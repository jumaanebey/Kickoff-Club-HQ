'use client'

import { useRef, useMemo } from 'react'
import { useFrame, extend } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from './hooks/useGameStore'
import { shaderMaterial } from '@react-three/drei'

// Track configuration
const SEGMENT_LENGTH = 100
const TRACK_WIDTH = 15
const LANE_WIDTH = 3
const VISIBLE_SEGMENTS = 4

// Yard line positions (every 10 yards for 100-yard field)
const YARD_LINES = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

// Procedural grass shader material
const GrassMaterial = shaderMaterial(
  { time: 0, fever: 0 },
  // Vertex shader - adds subtle curved world effect
  `
    varying vec2 vUv;
    varying vec3 vPosition;

    void main() {
      vUv = uv;
      vPosition = position;

      // Curved world effect - bend geometry down as it goes into distance
      vec3 pos = position;
      float curveAmount = 0.003;
      float distFromCamera = pos.y; // In our rotated plane, y is the forward direction
      pos.z -= distFromCamera * distFromCamera * curveAmount;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment shader - procedural grass with stripes
  `
    uniform float time;
    uniform float fever;
    varying vec2 vUv;
    varying vec3 vPosition;

    void main() {
      // Base grass color
      vec3 grassDark = vec3(0.133, 0.545, 0.133);  // Forest green
      vec3 grassLight = vec3(0.196, 0.804, 0.196); // Lime green
      
      // Fever colors (Golden)
      vec3 feverDark = vec3(0.8, 0.4, 0.0);
      vec3 feverLight = vec3(1.0, 0.8, 0.2);

      // Striped grass pattern
      float stripe = step(0.5, fract(vUv.y * 10.0));
      vec3 baseColor = mix(grassDark, grassLight, stripe * 0.3);
      
      // Interpolate to Fever color
      vec3 finalBase = mix(baseColor, mix(feverDark, feverLight, stripe * 0.5), fever);

      // Add subtle noise for texture
      float noise = fract(sin(dot(vUv * 100.0, vec2(12.9898, 78.233))) * 43758.5453);
      finalBase += noise * 0.02;

      // Fever glow effect
      finalBase += fever * 0.1 * sin(time * 5.0 + vUv.y * 10.0);

      // Darken edges for depth
      float edgeDarkening = 1.0 - abs(vUv.x - 0.5) * 0.3;
      finalBase *= edgeDarkening;

      // Distance fog effect
      float dist = length(vPosition.xy);
      float fog = 1.0 - smoothstep(30.0, 80.0, dist) * 0.3;
      finalBase *= fog;

      gl_FragColor = vec4(finalBase, 1.0);
    }
  `
)

// Extend Three.js with our custom material
extend({ GrassMaterial })

// TypeScript declaration for custom material
declare module '@react-three/fiber' {
  interface ThreeElements {
    grassMaterial: any
  }
}

function TrackSegment({ position }: { position: [number, number, number] }) {
  const grassRef = useRef<any>(null)
  const segmentsRef = useRef<THREE.Group>(null)
  const isFever = useGameStore(state => state.isFever)

  useFrame((state) => {
    if (grassRef.current) {
      grassRef.current.time = state.clock.elapsedTime
      // Smoothly transition fever uniform
      const targetFever = isFever ? 1 : 0
      grassRef.current.fever = THREE.MathUtils.lerp(grassRef.current.fever, targetFever, 0.1)
    }
  })

  return (
    <group position={position}>
      {/* Main field surface with procedural grass shader */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[TRACK_WIDTH, SEGMENT_LENGTH, 1, 32]} />
        <grassMaterial ref={grassRef} />
      </mesh>

      {/* Side Walls Decor moved into each segment for infinite loop */}
      <StadiumWalls />
      <StadiumLights />

      {/* Yard lines - white with glow */}
      {YARD_LINES.map((yard) => (
        <group key={yard}>
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0.03, -SEGMENT_LENGTH / 2 + yard]}
          >
            <planeGeometry args={[TRACK_WIDTH - 2, 0.18]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={0.2}
            />
          </mesh>
          {/* Yard numbers */}
          {yard > 0 && yard < 100 && yard % 10 === 0 && (
            <>
              {/* Left number marker */}
              <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[-5, 0.03, -SEGMENT_LENGTH / 2 + yard]}
              >
                <circleGeometry args={[0.8, 16]} />
                <meshStandardMaterial
                  color="#ffffff"
                  emissive="#ffffff"
                  emissiveIntensity={0.1}
                />
              </mesh>
              {/* Right number marker */}
              <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[5, 0.03, -SEGMENT_LENGTH / 2 + yard]}
              >
                <circleGeometry args={[0.8, 16]} />
                <meshStandardMaterial
                  color="#ffffff"
                  emissive="#ffffff"
                  emissiveIntensity={0.1}
                />
              </mesh>
            </>
          )}
        </group>
      ))}

      {/* Lane markers (dotted lines) */}
      {[-LANE_WIDTH, LANE_WIDTH].map((x) => (
        <group key={x}>
          {Array.from({ length: 20 }).map((_, i) => (
            <mesh
              key={i}
              rotation={[-Math.PI / 2, 0, 0]}
              position={[x, 0.02, -SEGMENT_LENGTH / 2 + i * 5 + 2.5]}
            >
              <planeGeometry args={[0.08, 1.5]} />
              <meshStandardMaterial
                color="#ffffff"
                transparent
                opacity={0.4}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* Sidelines with glow */}
      {[-(TRACK_WIDTH / 2) - 0.3, (TRACK_WIDTH / 2) + 0.3].map((x, i) => (
        <mesh
          key={i}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[x, 0.02, 0]}
        >
          <planeGeometry args={[0.6, SEGMENT_LENGTH]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive={isFever ? "#fbbf24" : "#ffffff"}
            emissiveIntensity={isFever ? 2 : 0.3}
          />
        </mesh>
      ))}

      {/* Endzone */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.015, -SEGMENT_LENGTH / 2 + 5]}
      >
        <planeGeometry args={[TRACK_WIDTH - 1, 10]} />
        <meshStandardMaterial
          color={isFever ? "#9a3412" : "#1e40af"}
          roughness={0.7}
        />
      </mesh>

      {/* Endzone text marker */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.02, -SEGMENT_LENGTH / 2 + 5]}
      >
        <planeGeometry args={[6, 2]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#fbbf24"
          emissiveIntensity={isFever ? 1.5 : 0.3}
        />
      </mesh>
    </group>
  )
}

function StadiumWalls() {
  const wallHeight = 12
  const wallDistance = TRACK_WIDTH / 2 + 6

  // Create crowd colors array for variety
  const crowdColors = ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899']

  return (
    <>
      {/* Stadium structure - left */}
      <group position={[-wallDistance, 0, 0]}>
        {/* Base wall */}
        <mesh position={[0, wallHeight / 2, 0]}>
          <boxGeometry args={[2, wallHeight, 300]} />
          <meshStandardMaterial color="#1f2937" roughness={0.8} />
        </mesh>

        {/* Tiered seating effect */}
        {[0, 4, 8].map((y, tier) => (
          <group key={tier} position={[-1 - tier * 0.5, y + 2, 0]}>
            <mesh>
              <boxGeometry args={[1, 3, 300]} />
              <meshStandardMaterial color="#374151" roughness={0.9} />
            </mesh>
            {/* Team Banners on the tiers */}
            <mesh position={[0.51, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
              <planeGeometry args={[10, 2.5]} />
              <meshStandardMaterial
                color={tier % 2 === 0 ? "#1d4ed8" : "#fbbf24"}
                metalness={0.5}
                roughness={0.5}
              />
            </mesh>
          </group>
        ))}

        {/* Crowd billboards - animated sections */}
        {Array.from({ length: 15 }).map((_, i) => (
          <mesh
            key={`left-${i}`}
            position={[1.1, 3 + (i % 3) * 2, -140 + i * 20]}
            rotation={[0, Math.PI / 2, 0]}
          >
            <planeGeometry args={[18, 5]} />
            <meshStandardMaterial
              color={crowdColors[i % crowdColors.length]}
              emissive={crowdColors[i % crowdColors.length]}
              emissiveIntensity={0.2}
            />
          </mesh>
        ))}
      </group>

      {/* Stadium structure - right */}
      <group position={[wallDistance, 0, 0]}>
        {/* Base wall */}
        <mesh position={[0, wallHeight / 2, 0]}>
          <boxGeometry args={[2, wallHeight, 300]} />
          <meshStandardMaterial color="#1f2937" roughness={0.8} />
        </mesh>

        {/* Tiered seating effect */}
        {[0, 4, 8].map((y, tier) => (
          <group key={tier} position={[1 + tier * 0.5, y + 2, 0]}>
            <mesh>
              <boxGeometry args={[1, 3, 300]} />
              <meshStandardMaterial color="#374151" roughness={0.9} />
            </mesh>
            {/* Team Banners on the tiers */}
            <mesh position={[-0.51, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
              <planeGeometry args={[10, 2.5]} />
              <meshStandardMaterial
                color={tier % 2 === 0 ? "#1d4ed8" : "#fbbf24"}
                metalness={0.5}
                roughness={0.5}
              />
            </mesh>
          </group>
        ))}

        {/* Crowd billboards */}
        {Array.from({ length: 15 }).map((_, i) => (
          <mesh
            key={`right-${i}`}
            position={[-1.1, 3 + (i % 3) * 2, -140 + i * 20]}
            rotation={[0, -Math.PI / 2, 0]}
          >
            <planeGeometry args={[18, 5]} />
            <meshStandardMaterial
              color={crowdColors[(i + 3) % crowdColors.length]}
              emissive={crowdColors[(i + 3) % crowdColors.length]}
              emissiveIntensity={0.2}
            />
          </mesh>
        ))}
      </group>

      {/* Advertising boards along sidelines */}
      {Array.from({ length: 20 }).map((_, i) => (
        <group key={`ad-${i}`}>
          <mesh
            position={[-(TRACK_WIDTH / 2) - 1.5, 0.5, -150 + i * 16]}
            rotation={[0, Math.PI / 6, 0]}
          >
            <boxGeometry args={[3, 1, 0.2]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#fbbf24"
              emissiveIntensity={0.5}
            />
          </mesh>
          <mesh
            position={[(TRACK_WIDTH / 2) + 1.5, 0.5, -150 + i * 16]}
            rotation={[0, -Math.PI / 6, 0]}
          >
            <boxGeometry args={[3, 1, 0.2]} />
            <meshStandardMaterial
              color="#3b82f6"
              emissive="#3b82f6"
              emissiveIntensity={0.5}
            />
          </mesh>
        </group>
      ))}
    </>
  )
}

function StadiumLights() {
  const { isFever } = useGameStore()
  const lightColor = isFever ? "#fbbf24" : "#3b82f6"
  const intensity = isFever ? 10 : 4

  const lightPositions = [
    [-25, 0, -120], [25, 0, -120],
    [-25, 0, -40], [25, 0, -40],
    [-25, 0, 40], [25, 0, 40],
    [-25, 0, 120], [25, 0, 120],
  ]

  return (
    <>
      {lightPositions.map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh position={[0, 15, 0]}>
            <cylinderGeometry args={[0.3, 0.5, 30, 8]} />
            <meshStandardMaterial color="#374151" metalness={0.6} />
          </mesh>
          <group position={[0, 30, 0]}>
            <mesh>
              <boxGeometry args={[4, 2, 2]} />
              <meshStandardMaterial color="#1f2937" />
            </mesh>
            {/* Pulsing light panels */}
            <mesh position={[0, 0, 1.1]}>
              <planeGeometry args={[3.5, 1.5]} />
              <meshStandardMaterial
                color={lightColor}
                emissive={lightColor}
                emissiveIntensity={intensity}
              />
            </mesh>
            <pointLight
              color={lightColor}
              intensity={intensity * 20}
              distance={60}
              decay={2}
            />
            {/* Volumetric Beam */}
            <mesh rotation={[Math.PI / 3, 0, 0]} position={[0, -12, 12]}>
              <coneGeometry args={[6, 35, 16, 1, true]} />
              <meshStandardMaterial
                color={lightColor}
                transparent
                opacity={0.08}
                depthWrite={false}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        </group>
      ))}
    </>
  )
}

export function Track() {
  const groupRef = useRef<THREE.Group>(null)
  const segmentRefs = useRef<THREE.Group[]>([])
  const offsetRef = useRef(0)

  const { speed, phase } = useGameStore()

  // Create segments
  const segments = useMemo(() => {
    return Array.from({ length: VISIBLE_SEGMENTS }).map((_, i) => ({
      id: i,
      z: -i * SEGMENT_LENGTH,
    }))
  }, [])

  useFrame((_, delta) => {
    if (phase !== 'playing') return

    // Move track towards camera (player stays still, world moves)
    const movement = speed * delta
    offsetRef.current += movement

    // Reposition segments that have passed the camera
    segmentRefs.current.forEach((segment) => {
      if (!segment) return

      const currentZ = segment.position.z + offsetRef.current

      // If segment is behind camera, move it to the front
      if (currentZ > SEGMENT_LENGTH) {
        segment.position.z -= VISIBLE_SEGMENTS * SEGMENT_LENGTH
      }
    })
  })

  return (
    <group ref={groupRef}>
      {/* Track segments */}
      {segments.map((seg, i) => (
        <group
          key={seg.id}
          ref={(el) => {
            if (el) segmentRefs.current[i] = el
          }}
          position={[0, 0, seg.z]}
        >
          <TrackSegment position={[0, 0, 0]} />
        </group>
      ))}

      {/* Ground plane for shadows - extends far */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.02, 0]}
        receiveShadow
      >
        <planeGeometry args={[150, 600]} />
        <shadowMaterial transparent opacity={0.3} />
      </mesh>

      {/* Ambient ground glow for night game feel */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.03, 0]}
      >
        <planeGeometry args={[TRACK_WIDTH + 20, 400]} />
        <meshBasicMaterial
          color="#1e3a5f"
          transparent
          opacity={0.15}
        />
      </mesh>
    </group>
  )
}
