import { useRef, useMemo, useCallback, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

const DEFAULT_DEPTH_RANGE = 50
const MAX_HORIZONTAL_OFFSET = 8
const MAX_VERTICAL_OFFSET = 8

const createClothMaterial = () => {
  return new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
      map:         { value: null },
      opacity:     { value: 1.0 },
      blurAmount:  { value: 0.0 },
      scrollForce: { value: 0.0 },
      time:        { value: 0.0 },
      isHovered:   { value: 0.0 },
    },
    vertexShader: `
      uniform float scrollForce;
      uniform float time;
      uniform float isHovered;
      varying vec2 vUv;
      varying vec3 vNormal;

      void main() {
        vUv = uv;
        vNormal = normal;
        vec3 pos = position;

        float curveIntensity = scrollForce * 0.3;
        float distanceFromCenter = length(pos.xy);
        float curve = distanceFromCenter * distanceFromCenter * curveIntensity;

        float ripple1 = sin(pos.x * 2.0 + scrollForce * 3.0) * 0.02;
        float ripple2 = sin(pos.y * 2.5 + scrollForce * 2.0) * 0.015;
        float clothEffect = (ripple1 + ripple2) * abs(curveIntensity) * 2.0;

        float flagWave = 0.0;
        if (isHovered > 0.5) {
          float wavePhase = pos.x * 3.0 + time * 8.0;
          float waveAmplitude = sin(wavePhase) * 0.1;
          float dampening = smoothstep(-0.5, 0.5, pos.x);
          flagWave = waveAmplitude * dampening;
          float secondaryWave = sin(pos.x * 5.0 + time * 12.0) * 0.03 * dampening;
          flagWave += secondaryWave;
        }

        pos.z -= (curve + clothEffect + flagWave);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D map;
      uniform float opacity;
      uniform float blurAmount;
      uniform float scrollForce;
      varying vec2 vUv;

      void main() {
        vec4 color = texture2D(map, vUv);

        if (blurAmount > 0.0) {
          vec2 texelSize = 1.0 / vec2(textureSize(map, 0));
          vec4 blurred = vec4(0.0);
          float total = 0.0;
          for (float x = -2.0; x <= 2.0; x += 1.0) {
            for (float y = -2.0; y <= 2.0; y += 1.0) {
              vec2 offset = vec2(x, y) * texelSize * blurAmount;
              float weight = 1.0 / (1.0 + length(vec2(x, y)));
              blurred += texture2D(map, vUv + offset) * weight;
              total += weight;
            }
          }
          color = blurred / total;
        }

        float curveHighlight = abs(scrollForce) * 0.05;
        color.rgb += vec3(curveHighlight * 0.1);
        gl_FragColor = vec4(color.rgb, color.a * opacity);
      }
    `,
  })
}

function ImagePlane({ texture, position, scale, material, imageData, onHover, onNavigate }) {
  const meshRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (material && texture) material.uniforms.map.value = texture
  }, [material, texture])

  useEffect(() => {
    if (material?.uniforms) material.uniforms.isHovered.value = isHovered ? 1.0 : 0.0
  }, [material, isHovered])

  const handleEnter = useCallback(() => {
    setIsHovered(true)
    onHover(imageData)
  }, [imageData, onHover])

  const handleLeave = useCallback(() => {
    setIsHovered(false)
    onHover(null)
  }, [onHover])

  const handleClick = useCallback(() => {
    if (imageData?.sectionId) onNavigate(imageData.sectionId)
  }, [imageData, onNavigate])

  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={scale}
      material={material}
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
      onClick={handleClick}
    >
      <planeGeometry args={[1, 1, 32, 32]} />
    </mesh>
  )
}

