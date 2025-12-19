'use client'

import { Suspense, useEffect, useState, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { Sky, Environment, Preload } from '@react-three/drei'

import { useGameStore } from './hooks/useGameStore'
import { useControls } from './hooks/useControls'
import { useAudio } from './hooks/useAudio'

import { Player } from './Player'
import { Track } from './Track'
import { Obstacles } from './Obstacles'
import { Collectibles } from './Collectibles'
import { GameCamera } from './Camera'
import { ParticleSystem, PlayerTrail } from './effects/Particles'
import { GameHUD } from './ui/HUD'
import { StartScreen } from './ui/StartScreen'
import { GameOverScreen } from './ui/GameOverScreen'

import { Loader2 } from 'lucide-react'

// Loading fallback
function LoadingScreen() {
  return (
    <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
        <p className="text-white/60">Loading Blitz Rush 3D...</p>
      </div>
    </div>
  )
}

// Scene lighting
function Lighting() {
  const { distance, isFever } = useGameStore()

  // Day/Night cycle based on distance (0 to 1 cycle every 1000m)
  const cycle = (distance % 1000) / 1000
  const isNight = cycle > 0.5

  // Ambient light: Darker at night, Golden in fever
  const ambientIntensity = isFever ? 0.8 : (isNight ? 0.2 : 0.5)
  const ambientColor = isFever ? "#fbbf24" : (isNight ? "#1e3a5f" : "#ffffff")

  return (
    <>
      <ambientLight intensity={ambientIntensity} color={ambientColor} />
      <directionalLight
        position={[10, 30, 10]}
        intensity={isFever ? 2.5 : (isNight ? 0.3 : 1.5)}
        color={isFever ? "#fbbf24" : (isNight ? "#60a5fa" : "#ffffff")}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={100}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />
      {/* Rim light - Stronger during fever */}
      <directionalLight
        position={[-10, 10, -10]}
        intensity={isFever ? 2.0 : 0.5}
        color={isFever ? "#f97316" : "#60a5fa"}
      />
    </>
  )
}

// Full screen speed lines/vignette controlled by game state
function ScreenEffects() {
  const { speed, isFever } = useGameStore()
  const intensity = Math.max(0, (speed - 25) / 25)
  const lineCount = isFever ? 20 : 8

  return (
    <>
      <div
        className={`absolute inset-0 pointer-events-none transition-all duration-500 ${isFever ? 'animate-vignette-pulse' : ''}`}
        style={{
          background: `radial-gradient(circle, transparent 40%, ${isFever ? 'rgba(251, 191, 36, 0.4)' : 'rgba(15, 23, 42, 0.4)'} 100%)`,
          opacity: intensity
        }}
      >
        {intensity > 0.1 && (
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: lineCount }).map((_, i) => (
              <div
                key={i}
                className="absolute bg-white/40 h-[1px] md:h-[2px] w-48 blur-[1px]"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: '-20%',
                  animationName: 'speedLine',
                  animationDuration: `${0.2 + Math.random() * 0.3}s`,
                  animationTimingFunction: 'linear',
                  animationIterationCount: 'infinite',
                  animationDelay: `${Math.random()}s`,
                  transform: `rotate(${Math.random() > 0.5 ? 0.5 : -0.5}deg)`
                }}
              />
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes speedLine {
          from { transform: translateX(0); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          to { transform: translateX(1200%); opacity: 0; }
        }
        .animate-vignette-pulse {
          animation: vignettePulse 2s ease-in-out infinite;
        }
        @keyframes vignettePulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.05); opacity: 0.5; }
        }
      `}</style>
    </>
  )
}


// Game scene
function GameScene() {
  const { phase, tick } = useGameStore()

  // Game loop
  useEffect(() => {
    let lastTime = performance.now()
    let animationId: number

    const gameLoop = (time: number) => {
      const delta = (time - lastTime) / 1000 // Convert to seconds
      lastTime = time

      if (phase === 'playing') {
        tick(delta)
      }

      animationId = requestAnimationFrame(gameLoop)
    }

    animationId = requestAnimationFrame(gameLoop)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [phase, tick])

  return (
    <>
      {/* Environment */}
      <Sky
        sunPosition={[100, 20, 100]}
        turbidity={10}
        rayleigh={0.5}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />

      {/* Lighting */}
      <Lighting />

      {/* Game elements */}
      <Track />
      <Player />
      <Obstacles />
      <Collectibles />

      {/* Effects */}
      <ParticleSystem />
      <PlayerTrail />

      {/* Camera */}
      <GameCamera />

      {/* Preload assets */}
      <Preload all />
    </>
  )
}

// Main game component
export function BlitzRush3DGame() {
  const [showTutorial, setShowTutorial] = useState(false)

  // Set up controls
  useControls()

  // Set up audio
  const { playMusic, stopMusic } = useAudio()
  const { phase } = useGameStore()

  // Music management
  useEffect(() => {
    if (phase === 'menu') {
      playMusic('menu')
    } else if (phase === 'playing') {
      playMusic('gameplay')
    } else if (phase === 'gameover') {
      playMusic('gameOver')
    }

    return () => {
      stopMusic()
    }
  }, [phase, playMusic, stopMusic])

  return (
    <div className="relative w-full h-[700px] md:h-[800px] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
      {/* 3D Canvas */}
      <Suspense fallback={<LoadingScreen />}>
        <Canvas
          shadows
          camera={{ position: [0, 8, 12], fov: 60 }}
          gl={{
            antialias: true,
            powerPreference: 'high-performance',
            alpha: false,
          }}
          dpr={[1, 2]} // Responsive pixel ratio
        >
          <color attach="background" args={['#0f172a']} />
          <fog attach="fog" args={['#0f172a', 50, 150]} />

          <GameScene />
        </Canvas>
      </Suspense>

      {/* UI Overlays */}
      <ScreenEffects />
      <GameHUD />
      <StartScreen onShowTutorial={() => setShowTutorial(true)} />
      <GameOverScreen />

      {/* Version indicator */}
      <div className="absolute bottom-2 left-2 text-white/20 text-xs font-mono">
        Blitz Rush 3D v1.0
      </div>
    </div>
  )
}

// Export for page use
export default BlitzRush3DGame
