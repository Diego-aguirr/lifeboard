import { useState } from 'react'
import { Button } from '@/shared/components/Button/Button'
import { Input } from '@/shared/components/Input/Input'
import { EmojiPicker } from '@/shared/components/EmojiPicker/EmojiPicker'

interface CreateBoardFormProps {
  onCreate: (title: string, icon: string) => void
}

export function CreateBoardForm({ onCreate }: CreateBoardFormProps) {
  const [title, setTitle] = useState('')
  const [icon, setIcon] = useState('📋')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    onCreate(trimmed, icon)
    setTitle('')
    setIcon('📋')
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <EmojiPicker value={icon} onChange={setIcon} />
      <Input
        label="Nuevo tablero"
        placeholder="Nombre del tablero"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <Button type="submit" size="sm">
        Crear
      </Button>
    </form>
  )
}
