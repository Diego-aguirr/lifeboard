import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning'
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Eliminar',
  cancelLabel = 'Cancelar',
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (isOpen) {
      cancelRef.current?.focus()
    }
  }, [isOpen])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onCancel()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onCancel])

  const dangerGradient = variant === 'danger'
    ? 'from-red-500/10 to-red-600/5 border-red-500/20'
    : 'from-amber-500/10 to-amber-600/5 border-amber-500/20'

  const confirmButtonStyle = variant === 'danger'
    ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20'
    : 'bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-500/20'

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
          />

          {/* Dialog */}
          <motion.div
            className={`relative w-full max-w-sm bg-gradient-to-br ${dangerGradient} border rounded-2xl p-6 shadow-2xl`}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            aria-describedby="confirm-message"
          >
            {/* Icon */}
            <motion.div
              className="flex justify-center mb-4"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.1 }}
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                variant === 'danger' ? 'bg-red-500/20' : 'bg-amber-500/20'
              }`}>
                <span className="text-3xl" aria-hidden="true">
                  {variant === 'danger' ? '🗑️' : '⚠️'}
                </span>
              </div>
            </motion.div>

            {/* Content */}
            <div className="text-center mb-6">
              <h2 id="confirm-title" className="text-lg font-semibold text-foreground mb-2">
                {title}
              </h2>
              <p id="confirm-message" className="text-sm text-muted-foreground">
                {message}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                ref={cancelRef}
                onClick={onCancel}
                className="flex-1 px-4 py-2.5 text-sm font-medium bg-secondary/50 text-secondary-foreground rounded-xl hover:bg-secondary transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                {cancelLabel}
              </button>
              <motion.button
                onClick={onConfirm}
                className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${confirmButtonStyle}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {confirmLabel}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
