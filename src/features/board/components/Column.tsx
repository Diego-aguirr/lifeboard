import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Card } from '../types'
import { ColumnHeader } from './ColumnHeader'
import { CardItem } from './CardItem'
import { CardDetail } from './CardDetail'
import { CreateCardForm } from './CreateCardForm'

interface ColumnProps {
  id: string
  title: string
  cards: Card[]
  columnCount: number
  columnIndex: number
  isFirst: boolean
  isLast: boolean
  onRename: (title: string) => void
  onDelete: () => void
  onMove: (direction: 'left' | 'right') => void
  onAddCard: (title: string) => void
  onRenameCard: (cardId: string, title: string) => void
  onDeleteCard: (cardId: string) => void
  onMoveCard: (cardId: string, direction: 'left' | 'right') => void
  onUpdateCard: (cardId: string, updates: Partial<Card>) => void
}

export function Column({
  id,
  title,
  cards,
  columnCount,
  columnIndex,
  isFirst,
  isLast,
  onRename,
  onDelete,
  onMove,
  onAddCard,
  onRenameCard,
  onDeleteCard,
  onMoveCard,
  onUpdateCard,
}: ColumnProps) {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-col w-72 shrink-0 rounded-lg bg-secondary/50 p-3"
    >
      <ColumnHeader
        title={title}
        isFirst={isFirst}
        isLast={isLast}
        onRename={onRename}
        onDelete={onDelete}
        onMove={onMove}
        dragHandleProps={{ ...attributes, ...listeners }}
      />

      <div className="flex flex-col gap-2 mb-3">
        {cards.map(card => (
          <CardItem
            key={card.id}
            card={card}
            canMoveLeft={columnIndex > 0}
            canMoveRight={columnIndex < columnCount - 1}
            onRename={title => onRenameCard(card.id, title)}
            onDelete={() => onDeleteCard(card.id)}
            onMove={direction => onMoveCard(card.id, direction)}
            onOpenDetail={() => setSelectedCard(card)}
          />
        ))}
      </div>

      <CreateCardForm onCreate={onAddCard} />

      {selectedCard && (
        <CardDetail
          card={selectedCard}
          isOpen={true}
          onClose={() => setSelectedCard(null)}
          onSave={updates => {
            onUpdateCard(selectedCard.id, updates)
            setSelectedCard(null)
          }}
        />
      )}
    </div>
  )
}
