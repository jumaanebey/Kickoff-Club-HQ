'use client'

/**
 * HAIL MARY 3D — a from-scratch react-three-fiber football passing game.
 *
 * Broadcast camera behind the QB looking downfield. Real perspective field with
 * yard lines (canvas texture), an instanced stadium crowd, stadium lights, night
 * sky, shadows, 3D route-running receivers + man coverage, and a football that
 * arcs through 3D space (with a real cast shadow) onto a wind-blown landing spot.
 *
 * Sim state lives in a mutable module object updated in useFrame; only discrete
 * HUD values flow through a tiny zustand store so the scene graph never re-renders
 * per frame. No shared/old game code.
 */

import { useRef, useEffect, useMemo, useState } from 'react'
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { PerspectiveCamera, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { create } from 'zustand'

// ---------------------------------------------------------------------------
// World constants (units = yards). LOS at z=0, downfield is -z.
// ---------------------------------------------------------------------------
const FIELD_W = 53 // sideline to sideline
const HALF_W = FIELD_W / 2
const GOAL_Z = -50 // goal line
const ENDZONE_Z = -60 // back of end zone
const BACK_Z = 6 // behind the QB
const PLAY_CLOCK = 7 // seconds to release before a sack — routes stay live longer
const START_LIVES = 3
const MAXR = 3
const MAXD = 2

type Phase = 'menu' | 'playing' | 'gameover'
type ResultType = 'catch' | 'td' | 'dime' | 'incomplete' | 'int' | 'sack'
const ROUTES = ['go', 'post', 'corner', 'slant', 'out', 'wheel'] as const
const ROUTE_LABEL: Record<string, string> = { go: 'Go', post: 'Post', corner: 'Corner', slant: 'Slant', out: 'Out', wheel: 'Wheel' }
// short coaching note per route — what it's good for (educational)
const ROUTE_TIP: Record<string, string> = {
  go: 'Go: straight deep shot — beats a beaten DB.',
  post: 'Post: breaks to the middle — splits the safeties.',
  corner: 'Corner: breaks to the sideline — beats inside leverage.',
  slant: 'Slant: quick inside cut — beats off coverage.',
  out: 'Out: cut to the sideline — easy completion, stops the clock.',
  wheel: 'Wheel: up the sideline — beats a slow linebacker.',
}
const RECV_COLORS = ['#3b82f6', '#14b8a6', '#f472b6'] // WR1 / WR2 / WR3

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const rand = (a: number, b: number) => a + Math.random() * (b - a)
const d2 = (ax: number, az: number, bx: number, bz: number) => Math.hypot(ax - bx, az - bz)

// ---------------------------------------------------------------------------
// HUD store (discrete values only)
// ---------------------------------------------------------------------------
interface PlayCard { color: string; route: string }
interface HUDState {
  phase: Phase
  presnap: boolean
  score: number
  streak: number
  lives: number
  clock: number
  wind: number
  down: number
  toGo: number
  fieldPos: number // 0-100 yards from own goal line
  firstDowns: number
  level: number
  coverage: string
  plays: PlayCard[]
  tip: string | null
  announce: string | null
  result: { type: ResultType; text: string; sub: string } | null
  best: number
  set: (p: Partial<HUDState>) => void
}
const useHUD = create<HUDState>((set) => ({
  phase: 'menu', presnap: false, score: 0, streak: 0, lives: START_LIVES, clock: PLAY_CLOCK,
  wind: 0, down: 1, toGo: 10, fieldPos: 25, firstDowns: 0, level: 0, coverage: '', plays: [],
  tip: null, announce: null, result: null, best: 0, set: (p) => set(p),
}))

// ---------------------------------------------------------------------------
// Mutable sim (never triggers React renders)
// ---------------------------------------------------------------------------
interface Recv { x: number; z: number; vx: number; vz: number; t: number; breakAt: number; broke: boolean; vx2: number; vz2: number; num: number; alive: boolean; route: { x: number; z: number }[]; routeName: string; key: string }
interface Def { x: number; z: number; speed: number; tgt: number; alive: boolean }
interface Ball { x0: number; z0: number; tx: number; tz: number; t: number; hang: number; peak: number; roll: number; alive: boolean }
const sim = {
  phase: 'menu' as Phase,
  presnap: false,
  score: 0, streak: 0, lives: START_LIVES, playClock: PLAY_CLOCK, wind: 0,
  // drive state
  down: 1, toGo: 10, fieldPos: 25, firstDowns: 0, level: 0, defCount: 0, routesDirty: false,
  receivers: [] as Recv[], defenders: [] as Def[],
  ball: null as Ball | null,
  reticle: { x: 0, z: -20, active: false },
  targetIdx: -1,
  resultTimer: 0, slow: 0,
  camShake: 0,
  camFocus: new THREE.Vector3(0, 1, -22),
  resultType: null as ResultType | null,
}

function coverageName(defenders: number): string {
  if (defenders <= 0) return 'No Coverage — free play'
  if (defenders === 1) return 'Single Man Coverage'
  return 'Double Coverage'
}
const ord = (n: number) => (n === 1 ? 'st' : n === 2 ? 'nd' : n === 3 ? 'rd' : 'th')

// reusable math temporaries (avoid per-frame allocation)
const _vPrev = new THREE.Vector3()
const _vVel = new THREE.Vector3()
const _qOrient = new THREE.Quaternion()
const _zAxis = new THREE.Vector3(0, 0, 1)
const _dummy = new THREE.Object3D()
const ARC = 16 // dots in the throw arc

// Difficulty scales with LEVEL (1 level per first down). Defender thresholds are
// fixed and announced so progression is legible: 1 defender at L1, 2 at L3, 3rd WR at L5.
function difficulty(level: number) {
  const s = Math.min(level, 16)
  return {
    recvSpeed: 7.2 + s * 0.5,
    catchR: clamp(5.6 - s * 0.18, 3.4, 5.6),
    interceptR: 3.4,
    numRecv: level >= 5 ? 3 : 2,
    defenders: level >= 3 ? 2 : level >= 1 ? 1 : 0,
    wind: clamp(s * 0.7, 0, 8) * (Math.random() < 0.5 ? -1 : 1),
  }
}

function makeRecv(x: number, num: number, speed: number): Recv {
  const route = ROUTES[Math.floor(rand(0, ROUTES.length))]
  const side = x < 0 ? 1 : -1
  let vx2 = 0, vz2 = -speed
  switch (route) {
    case 'go': vx2 = rand(-0.1, 0.1) * speed; break
    case 'post': vx2 = side * speed * 0.8; vz2 = -speed * 0.7; break
    case 'corner': vx2 = -side * speed * 0.85; vz2 = -speed * 0.6; break
    case 'slant': vx2 = side * speed * 0.95; vz2 = -speed * 0.45; break
    case 'out': vx2 = -side * speed * 0.95; vz2 = -speed * 0.25; break
    case 'wheel': vx2 = side * speed * 0.9; vz2 = -speed * 0.5; break
  }
  const recv: Recv = { x, z: -1, vx: rand(-2, 2), vz: -speed, t: 0, breakAt: rand(0.5, 1.2), broke: false, vx2, vz2, num, alive: true, route: [], routeName: ROUTE_LABEL[route], key: route }
  recv.route = computeRoute(recv)
  return recv
}

// Simulate a receiver's planned route forward in time (for the pre-snap diagram).
// Uses the exact same break logic the live sim does, so the line matches the run.
function computeRoute(r: Recv): { x: number; z: number }[] {
  const pts = [{ x: r.x, z: r.z }]
  let x = r.x, z = r.z, t = 0
  const step = 0.09
  for (let i = 0; i < 80; i++) {
    t += step
    const vx = t >= r.breakAt ? r.vx2 : r.vx
    const vz = t >= r.breakAt ? r.vz2 : r.vz
    x = clamp(x + vx * step, -HALF_W + 1, HALF_W - 1)
    z = clamp(z + vz * step, ENDZONE_Z + 1, BACK_Z)
    pts.push({ x, z })
    if (z <= ENDZONE_Z + 1.5) break
  }
  return pts
}

function spawnRound() {
  const d = difficulty(sim.level)
  const nums = [80, 11, 17, 88]
  sim.receivers = []
  for (let i = 0; i < d.numRecv; i++) {
    const x = lerp(-16, 16, d.numRecv === 1 ? 0.5 : i / (d.numRecv - 1)) + rand(-3, 3)
    sim.receivers.push(makeRecv(x, nums[i % nums.length], d.recvSpeed))
  }
  // defender added? announce it (answers "when does the 2nd defender come?")
  let announce: string | null = null
  if (d.defenders > sim.defCount && sim.firstDowns > 0) {
    announce = d.defenders === 1 ? 'DEFENSE ADDS A DEFENDER' : 'DOUBLE COVERAGE — defense tightens'
  } else if (d.numRecv > sim.receivers.length - 1 && false) { /* noop */ }
  sim.defCount = d.defenders
  sim.defenders = []
  for (let i = 0; i < d.defenders; i++) {
    const tgt = i % sim.receivers.length
    const r = sim.receivers[tgt]
    sim.defenders.push({ x: r.x + rand(-4, 4), z: rand(-26, -10), speed: d.recvSpeed * rand(0.7, 0.84), tgt, alive: true })
  }
  sim.wind = d.wind
  sim.ball = null
  sim.reticle.active = false
  sim.targetIdx = -1
  sim.playClock = PLAY_CLOCK
  sim.resultTimer = 0
  sim.resultType = null
  sim.presnap = true // study the routes, then hike
  sim.routesDirty = true // rebuild route tubes

  const plays: PlayCard[] = sim.receivers.map((r, i) => ({ color: RECV_COLORS[i % RECV_COLORS.length], route: r.routeName }))
  useHUD.getState().set({
    presnap: true,
    plays,
    coverage: coverageName(d.defenders),
    down: sim.down, toGo: sim.toGo, fieldPos: sim.fieldPos, firstDowns: sim.firstDowns, level: sim.level,
    announce, tip: null, result: null,
  })
  syncHUD()
}

function hike() {
  if (!sim.presnap) return
  sim.presnap = false
  sim.playClock = PLAY_CLOCK
  useHUD.getState().set({ presnap: false })
}

function syncHUD() {
  const h = useHUD.getState()
  const clk = Math.ceil(sim.playClock)
  if (h.score !== sim.score || h.streak !== sim.streak || h.lives !== sim.lives || h.wind !== Math.round(sim.wind) || h.clock !== clk) {
    h.set({ score: sim.score, streak: sim.streak, lives: sim.lives, wind: Math.round(sim.wind), clock: clk })
  }
}

function startGame() {
  sim.phase = 'playing'; sim.score = 0; sim.streak = 0; sim.lives = START_LIVES
  sim.down = 1; sim.toGo = 10; sim.fieldPos = 0; sim.firstDowns = 0; sim.level = 0; sim.defCount = 0
  spawnRound()
  useHUD.getState().set({ phase: 'playing', score: 0, streak: 0, lives: START_LIVES, result: null, tip: null, announce: null })
}

// Start a fresh possession after a turnover or a score (fieldPos = cumulative drive yards).
function newDrive() {
  sim.down = 1; sim.toGo = 10; sim.fieldPos = 0
}

function endGame() {
  sim.phase = 'gameover'
  const best = Math.max(useHUD.getState().best, sim.score)
  try { localStorage.setItem('hailmary3d_best', String(best)) } catch {}
  useHUD.getState().set({ phase: 'gameover', best })
}

// ---------------------------------------------------------------------------
// Field texture (yard lines, end zone) drawn to a canvas
// ---------------------------------------------------------------------------
function useFieldTexture() {
  return useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 1024; c.height = 1024
    const x = c.getContext('2d')!
    // playing field maps z in [BACK_Z .. ENDZONE_Z] over the canvas height
    x.fillStyle = '#1a7a3c'; x.fillRect(0, 0, 1024, 1024)
    // mowed stripes
    for (let i = 0; i < 20; i++) { if (i % 2 === 0) { x.fillStyle = 'rgba(255,255,255,0.05)'; x.fillRect(0, (1024 / 20) * i, 1024, 1024 / 20) } }
    const zToY = (z: number) => ((BACK_Z - z) / (BACK_Z - ENDZONE_Z)) * 1024
    // end zone band
    const ez0 = zToY(GOAL_Z)
    x.fillStyle = '#0c4a6e'; x.fillRect(0, ez0, 1024, 1024 - ez0)
    x.save(); x.translate(512, (ez0 + 1024) / 2); x.scale(1, -1); x.fillStyle = 'rgba(251,191,36,0.92)'
    x.font = '900 70px system-ui'; x.textAlign = 'center'; x.textBaseline = 'middle'
    x.fillText('KICKOFF CLUB', 0, 0); x.restore()
    // yard lines every 5 yds
    x.textAlign = 'center'; x.textBaseline = 'middle'
    for (let z = 0; z >= GOAL_Z; z -= 5) {
      const y = zToY(z)
      x.strokeStyle = 'rgba(255,255,255,0.55)'; x.lineWidth = z % 10 === 0 ? 4 : 2
      x.beginPath(); x.moveTo(0, y); x.lineTo(1024, y); x.stroke()
      if (z % 10 === 0 && z < 0) {
        const yd = -z
        x.fillStyle = 'rgba(255,255,255,0.5)'; x.font = '900 46px system-ui'
        x.save(); x.translate(150, y); x.scale(1, -1); x.fillText(String(yd), 0, 0); x.restore()
        x.save(); x.translate(874, y); x.scale(1, -1); x.fillText(String(yd), 0, 0); x.restore()
      }
      // hash marks
      x.strokeStyle = 'rgba(255,255,255,0.4)'; x.lineWidth = 3
      for (const hx of [384, 640]) { x.beginPath(); x.moveTo(hx - 10, y); x.lineTo(hx + 10, y); x.stroke() }
    }
    // sidelines
    x.strokeStyle = 'rgba(255,255,255,0.7)'; x.lineWidth = 8
    x.strokeRect(0, 0, 1024, 1024)
    const tex = new THREE.CanvasTexture(c)
    tex.anisotropy = 8
    tex.flipY = false // end zone maps downfield; text glyphs are drawn pre-flipped (scale 1,-1) to read upright
    tex.needsUpdate = true
    return tex
  }, [])
}

