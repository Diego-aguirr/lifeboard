import { z } from 'zod'

// ─── Base Schemas ──────────────────────────────────────

export const prioritySchema = z.enum(['low', 'medium', 'high'])
export const difficultySchema = z.enum(['easy', 'medium', 'hard'])

export const checklistItemSchema = z.object({
  id: z.string(),
  text: z.string(),
  completed: z.boolean(),
})

// ─── Card Schema ───────────────────────────────────────

export const cardSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  notes: z.string().optional().default(''),
  priority: prioritySchema,
  tags: z.array(z.string()),
  checklist: z.array(checklistItemSchema),
  progress: z.number(),
  timeSpent: z.number(),
  startDate: z.string().nullable(),
  targetDate: z.string().nullable(),
  difficulty: difficultySchema,
  order: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

// ─── Column Schema ─────────────────────────────────────

export const columnSchema = z.object({
  id: z.string(),
  title: z.string(),
  order: z.number(),
  cards: z.array(cardSchema),
})

// ─── Board Schema ──────────────────────────────────────

export const boardSchema = z.object({
  id: z.string(),
  title: z.string(),
  icon: z.string(),
  color: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  columns: z.array(columnSchema),
})

// ─── Array Schema ──────────────────────────────────────

export const boardsSchema = z.array(boardSchema)

// ─── Inferred Types ────────────────────────────────────

export type ValidatedCard = z.infer<typeof cardSchema>
export type ValidatedColumn = z.infer<typeof columnSchema>
export type ValidatedBoard = z.infer<typeof boardSchema>
