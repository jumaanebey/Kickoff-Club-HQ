'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore, DefensiveFormation, Play } from './hooks/useGameStore'
import { Button } from '@/components/ui/button'
import {
  Trophy,
  Zap,
  BookOpen,
  ChevronRight,
  Check,
  X,
  Target,
  Brain,
  ArrowRight,
  RotateCcw,
  HelpCircle,
  Flame
} from 'lucide-react'

// Menu Screen
function MenuScreen() {
  const { startGame, showTutorial, highScore, gamesPlayed } = useGameStore()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center p-4 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900"
    >
      <div className="w-full max-w-lg text-center">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 mb-4 shadow-lg shadow-green-500/30">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
            GRIDIRON <span className="text-green-400">IQ</span>
          </h1>
          <p className="text-slate-400">
            Think like a coach. Beat the defense.
          </p>
        </motion.div>

        {/* Stats */}
        {gamesPlayed > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center gap-4 mb-6"
          >
            <div className="bg-slate-800/50 rounded-xl px-5 py-2">
              <div className="text-xl font-black text-yellow-400">{highScore}</div>
              <div className="text-slate-500 text-xs">High Score</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl px-5 py-2">
              <div className="text-xl font-black text-slate-300">{gamesPlayed}</div>
              <div className="text-slate-500 text-xs">Games</div>
            </div>
          </motion.div>
        )}

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <Button
            onClick={startGame}
            className="w-full py-5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-black text-lg rounded-xl shadow-lg shadow-green-500/30"
          >
            START GAME
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>

          <Button
            onClick={showTutorial}
            variant="outline"
            className="w-full py-4 border-slate-600 text-slate-300 hover:bg-slate-800 rounded-xl"
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            How to Play
          </Button>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-slate-500 text-sm max-w-sm mx-auto"
        >
          Read the defense and call the perfect play. Learn real NFL concepts while testing your football IQ.
        </motion.p>
      </div>
    </motion.div>
  )
}