// ---------------------------------------------------------------------------
// Dusk skydome (gradient) — sits behind everything, ignores fog
// ---------------------------------------------------------------------------
function SkyDome() {
  const tex = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 8; c.height = 512
    const x = c.getContext('2d')!
    const g = x.createLinearGradient(0, 0, 0, 512)
    g.addColorStop(0, '#0a1b44')   // zenith — deep dusk blue (not black)
    g.addColorStop(0.4, '#1e3f7e')
    g.addColorStop(0.66, '#3f6bab') // mid sky
    g.addColorStop(0.82, '#8a7ba6') // dusk haze
    g.addColorStop(0.92, '#d68a52') // warm horizon glow
    g.addColorStop(1, '#e8a866')
    x.fillStyle = g; x.fillRect(0, 0, 8, 512)
    const t = new THREE.CanvasTexture(c)
    return t
  }, [])
  return (
    <mesh>
      <sphereGeometry args={[300, 32, 16]} />
      <meshBasicMaterial map={tex} side={THREE.BackSide} fog={false} />
    </mesh>
  )
}

// Moon glow up in the sky
function Moon() {
  return (
    <group position={[-60, 70, -150]}>
      <mesh><sphereGeometry args={[9, 24, 24]} /><meshBasicMaterial color="#fdf6e3" fog={false} /></mesh>
      <pointLight intensity={0.4} distance={400} color="#cfe0ff" />
    </group>
  )
}

