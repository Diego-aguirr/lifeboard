export interface ChecklistItem {
  id: string
  text: string
  completed: boolean
}

export interface Card {
  id: string
  title: string
  description: string
  priority: Priority
  tags: string[]
  checklist: ChecklistItem[]
  progress: number
  timeSpent: number
  startDate: string | null
  targetDate: string | null
  difficulty: Difficulty
  order: number
  createdAt: string
  updatedAt: string
}

export interface Column {
  id: string
  title: string
  order: number
  cards: Card[]
}

export interface Board {
  id: string
  title: string
  icon: string
  color: string
  createdAt: string
  updatedAt: string
  columns: Column[]
}

export type Priority = 'low' | 'medium' | 'high'
export type Difficulty = 'easy' | 'medium' | 'hard'
