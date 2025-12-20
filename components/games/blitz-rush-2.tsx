'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useGameSound } from '@/hooks/use-game-sound';
import { useGameProgress } from '@/hooks/use-game-progress';

type GameState = 'idle' | 'playing' | 'gameOver';
type Lane = -1 | 0 | 1;

type Obstacle = {
  id: number;
  lane: Lane;
  y: number; // 0 = top (spawn), 1 = bottom (player)
  type: 'defender' | 'cone';
};

type Coin = {
  id: number;
  lane: Lane;
  y: number;
};

const LANE_VALUES: Lane[] = [-1, 0, 1];

// Tunables
const INITIAL_SPEED = 0.5;
const MAX_SPEED = 1.6;
const SPEED_RAMP = 0.015;
const OBSTACLE_SPAWN_INTERVAL = 1100;
const COIN_SPAWN_INTERVAL = 700;
const COLLISION_THRESHOLD = 0.88;
const PLAYER_Y = 0.85;

export function BlitzRush2Game() {
  const { playSound } = useGameSound();
  const { markGameCompleted, progress } = useGameProgress();

  const [gameState, setGameState] = useState<GameState>('idle');
  const [playerLane, setPlayerLane] = useState<Lane>(0);
  const [isJumping, setIsJumping] = useState(false);
  const [jumpProgress, setJumpProgress] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [distance, setDistance] = useState(0);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [lastTimestamp, setLastTimestamp] = useState<number | null>(null);
  const [lastObstacleSpawn, setLastObstacleSpawn] = useState(0);
  const [lastCoinSpawn, setLastCoinSpawn] = useState(0);

  // Load high score
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem('blitzRush2HighScore');
    if (stored) {
      const v = Number.parseInt(stored, 10);
      if (!Number.isNaN(v)) setHighScore(v);
    }
    // Also check progress hook
    const savedProgress = progress['blitz-rush-2'];
    if (savedProgress?.highScore && savedProgress.highScore > highScore) {
      setHighScore(savedProgress.highScore);
    }
  }, [progress]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('blitzRush2HighScore', String(highScore));
  }, [highScore]);

  const resetRun = useCallback(() => {
    setGameState('idle');
    setPlayerLane(0);
    setIsJumping(false);
    setJumpProgress(0);
    setSpeed(INITIAL_SPEED);
    setDistance(0);
    setScore(0);
    setObstacles([]);
    setCoins([]);
    setLastTimestamp(null);
    setLastObstacleSpawn(0);
    setLastCoinSpawn(0);
  }, []);

  const startRun = useCallback(() => {
    playSound('start');
    setGameState('playing');
    setPlayerLane(0);
    setIsJumping(false);
    setJumpProgress(0);
    setSpeed(INITIAL_SPEED);
    setDistance(0);
    setScore(0);
    setObstacles([]);
    setCoins([]);
    setLastTimestamp(null);
    setLastObstacleSpawn(0);
    setLastCoinSpawn(0);
  }, [playSound]);

  const endRun = useCallback(() => {
    playSound('wrong');
    setGameState('gameOver');
    setObstacles([]);
    setCoins([]);
    setLastTimestamp(null);
    setHighScore(prev => (score > prev ? score : prev));
    // Record progress
    markGameCompleted('blitz-rush-2', Math.floor(distance * 100), score);
  }, [score, distance, playSound, markGameCompleted]);

  const spawnObstacle = useCallback(() => {
    const lane = LANE_VALUES[Math.floor(Math.random() * LANE_VALUES.length)];
    const type = Math.random() > 0.5 ? 'defender' : 'cone';
    const ob: Obstacle = {
      id: Date.now() + Math.random(),
      lane,
      y: -0.1,
      type,
    };
    setObstacles(prev => [...prev, ob]);
  }, []);

  const spawnCoin = useCallback(() => {
    const lane = LANE_VALUES[Math.floor(Math.random() * LANE_VALUES.length)];
    const coin: Coin = {
      id: Date.now() + Math.random(),
      lane,
      y: -0.1,
    };
    setCoins(prev => [...prev, coin]);
  }, []);

  const moveLane = useCallback((direction: -1 | 1) => {
    playSound('click');
    setPlayerLane(prev => {
      const idx = LANE_VALUES.indexOf(prev);
      const nextIdx = idx + direction;
      if (nextIdx < 0 || nextIdx >= LANE_VALUES.length) return prev;
      return LANE_VALUES[nextIdx];
    });
  }, [playSound]);

  const triggerJump = useCallback(() => {
    if (isJumping || gameState !== 'playing') return;
    playSound('click');
    setIsJumping(true);
    setJumpProgress(0);
  }, [isJumping, gameState, playSound]);

  // Keyboard controls
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (gameState === 'idle' && (e.code === 'Space' || e.code === 'Enter')) {
        e.preventDefault();
        startRun();
        return;
      }
      if (gameState !== 'playing') return;

      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        e.preventDefault();
        moveLane(-1);
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        e.preventDefault();
        moveLane(1);
      } else if (e.code === 'ArrowUp' || e.code === 'Space' || e.code === 'KeyW') {
        e.preventDefault();
        triggerJump();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [gameState, startRun, moveLane, triggerJump]);

  // Main game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    let frameId: number;

    const loop = (ts: number) => {
      if (lastTimestamp == null) {
        setLastTimestamp(ts);
        frameId = requestAnimationFrame(loop);
        return;
      }

      const deltaMs = ts - lastTimestamp;
      const deltaSec = deltaMs / 1000;
      setLastTimestamp(ts);

      // Distance and speed
      setDistance(prev => prev + deltaSec * speed);
      setSpeed(prev => Math.min(MAX_SPEED, prev + SPEED_RAMP * deltaSec));

      // Jump progress
      if (isJumping) {
        setJumpProgress(prev => {
          const next = prev + deltaSec * 2.5;
          if (next >= 1) {
            setIsJumping(false);
            return 0;
          }
          return next;
        });
      }

      // Move obstacles and detect collisions
      setObstacles(prev => {
        const next: Obstacle[] = [];
        let collided = false;

        for (const ob of prev) {
          const newY = ob.y + speed * deltaSec;
          if (newY > 1.2) continue;

          // Collision check
          if (
            !isJumping &&
            ob.lane === playerLane &&
            newY >= COLLISION_THRESHOLD &&
            newY <= COLLISION_THRESHOLD + 0.15
          ) {
            collided = true;
          }

          next.push({ ...ob, y: newY });
        }

        if (collided) {
          endRun();
          return [];
        }

        return next;
      });

      // Move coins and collect
      setCoins(prev => {
        const next: Coin[] = [];
        let collected = 0;

        for (const coin of prev) {
          const newY = coin.y + speed * deltaSec;
          if (newY > 1.2) continue;

          const isAtPlayer =
            coin.lane === playerLane &&
            newY >= COLLISION_THRESHOLD - 0.05 &&
            newY <= COLLISION_THRESHOLD + 0.1;

          if (isAtPlayer) {
            collected += 1;
            continue;
          }

          next.push({ ...coin, y: newY });
        }

        if (collected > 0) {
          playSound('correct');
          setScore(s => s + collected);
        }

        return next;
      });

      // Spawning
      setLastObstacleSpawn(prev => {
        const total = prev + deltaMs;
        if (total >= OBSTACLE_SPAWN_INTERVAL) {
          spawnObstacle();
          return total - OBSTACLE_SPAWN_INTERVAL;
        }
        return total;
      });

      setLastCoinSpawn(prev => {
        const total = prev + deltaMs;
        if (total >= COIN_SPAWN_INTERVAL) {
          spawnCoin();
          return total - COIN_SPAWN_INTERVAL;
        }
        return total;
      });

      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [gameState, lastTimestamp, speed, playerLane, isJumping, spawnObstacle, spawnCoin, endRun, playSound]);

  const distanceYards = Math.floor(distance * 100);
  const isIdle = gameState === 'idle';
  const isPlaying = gameState === 'playing';
  const isGameOver = gameState === 'gameOver';

  const laneToPercent = (lane: Lane) => {
    switch (lane) {
      case -1: return '20%';
      case 0: return '50%';
      case 1: return '80%';
    }
  };

  const jumpScale = isJumping ? 1 + Math.sin(jumpProgress * Math.PI) * 0.3 : 1;
  const jumpShadow = isJumping ? 0.5 + Math.sin(jumpProgress * Math.PI) * 0.5 : 1;

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-slate-950 text-white p-4">
      {/* HUD */}
      <div className="mb-4 flex items-center gap-6 text-sm font-bold">
        <div className="bg-emerald-900/50 px-3 py-1 rounded-full">
          🏈 {distanceYards} yds
        </div>
        <div className="bg-yellow-900/50 px-3 py-1 rounded-full">
          💰 {score}
        </div>
        <div className="bg-slate-800/50 px-3 py-1 rounded-full">
          🏆 {highScore}
        </div>
      </div>

      {/* Field */}
      <div className="relative w-full max-w-[360px] h-[500px] sm:h-[560px] overflow-hidden rounded-2xl border-4 border-emerald-700 bg-gradient-to-b from-emerald-800 via-emerald-700 to-emerald-600 shadow-2xl">

        {/* Yard lines */}
        <div className="pointer-events-none absolute inset-0">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute left-0 right-0 h-0.5 bg-white/30"
              style={{ top: `${(i + 1) * 12}%` }}
            />
          ))}
        </div>

        {/* Lane dividers */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[35%] top-0 bottom-0 w-0.5 bg-white/20" />
          <div className="absolute left-[65%] top-0 bottom-0 w-0.5 bg-white/20" />
        </div>

        {/* Idle overlay */}
        {isIdle && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-slate-950/80 backdrop-blur-sm z-20">
            <div className="text-6xl">🏈</div>
            <h1 className="text-3xl font-black tracking-tight">BLITZ RUSH 2</h1>
            <p className="max-w-[280px] text-center text-sm text-slate-300">
              Dodge defenders, collect coins, run as far as you can!
            </p>
            <div className="text-xs text-slate-400 mt-2">
              ← → to move • ↑ or SPACE to jump
            </div>
            <button
              onClick={startRun}
              className="mt-4 rounded-full bg-amber-500 px-8 py-3 text-lg font-black uppercase tracking-wide text-slate-950 shadow-lg hover:bg-amber-400 active:scale-95 transition"
            >
              KICKOFF
            </button>
          </div>
        )}

        {/* Game over overlay */}
        {isGameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-red-950/90 backdrop-blur-sm z-20">
            <div className="text-5xl">💥</div>
            <h2 className="text-2xl font-black">TACKLED!</h2>
            <div className="text-sm text-slate-200">
              {distanceYards} yards • {score} coins
            </div>
            {score >= highScore && highScore > 0 && (
              <div className="text-xs font-bold uppercase tracking-wide text-amber-400 animate-pulse">
                🏆 New High Score!
              </div>
            )}
            <button
              onClick={startRun}
              className="mt-4 rounded-full bg-amber-500 px-6 py-2 text-sm font-black uppercase tracking-wide text-slate-950 shadow hover:bg-amber-400 active:scale-95 transition"
            >
              RUN IT BACK
            </button>
            <button
              onClick={resetRun}
              className="text-xs text-slate-400 hover:text-white underline-offset-2 hover:underline"
            >
              Back to huddle
            </button>
          </div>
        )}

        {/* Player */}
        <div
          className="absolute w-12 h-12 -translate-x-1/2 transition-[left] duration-100 z-10"
          style={{
            left: laneToPercent(playerLane),
            bottom: '12%',
            transform: `translateX(-50%) scale(${jumpScale})`,
          }}
        >
          {/* Shadow */}
          <div
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-3 bg-black/40 rounded-full blur-sm"
            style={{ opacity: jumpShadow }}
          />
          {/* Player body */}
          <div className="w-full h-full bg-blue-600 rounded-lg border-2 border-blue-400 shadow-lg flex items-center justify-center">
            <span className="text-white font-black text-lg">20</span>
          </div>
          {/* Helmet */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-yellow-400 rounded-full border-2 border-yellow-600" />
        </div>

        {/* Obstacles */}
        {obstacles.map(ob => (
          <div
            key={ob.id}
            className="absolute w-10 h-10 -translate-x-1/2"
            style={{
              left: laneToPercent(ob.lane),
              top: `${ob.y * 100}%`,
            }}
          >
            {ob.type === 'defender' ? (
              <div className="w-full h-full bg-red-600 rounded-lg border-2 border-red-400 shadow-md flex items-center justify-center">
                <span className="text-white font-black text-sm">X</span>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-0 h-0 border-l-[16px] border-r-[16px] border-b-[32px] border-l-transparent border-r-transparent border-b-orange-500" />
              </div>
            )}
          </div>
        ))}

        {/* Coins */}
        {coins.map(coin => (
          <div
            key={coin.id}
            className="absolute w-8 h-8 -translate-x-1/2"
            style={{
              left: laneToPercent(coin.lane),
              top: `${coin.y * 100}%`,
            }}
          >
            <div className="w-full h-full bg-yellow-400 rounded-full border-2 border-yellow-600 shadow-lg flex items-center justify-center animate-pulse">
              <span className="text-yellow-800 font-black text-xs">$</span>
            </div>
          </div>
        ))}

        {/* Mobile controls */}
        {isPlaying && (
          <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-4 z-10">
            <button
              onClick={() => moveLane(-1)}
              className="w-14 h-14 rounded-full bg-slate-900/80 border-2 border-slate-600 text-2xl font-bold active:scale-90 active:bg-slate-700 transition"
            >
              ◀
            </button>
            <button
              onClick={triggerJump}
              className="w-16 h-16 rounded-full bg-amber-500/90 border-2 border-amber-400 text-xs font-black uppercase active:scale-90 active:bg-amber-400 transition"
            >
              JUMP
            </button>
            <button
              onClick={() => moveLane(1)}
              className="w-14 h-14 rounded-full bg-slate-900/80 border-2 border-slate-600 text-2xl font-bold active:scale-90 active:bg-slate-700 transition"
            >
              ▶
            </button>
          </div>
        )}
      </div>

      {/* Speed indicator */}
      {isPlaying && (
        <div className="mt-4 text-xs text-slate-500">
          Speed: {(speed * 100).toFixed(0)}%
        </div>
      )}
    </div>
  );
}
