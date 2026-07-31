import type { Card } from '../types'
import { ColumnHeader } from './ColumnHeader'
import { CardItem } from './CardItem'
import { CreateCardForm } from './CreateCardForm'

interface ColumnProps {
  title: string
  cards: Card[]
  isFirst: boolean
  isLast: boolean
  onRename: (title: string) => void
  onDelete: () => void
  onMove: (direction: 'left' | 'right') => void
  onAddCard: (title: string) => void
  onRenameCard: (cardId: string, title: string) => void
  onDeleteCard: (cardId: string) => void
}

export function Column({
  title,
  cards,
  isFirst,
  isLast,
  onRename,
  onDelete,
  onMove,
  onAddCard,
  onRenameCard,
  onDeleteCard,
}: ColumnProps) {
  return (
    <div className="flex flex-col w-72 shrink-0 rounded-lg bg-secondary/50 p-3">
      <ColumnHeader
        title={title}
        isFirst={isFirst}
        isLast={isLast}
        onRename={onRename}
        onDelete={onDelete}
        onMove={onMove}
      />

      <div className="flex flex-col gap-2 mb-3">
        {cards.map(card => (
          <CardItem
            key={card.id}
            title={card.title}
            onRename={title => onRenameCard(card.id, title)}
            onDelete={() => onDeleteCard(card.id)}
          />
        ))}
      </div>

      <CreateCardForm onCreate={onAddCard} />
    </div>
  )
}
