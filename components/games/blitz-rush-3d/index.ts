// Main game component
export { BlitzRush3DGame, default } from './BlitzRush3D'

// Hooks
export { useGameStore } from './hooks/useGameStore'
export { useControls } from './hooks/useControls'
export { useAudio } from './hooks/useAudio'

// UI Components
export { GameHUD } from './ui/HUD'
export { StartScreen } from './ui/StartScreen'
export { GameOverScreen } from './ui/GameOverScreen'

// Game Components
export { Player } from './Player'
export { Track } from './Track'
export { Obstacles } from './Obstacles'
export { Collectibles } from './Collectibles'
export { GameCamera } from './Camera'

// Effects
export { ParticleSystem, PlayerTrail } from './effects/Particles'

// Types
export type { Lane, GamePhase, PowerupType } from './hooks/useGameStore'
