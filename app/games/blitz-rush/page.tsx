'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Game constants
const LANE_COUNT = 3
const PLAYER_WIDTH = 50
const PLAYER_HEIGHT = 80
const OBSTACLE_WIDTH = 60
const OBSTACLE_HEIGHT = 60
const COIN_SIZE = 30
const GROUND_HEIGHT = 100
const GRAVITY = 0.8
const JUMP_FORCE = -15
const INITIAL_SPEED = 5
const SPEED_INCREMENT = 0.001
const SPAWN_INTERVAL = 1500

type GameState = 'menu' | 'playing' | 'paused' | 'gameover'

interface GameObject {
  x: number
  y: number
  lane: number
  type: 'obstacle' | 'coin'
}

export default function BlitzRushPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameState, setGameState] = useState<GameState>('menu')
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [muted, setMuted] = useState(false)

  // Game state refs (for animation loop)
  const gameStateRef = useRef<GameState>('menu')
  const scoreRef = useRef(0)
  const playerRef = useRef({
    lane: 1,
    y: 0,
    velocityY: 0,
    isJumping: false,
    targetLane: 1,
  })
  const objectsRef = useRef<GameObject[]>([])
  const speedRef = useRef(INITIAL_SPEED)
  const lastSpawnRef = useRef(0)
  const animationRef = useRef<number>(0)

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem('blitzRushHighScore')
    if (saved) setHighScore(parseInt(saved))
  }, [])

  // Get lane X position
  const getLaneX = useCallback((lane: number, canvasWidth: number) => {
    const laneWidth = canvasWidth / LANE_COUNT
    return laneWidth * lane + laneWidth / 2
  }, [])

  // Start game
  const startGame = useCallback(() => {
    playerRef.current = {
      lane: 1,
      y: 0,
      velocityY: 0,
      isJumping: false,
      targetLane: 1,
    }
    objectsRef.current = []
    speedRef.current = INITIAL_SPEED
    scoreRef.current = 0
    lastSpawnRef.current = Date.now()
    setScore(0)
    setGameState('playing')
    gameStateRef.current = 'playing'
  }, [])

  // End game
  const endGame = useCallback(() => {
    setGameState('gameover')
    gameStateRef.current = 'gameover'
    if (scoreRef.current > highScore) {
      setHighScore(scoreRef.current)
      localStorage.setItem('blitzRushHighScore', scoreRef.current.toString())
    }
  }, [highScore])

  // Switch lane
  const switchLane = useCallback((direction: 'left' | 'right') => {
    if (gameStateRef.current !== 'playing') return
    const player = playerRef.current
    if (direction === 'left' && player.targetLane > 0) {
      player.targetLane--
    } else if (direction === 'right' && player.targetLane < LANE_COUNT - 1) {
      player.targetLane++
    }
  }, [])

  // Jump
  const jump = useCallback(() => {
    if (gameStateRef.current !== 'playing') return
    const player = playerRef.current
    if (!player.isJumping) {
      player.velocityY = JUMP_FORCE
      player.isJumping = true
    }
  }, [])

  // Handle keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameStateRef.current === 'menu' || gameStateRef.current === 'gameover') {
        if (e.code === 'Space' || e.code === 'Enter') {
          startGame()
        }
        return
      }

      if (gameStateRef.current === 'playing') {
        switch (e.code) {
          case 'ArrowLeft':
          case 'KeyA':
            switchLane('left')
            break
          case 'ArrowRight':
          case 'KeyD':
            switchLane('right')
            break
          case 'ArrowUp':
          case 'KeyW':
          case 'Space':
            jump()
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [startGame, switchLane, jump])

  // Handle touch
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let touchStartX = 0
    let touchStartY = 0

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX
      touchStartY = e.touches[0].clientY
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (gameStateRef.current === 'menu' || gameStateRef.current === 'gameover') {
        startGame()
        return
      }

      const touchEndX = e.changedTouches[0].clientX
      const touchEndY = e.changedTouches[0].clientY
      const deltaX = touchEndX - touchStartX
      const deltaY = touchEndY - touchStartY

      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 30) {
        // Horizontal swipe
        if (deltaX > 0) switchLane('right')
        else switchLane('left')
      } else if (deltaY < -30) {
        // Swipe up
        jump()
      }
    }

    canvas.addEventListener('touchstart', handleTouchStart)
    canvas.addEventListener('touchend', handleTouchEnd)

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart)
      canvas.removeEventListener('touchend', handleTouchEnd)
    }
  }, [startGame, switchLane, jump])

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()
    window.addEventListener('resize', resize)

    const gameLoop = () => {
      const width = canvas.offsetWidth
      const height = canvas.offsetHeight
      const groundY = height - GROUND_HEIGHT

      // Clear canvas
      ctx.fillStyle = '#0f172a'
      ctx.fillRect(0, 0, width, height)

      // Draw lanes
      const laneWidth = width / LANE_COUNT
      ctx.strokeStyle = '#1e293b'
      ctx.lineWidth = 2
      for (let i = 1; i < LANE_COUNT; i++) {
        ctx.beginPath()
        ctx.setLineDash([20, 20])
        ctx.moveTo(i * laneWidth, 0)
        ctx.lineTo(i * laneWidth, groundY)
        ctx.stroke()
      }
      ctx.setLineDash([])

      // Draw ground
      ctx.fillStyle = '#166534'
      ctx.fillRect(0, groundY, width, GROUND_HEIGHT)

      // Draw yard lines
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 3
      for (let i = 0; i < 5; i++) {
        const y = groundY + 20 + i * 15
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      if (gameStateRef.current === 'playing') {
        const player = playerRef.current

        // Update player lane position (smooth transition)
        const targetX = getLaneX(player.targetLane, width)
        const currentX = getLaneX(player.lane, width)
        const laneSpeed = 0.15
        player.lane += (player.targetLane - player.lane) * laneSpeed

        // Update player Y (jumping)
        player.velocityY += GRAVITY
        player.y += player.velocityY
        if (player.y >= 0) {
          player.y = 0
          player.velocityY = 0
          player.isJumping = false
        }

        // Spawn objects
        const now = Date.now()
        if (now - lastSpawnRef.current > SPAWN_INTERVAL / (speedRef.current / INITIAL_SPEED)) {
          const lane = Math.floor(Math.random() * LANE_COUNT)
          const type = Math.random() > 0.3 ? 'obstacle' : 'coin'
          objectsRef.current.push({
            x: 0,
            y: -100,
            lane,
            type,
          })
          lastSpawnRef.current = now
        }

        // Update objects
        const playerX = getLaneX(player.lane, width)
        const playerY = groundY - PLAYER_HEIGHT + player.y

        objectsRef.current = objectsRef.current.filter(obj => {
          obj.y += speedRef.current

          // Check collision
          const objX = getLaneX(obj.lane, width)
          const objY = obj.y

          const hitX = Math.abs(objX - playerX) < (PLAYER_WIDTH + (obj.type === 'coin' ? COIN_SIZE : OBSTACLE_WIDTH)) / 2
          const hitY = objY + (obj.type === 'coin' ? COIN_SIZE : OBSTACLE_HEIGHT) > playerY && objY < playerY + PLAYER_HEIGHT

          if (hitX && hitY) {
            if (obj.type === 'coin') {
              scoreRef.current += 10
              setScore(scoreRef.current)
              return false // Remove coin
            } else {
              endGame()
            }
          }

          return obj.y < height + 100
        })

        // Increase speed and score
        speedRef.current += SPEED_INCREMENT
        scoreRef.current += 0.1
        setScore(Math.floor(scoreRef.current))
      }

      // Draw objects
      objectsRef.current.forEach(obj => {
        const objX = getLaneX(obj.lane, canvas.offsetWidth)
        if (obj.type === 'obstacle') {
          // Draw defender
          ctx.fillStyle = '#dc2626'
          ctx.fillRect(objX - OBSTACLE_WIDTH / 2, obj.y, OBSTACLE_WIDTH, OBSTACLE_HEIGHT)
          // Helmet
          ctx.fillStyle = '#991b1b'
          ctx.beginPath()
          ctx.arc(objX, obj.y + 15, 20, 0, Math.PI * 2)
          ctx.fill()
        } else {
          // Draw coin
          ctx.fillStyle = '#fbbf24'
          ctx.beginPath()
          ctx.arc(objX, obj.y + COIN_SIZE / 2, COIN_SIZE / 2, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = '#f59e0b'
          ctx.beginPath()
          ctx.arc(objX, obj.y + COIN_SIZE / 2, COIN_SIZE / 3, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      // Draw player
      const player = playerRef.current
      const playerX = getLaneX(player.lane, width)
      const playerY = groundY - PLAYER_HEIGHT + player.y

      // Body
      ctx.fillStyle = '#f97316'
      ctx.fillRect(playerX - PLAYER_WIDTH / 2, playerY, PLAYER_WIDTH, PLAYER_HEIGHT)

      // Helmet
      ctx.fillStyle = '#ea580c'
      ctx.beginPath()
      ctx.arc(playerX, playerY + 15, 22, 0, Math.PI * 2)
      ctx.fill()

      // Jersey number
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 20px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('7', playerX, playerY + 55)

      // Draw UI
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 24px sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText(`Score: ${Math.floor(scoreRef.current)}`, 20, 40)
      ctx.fillText(`Best: ${highScore}`, 20, 70)

      // Draw overlays
      if (gameStateRef.current === 'menu') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
        ctx.fillRect(0, 0, width, height)

        ctx.fillStyle = '#f97316'
        ctx.font = 'bold 48px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('BLITZ RUSH', width / 2, height / 2 - 40)

        ctx.fillStyle = '#ffffff'
        ctx.font = '24px sans-serif'
        ctx.fillText('Press SPACE or Tap to Start', width / 2, height / 2 + 20)

        ctx.font = '16px sans-serif'
        ctx.fillStyle = '#94a3b8'
        ctx.fillText('← → or Swipe to change lanes', width / 2, height / 2 + 60)
        ctx.fillText('↑ or Swipe up to jump', width / 2, height / 2 + 85)
      }

      if (gameStateRef.current === 'gameover') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
        ctx.fillRect(0, 0, width, height)

        ctx.fillStyle = '#ef4444'
        ctx.font = 'bold 48px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('GAME OVER', width / 2, height / 2 - 60)

        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 32px sans-serif'
        ctx.fillText(`Score: ${Math.floor(scoreRef.current)}`, width / 2, height / 2)

        if (scoreRef.current >= highScore) {
          ctx.fillStyle = '#fbbf24'
          ctx.font = '24px sans-serif'
          ctx.fillText('NEW HIGH SCORE!', width / 2, height / 2 + 40)
        }

        ctx.fillStyle = '#94a3b8'
        ctx.font = '20px sans-serif'
        ctx.fillText('Press SPACE or Tap to Play Again', width / 2, height / 2 + 90)
      }

      animationRef.current = requestAnimationFrame(gameLoop)
    }

    animationRef.current = requestAnimationFrame(gameLoop)

    return () => {
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [getLaneX, highScore, endGame])

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" asChild className="text-white hover:bg-white/10">
            <Link href="/games">
              <ArrowLeft className="mr-2 w-5 h-5" />
              Back to Games
            </Link>
          </Button>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={() => setMuted(!muted)}
            >
              {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </Button>

            <div className="text-right">
              <h1 className="text-xl font-bold text-white">Blitz Rush</h1>
              <p className="text-sm text-white/60">Endless Runner</p>
            </div>
          </div>
        </div>

        {/* Game Canvas */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="w-full h-[600px] md:h-[700px] rounded-2xl bg-slate-900 cursor-pointer"
            onClick={() => {
              if (gameState === 'menu' || gameState === 'gameover') {
                startGame()
              }
            }}
          />
        </div>

        {/* Instructions */}
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
            <h3 className="font-bold text-white mb-3">How to Play</h3>
            <ul className="space-y-2 text-white/70 text-sm">
              <li className="flex items-center gap-2">
                <span className="bg-slate-800 px-2 py-1 rounded text-xs font-mono">←/→</span>
                <span>Arrow keys or swipe to change lanes</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-slate-800 px-2 py-1 rounded text-xs font-mono">↑/Space</span>
                <span>Jump over obstacles</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-slate-800 px-2 py-1 rounded text-xs font-mono">Touch</span>
                <span>Tap to start, swipe to control</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
            <h3 className="font-bold text-white mb-3">Scoring</h3>
            <ul className="space-y-2 text-white/70 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 bg-yellow-500 rounded-full" />
                <span>Collect coins for +10 points</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 bg-red-600 rounded" />
                <span>Avoid defenders - game over on hit!</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 bg-orange-500 rounded" />
                <span>Run longer for more points</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
