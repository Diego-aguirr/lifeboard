import { z } from 'zod';

const cardSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1).max(100),
  description: z.string().max(500).default(''),
  priority: z.enum(['low', 'medium', 'high']).default('low'),
  order: z.number().optional(),
});

const columnSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1).max(50),
  order: z.number().optional(),
  cards: z.array(cardSchema).default([]),
});

export const createBoardSchema = z.object({
  title: z.string().min(1).max(100),
  icon: z.string().max(10).default('📋'),
  color: z.string().max(7).default('#3b82f6'),
  columns: z.array(columnSchema).default([]),
});

export const updateBoardSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  icon: z.string().max(10).optional(),
  color: z.string().max(7).optional(),
  columns: z.array(columnSchema).optional(),
});
