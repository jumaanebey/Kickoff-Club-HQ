'use client'

import { Suspense, useEffect, useState, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Sky, Environment, Preload } from '@react-three/drei'

import { useGameStore } from './hooks/useGameStore'
import { useControls } from './hooks/useControls'
import { useAudio } from './hooks/useAudio'

import { Player } from './Player'
import { Track } from './Track'
import { Obstacles } from './Obstacles'
import { Collectibles } from './Collectibles'
import { GameCamera } from './Camera'
import { ParticleSystem, PlayerTrail, SpeedLines3D, FeverBurst, PowerupBurst } from './effects/Particles'
import { GameHUD } from './ui/HUD'
import { StartScreen } from './ui/StartScreen'
import { GameOverScreen } from './ui/GameOverScreen'
import { PauseScreen } from './ui/PauseScreen'

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

// Scene lighting - optimized to not re-render on distance changes
function Lighting() {
  const ambientRef = useRef<THREE.AmbientLight>(null)
  const mainLightRef = useRef<THREE.DirectionalLight>(null)
  const rimLightRef = useRef<THREE.DirectionalLight>(null)

  // Only subscribe to isFever (changes rarely)
  const isFever = useGameStore(state => state.isFever)

  // Update lighting based on distance using useFrame (no re-renders)
  useFrame(() => {
    const distance = useGameStore.getState().distance
    const cycle = (distance % 1000) / 1000
    const isNight = cycle > 0.5

    if (ambientRef.current) {
      ambientRef.current.intensity = isFever ? 0.8 : (isNight ? 0.2 : 0.5)
      ambientRef.current.color.set(isFever ? "#fbbf24" : (isNight ? "#1e3a5f" : "#ffffff"))
    }

    if (mainLightRef.current) {
      mainLightRef.current.intensity = isFever ? 2.5 : (isNight ? 0.3 : 1.5)
      mainLightRef.current.color.set(isFever ? "#fbbf24" : (isNight ? "#60a5fa" : "#ffffff"))
    }

    if (rimLightRef.current) {
      rimLightRef.current.intensity = isFever ? 2.0 : 0.5
      rimLightRef.current.color.set(isFever ? "#f97316" : "#60a5fa")
    }
  })

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.5} />
      <directionalLight
        ref={mainLightRef}
        position={[10, 30, 10]}
        intensity={1.5}
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
        ref={rimLightRef}
        position={[-10, 10, -10]}
        intensity={0.5}
      />
    </>
  )
}

// Full screen speed lines/vignette controlled by game state
function ScreenEffects() {
  // Use selectors to minimize re-renders
  const isFever = useGameStore(state => state.isFever)
  const speed = useGameStore(state => state.speed)
  const intensity = Math.max(0, (speed - 25) / 25)
  const lineCount = isFever ? 20 : 8

  // Pre-compute random values once with useMemo to prevent flickering
  const speedLines = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      top: (i * 5 + 2.5) % 100, // Evenly distributed
      duration: 0.2 + (i % 5) * 0.06,
      delay: (i % 10) * 0.1,
      rotation: i % 2 === 0 ? 0.5 : -0.5,
    }))
  }, [])

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
            {speedLines.slice(0, lineCount).map((line, i) => (
              <div
                key={i}
                className="absolute bg-white/40 h-[1px] md:h-[2px] w-48 blur-[1px]"
                style={{
                  top: `${line.top}%`,
                  left: '-20%',
                  animationName: 'speedLine',
                  animationDuration: `${line.duration}s`,
                  animationTimingFunction: 'linear',
                  animationIterationCount: 'infinite',
                  animationDelay: `${line.delay}s`,
                  transform: `rotate(${line.rotation}deg)`
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
      <SpeedLines3D />
      <FeverBurst />
      <PowerupBurst />

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
  const [mounted, setMounted] = useState(false)
  const canvasContainerRef = useRef<HTMLDivElement>(null)

  // Prevent React Strict Mode double-mount issues with WebGL
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

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
      {/* 3D Canvas - only render when mounted to avoid Strict Mode double-init */}
      <div ref={canvasContainerRef} className="absolute inset-0">
        {mounted && (
          <Suspense fallback={<LoadingScreen />}>
            <Canvas
              shadows
              camera={{ position: [0, 8, 12], fov: 60 }}
              gl={{
                antialias: true,
                powerPreference: 'high-performance',
                alpha: false,
                preserveDrawingBuffer: true,
              }}
              dpr={[1, 2]}
              onCreated={({ gl }) => {
                // Ensure WebGL context is properly initialized
                gl.setClearColor('#0f172a', 1)
              }}
            >
              <color attach="background" args={['#0f172a']} />
              <fog attach="fog" args={['#0f172a', 50, 150]} />

              <GameScene />
            </Canvas>
          </Suspense>
        )}
      </div>

      {/* UI Overlays */}
      <ScreenEffects />
      <GameHUD />
      <StartScreen onShowTutorial={() => setShowTutorial(true)} />
      <GameOverScreen />
      <PauseScreen />

      {/* Version indicator */}
      <div className="absolute bottom-2 left-2 text-white/20 text-xs font-mono">
        Blitz Rush 3D v1.0
      </div>
    </div>
  )
}

// Export for page use
export default BlitzRush3DGame
