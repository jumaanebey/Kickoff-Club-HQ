'use client'

// Special layout for Blitz Rush - full screen game, no footer
export default function BlitzRushLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className="bg-slate-950"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        overflow: 'hidden'
      }}
    >
      {children}
    </div>
  )
}
