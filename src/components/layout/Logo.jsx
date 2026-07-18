export function LogoMark({ className = 'w-8 h-8' }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10 25l7 7 14-17"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M33 14c-4 4-9 6-14 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function LogoFull({ className = 'h-8' }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <LogoMark className="w-8 h-8 text-brand" />
      <span className="text-xl font-bold tracking-tight">Rapicot</span>
    </div>
  )
}
