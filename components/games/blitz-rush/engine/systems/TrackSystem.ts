import * as THREE from 'three'
import { TRACK_SEGMENT_LENGTH, TRACK_SEGMENTS_VISIBLE, LANE_WIDTH, FIELD_WIDTH } from '../config/constants'

interface TrackSegment {
  group: THREE.Group
  index: number
}

export class TrackSystem {
  private scene: THREE.Scene
  private segments: TrackSegment[] = []
  private scrollOffset = 0

  // Shared materials
  private grassDark: THREE.MeshStandardMaterial
  private grassLight: THREE.MeshStandardMaterial
  private lineMat: THREE.MeshStandardMaterial
  private sidelineMat: THREE.MeshStandardMaterial

  constructor(scene: THREE.Scene) {
    this.scene = scene

    this.grassDark = new THREE.MeshStandardMaterial({ color: '#166534', roughness: 0.9 })
    this.grassLight = new THREE.MeshStandardMaterial({ color: '#15803d', roughness: 0.9 })
    this.lineMat = new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#ffffff', emissiveIntensity: 0.1 })
    this.sidelineMat = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.8 })

    this.buildTrack()
  }

  private buildTrack(): void {
    for (let i = 0; i < TRACK_SEGMENTS_VISIBLE; i++) {
      const segment = this.createSegment(i)
      this.segments.push(segment)
    }

    // Static environment
    this.buildSidelines()
    this.buildStadiumLights()
  }

  private createSegment(index: number): TrackSegment {
    const group = new THREE.Group()
    const z = -index * TRACK_SEGMENT_LENGTH

    // Grass field - striped pattern
    const stripWidth = TRACK_SEGMENT_LENGTH / 4
    for (let j = 0; j < 4; j++) {
      const planeGeo = new THREE.PlaneGeometry(FIELD_WIDTH, stripWidth)
      const mat = j % 2 === 0 ? this.grassDark : this.grassLight
      const plane = new THREE.Mesh(planeGeo, mat)
      plane.rotation.x = -Math.PI / 2
      plane.position.set(0, -0.01, -j * stripWidth + TRACK_SEGMENT_LENGTH / 2 - stripWidth / 2)
      plane.receiveShadow = true
      group.add(plane)
    }

    // Yard lines
    const lineGeo = new THREE.PlaneGeometry(FIELD_WIDTH - 2, 0.1)
    for (let j = 0; j <= 4; j++) {
      const line = new THREE.Mesh(lineGeo, this.lineMat)
      line.rotation.x = -Math.PI / 2
      line.position.set(0, 0.001, -j * (TRACK_SEGMENT_LENGTH / 4) + TRACK_SEGMENT_LENGTH / 2)
      group.add(line)
    }

    // Hash marks
    const hashGeo = new THREE.PlaneGeometry(0.1, 0.5)
    for (let j = 0; j < 8; j++) {
      for (const xOff of [-2.5, 2.5]) {
        const hash = new THREE.Mesh(hashGeo, this.lineMat)
        hash.rotation.x = -Math.PI / 2
        hash.position.set(xOff, 0.001, -j * (TRACK_SEGMENT_LENGTH / 8) + TRACK_SEGMENT_LENGTH / 2)
        group.add(hash)
      }
    }

    // Lane dividers (subtle)
    const dividerGeo = new THREE.PlaneGeometry(0.05, TRACK_SEGMENT_LENGTH)
    const dividerMat = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      transparent: true,
      opacity: 0.15,
    })
    for (const x of [-LANE_WIDTH, LANE_WIDTH]) {
      const divider = new THREE.Mesh(dividerGeo, dividerMat)
      divider.rotation.x = -Math.PI / 2
      divider.position.set(x, 0.002, 0)
      group.add(divider)
    }

    group.position.z = z
    this.scene.add(group)

    return { group, index }
  }

  private buildSidelines(): void {
    // Sideline strips on both sides
    const sideGeo = new THREE.PlaneGeometry(3, TRACK_SEGMENT_LENGTH * TRACK_SEGMENTS_VISIBLE * 2)
    for (const xSign of [-1, 1]) {
      const side = new THREE.Mesh(sideGeo, this.sidelineMat)
      side.rotation.x = -Math.PI / 2
      side.position.set(xSign * (FIELD_WIDTH / 2 + 1.5), -0.02, -TRACK_SEGMENT_LENGTH * TRACK_SEGMENTS_VISIBLE / 2)
      side.receiveShadow = true
      this.scene.add(side)
    }

    // Crowd silhouettes (flat billboard strips)
    const crowdGeo = new THREE.PlaneGeometry(2, 3)
    const crowdMat = new THREE.MeshStandardMaterial({
      color: '#1e293b',
      emissive: '#334155',
      emissiveIntensity: 0.1,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide,
    })

    for (const xSign of [-1, 1]) {
      for (let i = 0; i < 20; i++) {
        const crowd = new THREE.Mesh(crowdGeo, crowdMat)
        crowd.position.set(
          xSign * (FIELD_WIDTH / 2 + 3 + Math.random() * 2),
          1.5,
          -i * 10 + Math.random() * 5
        )
        crowd.rotation.y = xSign * Math.PI * 0.1
        this.scene.add(crowd)
      }
    }
  }

  private buildStadiumLights(): void {
    // Stadium light poles
    const poleGeo = new THREE.CylinderGeometry(0.15, 0.2, 12, 8)
    const poleMat = new THREE.MeshStandardMaterial({ color: '#64748b', metalness: 0.6 })

    for (const xSign of [-1, 1]) {
      for (let i = 0; i < 4; i++) {
        const pole = new THREE.Mesh(poleGeo, poleMat)
        pole.position.set(xSign * (FIELD_WIDTH / 2 + 4), 6, -i * 50 - 20)
        pole.castShadow = true
        this.scene.add(pole)

        // Light fixture
        const light = new THREE.PointLight('#ffffff', 30, 60)
        light.position.set(xSign * (FIELD_WIDTH / 2 + 4), 12, -i * 50 - 20)
        light.castShadow = false // Performance: skip shadow maps
        this.scene.add(light)
      }
    }
  }

  update(dt: number, speed: number): void {
    this.scrollOffset += speed * dt

    // Reposition segments that scroll past the player
    for (const segment of this.segments) {
      const worldZ = segment.group.position.z + this.scrollOffset
      if (worldZ > TRACK_SEGMENT_LENGTH) {
        // Move this segment to the back
        segment.group.position.z -= TRACK_SEGMENT_LENGTH * TRACK_SEGMENTS_VISIBLE
      }
    }
  }

  reset(): void {
    this.scrollOffset = 0
    for (let i = 0; i < this.segments.length; i++) {
      this.segments[i].group.position.z = -i * TRACK_SEGMENT_LENGTH
    }
  }

  destroy(): void {
    // Remove segments
    for (const seg of this.segments) {
      this.scene.remove(seg.group)
      seg.group.traverse(child => {
        if ((child as THREE.Mesh).isMesh) {
          (child as THREE.Mesh).geometry.dispose()
        }
      })
    }
    this.segments.length = 0

    this.grassDark.dispose()
    this.grassLight.dispose()
    this.lineMat.dispose()
    this.sidelineMat.dispose()
  }
}
