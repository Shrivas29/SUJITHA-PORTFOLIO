import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function DottedSurface({ opacity = 1 }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    const isMobile   = window.innerWidth < 768
    const SEPARATION = isMobile ? 180 : 140
    const AMOUNTX    = isMobile ? 24 : 42
    const AMOUNTY    = isMobile ? 36 : 60

    const scene    = new THREE.Scene()
    const camera   = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000)
    camera.position.set(0, 340, 1180)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)
    containerRef.current.appendChild(renderer.domElement)

    // Build dot grid
    const geometry  = new THREE.BufferGeometry()
    const positions = []
    const colors    = []

    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        positions.push(
          ix * SEPARATION - (AMOUNTX * SEPARATION) / 2,
          0,
          iy * SEPARATION - (AMOUNTY * SEPARATION) / 2
        )
        // Warm near-black with a hint of rose — readable on cream #FAF7F2
        colors.push(0.18, 0.08, 0.12)
      }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geometry.setAttribute('color',    new THREE.Float32BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size:         5,
      vertexColors: true,
      transparent:  true,
      opacity:      0.22,
      sizeAttenuation: true,
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    let count = 0
    let animId

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const pos = geometry.attributes.position.array
      let i = 0
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          pos[i * 3 + 1] =
            Math.sin((ix + count) * 0.3) * 45 +
            Math.sin((iy + count) * 0.5) * 45
          i++
        }
      }
      geometry.attributes.position.needsUpdate = true
      renderer.render(scene, camera)
      count += 0.08
    }

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)
    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed', inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity,
        transition: 'opacity 0.6s ease',
      }}
      aria-hidden="true"
    />
  )
}
