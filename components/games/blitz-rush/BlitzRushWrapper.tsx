'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { BlitzRushEngine } from './engine/BlitzRushEngine'
import { useGameState } from './hooks/useGameState'
import { useFootballIQ } from './hooks/useFootballIQ'
import { GameHUD } from './ui/HUD'
import { StartScreen } from './ui/StartScreen'
import { GameOverScreen } from './ui/GameOverScreen'
import { PauseScreen } from './ui/PauseScreen'
import { QuizScreen } from './ui/QuizScreen'
import { TerminologyCollection } from './ui/TerminologyCollection'
import { LeaderboardPanel } from './ui/LeaderboardPanel'
import { ProgressionPanel } from './ui/ProgressionPanel'
import { Notifications } from './ui/Notifications'
import { useProgression } from './hooks/useProgression'
import { useStreak } from './hooks/useStreak'
import { useHaptics } from './hooks/useHaptics'

type OverlayPhase = 'menu' | 'playing' | 'paused' | 'gameover' | 'quiz' | 'terminology'

export default function BlitzRushWrapper() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [engine, setEngine] = useState<BlitzRushEngine | null>(null)
  const { phase: enginePhase, snapshot, popups, isFever, highScore } = useGameState(engine)
  const [overlayPhase, setOverlayPhase] = useState<OverlayPhase>('menu')
  const [showTerminology, setShowTerminology] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [showProgression, setShowProgression] = useState(false)

  const {
    footballIQ,
    level: iqLevel,
    discoveredTerms,
    answeredTrivia,
    discoveredCount,
    recordTriviaCorrect,
    recordTriviaAttempt,
    discoverTerm,
    recordLabelView,
    discoverTermsFromLabels,
  } = useFootballIQ()

  const progression = useProgression()
  const streak = useStreak()
  const haptics = useHaptics()

  // Sync engine phase → overlay phase (with quiz intercept)
  useEffect(() => {
    if (enginePhase === 'gameover' && overlayPhase !== 'quiz' && overlayPhase !== 'gameover') {
      // Record game end for progression + achievements
      if (snapshot) {
        progression.recordGameEnd({
          score: snapshot.score,
          distance: snapshot.distance,
          coins: snapshot.coins,
          nearMissChain: snapshot.nearMissChainBest,
          feverActivations: snapshot.feverActivations ?? 0,
        })
      }
      // Show quiz before game over screen
      setOverlayPhase('quiz')
    } else if (enginePhase !== 'gameover') {
      setOverlayPhase(enginePhase)
    }
  }, [enginePhase, overlayPhase, snapshot, progression])

  // Mount engine
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const eng = new BlitzRushEngine(canvas)
    setEngine(eng)

    return () => {
      eng.destroy()
      setEngine(null)
    }
  }, [])

  // Haptic feedback from engine events
  useEffect(() => {
    if (!engine) return
    const unsubs = [
      engine.on('nearMiss', () => haptics.vibrate('nearMiss')),
      engine.on('powerupCollected', (type) => {
        if (type === 'shield') haptics.vibrate('shieldActivate')
        else if (type === 'magnet') haptics.vibrate('magnetActivate')
        else if (type === 'speed') haptics.vibrate('speedBoost')
        else haptics.vibrate('powerupGrab')
      }),
      engine.on('feverActivated', () => haptics.vibrate('feverActivate', true)),
      engine.on('shieldBroken', () => haptics.vibrate('shieldBreak')),
      engine.on('gameOver', () => haptics.vibrate('gameOver', true)),
      engine.on('comboMilestone', () => haptics.vibrate('milestone')),
    ]
    return () => unsubs.forEach(fn => fn())
  }, [engine, haptics])

  // Listen for educational label events from engine
  useEffect(() => {
    if (!engine) return
    const handler = (data: { label: string; termId?: string }) => {
      recordLabelView(data.label)
      if (data.termId) {
        discoverTerm(data.termId)
      }
    }
    engine.on('obstacleLabeled', handler)
    return () => {
      // EventBus doesn't have off() — labels are one-shot per session anyway
    }
  }, [engine, recordLabelView, discoverTerm])

  const handleStart = useCallback((firstRunMode = false) => {
    engine?.getAudio().unlockAudioContext()
    engine?.start(firstRunMode)
    // Record daily streak activity on game start
    streak.recordActivity().then(result => {
      if (result.streakUpdated) {
        progression.checkStreakAchievements(result.newStreak)
      }
    })
  }, [engine, streak, progression])

  const handlePause = useCallback(() => {
    engine?.pause()
  }, [engine])

  const handleResume = useCallback(() => {
    engine?.resume()
  }, [engine])

  const handleRestart = useCallback(() => {
    engine?.getAudio().unlockAudioContext()
    engine?.start(false)
    setOverlayPhase('playing')
  }, [engine])

  const handleMuteToggle = useCallback(() => {
    return engine?.getAudio().toggleMute() ?? true
  }, [engine])

  // Quiz completed
  const handleQuizComplete = useCallback((result: {
    correct: boolean
    coinsEarned: number
    iqGained: number
    questionId: string
    termId?: string
  }) => {
    if (result.correct) {
      recordTriviaCorrect(result.questionId)
      // Award quiz XP
      progression.awardXP(50, 'quiz_complete', { questionId: result.questionId })
    } else {
      recordTriviaAttempt(result.questionId)
    }
    if (result.termId) {
      discoverTerm(result.termId)
    }
    // Check education achievements
    progression.checkEducationAchievements(answeredTrivia.size + (result.correct ? 1 : 0), discoveredCount)
    setOverlayPhase('gameover')
  }, [recordTriviaCorrect, recordTriviaAttempt, discoverTerm, progression, answeredTrivia, discoveredCount])

  // Quiz skipped
  const handleQuizSkip = useCallback(() => {
    setOverlayPhase('gameover')
  }, [])

  // Terminology panel
  const handleOpenTerminology = useCallback(() => {
    setShowTerminology(true)
  }, [])

  const handleCloseTerminology = useCallback(() => {
    setShowTerminology(false)
  }, [])

  // Leaderboard panel
  const handleOpenLeaderboard = useCallback(() => {
    setShowLeaderboard(true)
  }, [])

  const handleCloseLeaderboard = useCallback(() => {
    setShowLeaderboard(false)
  }, [])

  // Progression panel
  const handleOpenProgression = useCallback(() => {
    setShowProgression(true)
  }, [])

  const handleCloseProgression = useCallback(() => {
    setShowProgression(false)
  }, [])

  return (
    <div className="relative w-full h-[700px] md:h-[800px] rounded-2xl overflow-hidden bg-slate-900 select-none touch-none">
      {/* Three.js Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ touchAction: 'none' }}
      />

      {/* React UI Overlays */}
      {overlayPhase === 'menu' && !showTerminology && !showLeaderboard && !showProgression && (
        <StartScreen
          onStart={handleStart}
          highScore={highScore}
          onMuteToggle={handleMuteToggle}
          footballIQ={footballIQ}
          iqLevel={iqLevel}
          discoveredCount={discoveredCount}
          onOpenTerminology={handleOpenTerminology}
          onOpenLeaderboard={handleOpenLeaderboard}
          onOpenProgression={handleOpenProgression}
          playerLevel={progression.level}
          playerTitle={progression.title}
          currentStreak={streak.currentStreak}
          isStreakActive={streak.isActiveToday}
        />
      )}

      {overlayPhase === 'playing' && snapshot && (
        <GameHUD
          snapshot={snapshot}
          popups={popups}
          isFever={isFever}
          onPause={handlePause}
          onMuteToggle={handleMuteToggle}
          footballIQ={footballIQ}
          iqLevel={iqLevel}
          currentStreak={streak.currentStreak}
        />
      )}

      {overlayPhase === 'paused' && (
        <PauseScreen
          onResume={handleResume}
          onRestart={handleRestart}
          onMuteToggle={handleMuteToggle}
        />
      )}

      {overlayPhase === 'quiz' && snapshot && (
        <QuizScreen
          footballIQ={footballIQ}
          answeredIds={answeredTrivia}
          onComplete={handleQuizComplete}
          onSkip={handleQuizSkip}
        />
      )}

      {overlayPhase === 'gameover' && snapshot && !showLeaderboard && (
        <GameOverScreen
          snapshot={snapshot}
          onRestart={handleRestart}
          onMuteToggle={handleMuteToggle}
          footballIQ={footballIQ}
          iqLevel={iqLevel}
          onOpenLeaderboard={handleOpenLeaderboard}
          playerLevel={progression.level}
          playerTitle={progression.title}
          xpEarned={Math.floor(snapshot.score / 100) * 10}
        />
      )}

      {/* Terminology overlay (can appear over menu) */}
      {showTerminology && (
        <TerminologyCollection
          discoveredTerms={discoveredTerms}
          footballIQ={footballIQ}
          onClose={handleCloseTerminology}
        />
      )}

      {/* Leaderboard overlay (can appear over menu or gameover) */}
      {showLeaderboard && (
        <LeaderboardPanel
          onClose={handleCloseLeaderboard}
          currentScore={snapshot?.score}
        />
      )}

      {/* Progression overlay */}
      {showProgression && (
        <ProgressionPanel
          onClose={handleCloseProgression}
          xp={progression.xp}
          level={progression.level}
          title={progression.title}
          levelProgress={progression.levelProgress}
          nextLevelXP={progression.nextLevelXP}
          currentLevelXP={progression.currentLevelXP}
          unlockedAchievementIds={progression.unlockedAchievementIds}
          gamesPlayed={progression.gamesPlayed}
          currentStreak={streak.currentStreak}
          longestStreak={streak.longestStreak}
          isStreakActive={streak.isActiveToday}
        />
      )}

      {/* Toast notifications */}
      <Notifications
        levelUp={progression.pendingLevelUp}
        achievement={progression.pendingAchievement}
        streakMilestone={streak.milestoneReached}
        onDismissLevelUp={progression.dismissLevelUp}
        onDismissAchievement={progression.dismissAchievement}
        onDismissStreak={streak.dismissMilestone}
      />
    </div>
  )
}
