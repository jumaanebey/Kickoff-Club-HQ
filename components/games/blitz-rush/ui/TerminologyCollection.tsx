'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Lock, X, Search, Trophy, Brain } from 'lucide-react'
import { FOOTBALL_TERMS, TOTAL_TERMS, CATEGORY_LABELS, type TermCategory } from '../data/terminology'
import { getIQLevel, getIQLevelProgress } from '../hooks/useFootballIQ'

interface TerminologyCollectionProps {
  discoveredTerms: Set<string>
  footballIQ: number
  onClose: () => void
}

const CATEGORIES: (TermCategory | 'all')[] = ['all', 'positions', 'rules', 'terminology', 'strategy', 'history']

const CATEGORY_ICONS: Record<TermCategory, string> = {
  positions: '🏈',
  rules: '📋',
  terminology: '📖',
  strategy: '🧠',
  history: '🏆',
}

export function TerminologyCollection({ discoveredTerms, footballIQ, onClose }: TerminologyCollectionProps) {
  const [activeCategory, setActiveCategory] = useState<TermCategory | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTermId, setSelectedTermId] = useState<string | null>(null)

  const level = getIQLevel(footballIQ)
  const levelProgress = getIQLevelProgress(footballIQ)

  const filteredTerms = useMemo(() => {
    let terms = FOOTBALL_TERMS
    if (activeCategory !== 'all') {
      terms = terms.filter(t => t.category === activeCategory)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      terms = terms.filter(t =>
        discoveredTerms.has(t.id) && (
          t.term.toLowerCase().includes(q) ||
          t.definition.toLowerCase().includes(q)
        )
      )
    }
    return terms
  }, [activeCategory, searchQuery, discoveredTerms])

  const categoryStats = useMemo(() => {
    const stats: Record<string, { total: number; discovered: number }> = {}
    for (const cat of Object.keys(CATEGORY_LABELS) as TermCategory[]) {
      const catTerms = FOOTBALL_TERMS.filter(t => t.category === cat)
      stats[cat] = {
        total: catTerms.length,
        discovered: catTerms.filter(t => discoveredTerms.has(t.id)).length,
      }
    }
    return stats
  }, [discoveredTerms])

  const selectedTerm = selectedTermId ? FOOTBALL_TERMS.find(t => t.id === selectedTermId) : null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-slate-900 border-2 border-emerald-500/30 rounded-2xl w-full max-w-lg max-h-[90%] flex flex-col shadow-2xl relative overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/5 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">
                Football Dictionary
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Progress + IQ */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-white/40 font-medium">{discoveredTerms.size}/{TOTAL_TERMS} terms</span>
                <span className="text-emerald-400 font-bold">{Math.round((discoveredTerms.size / TOTAL_TERMS) * 100)}%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                  style={{ width: `${(discoveredTerms.size / TOTAL_TERMS) * 100}%` }}
                />
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-indigo-500/20 px-2.5 py-1 rounded-lg flex-shrink-0">
              <Brain className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-indigo-400 text-xs font-bold">{footballIQ} IQ</span>
              <span className="text-indigo-400/50 text-[10px]">({level})</span>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search discovered terms..."
              className="w-full bg-slate-800 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          {/* Category tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                  activeCategory === cat
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-white/40 hover:text-white/60 hover:bg-white/5'
                }`}
              >
                {cat === 'all' ? `All (${discoveredTerms.size})` : (
                  <>
                    {CATEGORY_ICONS[cat]} {CATEGORY_LABELS[cat]}
                    <span className="ml-1 text-[10px] opacity-60">
                      {categoryStats[cat]?.discovered}/{categoryStats[cat]?.total}
                    </span>
                  </>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Terms grid */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {filteredTerms.map(term => {
              const isDiscovered = discoveredTerms.has(term.id)

              return (
                <button
                  key={term.id}
                  onClick={() => isDiscovered ? setSelectedTermId(term.id) : undefined}
                  disabled={!isDiscovered}
                  className={`relative rounded-xl p-3 text-left transition-all ${
                    isDiscovered
                      ? 'bg-slate-800/80 border border-white/10 hover:border-emerald-500/30 hover:bg-slate-800 cursor-pointer'
                      : 'bg-slate-800/30 border border-white/5 cursor-default opacity-50'
                  }`}
                >
                  {isDiscovered ? (
                    <>
                      <div className={`text-[10px] font-bold uppercase mb-1 ${
                        term.difficulty === 'rookie' ? 'text-green-400/60' :
                        term.difficulty === 'starter' ? 'text-blue-400/60' :
                        term.difficulty === 'pro' ? 'text-purple-400/60' :
                        'text-yellow-400/60'
                      }`}>
                        {term.category}
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-white leading-tight truncate">
                        {term.term}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-1">
                      <Lock className="w-4 h-4 text-white/20 mb-1" />
                      <div className="text-[10px] text-white/20 font-medium">???</div>
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {filteredTerms.length === 0 && (
            <div className="text-center py-8 text-white/30 text-sm">
              {searchQuery ? 'No matching terms found' : 'No terms discovered yet in this category'}
            </div>
          )}
        </div>

        {/* Term detail modal */}
        <AnimatePresence>
          {selectedTerm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 flex items-center justify-center p-4 z-10"
              onClick={() => setSelectedTermId(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={e => e.stopPropagation()}
                className="bg-slate-800 border-2 border-emerald-500/30 rounded-2xl p-5 w-full max-w-sm shadow-xl"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    selectedTerm.difficulty === 'rookie' ? 'bg-green-500/20 text-green-400' :
                    selectedTerm.difficulty === 'starter' ? 'bg-blue-500/20 text-blue-400' :
                    selectedTerm.difficulty === 'pro' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {selectedTerm.difficulty}
                  </div>
                  <button
                    onClick={() => setSelectedTermId(null)}
                    className="text-white/40 hover:text-white/60"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-xl font-black text-white mb-2">{selectedTerm.term}</h3>
                <div className="text-[10px] text-white/30 uppercase font-bold mb-2">{selectedTerm.category}</div>
                <p className="text-sm text-white/70 leading-relaxed">{selectedTerm.definition}</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
