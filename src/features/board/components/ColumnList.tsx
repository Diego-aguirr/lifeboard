import { useState } from 'react'
import type { Column as ColumnType } from '../types'
import { Column } from './Column'
import { Button } from '@/shared/components/Button/Button'
import { Input } from '@/shared/components/Input/Input'

interface ColumnListProps {
  columns: ColumnType[]
  onAddColumn: (title: string) => void
  onRenameColumn: (id: string, title: string) => void
  onDeleteColumn: (id: string) => void
  onMoveColumn: (id: string, direction: 'left' | 'right') => void
  onAddCard: (columnId: string, title: string) => void
  onRenameCard: (columnId: string, cardId: string, title: string) => void
  onDeleteCard: (columnId: string, cardId: string) => void
  onMoveCard: (cardId: string, direction: 'left' | 'right') => void
}

export function ColumnList({
  columns,
  onAddColumn,
  onRenameColumn,
  onDeleteColumn,
  onMoveColumn,
  onAddCard,
  onRenameCard,
  onDeleteCard,
  onMoveCard,
}: ColumnListProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [newTitle, setNewTitle] = useState('')

  function handleAdd() {
    const trimmed = newTitle.trim()
    if (!trimmed) return
    onAddColumn(trimmed)
    setNewTitle('')
    setIsAdding(false)
  }

  return (
    <div className="flex gap-4 items-start overflow-x-auto p-4">
      {columns.map((col, index) => (
        <Column
          key={col.id}
          title={col.title}
          cards={col.cards}
          columnCount={columns.length}
          columnIndex={index}
          isFirst={index === 0}
          isLast={index === columns.length - 1}
          onRename={title => onRenameColumn(col.id, title)}
          onDelete={() => onDeleteColumn(col.id)}
          onMove={direction => onMoveColumn(col.id, direction)}
          onAddCard={title => onAddCard(col.id, title)}
          onRenameCard={(cardId, title) => onRenameCard(col.id, cardId, title)}
          onDeleteCard={cardId => onDeleteCard(col.id, cardId)}
          onMoveCard={onMoveCard}
        />
      ))}

      {isAdding ? (
        <div className="w-72 shrink-0 rounded-lg bg-secondary/50 p-3">
          <Input
            label="Nueva columna"
            placeholder="Nombre de la columna"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleAdd()
              if (e.key === 'Escape') {
                setNewTitle('')
                setIsAdding(false)
              }
            }}
            autoFocus
          />
          <div className="flex gap-2 mt-2">
            <Button size="sm" onClick={handleAdd}>
              Agregar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setNewTitle('')
                setIsAdding(false)
              }}
            >
              Cancelar
            </Button>
          </div>
        </div>
      ) : (
        <Button variant="ghost" onClick={() => setIsAdding(true)}>
          + Agregar columna
        </Button>
      )}
    </div>
  )
}