// Tutorial Screen
function TutorialScreen() {
  const { skipTutorial } = useGameStore()

  const steps = [
    {
      icon: Target,
      title: 'Read the Defense',
      description: 'Look at the defensive formation. Each coverage has weaknesses you can exploit.'
    },
    {
      icon: BookOpen,
      title: 'Pick the Right Play',
      description: 'Choose from 4 plays. Slants beat man coverage, posts beat Cover 2, etc.'
    },
    {
      icon: Zap,
      title: 'Build Your Streak',
      description: 'Correct = 100 pts. Streak bonus = +25 per consecutive answer!'
    },
    {
      icon: Trophy,
      title: 'Beat Your High Score',
      description: '10 questions per game. Go for the perfect score!'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center p-4 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-y-auto"
    >
      <div className="w-full max-w-lg py-4">
        <h2 className="text-2xl font-black text-white text-center mb-6">
          HOW TO PLAY
        </h2>

        <div className="space-y-3 mb-6">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-3 bg-slate-800/50 rounded-xl p-3"
            >
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <step.icon className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm mb-0.5">{step.title}</h3>
                <p className="text-slate-400 text-xs">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <Button
          onClick={skipTutorial}
          className="w-full py-5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-black text-lg rounded-xl"
        >
          GOT IT - LET'S PLAY
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </motion.div>
  )
}

// Defensive Formation Display
function DefenseDisplay({ defense }: { defense: DefensiveFormation }) {
  return (
    <div className="relative w-full aspect-[4/3] bg-gradient-to-t from-green-800 via-green-700 to-green-600 rounded-xl overflow-hidden shadow-inner">
      {/* Field texture */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(90deg, transparent 0px, transparent 40px, rgba(0,0,0,0.1) 40px, rgba(0,0,0,0.1) 80px)`
        }}
      />

      {/* Yard lines */}
      {[20, 40, 60, 80].map(y => {
        const top = 15 + (y / 100) * 70
        return (
          <div
            key={y}
            className="absolute left-[10%] right-[10%] h-[1px] bg-white/30"
            style={{ top: `${top}%` }}
          />
        )
      })}

      {/* Line of scrimmage */}
      <div
        className="absolute left-[5%] right-[5%] h-1 bg-yellow-400 shadow-lg"
        style={{ top: '80%' }}
      />

      {/* Coverage label */}
      <div className="absolute top-2 left-2 right-2">
        <div className="bg-red-600/90 backdrop-blur-sm rounded-lg px-2 py-1.5 text-center">
          <div className="text-white font-black text-xs sm:text-sm">{defense.name}</div>
        </div>
      </div>

      {/* Defensive players */}
      {defense.positions.map((player, i) => {
        const screenX = player.position.x
        const screenY = 15 + (player.position.y / 100) * 65

        const colors: { [key: string]: string } = {
          CB: 'bg-red-500',
          S: 'bg-red-600',
          LB: 'bg-red-700',
          DL: 'bg-red-800'
        }

        return (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${screenX}%`, top: `${screenY}%` }}
          >
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full ${colors[player.role]} border-2 border-white flex items-center justify-center text-white text-[10px] sm:text-xs font-bold shadow-lg`}
            >
              {player.role}
            </div>
          </motion.div>
        )
      })}

      {/* Offense placeholder (line of scrimmage) */}
      <div className="absolute left-[30%] right-[30%] flex justify-around" style={{ top: '82%' }}>
        {[0, 1, 2, 3, 4].map(i => (
          <div
            key={i}
            className="w-4 h-4 sm:w-5 sm:h-5 rounded bg-blue-500/60 border border-white/40"
          />
        ))}
      </div>
    </div>
  )
}

// Play Option Card
function PlayOptionCard({ play, onClick, disabled }: { play: Play, onClick: () => void, disabled: boolean }) {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.01 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
        disabled
          ? 'border-slate-700 bg-slate-800/50 opacity-50 cursor-not-allowed'
          : 'border-slate-600 bg-slate-800/80 hover:border-green-500 hover:bg-slate-700/80 cursor-pointer'
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-bold text-white text-sm">{play.name}</h3>
        <span className={`text-[10px] px-2 py-0.5 rounded-full ${
          play.playType === 'run' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'
        }`}>
          {play.playType.toUpperCase()}
        </span>
      </div>
      <p className="text-slate-400 text-xs">{play.description}</p>
    </motion.button>
  )
}

// Game Screen (Quiz)
function GameScreen() {
  const {
    currentQuestion,
    totalQuestions,
    currentDefense,
    playOptions,
    selectPlay,
    score,
    streak,
    down,
    yardsToGo,
    fieldPosition,
    timeRemaining,
    phase
  } = useGameStore()

  if (phase !== 'playing' || !currentDefense) return null

  const downSuffix = ['st', 'nd', 'rd', 'th'][Math.min(down - 1, 3)]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 p-3 sm:p-4 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-y-auto"
    >
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-slate-400 text-xs sm:text-sm">
            Q <span className="text-white font-bold">{currentQuestion}</span>/{totalQuestions}
          </div>
          <div className="flex items-center gap-3">
            {streak > 0 && (
              <div className="flex items-center gap-1 text-orange-400">
                <Flame className="w-4 h-4" />
                <span className="font-bold text-sm">{streak}</span>
              </div>
            )}
            <div className="text-green-400 font-bold text-sm">{score} pts</div>
          </div>
        </div>

        {/* Situation */}
        <div className="bg-slate-800/50 rounded-xl p-3 mb-3">
          <div className="flex items-center justify-between text-sm">
            <div>
              <div className="text-white font-bold">
                {down}{downSuffix} & {yardsToGo}
              </div>
              <div className="text-slate-400 text-xs">
                Ball on {fieldPosition < 50 ? `OWN ${fieldPosition}` : `OPP ${100 - fieldPosition}`}
              </div>
            </div>
            <div className="text-right">
              <div className="text-white font-mono text-xs">{timeRemaining}</div>
            </div>
          </div>
        </div>

        {/* Defense Display */}
        <div className="mb-4">
          <div className="text-center mb-2">
            <h2 className="text-white font-bold text-sm">The defense is showing...</h2>
          </div>
          <DefenseDisplay defense={currentDefense} />

          {/* Defense info */}
          <div className="mt-2 bg-slate-800/50 rounded-lg p-2">
            <div className="text-slate-400 text-xs">{currentDefense.description}</div>
          </div>
        </div>

        {/* Play Options */}
        <div className="space-y-2">
          <h3 className="text-white font-bold text-sm text-center">What play do you call?</h3>
          {playOptions.map((play, i) => (
            <motion.div
              key={play.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <PlayOptionCard
                play={play}
                onClick={() => selectPlay(play)}
                disabled={false}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// Result Screen
function ResultScreen() {
  const {
    selectedPlay,
    correctPlay,
    currentDefense,
    nextQuestion,
    currentQuestion,
    totalQuestions,
    score,
    streak,
    phase
  } = useGameStore()

  if (phase !== 'result' || !selectedPlay || !correctPlay || !currentDefense) return null

  const isCorrect = selectedPlay.id === correctPlay.id

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center p-4 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-y-auto"
    >
      <div className="w-full max-w-lg py-4">
        {/* Result Header */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center mb-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 10 }}
            className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 ${
              isCorrect ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            {isCorrect ? (
              <Check className="w-8 h-8 text-white" />
            ) : (
              <X className="w-8 h-8 text-white" />
            )}
          </motion.div>

          <h2 className={`text-2xl font-black ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
            {isCorrect ? 'CORRECT!' : 'NOT QUITE'}
          </h2>

          {isCorrect && streak > 1 && (
            <div className="flex items-center justify-center gap-2 text-orange-400 mt-1">
              <Flame className="w-4 h-4" />
              <span className="font-bold text-sm">{streak} streak!</span>
            </div>
          )}
        </motion.div>

        {/* Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`rounded-xl p-4 mb-4 ${isCorrect ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}
        >
          <div className="mb-2">
            <div className="text-slate-400 text-xs mb-0.5">You selected:</div>
            <div className="text-white font-bold text-sm">{selectedPlay.name}</div>
          </div>

          {!isCorrect && (
            <div className="mb-2">
              <div className="text-slate-400 text-xs mb-0.5">Better choice:</div>
              <div className="text-green-400 font-bold text-sm">{correctPlay.name}</div>
            </div>
          )}

          <div className="border-t border-white/10 pt-2 mt-2">
            <div className="flex items-start gap-2">
              <BookOpen className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-yellow-400 font-bold text-xs mb-0.5">Why?</div>
                <p className="text-slate-300 text-xs">
                  Against <span className="text-red-400 font-semibold">{currentDefense.name}</span>:
                  {' '}{currentDefense.weaknesses}
                </p>
                <p className="text-slate-400 text-xs mt-1">
                  <span className="text-green-400">{correctPlay.name}</span> exploits this weakness.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Score */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-4"
        >
          <div className="text-slate-400 text-xs">Score</div>
          <div className="text-2xl font-black text-white">{score}</div>
        </motion.div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            onClick={nextQuestion}
            className="w-full py-5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-black text-lg rounded-xl"
          >
            {currentQuestion >= totalQuestions ? 'SEE RESULTS' : 'NEXT QUESTION'}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Game Over Screen
function GameOverScreen() {
  const { score, highScore, correctAnswers, totalQuestions, bestStreak, resetGame, phase } = useGameStore()

  if (phase !== 'game-over') return null

  const percentage = Math.round((correctAnswers / totalQuestions) * 100)
  const isNewHighScore = score === highScore && score > 0

  let grade = 'F'
  let gradeColor = 'text-red-400'
  if (percentage >= 90) { grade = 'A+'; gradeColor = 'text-green-400' }
  else if (percentage >= 80) { grade = 'A'; gradeColor = 'text-green-400' }
  else if (percentage >= 70) { grade = 'B'; gradeColor = 'text-yellow-400' }
  else if (percentage >= 60) { grade = 'C'; gradeColor = 'text-orange-400' }
  else if (percentage >= 50) { grade = 'D'; gradeColor = 'text-orange-400' }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center p-4 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900"
    >
      <div className="w-full max-w-lg text-center">
        {/* Trophy */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 10 }}
          className="mb-4"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg shadow-yellow-500/30">
            <Trophy className="w-10 h-10 text-white" />
          </div>
        </motion.div>

        <h2 className="text-2xl font-black text-white mb-1">GAME OVER</h2>

        {isNewHighScore && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-yellow-400 font-bold text-sm mb-3"
          >
            NEW HIGH SCORE!
          </motion.div>
        )}

        {/* Grade */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-4"
        >
          <div className={`text-6xl font-black ${gradeColor}`}>{grade}</div>
          <div className="text-slate-400 text-sm">Coach Rating</div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          <div className="bg-slate-800/50 rounded-xl p-3">
            <div className="text-xl font-black text-white">{score}</div>
            <div className="text-slate-500 text-xs">Score</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-3">
            <div className="text-xl font-black text-green-400">{correctAnswers}/{totalQuestions}</div>
            <div className="text-slate-500 text-xs">Correct</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-3">
            <div className="text-xl font-black text-orange-400">{bestStreak}</div>
            <div className="text-slate-500 text-xs">Streak</div>
          </div>
        </motion.div>

        {/* Play Again */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            onClick={resetGame}
            className="w-full py-5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-black text-lg rounded-xl"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            PLAY AGAIN
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Main Game Component
export function GridironIQGame() {
  const { phase } = useGameStore()

  return (
    <div className="relative w-full h-[700px] md:h-[800px] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
      <AnimatePresence mode="wait">
        {phase === 'menu' && <MenuScreen key="menu" />}
        {phase === 'tutorial' && <TutorialScreen key="tutorial" />}
        {phase === 'playing' && <GameScreen key="playing" />}
        {phase === 'result' && <ResultScreen key="result" />}
        {phase === 'game-over' && <GameOverScreen key="game-over" />}
      </AnimatePresence>

      {/* Version indicator */}
      <div className="absolute bottom-2 left-2 text-white/20 text-xs font-mono pointer-events-none z-10">
        Gridiron IQ v2.0
      </div>
    </div>
  )
}

export default GridironIQGame
