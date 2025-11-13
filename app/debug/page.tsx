'use client'

export default function DebugPage() {
  const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
  const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Debug Info</h1>

      <div className="space-y-4">
        <div>
          <strong>NEXT_PUBLIC_SUPABASE_URL:</strong>{' '}
          {hasUrl ? (
            <span className="text-green-400">✓ Set ({process.env.NEXT_PUBLIC_SUPABASE_URL})</span>
          ) : (
            <span className="text-red-400">✗ Not set</span>
          )}
        </div>

        <div>
          <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong>{' '}
          {hasKey ? (
            <span className="text-green-400">✓ Set (length: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length})</span>
          ) : (
            <span className="text-red-400">✗ Not set</span>
          )}
        </div>
      </div>
    </div>
  )
}
