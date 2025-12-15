'use client'

import { Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Sky, Environment, Preload } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, ChromaticAberration, BlendFunction } from '@react-three/postprocessing'

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
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
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
      {/* Rim light */}
      <directionalLight
        position={[-10, 10, -10]}
        intensity={0.5}
        color="#60a5fa"
      />
    </>
  )
}

// Post-processing effects
function PostProcessing() {
  const { slowMotion, phase } = useGameStore()

  return (
    <EffectComposer>
      <Bloom
        luminanceThreshold={0.8}
        luminanceSmoothing={0.3}
        intensity={0.4}
      />
      <Vignette
        eskil={false}
        offset={0.1}
        darkness={phase === 'gameover' ? 0.8 : 0.4}
      />
      {slowMotion && (
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={[0.002, 0.002]}
        />
      )}
    </EffectComposer>
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

      {/* Post-processing */}
      <PostProcessing />

      {/* Preload assets */}
      <Preload all />
    </>
  )
}

// Main game component
export function BlitzRush3DGame() {
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
      <GameHUD />
      <StartScreen />
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