// ---------------------------------------------------------------------------
// Stadium bowl — an enclosing wall + lower ring that frames the crowd
// ---------------------------------------------------------------------------
function Stadium() {
  return (
    <group>
      {/* upper bowl wall */}
      <mesh position={[0, 16, -26]}>
        <cylinderGeometry args={[74, 82, 48, 56, 1, true]} />
        <meshStandardMaterial color="#0b1326" side={THREE.BackSide} roughness={1} />
      </mesh>
      {/* lower field wall (advertising boards vibe) */}
      <mesh position={[0, 1.4, -26]}>
        <cylinderGeometry args={[44, 44, 3, 56, 1, true]} />
        <meshStandardMaterial color="#111c33" side={THREE.BackSide} roughness={0.8} emissive="#0a2a4a" emissiveIntensity={0.25} />
      </mesh>
    </group>
  )
}

// ---------------------------------------------------------------------------
// Crowd (instanced) — a wall of color rising around the field
// ---------------------------------------------------------------------------
function Crowd() {
  const ref = useRef<THREE.InstancedMesh>(null)
  const { count, mats, colors } = useMemo(() => {
    const dummy = new THREE.Object3D()
    const mats: THREE.Matrix4[] = []
    const colors: THREE.Color[] = []
    const palette = ['#1e3a8a', '#0891b2', '#f59e0b', '#e2e8f0', '#7c3aed', '#dc2626', '#16a34a']
    const place = (x: number, y: number, z: number) => {
      dummy.position.set(x, y, z)
      dummy.rotation.set(0, 0, 0)
      dummy.updateMatrix()
      mats.push(dummy.matrix.clone())
      colors.push(new THREE.Color(palette[Math.floor(rand(0, palette.length))]))
    }
    // raked bowl: back stand (behind end zone) + two side stands, dense, starting near field level
    for (let tier = 0; tier < 22; tier++) {
      const y = 0.6 + tier * 1.0
      const back = ENDZONE_Z + 1 - tier * 1.25 // start just behind the end zone, rake back+up
      for (let x = -46; x <= 46; x += 1.15) place(x + rand(-0.3, 0.3), y, back + rand(-0.3, 0.3))
      const sideX = HALF_W + 4 + tier * 1.25
      for (let z = BACK_Z + 6; z >= ENDZONE_Z - 2; z -= 1.15) {
        place(sideX, y, z + rand(-0.3, 0.3))
        place(-sideX, y, z + rand(-0.3, 0.3))
      }
    }
    return { count: mats.length, mats, colors }
  }, [])

  useEffect(() => {
    const m = ref.current; if (!m) return
    for (let i = 0; i < count; i++) {
      m.setMatrixAt(i, mats[i])
      m.setColorAt(i, colors[i])
    }
    m.instanceMatrix.needsUpdate = true
    if (m.instanceColor) m.instanceColor.needsUpdate = true
  }, [count, mats, colors])

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} frustumCulled={false}>
      <boxGeometry args={[0.85, 0.85, 0.85]} />
      <meshStandardMaterial roughness={0.9} />
    </instancedMesh>
  )
}

// ---------------------------------------------------------------------------
// Player figure (capsule body + helmet)
// ---------------------------------------------------------------------------
const Player = ({ color, groupRef }: { color: string; groupRef: React.MutableRefObject<THREE.Group | null> }) => (
  <group ref={groupRef}>
    <mesh castShadow position={[0, 1.1, 0]}>
      <capsuleGeometry args={[0.55, 1.1, 6, 12]} />
      <meshStandardMaterial color={color} roughness={0.6} />
    </mesh>
    <mesh castShadow position={[0, 2.15, 0]}>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.1} />
    </mesh>
  </group>
)

