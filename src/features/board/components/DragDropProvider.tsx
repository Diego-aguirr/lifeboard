import { useState, useCallback } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import type { Board, Card, Column } from '../types'

interface DragDropProviderProps {
  board: Board
  onReorderColumns: (columns: Column[]) => void
  onMoveCard: (cardId: string, targetColumnId: string, targetIndex: number) => void
  children: React.ReactNode
}

export function DragDropProvider({
  board,
  onReorderColumns,
  onMoveCard,
  children,
}: DragDropProviderProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [activeType, setActiveType] = useState<'column' | 'card' | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const columns = [...board.columns].sort((a, b) => a.order - b.order)
  const columnIds = columns.map(col => col.id)

  function findColumnByCardId(cardId: string): Column | undefined {
    return columns.find(col => col.cards.some(card => card.id === cardId))
  }

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event
    const id = active.id as string

    // Check if it's a column
    if (columns.some(col => col.id === id)) {
      setActiveType('column')
    } else {
      setActiveType('card')
    }

    setActiveId(id)
  }, [columns])

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // If dragging a card
    if (activeType === 'card') {
      const activeColumn = findColumnByCardId(activeId)
      const overColumn = columns.find(col => col.id === overId) || findColumnByCardId(overId)

      if (!activeColumn || !overColumn) return

      // If moving to a different column
      if (activeColumn.id !== overColumn.id) {
        const card = activeColumn.cards.find(c => c.id === activeId)
        if (!card) return

        const overIndex = overColumn.cards.findIndex(c => c.id === overId)
        const newIndex = overIndex >= 0 ? overIndex : overColumn.cards.length

        onMoveCard(activeId, overColumn.id, newIndex)
      }
    }
  }, [activeType, columns, onMoveCard])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    setActiveType(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    if (activeId === overId) return

    // Reorder columns
    if (activeType === 'column') {
      const oldIndex = columns.findIndex(col => col.id === activeId)
      const newIndex = columns.findIndex(col => col.id === overId)

      if (oldIndex !== -1 && newIndex !== -1) {
        const newColumns = arrayMove(columns, oldIndex, newIndex)
        const reordered = newColumns.map((col, i) => ({ ...col, order: i }))
        onReorderColumns(reordered)
      }
    }

    // Reorder cards within same column
    if (activeType === 'card') {
      const activeColumn = findColumnByCardId(activeId)
      const overColumn = columns.find(col => col.id === overId) || findColumnByCardId(overId)

      if (activeColumn && overColumn && activeColumn.id === overColumn.id) {
        const oldIndex = activeColumn.cards.findIndex(c => c.id === activeId)
        const newIndex = overColumn.cards.findIndex(c => c.id === overId)

        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
          const newCards = arrayMove(activeColumn.cards, oldIndex, newIndex)
          const newColumns = columns.map(col =>
            col.id === activeColumn.id ? { ...col, cards: newCards } : col
          )
          onReorderColumns(newColumns)
        }
      }
    }
  }, [activeType, columns, onReorderColumns])

  // Find the active item for the drag overlay
  function getActiveItem() {
    if (!activeId || !activeType) return null

    if (activeType === 'column') {
      return columns.find(col => col.id === activeId)
    }

    for (const col of columns) {
      const card = col.cards.find(c => c.id === activeId)
      if (card) return card
    }
    return null
  }

  const activeItem = getActiveItem()

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
        {children}
      </SortableContext>

      <DragOverlay>
        {activeType === 'column' && activeItem && (
          <div className="w-72 rounded-lg bg-secondary/80 p-3 shadow-xl border border-primary/30 opacity-90">
            <div className="text-sm font-medium text-foreground">
              {(activeItem as Column).title}
            </div>
          </div>
        )}
        {activeType === 'card' && activeItem && (
          <div className="rounded-md bg-surface border border-primary/30 p-2 shadow-xl opacity-90">
            <div className="text-sm text-foreground">
              {(activeItem as Card).title}
            </div>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
