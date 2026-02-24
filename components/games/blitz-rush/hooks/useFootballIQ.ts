'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

// ── Football IQ Levels ─────────────────────────────────
export type IQLevel = 'Rookie' | 'Starter' | 'Pro' | 'All-Pro'

export function getIQLevel(iq: number): IQLevel {
  if (iq >= 601) return 'All-Pro'
  if (iq >= 301) return 'Pro'
  if (iq >= 101) return 'Starter'
  return 'Rookie'
}

export function getIQLevelProgress(iq: number): { level: IQLevel; current: number; min: number; max: number; progress: number } {
  if (iq >= 601) return { level: 'All-Pro', current: iq, min: 601, max: 1000, progress: Math.min(1, (iq - 601) / 399) }
  if (iq >= 301) return { level: 'Pro', current: iq, min: 301, max: 600, progress: (iq - 301) / 299 }
  if (iq >= 101) return { level: 'Starter', current: iq, min: 101, max: 300, progress: (iq - 101) / 199 }
  return { level: 'Rookie', current: iq, min: 0, max: 100, progress: iq / 100 }
}

// ── Storage Keys ───────────────────────────────────────
const IQ_STORAGE_KEY = 'blitz-rush-football-iq'
const TERMS_STORAGE_KEY = 'blitz-rush-discovered-terms'
const TRIVIA_STORAGE_KEY = 'blitz-rush-answered-trivia'
const LABELS_STORAGE_KEY = 'blitz-rush-viewed-labels'

// ── Helpers ────────────────────────────────────────────
function loadNumber(key: string): number {
  if (typeof window === 'undefined') return 0
  const raw = localStorage.getItem(key)
  return raw ? parseInt(raw, 10) || 0 : 0
}

function loadSet(key: string): Set<string> {
  if (typeof window === 'undefined') return new Set()
  const raw = localStorage.getItem(key)
  if (!raw) return new Set()
  try {
    const arr = JSON.parse(raw)
    return new Set(Array.isArray(arr) ? arr : [])
  } catch {
    return new Set()
  }
}

function saveSet(key: string, set: Set<string>): void {
  if (typeof window === 'undefined') return
  const arr: string[] = []
  set.forEach(v => arr.push(v))
  localStorage.setItem(key, JSON.stringify(arr))
}

// ── IQ Point Values ────────────────────────────────────
export const IQ_REWARDS = {
  triviaCorrect: 50,
  triviaAttempt: 10,
  termDiscovery: 10,
  labelView: 2,
} as const

// ── Hook ───────────────────────────────────────────────
export function useFootballIQ() {
  const [footballIQ, setFootballIQ] = useState(0)
  const [discoveredTerms, setDiscoveredTerms] = useState<Set<string>>(new Set())
  const [answeredTrivia, setAnsweredTrivia] = useState<Set<string>>(new Set())
  const [viewedLabels, setViewedLabels] = useState<Set<string>>(new Set())
  const initialized = useRef(false)

  // Load from localStorage on mount
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    setFootballIQ(loadNumber(IQ_STORAGE_KEY))
    setDiscoveredTerms(loadSet(TERMS_STORAGE_KEY))
    setAnsweredTrivia(loadSet(TRIVIA_STORAGE_KEY))
    setViewedLabels(loadSet(LABELS_STORAGE_KEY))
  }, [])

  // Save IQ when it changes
  useEffect(() => {
    if (!initialized.current) return
    if (typeof window !== 'undefined') {
      localStorage.setItem(IQ_STORAGE_KEY, String(footballIQ))
    }
  }, [footballIQ])

  // ── Actions ────────────────────────────────────────────

  /** Player answered trivia correctly */
  const recordTriviaCorrect = useCallback((questionId: string) => {
    setAnsweredTrivia(prev => {
      const next = new Set(prev)
      next.add(questionId)
      saveSet(TRIVIA_STORAGE_KEY, next)
      return next
    })
    setFootballIQ(prev => prev + IQ_REWARDS.triviaCorrect)
  }, [])

  /** Player attempted trivia (wrong answer) */
  const recordTriviaAttempt = useCallback((questionId: string) => {
    setAnsweredTrivia(prev => {
      const next = new Set(prev)
      next.add(questionId)
      saveSet(TRIVIA_STORAGE_KEY, next)
      return next
    })
    setFootballIQ(prev => prev + IQ_REWARDS.triviaAttempt)
  }, [])

  /** Player discovered a new term (from gameplay label or trivia) */
  const discoverTerm = useCallback((termId: string) => {
    setDiscoveredTerms(prev => {
      if (prev.has(termId)) return prev
      const next = new Set(prev)
      next.add(termId)
      saveSet(TERMS_STORAGE_KEY, next)
      // Only award IQ for newly discovered terms
      setFootballIQ(iq => iq + IQ_REWARDS.termDiscovery)
      return next
    })
  }, [])

  /** Player viewed an educational label during gameplay */
  const recordLabelView = useCallback((label: string) => {
    setViewedLabels(prev => {
      if (prev.has(label)) return prev
      const next = new Set(prev)
      next.add(label)
      saveSet(LABELS_STORAGE_KEY, next)
      // Only award IQ for first-time label views
      setFootballIQ(iq => iq + IQ_REWARDS.labelView)
      return next
    })
  }, [])

  /** Batch discover terms from a gameplay session (labels seen) */
  const discoverTermsFromLabels = useCallback((labelTermIds: string[]) => {
    setDiscoveredTerms(prev => {
      let newCount = 0
      const next = new Set(prev)
      for (const id of labelTermIds) {
        if (!next.has(id)) {
          next.add(id)
          newCount++
        }
      }
      if (newCount > 0) {
        saveSet(TERMS_STORAGE_KEY, next)
        setFootballIQ(iq => iq + newCount * IQ_REWARDS.termDiscovery)
      }
      return next
    })
  }, [])

  return {
    footballIQ,
    level: getIQLevel(footballIQ),
    levelProgress: getIQLevelProgress(footballIQ),
    discoveredTerms,
    answeredTrivia,
    viewedLabels,
    discoveredCount: discoveredTerms.size,
    recordTriviaCorrect,
    recordTriviaAttempt,
    discoverTerm,
    recordLabelView,
    discoverTermsFromLabels,
  }
}