// ---------------------------------------------------------------------------
// The scene + sim
// ---------------------------------------------------------------------------
function Scene() {
  const fieldTex = useFieldTexture()
  const recvRefs = useRef<(THREE.Group | null)[]>([])
  const defRefs = useRef<(THREE.Group | null)[]>([])
  const ballRef = useRef<THREE.Group | null>(null)
  const reticleRef = useRef<THREE.Group | null>(null)
  const windRingRef = useRef<THREE.Mesh | null>(null)
  const targetRingRef = useRef<THREE.Mesh | null>(null)
  const routeTubeRefs = useRef<(THREE.Mesh | null)[]>([])
  const routeArrowRefs = useRef<(THREE.Mesh | null)[]>([])
  const firstDownRef = useRef<THREE.Mesh | null>(null)
  const arcDotsRef = useRef<THREE.InstancedMesh | null>(null)
  const camRef = useRef<THREE.PerspectiveCamera | null>(null)
  const dirRef = useRef<THREE.DirectionalLight | null>(null)
  const flick = useRef<{ x: number; y: number; t: number }[]>([])
  const { gl } = useThree()

  // keyboard: space snaps the ball pre-snap
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' && sim.phase === 'playing' && sim.presnap) { e.preventDefault(); hike() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const power = () => {
    const s = flick.current
    if (s.length < 2) return 0.3
    const a = s[0], b = s[s.length - 1]
    const dt = Math.max(0.016, (b.t - a.t) / 1000)
    return clamp((Math.hypot(b.x - a.x, b.y - a.y) / dt) / 2200, 0, 1)
  }

  const resolve = () => {
    const b = sim.ball!
    const lx = b.tx + sim.wind
    const lz = b.tz
    const d = difficulty(sim.level)
    let dR = Infinity, ri = -1
    sim.receivers.forEach((r, i) => { const dd = d2(r.x, r.z, lx, lz); if (dd < dR) { dR = dd; ri = i } })
    let dD = Infinity
    for (const df of sim.defenders) dD = Math.min(dD, d2(df.x, df.z, lx, lz))
    const yards = Math.max(0, Math.round(-lz))
    const isTD = lz <= GOAL_Z // a completion in the end zone is six
    sim.camFocus.set(lx, 1, lz)
    const tgt = ri >= 0 ? sim.receivers[ri] : null
    let openGap = Infinity // how open the targeted receiver was (nearest defender to HIM)
    if (tgt) for (const df of sim.defenders) openGap = Math.min(openGap, d2(df.x, df.z, tgt.x, tgt.z))
    const routeTip = tgt ? ROUTE_TIP[tgt.key] : ''

    let res: { type: ResultType; text: string; sub: string }
    let tip = ''

    if (dD < d.interceptR && dD <= dR) {
      // INTERCEPTION → turnover
      sim.lives -= 1; sim.streak = 0; sim.camShake = 0.5; sim.resultType = 'int'
      res = { type: 'int', text: 'INTERCEPTED', sub: 'Thrown into coverage' }
      tip = 'When a defender sits on the route, work to the open man instead.'
      sim.level = Math.max(0, sim.level - 1); newDrive()
    } else if (dR < d.catchR) {
      // COMPLETION
      const perfect = dR < d.catchR * 0.45
      const mult = 1 + sim.streak * 0.5
      sim.streak += 1
      sim.fieldPos += yards
      let pts = Math.round((yards + (perfect ? 20 : 0)) * mult)
      if (isTD) {
        pts += Math.round(100 * mult); sim.score += pts
        sim.resultType = 'td'; sim.slow = 0.85; sim.camShake = 0.45
        sim.firstDowns += 1; sim.level += 1
        res = { type: 'td', text: 'TOUCHDOWN!', sub: `+${pts}${perfect ? ' · DIME' : ''}` }
        tip = `Six! ${routeTip}`
        newDrive()
      } else {
        sim.score += pts; sim.toGo -= yards; sim.slow = 0.4
        if (sim.toGo <= 0) {
          // FIRST DOWN — move the chains
          sim.firstDowns += 1; sim.level += 1; sim.down = 1; sim.toGo = 10; sim.camShake = 0.22
          sim.resultType = perfect ? 'dime' : 'catch'
          res = { type: perfect ? 'dime' : 'catch', text: perfect ? 'DIME · 1ST DOWN' : 'FIRST DOWN!', sub: `+${pts} · ${yards} yds` }
          tip = openGap > 6 ? `Wide-open ${tgt?.routeName}. ${routeTip}` : `Tight window. ${routeTip}`
        } else {
          sim.down += 1; sim.camShake = 0.1
          if (sim.down > 4) {
            sim.lives -= 1; sim.streak = 0; sim.resultType = 'int'
            res = { type: 'incomplete', text: 'TURNOVER ON DOWNS', sub: `Came up ${Math.round(sim.toGo)} short` }
            tip = 'Convert on early downs — don’t leave it all to 4th.'
            sim.level = Math.max(0, sim.level - 1); newDrive()
          } else {
            sim.resultType = 'catch'
            res = { type: 'catch', text: 'COMPLETE', sub: `+${pts} · ${yards} yds` }
            tip = `${sim.down}${ord(sim.down)} & ${Math.round(sim.toGo)}. ${openGap > 6 ? 'Good read.' : 'Covered — but you got it.'}`
          }
        }
      }
    } else {
      // INCOMPLETE → uses a down
      sim.streak = 0; sim.camShake = 0.12; sim.resultType = 'incomplete'; sim.down += 1
      if (sim.down > 4) {
        sim.lives -= 1; sim.resultType = 'int'
        res = { type: 'incomplete', text: 'TURNOVER ON DOWNS', sub: 'Drive stalls' }
        tip = 'Four downs to gain ten — manage them.'
        sim.level = Math.max(0, sim.level - 1); newDrive()
      } else {
        res = { type: 'incomplete', text: 'INCOMPLETE', sub: openGap > 6 ? 'Missed an open man' : 'He was blanketed' }
        tip = openGap > 6 ? 'He was open — lead him to the catch point.' : 'Find the receiver the coverage left open.'
      }
    }

    sim.resultTimer = 1.7
    useHUD.getState().set({
      result: res, tip,
      score: sim.score, streak: sim.streak, lives: sim.lives,
      down: sim.down, toGo: Math.max(0, Math.round(sim.toGo)), fieldPos: Math.round(sim.fieldPos),
      firstDowns: sim.firstDowns, level: sim.level,
    })
  }

  // pointer → ground handled by the field plane events
  const onDown = (e: ThreeEvent<PointerEvent>) => {
    if (sim.phase !== 'playing' || sim.ball || sim.resultTimer > 0) return
    e.stopPropagation()
    if (sim.presnap) { hike(); return } // tap to snap
    ;(e.target as any)?.setPointerCapture?.(e.pointerId)
    sim.reticle.active = true
    sim.reticle.x = clamp(e.point.x, -HALF_W, HALF_W)
    sim.reticle.z = clamp(e.point.z, ENDZONE_Z, BACK_Z)
    flick.current = [{ x: e.nativeEvent.clientX, y: e.nativeEvent.clientY, t: performance.now() }]
  }
  const onMove = (e: ThreeEvent<PointerEvent>) => {
    if (!sim.reticle.active) return
    sim.reticle.x = clamp(e.point.x, -HALF_W, HALF_W)
    sim.reticle.z = clamp(e.point.z, ENDZONE_Z, BACK_Z)
    const arr = flick.current; arr.push({ x: e.nativeEvent.clientX, y: e.nativeEvent.clientY, t: performance.now() }); while (arr.length > 6) arr.shift()
  }
  const onUp = () => {
    if (sim.phase !== 'playing' || sim.ball || !sim.reticle.active) return
    const tx = sim.reticle.x, tz = sim.reticle.z
    const dist = d2(0, 1, tx, tz)
    const p = power()
    const hang = clamp(dist / 38, 0.55, 1.5) * (1.2 - 0.5 * p) + 0.15
    sim.ball = { x0: 0, z0: 1, tx, tz, t: 0, hang, peak: clamp(dist * 0.22, 4, 13) * (1.3 - 0.6 * p), roll: 0, alive: true }
    sim.reticle.active = false
  }

  useFrame((state, rdtRaw) => {
    const rdt = Math.min(rdtRaw, 0.05)
    // camera ease toward focus + shake
    if (camRef.current) {
      const cam = camRef.current
      const shake = sim.camShake > 0 ? sim.camShake : 0
      sim.camShake = Math.max(0, sim.camShake - rdt * 1.2)
      const baseY = 15, baseZ = 30
      const fx = sim.resultTimer > 0 ? sim.camFocus.x * 0.3 : 0
      cam.position.x += ((fx) + (Math.random() - 0.5) * shake - cam.position.x) * Math.min(1, rdt * 4)
      cam.position.y += (baseY + (Math.random() - 0.5) * shake - cam.position.y) * Math.min(1, rdt * 4)
      cam.position.z += (baseZ - cam.position.z) * Math.min(1, rdt * 4)
      const lookZ = sim.resultTimer > 0 ? sim.camFocus.z : -20
      cam.lookAt(fx * 0.5, 0.5, lookZ)
    }

    if (sim.phase !== 'playing') return

    // slow-mo
    let ts = 1
    if (sim.resultTimer > 0) ts = 0.35
    else if (sim.slow > 0) ts = lerp(0.35, 1, 1 - sim.slow)
    sim.slow = Math.max(0, sim.slow - rdt * 1.5)
    const dt = rdt * ts

    // result pause
    if (sim.resultTimer > 0) {
      sim.resultTimer -= rdt
      if (sim.resultTimer <= 0) {
        sim.camFocus.set(0, 1, -22)
        if (sim.lives <= 0) endGame(); else spawnRound()
      }
    } else if (sim.presnap) {
      // pre-snap: everyone set, routes drawn, clock stopped — waiting for the hike
      syncHUD()
    } else {
      // receivers
      for (const r of sim.receivers) {
        r.t += dt
        if (!r.broke && r.t >= r.breakAt) { r.broke = true; r.vx = r.vx2; r.vz = r.vz2 }
        r.x = clamp(r.x + r.vx * dt, -HALF_W + 1, HALF_W - 1)
        r.z = clamp(r.z + r.vz * dt, ENDZONE_Z + 1, BACK_Z)
      }
      // defenders chase
      for (const df of sim.defenders) {
        const r = sim.receivers[df.tgt] || sim.receivers[0]
        if (r) { const a = Math.atan2(r.z - df.z, r.x - df.x); df.x += Math.cos(a) * df.speed * dt; df.z += Math.sin(a) * df.speed * dt }
      }
      // predictive target highlight
      if (sim.reticle.active) {
        const lx = sim.reticle.x + sim.wind
        let bd = Infinity, bi = -1
        sim.receivers.forEach((r, i) => { const dd = d2(r.x, r.z, lx, sim.reticle.z); if (dd < bd) { bd = dd; bi = i } })
        sim.targetIdx = bi
      } else sim.targetIdx = -1

      // ball / play clock
      if (sim.ball) {
        const b = sim.ball; b.t += dt / b.hang
        if (b.t >= 1) { b.t = 1; resolve() }
        if (sim.slow <= 0 && b.t > 0.5) {
          let near = Infinity
          const bx = lerp(b.x0, b.tx, b.t) + sim.wind * b.t, bz = lerp(b.z0, b.tz, b.t)
          for (const r of sim.receivers) near = Math.min(near, d2(r.x, r.z, bx, bz))
          if (near < difficulty(sim.level).catchR * 1.6) sim.slow = 0.5
        }
      } else {
        sim.playClock -= dt
        if (sim.playClock <= 0) {
          sim.lives -= 1; sim.streak = 0; sim.camShake = 0.3; sim.resultType = 'sack'
          sim.resultTimer = 1.1; sim.camFocus.set(0, 1, -2)
          useHUD.getState().set({ result: { type: 'sack', text: 'SACKED!', sub: 'Held it too long' } })
        }
      }
      syncHUD()
    }

    // ---- write sim → meshes ----
    const time = state.clock.elapsedTime
    sim.receivers.forEach((r, i) => {
      const g = recvRefs.current[i]; if (!g) return
      g.visible = true
      g.position.set(r.x, Math.abs(Math.sin(time * 12 + i)) * 0.12, r.z)
      const yaw = Math.atan2(r.vx, -r.vz); g.rotation.y = yaw
      const sc = i === sim.targetIdx ? 1.12 : 1; g.scale.setScalar(lerp(g.scale.x, sc, 0.2))
    })
    for (let i = sim.receivers.length; i < MAXR; i++) { const g = recvRefs.current[i]; if (g) g.visible = false }
    sim.defenders.forEach((df, i) => {
      const g = defRefs.current[i]; if (!g) return
      g.visible = true; g.position.set(df.x, Math.abs(Math.sin(time * 12 + i)) * 0.12, df.z)
    })
    for (let i = sim.defenders.length; i < MAXD; i++) { const g = defRefs.current[i]; if (g) g.visible = false }

    // target glow ring under the receiver you're leading
    if (targetRingRef.current) {
      const tr = sim.reticle.active && sim.targetIdx >= 0 ? sim.receivers[sim.targetIdx] : null
      targetRingRef.current.visible = !!tr
      if (tr) targetRingRef.current.position.set(tr.x, 0.09, tr.z)
    }

    // ball — tight spiral: nose tracks the flight tangent, spin about the long axis
    if (ballRef.current) {
      const g = ballRef.current
      if (sim.ball) {
        const b = sim.ball; const t = clamp(b.t, 0, 1)
        const x = lerp(b.x0, b.tx, t) + sim.wind * t
        const z = lerp(b.z0, b.tz, t)
        const y = 1.6 + Math.sin(Math.PI * t) * b.peak
        _vPrev.copy(g.position)
        g.visible = true
        g.position.set(x, y, z)
        _vVel.set(x, y, z).sub(_vPrev)
        if (_vVel.lengthSq() > 1e-5) {
          _vVel.normalize()
          _qOrient.setFromUnitVectors(_zAxis, _vVel) // point long axis along velocity
          g.quaternion.copy(_qOrient)
          b.roll += rdt * 26 // fast spiral spin about the long axis
          g.rotateZ(b.roll)
        }
      } else g.visible = false
    }

    // pre-snap route diagrams — solid color-coded route lines (rebuilt on spawn)
    if (sim.routesDirty) {
      for (let i = 0; i < MAXR; i++) {
        const mesh = routeTubeRefs.current[i]
        const arrow = routeArrowRefs.current[i]
        const r = sim.receivers[i]
        const col = RECV_COLORS[i % RECV_COLORS.length]
        if (mesh && r && r.route.length > 1) {
          const pts = r.route.map((p) => new THREE.Vector3(p.x, 0.22, p.z))
          const curve = new THREE.CatmullRomCurve3(pts)
          mesh.geometry.dispose()
          mesh.geometry = new THREE.TubeGeometry(curve, Math.max(12, r.route.length), 0.34, 8, false)
          const mat = mesh.material as THREE.MeshStandardMaterial
          mat.color.set(col); mat.emissive.set(col)
        }
        if (arrow && r && r.route.length > 1) {
          const end = r.route[r.route.length - 1]
          const prev = r.route[r.route.length - 2]
          const dir = new THREE.Vector3(end.x - prev.x, 0, end.z - prev.z).normalize()
          arrow.position.set(end.x, 0.4, end.z)
          arrow.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir)
          ;(arrow.material as THREE.MeshStandardMaterial).color.set(col)
          ;(arrow.material as THREE.MeshStandardMaterial).emissive.set(col)
        }
      }
      sim.routesDirty = false
    }
    for (let i = 0; i < MAXR; i++) {
      const show = sim.presnap && !!sim.receivers[i]
      if (routeTubeRefs.current[i]) routeTubeRefs.current[i]!.visible = show
      if (routeArrowRefs.current[i]) routeArrowRefs.current[i]!.visible = show
    }
    // first-down marker line at the to-go distance
    if (firstDownRef.current) {
      firstDownRef.current.visible = sim.phase === 'playing' && !sim.ball
      firstDownRef.current.position.set(0, 0.14, -Math.max(1, sim.toGo))
    }

    // reticle + wind ring + trajectory
    const showAim = sim.reticle.active && !sim.ball && sim.phase === 'playing'
    if (reticleRef.current) { reticleRef.current.visible = showAim; reticleRef.current.position.set(sim.reticle.x, 0.06, sim.reticle.z) }
    if (windRingRef.current) {
      windRingRef.current.visible = showAim
      windRingRef.current.position.set(sim.reticle.x + sim.wind, 0.07, sim.reticle.z)
      const cr = difficulty(sim.level).catchR
      windRingRef.current.scale.setScalar(cr / 4)
    }
    if (arcDotsRef.current) {
      const m = arcDotsRef.current
      const p = power()
      const peak = clamp(d2(0, 1, sim.reticle.x, sim.reticle.z) * 0.22, 4, 13) * (1.3 - 0.6 * p)
      for (let i = 0; i < ARC; i++) {
        if (showAim) {
          const t = i / (ARC - 1)
          _dummy.position.set(lerp(0, sim.reticle.x, t) + sim.wind * t, 1.6 + Math.sin(Math.PI * t) * peak, lerp(1, sim.reticle.z, t))
          _dummy.scale.setScalar(lerp(1, 0.45, t))
        } else {
          _dummy.position.set(0, -100, 0); _dummy.scale.setScalar(0.0001)
        }
        _dummy.updateMatrix(); m.setMatrixAt(i, _dummy.matrix)
      }
      m.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <>
      <PerspectiveCamera ref={camRef as any} makeDefault position={[0, 15, 30]} fov={50} />
      <fog attach="fog" args={['#101d3a', 60, 160]} />
      <SkyDome />
      <Moon />
      <Stars radius={150} depth={60} count={1400} factor={4} fade speed={0.4} />
      <Stadium />

      <hemisphereLight args={['#bcd4ff', '#0a3d1a', 0.5]} />
      <ambientLight intensity={0.25} />
      <directionalLight
        ref={dirRef as any}
        position={[18, 40, 10]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={120}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={20}
        shadow-camera-bottom={-70}
      />
      {/* stadium light glows */}
      {[[-34, -30], [34, -30], [-34, 2], [34, 2]].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 18, 0]}><boxGeometry args={[4, 1.4, 0.6]} /><meshStandardMaterial color="#fffbe6" emissive="#fffbe6" emissiveIntensity={2} /></mesh>
          <mesh position={[0, 9, 0]}><cylinderGeometry args={[0.3, 0.3, 18]} /><meshStandardMaterial color="#334155" /></mesh>
          <pointLight position={[0, 18, 0]} intensity={40} distance={70} color="#fff7d6" />
        </group>
      ))}

      {/* field */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, (BACK_Z + ENDZONE_Z) / 2]}
        receiveShadow
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
      >
        <planeGeometry args={[FIELD_W, BACK_Z - ENDZONE_Z]} />
        <meshStandardMaterial map={fieldTex} roughness={0.85} />
      </mesh>
      {/* surrounding turf/ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, -25]}>
        <planeGeometry args={[200, 240]} />
        <meshStandardMaterial color="#0c3d1c" roughness={1} />
      </mesh>

      <Crowd />

      {/* QB */}
      <group position={[0, 0, 1.5]}>
        <Player color="#f59e0b" groupRef={useRef<THREE.Group | null>(null)} />
      </group>

      {/* receivers — color-coded to their route line + play card */}
      {Array.from({ length: MAXR }).map((_, i) => (
        <group key={`r${i}`} ref={(el) => { recvRefs.current[i] = el }} visible={false}>
          <Player color={RECV_COLORS[i % RECV_COLORS.length]} groupRef={useRef<THREE.Group | null>(null)} />
        </group>
      ))}
      {/* defenders */}
      {Array.from({ length: MAXD }).map((_, i) => (
        <group key={`d${i}`} ref={(el) => { defRefs.current[i] = el }} visible={false}>
          <Player color="#dc2626" groupRef={useRef<THREE.Group | null>(null)} />
        </group>
      ))}

      {/* football — long axis is local +Z; laces ride on top so the spiral is visible */}
      <group ref={ballRef} visible={false}>
        <mesh castShadow scale={[0.5, 0.5, 1.0]}>
          <sphereGeometry args={[0.45, 20, 16]} />
          <meshStandardMaterial color="#7c3a12" roughness={0.55} />
        </mesh>
        {/* white nose stripes */}
        <mesh position={[0, 0, 0.34]}><torusGeometry args={[0.15, 0.022, 8, 18]} /><meshStandardMaterial color="#f5f0df" /></mesh>
        <mesh position={[0, 0, -0.34]}><torusGeometry args={[0.15, 0.022, 8, 18]} /><meshStandardMaterial color="#f5f0df" /></mesh>
        {/* laces */}
        <mesh position={[0, 0.2, 0]}><boxGeometry args={[0.035, 0.035, 0.4]} /><meshStandardMaterial color="#f5f0df" /></mesh>
        {[-0.13, -0.05, 0.05, 0.13].map((z, i) => (
          <mesh key={i} position={[0, 0.21, z]}><boxGeometry args={[0.12, 0.03, 0.03]} /><meshStandardMaterial color="#f5f0df" /></mesh>
        ))}
      </group>

      {/* pre-snap route diagrams — solid color-coded lines + arrowheads */}
      {Array.from({ length: MAXR }).map((_, i) => (
        <mesh key={`tube${i}`} ref={(el) => { routeTubeRefs.current[i] = el }} visible={false}>
          <tubeGeometry args={[new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0.22, 0), new THREE.Vector3(0, 0.22, -1)]), 12, 0.34, 8, false]} />
          <meshStandardMaterial color={RECV_COLORS[i % RECV_COLORS.length]} emissive={RECV_COLORS[i % RECV_COLORS.length]} emissiveIntensity={0.5} roughness={0.5} />
        </mesh>
      ))}
      {Array.from({ length: MAXR }).map((_, i) => (
        <mesh key={`arrow${i}`} ref={(el) => { routeArrowRefs.current[i] = el }} visible={false}>
          <coneGeometry args={[0.7, 1.6, 12]} />
          <meshStandardMaterial color={RECV_COLORS[i % RECV_COLORS.length]} emissive={RECV_COLORS[i % RECV_COLORS.length]} emissiveIntensity={0.5} />
        </mesh>
      ))}

      {/* line of scrimmage (blue) + first-down marker (yellow) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.12, 0]}>
        <planeGeometry args={[FIELD_W, 0.5]} />
        <meshBasicMaterial color="#60a5fa" transparent opacity={0.75} />
      </mesh>
      <mesh ref={firstDownRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.14, -10]} visible={false}>
        <planeGeometry args={[FIELD_W, 0.7]} />
        <meshBasicMaterial color="#fde047" />
      </mesh>

      {/* aim reticle */}
      <group ref={reticleRef} visible={false}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.8, 1.1, 32]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
        </mesh>
      </group>
      {/* target glow ring */}
      <mesh ref={targetRingRef} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <ringGeometry args={[1.0, 1.4, 32]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.85} />
      </mesh>
      {/* wind-adjusted catch window */}
      <mesh ref={windRingRef} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <ringGeometry args={[3.4, 4, 40]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.8} />
      </mesh>
      {/* throw-arc dots */}
      <instancedMesh ref={arcDotsRef} args={[undefined, undefined, ARC]} frustumCulled={false}>
        <sphereGeometry args={[0.17, 10, 10]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.55} />
      </instancedMesh>
    </>
  )
}

