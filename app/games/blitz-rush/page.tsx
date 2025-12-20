'use client'

export default function BlitzRushPage() {
  return (
    <div className="fixed inset-0 bg-black">
      <iframe
        src="/games/blitz-rush/index.html"
        className="w-full h-full border-0"
        title="Blitz Rush"
      />
    </div>
  )
}
