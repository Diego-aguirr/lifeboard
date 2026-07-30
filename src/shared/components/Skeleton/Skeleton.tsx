interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      data-testid="skeleton"
      className={`animate-pulse rounded bg-muted ${className}`}
      aria-hidden="true"
    />
  )
}
