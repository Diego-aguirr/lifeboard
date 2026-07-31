import { useEffect } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { useBoardContext } from '@/features/board/context/BoardContext'
import { useAchievements } from '@/shared/hooks/useAchievements'
import { AchievementNotification } from '@/shared/components/Achievement/AchievementNotification'
import { routes } from './routes'

const router = createBrowserRouter(routes)

function AchievementChecker() {
  const { boards } = useBoardContext()
  const { newAchievement, dismissNotification, checkAchievements } = useAchievements()

  useEffect(() => {
    checkAchievements(boards)
  }, [boards, checkAchievements])

  return (
    <>
      <RouterProvider router={router} />
      <AchievementNotification achievement={newAchievement} onDismiss={dismissNotification} />
    </>
  )
}

export default function App() {
  return <AchievementChecker />
}
