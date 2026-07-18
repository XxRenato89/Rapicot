export function CardSkeleton({ className = '' }) {
  return (
    <div className={`rounded-xl border border-paper-deep bg-white p-5 ${className}`}>
      <div className="mb-3 h-4 w-24 rounded bg-paper-deep animate-pulse" />
      <div className="h-8 w-20 rounded bg-paper-deep animate-pulse" />
    </div>
  )
}

export function RowSkeleton({ cols = 4 }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-paper-deep bg-white p-4">
      {Array.from({ length: cols }).map((_, i) => (
        <div
          key={i}
          className="h-4 rounded bg-paper-deep animate-pulse"
          style={{ width: `${[30, 40, 20, 15][i] || 20}%` }}
        />
      ))}
    </div>
  )
}

export function TableSkeleton({ rows = 4 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <RowSkeleton key={i} cols={4} />
      ))}
    </div>
  )
}
