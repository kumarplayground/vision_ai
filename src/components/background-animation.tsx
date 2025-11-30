"use client"

import { useEffect, useRef } from 'react'

export function BackgroundAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Configuration
    const isMobile = window.innerWidth < 768
    const PARTICLE_COUNT = isMobile ? 60 : 150
    const PARTICLE_SIZE = 2
    const CURSOR_INFLUENCE_RADIUS = 150
    const CURSOR_REPEL_FORCE = 50
    const CURSOR_ATTRACT_FORCE = 20
    
    // Canvas setup
    const resizeCanvas = () => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Cursor state
    let mouseX = canvas.width / 2
    let mouseY = canvas.height / 2
    let lastMouseX = mouseX
    let lastMouseY = mouseY
    let mouseVelocity = 0
    let scrollVelocity = 0
    let lastScrollY = 0
    let idleTime = 0

    // Particle system
    class Particle {
        x: number = 0
        y: number = 0
        vx: number = 0
        vy: number = 0
        baseVx: number = 0
        baseVy: number = 0
        opacity: number = 0
        baseOpacity: number = 0
        breathPhase: number = 0
        color: string = ''

        constructor() {
            this.reset()
            this.opacity = Math.random() * 0.4 + 0.3
            this.baseOpacity = this.opacity
            this.breathPhase = Math.random() * Math.PI * 2
            // Cyberpunk colors: Cyan and Magenta
            this.color = Math.random() > 0.5 ? '#00d9ff' : '#ff006e'
        }

        reset() {
            this.x = Math.random() * canvas!.width
            this.y = Math.random() * canvas!.height
            // Random velocity
            this.vx = (Math.random() - 0.5) * 1.5
            this.vy = (Math.random() - 0.5) * 1.5
            this.baseVx = this.vx
            this.baseVy = this.vy
        }

        update() {
            const time = Date.now() / 3000
            
            // Breathing cycle (pulsing opacity)
            this.opacity = this.baseOpacity + Math.sin(time + this.breathPhase) * 0.2
            
            // Distance to cursor
            const dx = mouseX - this.x
            const dy = mouseY - this.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            
            // Cursor interaction logic
            if (distance < CURSOR_INFLUENCE_RADIUS) {
                const force = (CURSOR_INFLUENCE_RADIUS - distance) / CURSOR_INFLUENCE_RADIUS
                
                if (mouseVelocity > 5) {
                    // Fast movement: repel particles violently
                    this.vx -= (dx / distance) * force * CURSOR_REPEL_FORCE * 0.01
                    this.vy -= (dy / distance) * force * CURSOR_REPEL_FORCE * 0.01
                } else if (mouseVelocity < 2 && idleTime < 300) {
                    // Slow/hovering: attract particles gently
                    this.vx += (dx / distance) * force * CURSOR_ATTRACT_FORCE * 0.001
                    this.vy += (dy / distance) * force * CURSOR_ATTRACT_FORCE * 0.001
                }
            }
            
            // Scroll influence (if page is scrollable)
            if (Math.abs(scrollVelocity) > 0.1) {
                this.vy += scrollVelocity * 0.05
            }
            
            // Return to base velocity (swarm cohesion)
            this.vx += (this.baseVx - this.vx) * 0.01
            this.vy += (this.baseVy - this.vy) * 0.01
            
            // Damping (friction)
            this.vx *= 0.98
            this.vy *= 0.98
            
            // Update position
            this.x += this.vx
            this.y += this.vy
            
            // Wrap around edges (infinite canvas effect)
            if (this.x < 0) this.x = canvas!.width
            if (this.x > canvas!.width) this.x = 0
            if (this.y < 0) this.y = canvas!.height
            if (this.y > canvas!.height) this.y = 0
        }

        draw() {
            if (!ctx) return
            ctx.fillStyle = this.color
            ctx.globalAlpha = this.opacity
            ctx.beginPath()
            ctx.arc(this.x, this.y, PARTICLE_SIZE, 0, Math.PI * 2)
            ctx.fill()
        }
    }

    // Initialize particles
    const particles: Particle[] = []
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle())
    }

    let animationFrameId: number

    // Animation loop
    function animate() {
        if (!ctx || !canvas) return

        // Fade effect for trails: Draw a semi-transparent rectangle over the previous frame
        ctx.fillStyle = 'rgba(10, 14, 39, 0.15)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        
        // Update and draw particles
        particles.forEach(particle => {
            particle.update()
            particle.draw()
        })
        
        // Draw connections between nearby particles (Neural Network effect)
        ctx.globalAlpha = 0.15
        ctx.strokeStyle = '#00d9ff'
        ctx.lineWidth = 0.5
        
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x
                const dy = particles[i].y - particles[j].y
                const distance = Math.sqrt(dx * dx + dy * dy)
                
                if (distance < 100) {
                    ctx.beginPath()
                    ctx.moveTo(particles[i].x, particles[i].y)
                    ctx.lineTo(particles[j].x, particles[j].y)
                    ctx.stroke()
                }
            }
        }
        
        ctx.globalAlpha = 1
        
        // Decay velocities
        mouseVelocity *= 0.95
        scrollVelocity *= 0.92
        idleTime++
        
        animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
        lastMouseX = mouseX
        lastMouseY = mouseY
        mouseX = e.clientX
        mouseY = e.clientY
        
        const dx = mouseX - lastMouseX
        const dy = mouseY - lastMouseY
        mouseVelocity = Math.sqrt(dx * dx + dy * dy)
        idleTime = 0
    }
    document.addEventListener('mousemove', handleMouseMove)

    // Scroll tracking
    let scrollTimeout: NodeJS.Timeout
    const handleScroll = () => {
        const currentScroll = window.scrollY
        scrollVelocity = currentScroll - lastScrollY
        lastScrollY = currentScroll
        idleTime = 0
        
        clearTimeout(scrollTimeout)
        scrollTimeout = setTimeout(() => {
            scrollVelocity = 0
        }, 100)
    }
    window.addEventListener('scroll', handleScroll)

    return () => {
        window.removeEventListener('resize', resizeCanvas)
        document.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('scroll', handleScroll)
        cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas 
        ref={canvasRef} 
        className="fixed inset-0 -z-10 w-full h-full pointer-events-none"
        style={{ background: '#0a0e27' }} 
    />
  )
}
