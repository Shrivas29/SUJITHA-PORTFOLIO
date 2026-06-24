import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const PARTICLE_COUNT = 500

export default function ParticleCanvas({ opacity = 1 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setSize(window.innerWidth, window.innerHeight)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 300)
    camera.position.z = 60

    // Build particle geometry: sphere distribution
    const positions   = new Float32Array(PARTICLE_COUNT * 3)
    const basePos     = new Float32Array(PARTICLE_COUNT * 3)
    const speeds      = new Float32Array(PARTICLE_COUNT)
    const phases      = new Float32Array(PARTICLE_COUNT)
    const colors      = new Float32Array(PARTICLE_COUNT * 3)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi   = Math.acos(2 * Math.random() - 1)
      const r     = 20 + Math.random() * 25

      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.sin(phi) * Math.sin(theta)
      const z = r * Math.cos(phi)

      basePos[i * 3]     = x
      basePos[i * 3 + 1] = y
      basePos[i * 3 + 2] = z

      positions[i * 3]     = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      speeds[i] = 0.3 + Math.random() * 0.7
      phases[i] = Math.random() * Math.PI * 2

      // Deep rose → dusty mauve (dark particles for cream background)
      const t = Math.random()
      colors[i * 3]     = 0.71 - t * 0.16   // R: rose to mauve
      colors[i * 3 + 1] = 0.16 + t * 0.27   // G: low-mid
      colors[i * 3 + 2] = 0.31 + t * 0.24   // B: mauve-violet shift
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color',    new THREE.BufferAttribute(colors, 3))

    // Soft circular sprite texture
    const spriteTex = (() => {
      const sz  = 32
      const cvs = document.createElement('canvas')
      cvs.width = cvs.height = sz
      const ctx = cvs.getContext('2d')
      const g   = ctx.createRadialGradient(sz / 2, sz / 2, 0, sz / 2, sz / 2, sz / 2)
      g.addColorStop(0, 'rgba(255,255,255,1)')
      g.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, sz, sz)
      return new THREE.CanvasTexture(cvs)
    })()

    const material = new THREE.PointsMaterial({
      size: 0.45,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      map: spriteTex,
      alphaTest: 0.01,
      sizeAttenuation: true,
    })

    const particles = new THREE.Points(geometry, material)
    scene.add(particles)

    // Mouse influence
    let targetRotX = 0, targetRotY = 0
    const onMouseMove = (e) => {
      targetRotY = ((e.clientX / window.innerWidth)  - 0.5) * 0.4
      targetRotX = ((e.clientY / window.innerHeight) - 0.5) * -0.2
    }
    window.addEventListener('mousemove', onMouseMove)

    // Resize handler
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    let raf
    const animate = () => {
      raf = requestAnimationFrame(animate)
      const t = Date.now() * 0.001
      const posAttr = geometry.getAttribute('position')

      // Oscillate each particle around base position
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const ph  = phases[i]
        const spd = speeds[i]
        posAttr.setXYZ(
          i,
          basePos[i * 3]     + Math.sin(t * spd + ph)       * 1.2,
          basePos[i * 3 + 1] + Math.cos(t * spd + ph * 1.3) * 1.0,
          basePos[i * 3 + 2] + Math.sin(t * spd * 0.7 + ph) * 0.8
        )
      }
      posAttr.needsUpdate = true

      // Smooth rotation toward mouse
      particles.rotation.y += (targetRotY - particles.rotation.y) * 0.03
      particles.rotation.x += (targetRotX - particles.rotation.x) * 0.03
      particles.rotation.z  = Math.sin(t * 0.05) * 0.05

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      spriteTex.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        opacity,
        transition: 'opacity 1.2s ease',
      }}
      aria-hidden="true"
    />
  )
}
