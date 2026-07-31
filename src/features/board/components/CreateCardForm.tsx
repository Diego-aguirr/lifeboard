import { useState } from 'react'
import { Button } from '@/shared/components/Button/Button'
import { Input } from '@/shared/components/Input/Input'

interface CreateCardFormProps {
  onCreate: (title: string) => void
}

export function CreateCardForm({ onCreate }: CreateCardFormProps) {
  const [title, setTitle] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    onCreate(trimmed)
    setTitle('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <Input
        label="Nueva tarjeta"
        placeholder="Título de la tarjeta"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <Button type="submit" size="sm">
        +
      </Button>
    </form>
  )
}
