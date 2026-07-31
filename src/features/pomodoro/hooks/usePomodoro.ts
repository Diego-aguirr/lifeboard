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
          // Timer finished
          clearTimer()
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
