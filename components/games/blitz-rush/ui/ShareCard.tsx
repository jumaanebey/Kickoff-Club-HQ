'use client'

import { useRef, useCallback } from 'react'
import { Share2, Download, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import type { GameSnapshot } from '../engine/core/EventBus'

interface ShareCardProps {
  snapshot: GameSnapshot
  footballIQ?: number
  iqLevel?: string
}

export function ShareCard({ snapshot, footballIQ = 0, iqLevel = 'Rookie' }: ShareCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [copied, setCopied] = useState(false)

  const generateCard = useCallback((): HTMLCanvasElement | null => {
    const canvas = canvasRef.current
    if (!canvas) return null

    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    const w = 600
    const h = 340
    canvas.width = w
    canvas.height = h

    // Background gradient
    const bg = ctx.createLinearGradient(0, 0, w, h)
    bg.addColorStop(0, '#0f172a')
    bg.addColorStop(0.5, '#1e293b')
    bg.addColorStop(1, '#0f172a')
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, w, h)

    // Top accent bar
    const accent = ctx.createLinearGradient(0, 0, w, 0)
    accent.addColorStop(0, '#facc15')
    accent.addColorStop(1, '#f97316')
    ctx.fillStyle = accent
    ctx.fillRect(0, 0, w, 4)

    // Title
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold italic 36px system-ui, -apple-system, sans-serif'
    ctx.fillText('BLITZ RUSH 3D', 30, 55)

    // Subtitle
    ctx.fillStyle = '#94a3b8'
    ctx.font = 'bold 14px system-ui, -apple-system, sans-serif'
    ctx.fillText('kickoffclubhq.com/games/blitz-rush', 30, 80)

    // Divider
    ctx.strokeStyle = '#334155'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(30, 95)
    ctx.lineTo(w - 30, 95)
    ctx.stroke()

    // Score — large
    ctx.fillStyle = '#facc15'
    ctx.font = 'bold 56px system-ui, -apple-system, sans-serif'
    ctx.fillText(Math.floor(snapshot.score).toLocaleString(), 30, 165)

    ctx.fillStyle = '#64748b'
    ctx.font = 'bold 16px system-ui, -apple-system, sans-serif'
    ctx.fillText('SCORE', 30, 185)

    // Stats row
    const statsY = 230
    const stats = [
      { label: 'DISTANCE', value: `${Math.floor(snapshot.distance)}m`, color: '#e2e8f0' },
      { label: 'COINS', value: `${snapshot.coins}`, color: '#facc15' },
      { label: 'COMBO', value: `${snapshot.nearMissChainBest}x`, color: '#fb923c' },
    ]

    if (footballIQ > 0) {
      stats.push({ label: 'FOOTBALL IQ', value: `${footballIQ}`, color: '#818cf8' })
    }

    const statWidth = (w - 60) / stats.length
    stats.forEach((stat, i) => {
      const x = 30 + i * statWidth

      // Stat box background
      ctx.fillStyle = '#1e293b'
      ctx.beginPath()
      ctx.roundRect(x, statsY - 30, statWidth - 10, 60, 8)
      ctx.fill()

      ctx.fillStyle = stat.color
      ctx.font = 'bold 22px system-ui, -apple-system, sans-serif'
      ctx.fillText(stat.value, x + 10, statsY + 3)

      ctx.fillStyle = '#64748b'
      ctx.font = 'bold 10px system-ui, -apple-system, sans-serif'
      ctx.fillText(stat.label, x + 10, statsY + 20)
    })

    // Bottom CTA
    ctx.fillStyle = '#475569'
    ctx.font = '13px system-ui, -apple-system, sans-serif'
    ctx.fillText('Think you can beat this? Try it now!', 30, h - 20)

    return canvas
  }, [snapshot, footballIQ])

  const handleShare = useCallback(async () => {
    const shareText = [
      `I scored ${Math.floor(snapshot.score).toLocaleString()} in Blitz Rush 3D!`,
      `${Math.floor(snapshot.distance)}m | ${snapshot.coins} coins`,
      footballIQ > 0 ? `Football IQ: ${footballIQ} (${iqLevel})` : '',
      '',
      'Think you can beat me?',
      'https://kickoffclubhq.com/games/blitz-rush',
    ].filter(Boolean).join('\n')

    // Try native share with canvas image
    if (typeof navigator !== 'undefined' && navigator.share) {
      const canvas = generateCard()
      if (canvas) {
        try {
          const blob = await new Promise<Blob | null>(resolve =>
            canvas.toBlob(resolve, 'image/png')
          )
          if (blob) {
            const file = new File([blob], 'blitz-rush-score.png', { type: 'image/png' })
            await navigator.share({
              title: 'Blitz Rush 3D',
              text: shareText,
              files: [file],
            })
            return
          }
        } catch {
          // Fall through to text-only share
        }
      }

      // Text-only share
      try {
        await navigator.share({ title: 'Blitz Rush 3D', text: shareText })
        return
      } catch {
        // User cancelled or not supported
      }
    }

    // Clipboard fallback
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [snapshot, footballIQ, iqLevel, generateCard])

  const handleDownload = useCallback(() => {
    const canvas = generateCard()
    if (!canvas) return

    const link = document.createElement('a')
    link.download = 'blitz-rush-score.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }, [generateCard])

  return (
    <div className="flex flex-col gap-2">
      {/* Hidden canvas for image generation */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Share buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleShare}
          className="flex-1 border-2 border-slate-700 hover:bg-slate-800 text-slate-200 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-1.5 sm:gap-2 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
              <span className="text-emerald-400">COPIED!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> SHARE
            </>
          )}
        </button>
        <button
          onClick={handleDownload}
          className="border-2 border-slate-700 hover:bg-slate-800 text-slate-200 py-3 sm:py-4 px-4 rounded-xl sm:rounded-2xl font-bold text-sm flex items-center justify-center transition-colors"
          title="Download score card"
        >
          <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  )
}
