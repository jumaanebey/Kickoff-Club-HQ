'use client'

// Special layout for Blitz Rush - no footer, no padding
// The game needs full screen space
export default function BlitzRushLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950">
      {children}
    </div>
  )
}
