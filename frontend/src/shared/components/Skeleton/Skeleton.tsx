import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      data-testid="skeleton"
      className={cn('animate-pulse rounded bg-muted', className)}
      aria-hidden="true"
    />
  )
}
