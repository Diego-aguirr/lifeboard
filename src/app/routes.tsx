import type { RouteObject } from 'react-router'
import { Navigate } from 'react-router'
import { MainLayout } from '@/layouts/MainLayout/MainLayout'
import DashboardPage from '@/features/dashboard/DashboardPage'
import BoardPage from '@/features/board/BoardPage'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'board/:boardId', element: <BoardPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]
