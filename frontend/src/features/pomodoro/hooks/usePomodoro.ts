import { useState, useEffect, useCallback, useRef } from 'react'

type TimerMode = 'work' | 'break'

interface PomodoroState {
  mode: TimerMode
  timeLeft: number
  isRunning: boolean
  sessionsCompleted: number
}

const WORK_DURATION = 25 * 60 // 25 minutes
const BREAK_DURATION = 5 * 60 // 5 minutes

// Generate notification sound using Web Audio API
function playNotificationSound(mode: 'work' | 'break') {
  try {
    const ctx = new AudioContext()
    const now = ctx.currentTime

    // Work complete: ascending tones (C5 → E5 → G5) — achievement feeling
    // Break complete: descending tones (G5 → E5 → C5) — back to work feeling
    const frequencies = mode === 'work'
      ? [523.25, 659.25, 783.99]  // C5, E5, G5 (ascending)
      : [783.99, 659.25, 523.25]  // G5, E5, C5 (descending)

    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now)

      gain.gain.setValueAtTime(0, now + i * 0.15)
      gain.gain.linearRampToValueAtTime(0.3, now + i * 0.15 + 0.05)
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.15 + 0.4)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now + i * 0.15)
      osc.stop(now + i * 0.15 + 0.5)
    })

    // Close context after sounds finish
    setTimeout(() => ctx.close(), 2000)
  } catch {
    // Audio not available, fail silently
  }
}

export function usePomodoro() {
  const [state, setState] = useState<PomodoroState>({
    mode: 'work',
    timeLeft: WORK_DURATION,
    isRunning: false,
    sessionsCompleted: 0,
  })

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const switchMode = useCallback(() => {
    setState(prev => {
      const newMode = prev.mode === 'work' ? 'break' : 'work'
      return {
        ...prev,
        mode: newMode,
        timeLeft: newMode === 'work' ? WORK_DURATION : BREAK_DURATION,
        isRunning: false,
        sessionsCompleted: prev.mode === 'work'
          ? prev.sessionsCompleted + 1
          : prev.sessionsCompleted,
      }
    })
    clearTimer()
  }, [clearTimer])

  useEffect(() => {
    if (!state.isRunning) {
      clearTimer()
      return
    }

    intervalRef.current = setInterval(() => {
      setState(prev => {
        if (prev.timeLeft <= 1) {
          // Timer finished — play sound
          clearTimer()
          playNotificationSound(prev.mode)
          const newMode = prev.mode === 'work' ? 'break' : 'work'
          return {
            ...prev,
            mode: newMode,
            timeLeft: newMode === 'work' ? WORK_DURATION : BREAK_DURATION,
            isRunning: false,
            sessionsCompleted: prev.mode === 'work'
              ? prev.sessionsCompleted + 1
              : prev.sessionsCompleted,
          }
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 }
      })
    }, 1000)

    return clearTimer
  }, [state.isRunning, clearTimer])

  const start = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: true }))
  }, [])

  const pause = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: false }))
  }, [])

  const reset = useCallback(() => {
    clearTimer()
    setState({
      mode: 'work',
      timeLeft: WORK_DURATION,
      isRunning: false,
      sessionsCompleted: 0,
    })
  }, [clearTimer])

  const skip = useCallback(() => {
    switchMode()
  }, [switchMode])

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }, [])

  return {
    mode: state.mode,
    timeLeft: state.timeLeft,
    isRunning: state.isRunning,
    sessionsCompleted: state.sessionsCompleted,
    formattedTime: formatTime(state.timeLeft),
    progress: ((state.mode === 'work' ? WORK_DURATION : BREAK_DURATION) - state.timeLeft) /
      (state.mode === 'work' ? WORK_DURATION : BREAK_DURATION) * 100,
    start,
    pause,
    reset,
    skip,
  }
}
