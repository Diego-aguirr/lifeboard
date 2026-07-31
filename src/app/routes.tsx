import type { RouteObject } from 'react-router'
import { Navigate } from 'react-router'
import { MainLayout } from '@/layouts/MainLayout/MainLayout'
import Dashboard from '@/features/dashboard/index'
import Board from '@/features/board/index'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'board/:boardId', element: <Board /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]
