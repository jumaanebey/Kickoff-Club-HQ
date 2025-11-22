'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Trophy, Play, Pause, RotateCcw } from 'lucide-react'

type Lane = 0 | 1 | 2
type ObstacleType = 'cone' | 'tackler' | 'barrier'

interface Obstacle {
  id: number
  lane: Lane
  z: number // Distance from player (higher = farther away)
  type: ObstacleType
  height: 'low' | 'high' // low = slide under, high = jump over
}

interface PowerUp {
  id: number
  lane: Lane
  z: number
  type: 'football' | 'boost'
}

export default function BlitzRushGame() {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'gameOver'>('menu')
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [playerLane, setPlayerLane] = useState<Lane>(1) // Start in middle lane
  const [playerAction, setPlayerAction] = useState<'running' | 'jumping' | 'sliding'>('running')
  const [obstacles, setObstacles] = useState<Obstacle[]>([])
  const [powerUps, setPowerUps] = useState<PowerUp[]>([])
  const [speed, setSpeed] = useState(5) // Game speed increases over time
  const [distance, setDistance] = useState(0) // Total distance traveled

  const gameLoopRef = useRef<number>()
  const lastObstacleRef = useRef(0)
  const lastPowerUpRef = useRef(0)
  const jumpTimeoutRef = useRef<NodeJS.Timeout>()
  const slideTimeoutRef = useRef<NodeJS.Timeout>()

  // Load high score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('blitzRushHighScore')
    if (saved) setHighScore(parseInt(saved))
  }, [])

  // Main game loop
  useEffect(() => {
    if (gameState !== 'playing') return

    const gameLoop = () => {
      // Move obstacles toward player
      setObstacles(prev =>
        prev
          .map(obs => ({ ...obs, z: obs.z - speed }))
          .filter(obs => obs.z > -20) // Remove obstacles that passed the player
      )

      // Move power-ups toward player
      setPowerUps(prev =>
        prev
          .map(pu => ({ ...pu, z: pu.z - speed }))
          .filter(pu => pu.z > -20)
      )

      // Increase score and distance
      setScore(prev => prev + 1)
      setDistance(prev => prev + 1)

      // Gradually increase speed
      if (distance % 500 === 0 && distance > 0) {
        setSpeed(prev => Math.min(prev + 0.5, 15)) // Max speed of 15
      }

      // Spawn new obstacles
      if (Date.now() - lastObstacleRef.current > 2000 / speed) {
        spawnObstacle()
        lastObstacleRef.current = Date.now()
      }

      // Spawn power-ups occasionally
      if (Date.now() - lastPowerUpRef.current > 5000) {
        spawnPowerUp()
        lastPowerUpRef.current = Date.now()
      }

      // Check collisions
      checkCollisions()

      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
  }, [gameState, speed, playerLane, playerAction, distance])

  const spawnObstacle = () => {
    const lanes: Lane[] = [0, 1, 2]
    const lane = lanes[Math.floor(Math.random() * lanes.length)]
    const types: ObstacleType[] = ['cone', 'tackler', 'barrier']
    const type = types[Math.floor(Math.random() * types.length)]
    const height = Math.random() > 0.5 ? 'high' : 'low'

    setObstacles(prev => [
      ...prev,
      {
        id: Date.now(),
        lane,
        z: 150, // Spawn far away
        type,
        height
      }
    ])
  }

  const spawnPowerUp = () => {
    const lanes: Lane[] = [0, 1, 2]
    const lane = lanes[Math.floor(Math.random() * lanes.length)]
    const type = Math.random() > 0.7 ? 'boost' : 'football'

    setPowerUps(prev => [
      ...prev,
      {
        id: Date.now(),
        lane,
        z: 150,
        type
      }
    ])
  }

  const checkCollisions = () => {
    // Check obstacle collisions
    obstacles.forEach(obs => {
      if (obs.lane === playerLane && obs.z < 5 && obs.z > -5) {
        // Player is in same lane and at same position as obstacle
        const canAvoid =
          (obs.height === 'high' && playerAction === 'jumping') ||
          (obs.height === 'low' && playerAction === 'sliding')

        if (!canAvoid) {
          gameOver()
        }
      }
    })

    // Check power-up collection
    powerUps.forEach(pu => {
      if (pu.lane === playerLane && pu.z < 5 && pu.z > -5) {
        collectPowerUp(pu)
      }
    })
  }

  const collectPowerUp = (powerUp: PowerUp) => {
    setPowerUps(prev => prev.filter(pu => pu.id !== powerUp.id))

    if (powerUp.type === 'football') {
      setScore(prev => prev + 100)
    } else if (powerUp.type === 'boost') {
      setSpeed(prev => prev * 1.5)
      setTimeout(() => setSpeed(prev => prev / 1.5), 3000)
    }
  }

  const changeLane = useCallback((direction: 'left' | 'right') => {
    setPlayerLane(prev => {
      if (direction === 'left' && prev > 0) return (prev - 1) as Lane
      if (direction === 'right' && prev < 2) return (prev + 1) as Lane
      return prev
    })
  }, [])

  const jump = useCallback(() => {
    if (playerAction !== 'running') return
    setPlayerAction('jumping')
    if (jumpTimeoutRef.current) clearTimeout(jumpTimeoutRef.current)
    jumpTimeoutRef.current = setTimeout(() => setPlayerAction('running'), 500)
  }, [playerAction])

  const slide = useCallback(() => {
    if (playerAction !== 'running') return
    setPlayerAction('sliding')
    if (slideTimeoutRef.current) clearTimeout(slideTimeoutRef.current)
    slideTimeoutRef.current = setTimeout(() => setPlayerAction('running'), 500)
  }, [playerAction])

  // Keyboard controls
  useEffect(() => {
    if (gameState !== 'playing') return

    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault()
          changeLane('left')
          break
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault()
          changeLane('right')
          break
        case 'ArrowUp':
        case 'w':
        case 'W':
        case ' ':
          e.preventDefault()
          jump()
          break
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault()
          slide()
          break
        case 'Escape':
          e.preventDefault()
          setGameState('paused')
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [gameState, changeLane, jump, slide])

  const startGame = () => {
    setGameState('playing')
    setScore(0)
    setDistance(0)
    setSpeed(5)
    setPlayerLane(1)
    setPlayerAction('running')
    setObstacles([])
    setPowerUps([])
    lastObstacleRef.current = Date.now()
    lastPowerUpRef.current = Date.now()
  }

  const gameOver = () => {
    setGameState('gameOver')
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem('blitzRushHighScore', score.toString())
    }
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current)
    }
  }

  const togglePause = () => {
    setGameState(prev => prev === 'playing' ? 'paused' : 'playing')
  }

  // Touch controls for mobile
  const [touchStart, setTouchStart] = useState<{ x: number, y: number } | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    setTouchStart({ x: touch.clientX, y: touch.clientY })
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return

    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - touchStart.x
    const deltaY = touch.clientY - touchStart.y

    // Determine swipe direction
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > 50) {
        changeLane(deltaX > 0 ? 'right' : 'left')
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > 50) {
        if (deltaY < 0) jump() // Swipe up
        else slide() // Swipe down
      }
    }

    setTouchStart(null)
  }

  // Calculate 3D perspective positions
  const get3DPosition = (z: number, lane: Lane) => {
    const scale = Math.max(0.1, 1 - (z / 200))
    const laneOffset = (lane - 1) * 120 // -120, 0, +120 for lanes 0, 1, 2
    const perspective = laneOffset * scale
    return { scale, perspective, z }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-700 to-green-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-gray-900/90 backdrop-blur-sm text-white">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-orange-500 flex items-center gap-2">
                <Trophy className="h-8 w-8" />
                Blitz Rush
              </h1>
              <p className="text-gray-400 mt-1">3D Football Endless Runner</p>
            </div>
            {gameState === 'playing' && (
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-500">{score}</div>
                <div className="text-sm text-gray-400">High: {highScore}</div>
              </div>
            )}
          </div>
        </div>

        {/* Game Area */}
        <div className="relative aspect-[9/16] md:aspect-video bg-gradient-to-b from-sky-400 to-green-500 overflow-hidden"
             onTouchStart={handleTouchStart}
             onTouchEnd={handleTouchEnd}>

          {/* Menu */}
          {gameState === 'menu' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
              <h2 className="text-4xl font-bold mb-4">Blitz Rush</h2>
              <p className="text-lg mb-2">Temple Run-style Football Game</p>
              <p className="text-sm text-gray-300 mb-8 text-center max-w-md px-4">
                Swipe left/right to change lanes<br/>
                Swipe up to jump, swipe down to slide<br/>
                Or use Arrow Keys / WASD
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

          {/* Paused */}
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

          {/* Game Over */}
          {gameState === 'gameOver' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
              <h2 className="text-4xl font-bold mb-4 text-red-500">Game Over!</h2>
              <div className="text-6xl font-bold mb-2 text-orange-500">{score}</div>
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

          {/* Playing - 3D Game View */}
          {gameState === 'playing' && (
            <>
              {/* Field lanes */}
              <div className="absolute inset-0" style={{ perspective: '1000px' }}>
                {/* Ground with perspective */}
                <div className="absolute inset-0 bg-gradient-to-b from-green-600 to-green-800">
                  {/* Lane markers */}
                  <div className="absolute inset-0 flex justify-center">
                    {[0, 1, 2, 3].map(i => (
                      <div key={i} className="flex-1 border-l-2 border-white/20" />
                    ))}
                  </div>
                </div>

                {/* Obstacles */}
                {obstacles.map(obs => {
                  const pos = get3DPosition(obs.z, obs.lane)
                  return (
                    <div
                      key={obs.id}
                      className="absolute bottom-0 transition-transform duration-100"
                      style={{
                        left: `calc(50% + ${pos.perspective}px)`,
                        transform: `translateX(-50%) scale(${pos.scale})`,
                        fontSize: `${48 * pos.scale}px`,
                      }}
                    >
                      {obs.type === 'cone' && '🚧'}
                      {obs.type === 'tackler' && '🏈'}
                      {obs.type === 'barrier' && '⛔'}
                    </div>
                  )
                })}

                {/* Power-ups */}
                {powerUps.map(pu => {
                  const pos = get3DPosition(pu.z, pu.lane)
                  return (
                    <div
                      key={pu.id}
                      className="absolute bottom-0 transition-transform duration-100 animate-bounce"
                      style={{
                        left: `calc(50% + ${pos.perspective}px)`,
                        transform: `translateX(-50%) scale(${pos.scale})`,
                        fontSize: `${32 * pos.scale}px`,
                      }}
                    >
                      {pu.type === 'football' && '🏈'}
                      {pu.type === 'boost' && '⚡'}
                    </div>
                  )
                })}

                {/* Player */}
                <div
                  className="absolute bottom-4 transition-all duration-200"
                  style={{
                    left: `calc(50% + ${(playerLane - 1) * 120}px)`,
                    transform: `translateX(-50%) ${
                      playerAction === 'jumping' ? 'translateY(-60px)' :
                      playerAction === 'sliding' ? 'translateY(20px)' : ''
                    }`,
                  }}
                >
                  <div className="text-6xl">
                    {playerAction === 'jumping' && '🏃‍♂️'}
                    {playerAction === 'running' && '🏃'}
                    {playerAction === 'sliding' && '🤸'}
                  </div>
                </div>
              </div>

              {/* HUD */}
              <div className="absolute top-4 left-4 right-4 flex justify-between">
                <div className="bg-black/50 px-4 py-2 rounded-lg">
                  <div className="text-xs text-gray-300">Score</div>
                  <div className="text-2xl font-bold text-orange-500">{score}</div>
                </div>
                <div className="bg-black/50 px-4 py-2 rounded-lg">
                  <div className="text-xs text-gray-300">Distance</div>
                  <div className="text-2xl font-bold">{Math.floor(distance / 10)}m</div>
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
            </>
          )}
        </div>

        {/* Instructions */}
        {gameState === 'menu' && (
          <div className="p-6 border-t border-gray-700">
            <h3 className="font-semibold mb-2">How to Play:</h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
              <div>
                <span className="text-orange-500 font-semibold">Desktop:</span>
                <ul className="ml-4 mt-1 space-y-1">
                  <li>← → or A/D: Change lanes</li>
                  <li>↑ or W/Space: Jump</li>
                  <li>↓ or S: Slide</li>
                  <li>ESC: Pause</li>
                </ul>
              </div>
              <div>
                <span className="text-orange-500 font-semibold">Mobile:</span>
                <ul className="ml-4 mt-1 space-y-1">
                  <li>Swipe left/right: Change lanes</li>
                  <li>Swipe up: Jump over high obstacles</li>
                  <li>Swipe down: Slide under low obstacles</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
