'use client'

import React, { useEffect, useRef } from 'react'

interface ParticleProps {
    x: number
    y: number
    color: string
    size: number
    speedX: number
    speedY: number
    life: number
}

export function FountainParticles({ className }: { className?: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let particles: ParticleProps[] = []
        let animationFrameId: number

        const createParticle = () => {
            // Emit from center-ish bottom
            const x = canvas.width / 2 + (Math.random() - 0.5) * 10
            const y = canvas.height - 20

            particles.push({
                x,
                y,
                color: `rgba(100, 200, 255, ${Math.random() * 0.5 + 0.5})`,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 2,
                speedY: -(Math.random() * 3 + 2), // Upward
                life: 1.0
            })
        }

        const updateParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Add new particles
            if (Math.random() > 0.1) { // Control density
                createParticle()
            }

            // Update existing
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i]
                p.x += p.speedX
                p.y += p.speedY
                p.speedY += 0.1 // Gravity
                p.life -= 0.02
                p.size *= 0.95 // Shrink

                ctx.fillStyle = p.color
                ctx.globalAlpha = Math.max(0, p.life)
                ctx.beginPath()
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
                ctx.fill()

                if (p.life <= 0) {
                    particles.splice(i, 1)
                    i--
                }
            }
            ctx.globalAlpha = 1.0

            animationFrameId = requestAnimationFrame(updateParticles)
        }

        // Set canvas size
        canvas.width = 100
        canvas.height = 100

        updateParticles()

        return () => {
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className={`pointer-events-none ${className}`}
            style={{ width: '100%', height: '100%' }}
        />
    )
}
