import { useState, useEffect, useCallback } from 'react'
import type { Board } from '@/features/board/types'

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt: string | null
}

interface AchievementState {
  achievements: Achievement[]
  newAchievement: Achievement | null
}

const STORAGE_KEY = 'lifeboard:achievements'

const DEFAULT_ACHIEVEMENTS: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
  { id: 'first-board', title: 'Primer Tablero', description: 'Creaste tu primer tablero', icon: '🎯' },
  { id: 'five-boards', title: 'Coleccionista', description: 'Tienes 5 tableros', icon: '📚' },
  { id: 'first-card', title: 'Primera Tarjeta', description: 'Creaste tu primera tarjeta', icon: '🃏' },
  { id: 'ten-cards', title: 'Productivo', description: 'Tienes 10 tarjetas', icon: '⚡' },
  { id: 'fifty-cards', title: 'Maestro', description: 'Tienes 50 tarjetas', icon: '🏆' },
  { id: 'first-complete', title: 'Primer Logro', description: 'Completaste una tarjeta (progreso 100%)', icon: '⭐' },
  { id: 'ten-complete', title: 'Imparable', description: 'Completaste 10 tarjetas', icon: '🔥' },
  { id: 'checklist-master', title: 'Detalle', description: 'Completaste 20 items de checklist', icon: '✅' },
  { id: 'tagger', title: 'Organizador', description: 'Usaste 5 etiquetas diferentes', icon: '🏷️' },
  { id: 'pomodoro-5', title: 'Enfocado', description: 'Completaste 5 sesiones Pomodoro', icon: '🍅' },
]

function loadAchievements(): AchievementState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {}
  return {
    achievements: DEFAULT_ACHIEVEMENTS.map(a => ({
      ...a,
      unlocked: false,
      unlockedAt: null,
    })),
    newAchievement: null,
  }
}

function saveAchievements(state: AchievementState) {
  const { newAchievement, ...rest } = state
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rest))
}

export function useAchievements() {
  const [state, setState] = useState<AchievementState>(loadAchievements)

  const unlock = useCallback((id: string) => {
    setState(prev => {
      const achievement = prev.achievements.find(a => a.id === id)
      if (!achievement || achievement.unlocked) return prev

      const updated = {
        ...prev,
        achievements: prev.achievements.map(a =>
          a.id === id
            ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() }
            : a
        ),
        newAchievement: { ...achievement, unlocked: true, unlockedAt: new Date().toISOString() },
      }
      saveAchievements(updated)
      return updated
    })
  }, [])

  const dismissNotification = useCallback(() => {
    setState(prev => ({ ...prev, newAchievement: null }))
  }, [])

  // Check achievements based on board data
  const checkAchievements = useCallback((boards: Board[]) => {
    const allCards = boards.flatMap(b => b.columns.flatMap(c => c.cards))
    const completedCards = allCards.filter(c => c.progress >= 100)
    const allChecklist = allCards.flatMap(c => c.checklist)
    const completedChecklist = allChecklist.filter(i => i.completed)
    const allTags = new Set(allCards.flatMap(c => c.tags))

    // Board achievements
    if (boards.length >= 1) unlock('first-board')
    if (boards.length >= 5) unlock('five-boards')

    // Card achievements
    if (allCards.length >= 1) unlock('first-card')
    if (allCards.length >= 10) unlock('ten-cards')
    if (allCards.length >= 50) unlock('fifty-cards')

    // Completion achievements
    if (completedCards.length >= 1) unlock('first-complete')
    if (completedCards.length >= 10) unlock('ten-complete')

    // Checklist achievements
    if (completedChecklist.length >= 20) unlock('checklist-master')

    // Tag achievements
    if (allTags.size >= 5) unlock('tagger')
  }, [unlock])

  return {
    achievements: state.achievements,
    newAchievement: state.newAchievement,
    dismissNotification,
    checkAchievements,
  }
}