// ---------------------------------------------------------------------------
// HUD overlay (DOM)
// ---------------------------------------------------------------------------
function HUD() {
  const { phase, presnap, score, streak, lives, clock, wind, down, toGo, firstDowns, level, coverage, plays, tip, announce, result } = useHUD()
  if (phase !== 'playing') return null
  const mult = (1 + streak * 0.5).toFixed(1)
  const downStr = `${down}${ord(down)} & ${toGo === 0 ? 'Goal' : toGo}`
  return (
    <div className="pointer-events-none absolute inset-0 select-none font-sans">
      {/* ---- top scoreboard bar ---- */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-stretch gap-px rounded-lg overflow-hidden border border-white/15 bg-slate-950/80 backdrop-blur text-center shadow-lg">
        <div className="px-3 py-1.5">
          <p className="text-white text-2xl font-heading leading-none tabular-nums">{score.toLocaleString()}</p>
          <p className="text-slate-400 text-[9px] font-bold tracking-widest">SCORE</p>
        </div>
        <div className="px-3 py-1.5 bg-white/5">
          <p className="text-white text-2xl font-heading leading-none tabular-nums">{downStr}</p>
          <p className="text-slate-400 text-[9px] font-bold tracking-widest">DOWN</p>
        </div>
        <div className="px-3 py-1.5">
          <p className={`text-2xl font-heading leading-none tabular-nums ${clock <= 2 ? 'text-red-500 animate-pulse' : 'text-white'}`}>0:{String(Math.max(0, clock)).padStart(2, '0')}</p>
          <p className="text-slate-400 text-[9px] font-bold tracking-widest">CLOCK</p>
        </div>
      </div>

      {/* level + first downs (top-left) */}
      <div className="absolute top-3 left-3 rounded-lg bg-slate-950/70 backdrop-blur px-3 py-1.5 border border-white/10">
        <p className="text-emerald-300 text-sm font-heading leading-none">LEVEL {level + 1}</p>
        <p className="text-slate-400 text-[10px] mt-0.5">{firstDowns} first downs</p>
      </div>

      {/* streak (top-right) */}
      {streak > 0 && (
        <div className="absolute top-3 right-3 text-right rounded-lg bg-slate-950/70 backdrop-blur px-3 py-1.5 border border-orange-500/30">
          <p className="text-orange-400 text-lg font-heading leading-none">🔥 {mult}x</p>
          <p className="text-slate-400 text-[9px] font-bold tracking-widest">{streak} STREAK</p>
        </div>
      )}

      {/* lives + wind (bottom corners) */}
      <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
        {Array.from({ length: START_LIVES }).map((_, i) => (
          <span key={i} className="text-xl" style={{ opacity: i < lives ? 1 : 0.22 }}>🏈</span>
        ))}
        <span className="text-slate-400 text-[10px] ml-1">turnovers left</span>
      </div>
      {Math.abs(wind) > 0 && (
        <div className="absolute bottom-4 right-3 text-white/90 text-sm font-bold tabular-nums">
          WIND {wind > 0 ? '→' : '←'} {Math.abs(wind)}
        </div>
      )}

      {/* ---- pre-snap play card (educational) ---- */}
      {presnap && !result && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[88%] max-w-md text-center">
          <div className="rounded-xl bg-slate-950/80 backdrop-blur border border-white/10 px-4 py-3 mb-2">
            <p className="text-cyan-300 text-[11px] font-bold uppercase tracking-widest mb-2">Read the play · {coverage}</p>
            <div className="flex justify-center gap-4">
              {plays.map((p, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 text-white text-sm font-bold">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
                  {p.route}
                </span>
              ))}
            </div>
          </div>
          <p className="text-white text-lg font-heading uppercase animate-pulse drop-shadow">▶ Tap field or Space to hike</p>
        </div>
      )}

      {/* ---- result banner + coaching tip ---- */}
      {result && (
        <div className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-[90%]">
          <p className="text-5xl font-heading drop-shadow-lg animate-[pop_.3s_ease-out]" style={{ color: resColor(result.type) }}>{result.text}</p>
          <p className="text-white text-lg font-bold mt-1">{result.sub}</p>
          {tip && <p className="text-cyan-200/90 text-sm mt-2 max-w-sm mx-auto">💡 {tip}</p>}
        </div>
      )}

      {/* ---- defender announcement toast ---- */}
      {announce && presnap && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-red-600/90 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full animate-pulse">
          ⚠ {announce}
        </div>
      )}
    </div>
  )
}
function resColor(t: ResultType) {
  return { td: '#fbbf24', dime: '#a78bfa', catch: '#22c55e', incomplete: '#f87171', int: '#ef4444', sack: '#f87171' }[t]
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------
export default function HailMary() {
  const { phase, best, set } = useHUD()
  const [finalScore, setFinalScore] = useState(0)
  const [finalFD, setFinalFD] = useState(0)

  useEffect(() => {
    const b = Number(localStorage.getItem('hailmary3d_best') || '0')
    set({ best: b })
    return () => { sim.phase = 'menu' }
  }, [set])

  useEffect(() => { if (phase === 'gameover') { setFinalScore(sim.score); setFinalFD(sim.firstDowns) } }, [phase])

  return (
    <div className="relative w-full max-w-[960px] mx-auto select-none" style={{ aspectRatio: '16 / 10' }}>
      <Canvas shadows dpr={[1, 2]} className="rounded-2xl border border-white/10 shadow-2xl cursor-crosshair touch-none" gl={{ antialias: true }}>
        <Scene />
      </Canvas>

      <HUD />

      {phase === 'menu' && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-slate-950/55 backdrop-blur-sm">
          <div className="text-center px-6">
            <p className="text-orange-400 text-xs font-bold uppercase tracking-[0.3em] mb-3">Kickoff Club</p>
            <h2 className="text-5xl sm:text-6xl font-heading uppercase text-white mb-4 drop-shadow-lg">Hail Mary</h2>
            <div className="text-white/80 max-w-md mx-auto mb-4 space-y-1.5 text-sm text-left">
              <p><span className="text-cyan-300 font-bold">1. Read</span> — each receiver&apos;s route is drawn & named pre-snap. Spot who the coverage leaves open.</p>
              <p><span className="text-cyan-300 font-bold">2. Hike</span> — tap the field / press Space to snap.</p>
              <p><span className="text-cyan-300 font-bold">3. Throw</span> — drag to aim; flick fast for a bullet, slow for a touch pass. Lead the open man.</p>
              <p><span className="text-cyan-300 font-bold">4. Move the chains</span> — gain the yellow line for a first down. Reach the end zone for six. Every first down levels up the defense.</p>
            </div>
            {best > 0 && <p className="text-yellow-400 text-sm mb-5">🏆 Best: {best.toLocaleString()}</p>}
            <button onClick={startGame} className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg px-10 py-4 rounded-xl transition-all hover:scale-105 shadow-lg shadow-orange-500/40">Hike It →</button>
          </div>
        </div>
      )}

      {phase === 'gameover' && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-slate-950/80 backdrop-blur-sm">
          <div className="text-center px-6">
            <h2 className="text-2xl font-heading uppercase text-white/60 mb-1">Final Whistle</h2>
            <p className="text-6xl font-heading text-orange-400 mb-1">{finalScore.toLocaleString()}</p>
            <p className="text-white/60 mb-3 text-sm">{finalFD} first down{finalFD === 1 ? '' : 's'} moved</p>
            {finalScore >= best && finalScore > 0 ? <p className="text-yellow-400 font-bold mb-6">🏆 New personal best!</p> : <p className="text-white/50 mb-6">Best: {best.toLocaleString()}</p>}
            <button onClick={startGame} className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg px-10 py-4 rounded-xl transition-all hover:scale-105 shadow-lg shadow-orange-500/40">Run It Back ↻</button>
          </div>
        </div>
      )}

      <style>{`@keyframes pop{0%{transform:translate(-50%,-50%) scale(.6);opacity:0}100%{transform:translate(-50%,-50%) scale(1);opacity:1}}`}</style>
    </div>
  )
}