function GalleryScene({
  images,
  speed = 1,
  visibleCount = 8,
  onHover,
  onNavigate,
  fadeSettings = {
    fadeIn:  { start: 0.05, end: 0.15 },
    fadeOut: { start: 0.85, end: 0.95 },
  },
  blurSettings = {
    blurIn:  { start: 0.0, end: 0.1 },
    blurOut: { start: 0.9, end: 1.0 },
    maxBlur: 3.0,
  },
}) {
  const [scrollVelocity, setScrollVelocity] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)
  const lastInteraction = useRef(Date.now())

  const normalizedImages = useMemo(
    () => images.map(img => (typeof img === 'string' ? { src: img, alt: '' } : img)),
    [images]
  )

  const textures = useTexture(normalizedImages.map(img => img.src))

  const materials = useMemo(
    () => Array.from({ length: visibleCount }, () => createClothMaterial()),
    [visibleCount]
  )

  const spatialPositions = useMemo(() => {
    return Array.from({ length: visibleCount }, (_, i) => {
      const hAngle = (i * 2.618) % (Math.PI * 2)
      const vAngle = (i * 1.618 + Math.PI / 3) % (Math.PI * 2)
      const hRadius = (i % 3) * 1.2
      const vRadius = ((i + 1) % 4) * 0.8
      return {
        x: (Math.sin(hAngle) * hRadius * MAX_HORIZONTAL_OFFSET) / 3,
        y: (Math.cos(vAngle) * vRadius * MAX_VERTICAL_OFFSET) / 4,
      }
    })
  }, [visibleCount])

  const totalImages = normalizedImages.length
  const depthRange  = DEFAULT_DEPTH_RANGE

  const planesData = useRef(
    Array.from({ length: visibleCount }, (_, i) => ({
      index:      i,
      z:          visibleCount > 0 ? ((depthRange / visibleCount) * i) % depthRange : 0,
      imageIndex: totalImages > 0 ? i % totalImages : 0,
      x:          spatialPositions[i]?.x ?? 0,
      y:          spatialPositions[i]?.y ?? 0,
    }))
  )

  useEffect(() => {
    planesData.current = Array.from({ length: visibleCount }, (_, i) => ({
      index:      i,
      z:          visibleCount > 0 ? ((depthRange / Math.max(visibleCount, 1)) * i) % depthRange : 0,
      imageIndex: totalImages > 0 ? i % totalImages : 0,
      x:          spatialPositions[i]?.x ?? 0,
      y:          spatialPositions[i]?.y ?? 0,
    }))
  }, [depthRange, spatialPositions, totalImages, visibleCount])

  const handleWheel = useCallback(e => {
    e.preventDefault()
    setScrollVelocity(prev => prev + e.deltaY * 0.01 * speed)
    setAutoPlay(false)
    lastInteraction.current = Date.now()
  }, [speed])

  const handleKeyDown = useCallback(e => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      setScrollVelocity(prev => prev - 2 * speed)
      setAutoPlay(false)
      lastInteraction.current = Date.now()
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      setScrollVelocity(prev => prev + 2 * speed)
      setAutoPlay(false)
      lastInteraction.current = Date.now()
    }
  }, [speed])

  useEffect(() => {
    const canvas = document.querySelector('canvas')
    if (canvas) {
      canvas.addEventListener('wheel', handleWheel, { passive: false })
      document.addEventListener('keydown', handleKeyDown)
      return () => {
        canvas.removeEventListener('wheel', handleWheel)
        document.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [handleWheel, handleKeyDown])

  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastInteraction.current > 3000) setAutoPlay(true)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useFrame((state, delta) => {
    if (autoPlay) setScrollVelocity(prev => prev + 0.3 * delta)
    setScrollVelocity(prev => prev * 0.95)

    const time = state.clock.getElapsedTime()
    materials.forEach(mat => {
      if (mat?.uniforms) {
        mat.uniforms.time.value        = time
        mat.uniforms.scrollForce.value = scrollVelocity
      }
    })

    const imageAdvance = totalImages > 0 ? visibleCount % totalImages || totalImages : 0

    planesData.current.forEach((plane, i) => {
      let newZ = plane.z + scrollVelocity * delta * 10
      let wrapsForward  = 0
      let wrapsBackward = 0

      if (newZ >= depthRange) {
        wrapsForward = Math.floor(newZ / depthRange)
        newZ -= depthRange * wrapsForward
      } else if (newZ < 0) {
        wrapsBackward = Math.ceil(-newZ / depthRange)
        newZ += depthRange * wrapsBackward
      }

      if (wrapsForward > 0 && imageAdvance > 0 && totalImages > 0)
        plane.imageIndex = (plane.imageIndex + wrapsForward * imageAdvance) % totalImages
      if (wrapsBackward > 0 && imageAdvance > 0 && totalImages > 0) {
        const step = plane.imageIndex - wrapsBackward * imageAdvance
        plane.imageIndex = ((step % totalImages) + totalImages) % totalImages
      }

      plane.z = ((newZ % depthRange) + depthRange) % depthRange
      plane.x = spatialPositions[i]?.x ?? 0
      plane.y = spatialPositions[i]?.y ?? 0

      const normalizedPosition = plane.z / depthRange
      let opacity = 1

      if (normalizedPosition >= fadeSettings.fadeIn.start && normalizedPosition <= fadeSettings.fadeIn.end) {
        opacity = (normalizedPosition - fadeSettings.fadeIn.start) / (fadeSettings.fadeIn.end - fadeSettings.fadeIn.start)
      } else if (normalizedPosition < fadeSettings.fadeIn.start) {
        opacity = 0
      } else if (normalizedPosition >= fadeSettings.fadeOut.start && normalizedPosition <= fadeSettings.fadeOut.end) {
        opacity = 1 - (normalizedPosition - fadeSettings.fadeOut.start) / (fadeSettings.fadeOut.end - fadeSettings.fadeOut.start)
      } else if (normalizedPosition > fadeSettings.fadeOut.end) {
        opacity = 0
      }
      opacity = Math.max(0, Math.min(1, opacity))

      let blur = 0
      if (normalizedPosition >= blurSettings.blurIn.start && normalizedPosition <= blurSettings.blurIn.end) {
        blur = blurSettings.maxBlur * (1 - (normalizedPosition - blurSettings.blurIn.start) / (blurSettings.blurIn.end - blurSettings.blurIn.start))
      } else if (normalizedPosition < blurSettings.blurIn.start) {
        blur = blurSettings.maxBlur
      } else if (normalizedPosition >= blurSettings.blurOut.start && normalizedPosition <= blurSettings.blurOut.end) {
        blur = blurSettings.maxBlur * (normalizedPosition - blurSettings.blurOut.start) / (blurSettings.blurOut.end - blurSettings.blurOut.start)
      } else if (normalizedPosition > blurSettings.blurOut.end) {
        blur = blurSettings.maxBlur
      }
      blur = Math.max(0, Math.min(blurSettings.maxBlur, blur))

      const mat = materials[i]
      if (mat?.uniforms) {
        mat.uniforms.opacity.value    = opacity
        mat.uniforms.blurAmount.value = blur
      }
    })
  })

  if (normalizedImages.length === 0) return null

  return (
    <>
      {planesData.current.map((plane, i) => {
        const texture   = textures[plane.imageIndex]
        const material  = materials[i]
        const imageData = normalizedImages[plane.imageIndex]
        if (!texture || !material) return null

        const worldZ = plane.z - depthRange / 2
        const aspect = texture.image ? texture.image.width / texture.image.height : 1
        const scale  = aspect > 1 ? [2 * aspect, 2, 1] : [2, 2 / aspect, 1]

        return (
          <ImagePlane
            key={plane.index}
            texture={texture}
            position={[plane.x, plane.y, worldZ]}
            scale={scale}
            material={material}
            imageData={imageData}
            onHover={onHover}
            onNavigate={onNavigate}
          />
        )
      })}
    </>
  )
}

function FallbackGallery({ images, onNavigate }) {
  const normalized = useMemo(
    () => images.map(img => (typeof img === 'string' ? { src: img, alt: '' } : img)),
    [images]
  )
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#F0EAE1', padding: 16, gap: 12, flexWrap: 'wrap' }}>
      {normalized.map((img, i) => (
        <button
          key={i}
          onClick={() => img.sectionId && onNavigate(img.sectionId)}
          style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer', position: 'relative' }}
        >
          <img src={img.src} alt={img.alt} style={{ width: 200, height: 130, objectFit: 'cover', display: 'block' }} />
          {img.label && (
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(26,18,24,0.7)', color: '#FAF7F2', fontFamily: "'Comico', serif", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '6px 8px', textAlign: 'center' }}>
              {img.label}
            </div>
          )}
        </button>
      ))}
    </div>
  )
}

