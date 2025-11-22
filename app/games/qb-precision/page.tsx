'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Target, Play, Pause, RotateCcw, TrendingUp } from 'lucide-react'

interface Vector2D {
  x: number
  y: number
}

interface Receiver {
  id: number
  x: number
  y: number
  route: Vector2D[]
  routeProgress: number
  speed: number
  active: boolean
}

interface Ball {
  x: number
  y: number
  vx: number
  vy: number
  gravity: number
  active: boolean
}

export default function QBPrecisionGame() {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'gameOver'>('menu')
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [completions, setCompletions] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [receivers, setReceivers] = useState<Receiver[]>([])
  const [ball, setBall] = useState<Ball | null>(null)
  const [level, setLevel] = useState(1)
  const [timeRemaining, setTimeRemaining] = useState(60) // 60 seconds per game

  // Throwing mechanics
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<Vector2D | null>(null)
  const [dragEnd, setDragEnd] = useState<Vector2D | null>(null)
  const [qbPosition] = useState<Vector2D>({ x: 400, y: 500 }) // QB at bottom center

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()
  const timerIntervalRef = useRef<NodeJS.Timeout>()

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem('qbPrecisionHighScore')
    if (saved) setHighScore(parseInt(saved))
  }, [])

  // Game timer
  useEffect(() => {
    if (gameState !== 'playing') return

    timerIntervalRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          endGame()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
      }
    }
  }, [gameState])

  // Spawn receivers
  useEffect(() => {
    if (gameState !== 'playing' || receivers.length > 0) return

    spawnReceivers()
  }, [gameState])

  const spawnReceivers = () => {
    const newReceivers: Receiver[] = []
    const numReceivers = Math.min(2 + level, 4) // More receivers at higher levels

    for (let i = 0; i < numReceivers; i++) {
      const startX = 200 + (i * 200)
      const startY = 400

      // Create route (simple pattern for now)
      const route: Vector2D[] = []
      const routeType = Math.floor(Math.random() * 3)

      if (routeType === 0) {
        // Go route (straight up)
        for (let j = 0; j < 100; j++) {
          route.push({ x: startX, y: startY - j * 3 })
        }
      } else if (routeType === 1) {
        // Post route (up then diagonal)
        for (let j = 0; j < 50; j++) {
          route.push({ x: startX, y: startY - j * 3 })
        }
        for (let j = 0; j < 50; j++) {
          route.push({ x: startX + j * 2, y: startY - 150 - j })
        }
      } else {
        // Out route (up then sideways)
        for (let j = 0; j < 50; j++) {
          route.push({ x: startX, y: startY - j * 3 })
        }
        for (let j = 0; j < 50; j++) {
          route.push({ x: startX + j * 3, y: startY - 150 })
        }
      }

      newReceivers.push({
        id: i,
        x: startX,
        y: startY,
        route,
        routeProgress: 0,
        speed: 1 + (level * 0.2),
        active: true
      })
    }

    setReceivers(newReceivers)
  }

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const gameLoop = () => {
      // Clear canvas
      ctx.fillStyle = '#1e3a1e'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw field markings
      drawField(ctx)

      // Update and draw receivers
      receivers.forEach(receiver => {
        if (receiver.active && receiver.routeProgress < receiver.route.length) {
          receiver.routeProgress += receiver.speed
          const pos = receiver.route[Math.floor(receiver.routeProgress)]
          if (pos) {
            receiver.x = pos.x
            receiver.y = pos.y
          }
        }

        // Draw receiver
        ctx.fillStyle = receiver.active ? '#60a5fa' : '#94a3b8'
        ctx.beginPath()
        ctx.arc(receiver.x, receiver.y, 15, 0, Math.PI * 2)
        ctx.fill()

        // Draw route path
        ctx.strokeStyle = '#334155'
        ctx.lineWidth = 2
        ctx.setLineDash([5, 5])
        ctx.beginPath()
        receiver.route.forEach((point, i) => {
          if (i === 0) ctx.moveTo(point.x, point.y)
          else ctx.lineTo(point.x, point.y)
        })
        ctx.stroke()
        ctx.setLineDash([])
      })

      // Update and draw ball
      if (ball && ball.active) {
        ball.x += ball.vx
        ball.y += ball.vy
        ball.vy += ball.gravity

        // Draw ball
        ctx.fillStyle = '#f97316'
        ctx.beginPath()
        ctx.arc(ball.x, ball.y, 10, 0, Math.PI * 2)
        ctx.fill()

        // Check for catches
        receivers.forEach(receiver => {
          if (!receiver.active) return

          const dx = ball.x - receiver.x
          const dy = ball.y - receiver.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 25) {
            // Catch!
            setBall(null)
            setScore(prev => prev + 100 * level)
            setCompletions(prev => prev + 1)
            setAttempts(prev => prev + 1)
            receiver.active = false

            // Spawn new receivers after short delay
            setTimeout(() => {
              setReceivers([])
              setTimeout(spawnReceivers, 100)
            }, 500)
          }
        })

        // Ball out of bounds
        if (ball.y < 0 || ball.y > canvas.height || ball.x < 0 || ball.x > canvas.width) {
          setBall(null)
          setAttempts(prev => prev + 1)

          // Spawn new receivers
          setTimeout(() => {
            setReceivers([])
            setTimeout(spawnReceivers, 100)
          }, 500)
        }
      }

      // Draw QB
      ctx.fillStyle = '#f97316'
      ctx.beginPath()
      ctx.arc(qbPosition.x, qbPosition.y, 20, 0, Math.PI * 2)
      ctx.fill()

      // Draw QB label
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 16px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('QB', qbPosition.x, qbPosition.y + 45)

      // Draw aiming line while dragging
      if (isDragging && dragStart && dragEnd) {
        ctx.strokeStyle = '#fbbf24'
        ctx.lineWidth = 3
        ctx.setLineDash([])
        ctx.beginPath()
        ctx.moveTo(qbPosition.x, qbPosition.y)
        ctx.lineTo(dragEnd.x, dragEnd.y)
        ctx.stroke()

        // Draw power indicator
        const dx = dragEnd.x - qbPosition.x
        const dy = dragEnd.y - qbPosition.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const power = Math.min(distance / 3, 100)

        ctx.fillStyle = '#fbbf24'
        ctx.font = 'bold 14px sans-serif'
        ctx.fillText(`${Math.round(power)}% Power`, qbPosition.x, qbPosition.y - 40)
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop)
    }

    gameLoop()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [gameState, receivers, ball, isDragging, dragStart, dragEnd])

  const drawField = (ctx: CanvasRenderingContext2D) => {
    // Draw yard lines
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 1
    ctx.setLineDash([])

    for (let y = 50; y < 600; y += 50) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(800, y)
      ctx.stroke()
    }

    // Draw end zone
    ctx.fillStyle = '#f9731644'
    ctx.fillRect(0, 0, 800, 100)
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameState !== 'playing' || ball?.active) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Check if clicking near QB
    const dx = x - qbPosition.x
    const dy = y - qbPosition.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance < 50) {
      setIsDragging(true)
      setDragStart({ x, y })
      setDragEnd({ x, y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setDragEnd({ x, y })
  }

  const handleMouseUp = () => {
    if (!isDragging || !dragEnd) return

    // Calculate throw velocity
    const dx = dragEnd.x - qbPosition.x
    const dy = dragEnd.y - qbPosition.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance > 20) {
      // Throw the ball
      const power = Math.min(distance / 3, 100) / 100
      const angle = Math.atan2(dy, dx)

      const throwSpeed = 15 * power
      const vx = Math.cos(angle) * throwSpeed
      const vy = Math.sin(angle) * throwSpeed - 3 // Add arc

      setBall({
        x: qbPosition.x,
        y: qbPosition.y,
        vx,
        vy,
        gravity: 0.3,
        active: true
      })
    }

    setIsDragging(false)
    setDragStart(null)
    setDragEnd(null)
  }

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (gameState !== 'playing' || ball?.active) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const touch = e.touches[0]
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top

    const dx = x - qbPosition.x
    const dy = y - qbPosition.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance < 50) {
      setIsDragging(true)
      setDragStart({ x, y })
      setDragEnd({ x, y })
    }
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDragging) return
    e.preventDefault()

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const touch = e.touches[0]
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top

    setDragEnd({ x, y })
  }

  const handleTouchEnd = () => {
    handleMouseUp()
  }

  const startGame = () => {
    setGameState('playing')
    setScore(0)
    setCompletions(0)
    setAttempts(0)
    setLevel(1)
    setTimeRemaining(60)
    setReceivers([])
    setBall(null)
    setIsDragging(false)
  }

  const endGame = () => {
    setGameState('gameOver')
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem('qbPrecisionHighScore', score.toString())
    }
  }

  const togglePause = () => {
    setGameState(prev => prev === 'playing' ? 'paused' : 'playing')
  }

  const completionPercentage = attempts > 0 ? ((completions / attempts) * 100).toFixed(1) : '0.0'

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-gray-900/90 backdrop-blur-sm text-white">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-orange-500 flex items-center gap-2">
                <Target className="h-8 w-8" />
                QB Precision
              </h1>
              <p className="text-gray-400 mt-1">Retro Bowl-Style Throwing</p>
            </div>
            {gameState === 'playing' && (
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-500">{score}</div>
                <div className="text-sm text-gray-400">
                  {completions}/{attempts} ({completionPercentage}%)
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Game Area */}
        <div className="relative bg-gray-800">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="w-full max-w-full h-auto cursor-crosshair"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => {
              if (isDragging) handleMouseUp()
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />

          {/* Menu Overlay */}
          {gameState === 'menu' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
              <h2 className="text-4xl font-bold mb-4">QB Precision</h2>
              <p className="text-lg mb-2">Retro Bowl-Style Football Game</p>
              <p className="text-sm text-gray-300 mb-8 text-center max-w-md px-4">
                Hold and drag from the QB to aim<br/>
                Release to throw with arc and power<br/>
                Hit receivers in stride for completions
              </p>
              <Button onClick={startGame} size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                <Play className="h-5 w-5 mr-2" />
                Start Game
              </Button>
              {highScore > 0 && (
                <div className="mt-6 text-center">
                  <div className="text-sm text-gray-400">High Score</div>
                  <div className="text-3xl font-bold text-orange-500">{highScore}</div>
                </div>
              )}
            </div>
          )}

          {/* Paused Overlay */}
          {gameState === 'paused' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
              <h2 className="text-4xl font-bold mb-8">Paused</h2>
              <div className="flex gap-4">
                <Button onClick={togglePause} size="lg" className="bg-green-500 hover:bg-green-600">
                  <Play className="h-5 w-5 mr-2" />
                  Resume
                </Button>
                <Button onClick={() => setGameState('menu')} size="lg" variant="outline">
                  Main Menu
                </Button>
              </div>
            </div>
          )}

          {/* Game Over Overlay */}
          {gameState === 'gameOver' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
              <h2 className="text-4xl font-bold mb-4">Time's Up!</h2>
              <div className="text-6xl font-bold mb-2 text-orange-500">{score}</div>
              <div className="text-lg mb-2">
                <TrendingUp className="inline h-5 w-5 mr-2" />
                {completions}/{attempts} Completions ({completionPercentage}%)
              </div>
              <div className="text-sm text-gray-400 mb-8">
                High Score: {highScore}
              </div>
              <div className="flex gap-4">
                <Button onClick={startGame} size="lg" className="bg-orange-500 hover:bg-orange-600">
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Play Again
                </Button>
                <Button onClick={() => setGameState('menu')} size="lg" variant="outline">
                  Main Menu
                </Button>
              </div>
            </div>
          )}

          {/* HUD */}
          {gameState === 'playing' && (
            <div className="absolute top-4 left-4 right-4 flex justify-between">
              <div className="bg-black/50 px-4 py-2 rounded-lg">
                <div className="text-xs text-gray-300">Time</div>
                <div className="text-2xl font-bold text-orange-500">{timeRemaining}s</div>
              </div>
              <div className="bg-black/50 px-4 py-2 rounded-lg">
                <div className="text-xs text-gray-300">Level</div>
                <div className="text-2xl font-bold">{level}</div>
              </div>
              <Button
                onClick={togglePause}
                size="sm"
                variant="outline"
                className="bg-black/50"
              >
                <Pause className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Instructions */}
        {gameState === 'menu' && (
          <div className="p-6 border-t border-gray-700">
            <h3 className="font-semibold mb-2">How to Play:</h3>
            <div className="text-sm text-gray-300 space-y-2">
              <p>1. Click and hold near the QB (orange player at bottom)</p>
              <p>2. Drag your mouse/finger to aim at a receiver (blue players running routes)</p>
              <p>3. The farther you drag, the more power in your throw</p>
              <p>4. Release to throw the ball with a parabolic arc</p>
              <p>5. Hit receivers in stride for completions and points!</p>
              <p className="text-orange-500 font-semibold mt-4">
                Complete passes within 60 seconds to maximize your score!
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
