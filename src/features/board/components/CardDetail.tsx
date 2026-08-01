import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/shared/components/Modal/Modal'
import type { Card, ChecklistItem } from '../types'

// Simple markdown parser (bold, italic, code, links, lists, headers)
function parseMarkdown(text: string): string {
  if (!text) return ''
  return text
    // Headers
    .replace(/^### (.+)$/gm, '<h3 class="text-sm font-bold text-foreground mt-3 mb-1">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-base font-bold text-foreground mt-4 mb-2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-lg font-bold text-foreground mt-4 mb-2">$1</h1>')
    // Bold and italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong class="font-bold">$1</strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
    // Inline code
    .replace(/`(.+?)`/g, '<code class="px-1.5 py-0.5 bg-muted text-foreground rounded text-xs font-mono">$1</code>')
    // Links
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
    // Unordered lists
    .replace(/^- (.+)$/gm, '<li class="ml-4 text-sm text-foreground">• $1</li>')
    // Line breaks
    .replace(/\n\n/g, '<br /><br />')
}

const cardFormSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  description: z.string(),
  priority: z.enum(['low', 'medium', 'high']),
  difficulty: z.enum(['easy', 'medium', 'hard']),
})

type CardFormData = z.infer<typeof cardFormSchema>

interface CardDetailProps {
  card: Card
  isOpen: boolean
  onClose: () => void
  onSave: (updates: Partial<Card>) => void
}

export function CardDetail({ card, isOpen, onClose, onSave }: CardDetailProps) {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(card.checklist)
  const [tags, setTags] = useState<string[]>(card.tags)
  const [newTag, setNewTag] = useState('')
  const [newChecklistItem, setNewChecklistItem] = useState('')
  const [notes, setNotes] = useState(card.notes || '')
  const [showNotesPreview, setShowNotesPreview] = useState(false)

  const renderedNotes = useMemo(() => parseMarkdown(notes), [notes])

  const { register, handleSubmit, formState: { errors } } = useForm<CardFormData>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: {
      title: card.title,
      description: card.description,
      priority: card.priority,
      difficulty: card.difficulty,
    },
  })

  function onSubmit(data: CardFormData) {
    const completedCount = checklist.filter(i => i.completed).length
    const calculatedProgress = checklist.length > 0
      ? Math.round((completedCount / checklist.length) * 100)
      : 0

    onSave({
      ...data,
      checklist,
      tags,
      notes,
      progress: calculatedProgress,
      updatedAt: new Date().toISOString(),
    })
    onClose()
  }

  function addChecklistItem() {
    const text = newChecklistItem.trim()
    if (!text) return

    setChecklist(prev => [
      ...prev,
      { id: crypto.randomUUID(), text, completed: false },
    ])
    setNewChecklistItem('')
  }

  function toggleChecklistItem(id: string) {
    setChecklist(prev =>
      prev.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    )
  }

  function deleteChecklistItem(id: string) {
    setChecklist(prev => prev.filter(item => item.id !== id))
  }

  function addTag() {
    const tag = newTag.trim().toLowerCase()
    if (!tag || tags.includes(tag)) return

    setTags(prev => [...prev, tag])
    setNewTag('')
  }

  function removeTag(tag: string) {
    setTags(prev => prev.filter(t => t !== tag))
  }

  const completedCount = checklist.filter(i => i.completed).length
  const progress = checklist.length > 0
    ? Math.round((completedCount / checklist.length) * 100)
    : card.progress

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader title="Detalle de tarjeta" onClose={onClose} />

        <ModalBody className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="card-title" className="block text-sm font-medium text-foreground mb-1">
              Título
            </label>
            <input
              id="card-title"
              {...register('title')}
              className="w-full px-3 py-2 text-sm bg-surface border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-danger">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="card-description" className="block text-sm font-medium text-foreground mb-1">
              Descripción
            </label>
            <textarea
              id="card-description"
              {...register('description')}
              rows={3}
              className="w-full px-3 py-2 text-sm bg-surface border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none"
            />
          </div>

          {/* Priority & Difficulty */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="card-priority" className="block text-sm font-medium text-foreground mb-1">
                Prioridad
              </label>
              <select
                id="card-priority"
                {...register('priority')}
                className="w-full px-3 py-2 text-sm bg-surface border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </select>
            </div>
            <div>
              <label htmlFor="card-difficulty" className="block text-sm font-medium text-foreground mb-1">
                Dificultad
              </label>
              <select
                id="card-difficulty"
                {...register('difficulty')}
                className="w-full px-3 py-2 text-sm bg-surface border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              >
                <option value="easy">Fácil</option>
                <option value="medium">Media</option>
                <option value="hard">Difícil</option>
              </select>
            </div>
          </div>

          {/* Progress */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-foreground">Progreso</label>
              <span className="text-sm text-muted-foreground">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Checklist */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-2">
              Checklist ({completedCount}/{checklist.length})
            </h3>
            <div className="space-y-2">
              {checklist.map(item => (
                <div key={item.id} className="flex items-center gap-2 group">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => toggleChecklistItem(item.id)}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary/50 cursor-pointer"
                    aria-label={`Marcar "${item.text}" como completado`}
                  />
                  <span className={`flex-1 text-sm ${item.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                    {item.text}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteChecklistItem(item.id)}
                    className="text-xs text-muted-foreground hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={`Eliminar "${item.text}"`}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={newChecklistItem}
                onChange={e => setNewChecklistItem(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addChecklistItem()
                  }
                }}
                placeholder="Nuevo item..."
                className="flex-1 px-3 py-1.5 text-sm bg-surface border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                aria-label="Nuevo item de checklist"
              />
              <button
                type="button"
                onClick={addChecklistItem}
                className="px-3 py-1.5 text-sm font-medium bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-2">Etiquetas</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-danger transition-colors"
                    aria-label={`Eliminar etiqueta "${tag}"`}
                  >
                    ✕
                  </button>
                </span>
              ))}
              {tags.length === 0 && (
                <span className="text-sm text-muted-foreground">Sin etiquetas</span>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={e => setNewTag(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addTag()
                  }
                }}
                placeholder="Nueva etiqueta..."
                className="flex-1 px-3 py-1.5 text-sm bg-surface border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                aria-label="Nueva etiqueta"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-3 py-1.5 text-sm font-medium bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Notes (Markdown) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-foreground">Notas</h3>
              <button
                type="button"
                onClick={() => setShowNotesPreview(!showNotesPreview)}
                className="text-xs text-primary hover:text-primary/80 transition-colors"
              >
                {showNotesPreview ? '✏️ Editar' : '👁 Vista previa'}
              </button>
            </div>
            {showNotesPreview ? (
              <div
                className="w-full min-h-[120px] px-3 py-2 text-sm bg-surface border border-border rounded-md prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: renderedNotes || '<span class="text-muted-foreground">Sin contenido</span>' }}
              />
            ) : (
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={5}
                placeholder="Escribe notas en Markdown...&#10;&#10;**Negrita** *cursiva* `código`&#10;- Lista&#10;## Títulos"
                className="w-full px-3 py-2 text-sm bg-surface border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none font-mono"
                aria-label="Notas en Markdown"
              />
            )}
          </div>
        </ModalBody>

        <ModalFooter>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-surface-hover transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
          >
            Guardar
          </button>
        </ModalFooter>
      </form>
    </Modal>
  )
}