export default function InfiniteGallery({
  images,
  className,
  style,
  speed,
  visibleCount,
  onNavigate,
  fadeSettings = {
    fadeIn:  { start: 0.05, end: 0.25 },
    fadeOut: { start: 0.4,  end: 0.43 },
  },
  blurSettings = {
    blurIn:  { start: 0.0, end: 0.1 },
    blurOut: { start: 0.4, end: 0.43 },
    maxBlur: 8.0,
  },
}) {
  const [webglSupported, setWebglSupported] = useState(true)
  const [hoveredImage, setHoveredImage] = useState(null)

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (!gl) setWebglSupported(false)
    } catch {
      setWebglSupported(false)
    }
  }, [])

  const handleNavigate = useCallback(sectionId => {
    if (onNavigate) onNavigate(sectionId)
  }, [onNavigate])

  if (!webglSupported) {
    return (
      <div className={className} style={style}>
        <FallbackGallery images={images} onNavigate={handleNavigate} />
      </div>
    )
  }

  return (
    <div
      className={className}
      style={{ ...style, position: 'relative', cursor: hoveredImage ? 'pointer' : 'default' }}
    >
      <Canvas camera={{ position: [0, 0, 0], fov: 55 }} gl={{ antialias: true, alpha: true }}>
        <GalleryScene
          images={images}
          speed={speed}
          visibleCount={visibleCount}
          onHover={setHoveredImage}
          onNavigate={handleNavigate}
          fadeSettings={fadeSettings}
          blurSettings={blurSettings}
        />
      </Canvas>

      {/* Label overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: `translateX(-50%) translateY(${hoveredImage ? 0 : 12}px)`,
          opacity: hoveredImage ? 1 : 0,
          transition: 'opacity 0.25s ease, transform 0.25s ease',
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
        }}
      >
        {hoveredImage?.label && (
          <>
            <p style={{
              fontFamily: "'Comico', serif",
              fontSize: 9,
              letterSpacing: '0.3em',
              color: '#FAF7F2',
              textTransform: 'uppercase',
              margin: 0,
              textShadow: '0 1px 8px rgba(0,0,0,0.6)',
            }}>
              {hoveredImage.label}
            </p>
            <div style={{ width: 1, height: 20, background: '#B5294E' }} />
            <p style={{
              fontFamily: "'Comico', serif",
              fontSize: 7,
              letterSpacing: '0.25em',
              color: '#DDD0C8',
              textTransform: 'uppercase',
              margin: 0,
              textShadow: '0 1px 8px rgba(0,0,0,0.6)',
            }}>
              Click to explore
            </p>
          </>
        )}
      </div>

      {/* Scroll hint (auto-hides once user scrolls) */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        right: 24,
        opacity: hoveredImage ? 0 : 0.4,
        transition: 'opacity 0.3s ease',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}>
        <p style={{
          fontFamily: "'Comico', serif",
          fontSize: 7,
          letterSpacing: '0.2em',
          color: '#FAF7F2',
          textTransform: 'uppercase',
          margin: 0,
          textShadow: '0 1px 4px rgba(0,0,0,0.5)',
        }}>
          Scroll to explore
        </p>
      </div>
    </div>
  )
}
