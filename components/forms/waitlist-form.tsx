'use client'

import { useState } from 'react'
import { cn } from '@/shared/utils'
import { joinWaitlist, WaitlistSource } from '@/app/actions/waitlist'
import { Loader2, CheckCircle2, ArrowRight } from 'lucide-react'

interface WaitlistFormProps {
  source: WaitlistSource
  placeholder?: string
  buttonText?: string
  className?: string
  variant?: 'default' | 'dark' | 'inline'
  successMessage?: string
}

export function WaitlistForm({
  source,
  placeholder = 'Enter your email',
  buttonText = 'Join',
  className,
  variant = 'default',
  successMessage = "You're on the list!"
}: WaitlistFormProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) return

    setStatus('loading')

    const result = await joinWaitlist(email, source)

    if (result.success) {
      setStatus('success')
      setMessage(successMessage)
      setEmail('')
    } else {
      setStatus('error')
      setMessage(result.message)
    }

    // Reset after 5 seconds
    setTimeout(() => {
      if (status === 'success' || status === 'error') {
        setStatus('idle')
        setMessage('')
      }
    }, 5000)
  }

  if (status === 'success') {
    return (
      <div className={cn(
        "flex items-center gap-2 py-3 px-4",
        variant === 'dark' ? "bg-emerald-500 text-white" : "bg-emerald-500/10 text-emerald-500 border-2 border-emerald-500",
        className
      )}>
        <CheckCircle2 className="w-5 h-5 shrink-0" />
        <span className="font-bold">{message}</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <div className={cn(
        "flex gap-2",
        variant === 'inline' && "flex-col sm:flex-row"
      )}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          disabled={status === 'loading'}
          className={cn(
            "flex-1 px-4 py-3 focus:outline-none transition-colors",
            variant === 'dark'
              ? "border-2 border-white/20 bg-white/10 text-white placeholder:text-white/40 focus:border-amber-400"
              : "border-2 border-gray-900 bg-white text-gray-900 placeholder:text-gray-500 focus:border-orange-500",
            status === 'error' && "border-orange-500"
          )}
        />
        <button
          type="submit"
          disabled={status === 'loading' || !email.trim()}
          className={cn(
            "px-6 py-3 font-bold uppercase transition-colors flex items-center justify-center gap-2 whitespace-nowrap",
            variant === 'dark'
              ? "bg-orange-500 text-white hover:bg-orange-600 disabled:bg-orange-500/50"
              : "bg-orange-500 text-white hover:bg-orange-600 disabled:bg-orange-500/50"
          )}
        >
          {status === 'loading' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              {buttonText}
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
      {status === 'error' && message && (
        <p className="text-orange-500 text-sm mt-2">{message}</p>
      )}
    </form>
  )
}
