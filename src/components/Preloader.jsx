import { useEffect, useRef, useState } from 'react'

// ─── Particle ────────────────────────────────────────────────────────────────
class Particle {
  constructor() {
    this.pos   = { x: 0, y: 0 }
    this.vel   = { x: 0, y: 0 }
    this.acc   = { x: 0, y: 0 }
    this.target = { x: 0, y: 0 }
    this.maxSpeed   = 4
    this.maxForce   = 0.18
    this.closeEnough = 60
    this.isKilled   = false
    this.startColor    = { r: 240, g: 78,  b: 35 }
    this.targetColor   = { r: 240, g: 78,  b: 35 }
    this.colorWeight   = 1
    this.colorBlendRate = 0.018
  }

  move() {
    const dx = this.target.x - this.pos.x
    const dy = this.target.y - this.pos.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    const prox = dist < this.closeEnough ? dist / this.closeEnough : 1
    const mag  = dist || 1
    const tx   = (dx / mag) * this.maxSpeed * prox
    const ty   = (dy / mag) * this.maxSpeed * prox
    const sx   = tx - this.vel.x
    const sy   = ty - this.vel.y
    const sm   = Math.sqrt(sx * sx + sy * sy) || 1
    this.acc.x += (sx / sm) * this.maxForce
    this.acc.y += (sy / sm) * this.maxForce
    this.vel.x += this.acc.x; this.vel.y += this.acc.y
    this.pos.x += this.vel.x; this.pos.y += this.vel.y
    this.acc.x  = 0; this.acc.y = 0
  }

  draw(ctx) {
    if (this.colorWeight < 1) this.colorWeight = Math.min(this.colorWeight + this.colorBlendRate, 1)
    const r = Math.round(this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight)
    const g = Math.round(this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight)
    const b = Math.round(this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight)
    ctx.fillStyle = `rgb(${r},${g},${b})`
    ctx.fillRect(this.pos.x, this.pos.y, 2.5, 2.5)
  }

  kill(w, h) {
    if (this.isKilled) return
    const cx = w / 2, cy = h / 2
    const mag = (w + h) * 0.7
    const rx = Math.random() * w, ry = Math.random() * h
    const dx = rx - cx, dy = ry - cy
    const d  = Math.sqrt(dx * dx + dy * dy) || 1
    this.target.x = cx + (dx / d) * mag
    this.target.y = cy + (dy / d) * mag
    const bl = {
      r: Math.round(this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight),
      g: Math.round(this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight),
      b: Math.round(this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight),
    }
    this.startColor  = bl
    this.targetColor = { r: 12, g: 10, b: 9 }
    this.colorWeight = 0
    this.isKilled    = true
  }
}

// ─── Sequence ────────────────────────────────────────────────────────────────
const SEQUENCE = [
  { word: 'SUJITHA',  sub: 'DIGITAL MARKETING INFLUENCER',   color: { r: 225, g: 224, b: 204 } },
  { word: 'STRATEGY', sub: 'DATA · PRECISION · RESULTS',     color: { r: 240, g: 78,  b: 35 } },
  { word: 'GROWTH',   sub: 'BECAUSE NUMBERS TELL THE TRUTH', color: { r: 225, g: 224, b: 204 } },
]
const WORD_HOLD  = 3200
const SCATTER_AT = SEQUENCE.length * WORD_HOLD
const FADE_MS    = 900
const PIXEL_STEP = 4

// ─── Component ───────────────────────────────────────────────────────────────
export default function Preloader({ onComplete }) {
  const canvasRef = useRef(null)
  const S         = useRef({ particles: [], animId: null })
  const [opacity,  setOpacity]  = useState(1)
  const [sub,      setSub]      = useState(SEQUENCE[0].sub)
  const [subShow,  setSubShow]  = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    const loadWord = (idx) => {
      const { word, sub: subText, color } = SEQUENCE[idx]
      const off = document.createElement('canvas')
      off.width = canvas.width; off.height = canvas.height
      const oc  = off.getContext('2d')
      // Start large, then scale down to fit 80% of screen width
      let fs = Math.min(canvas.height * 0.40, 220)
      oc.font = `700 ${fs}px Syncopate, 'Arial Black', Arial`
      const maxW = canvas.width * 0.80
      const measured = oc.measureText(word).width
      if (measured > maxW) fs = fs * (maxW / measured)
      oc.font         = `700 ${fs}px Syncopate, 'Arial Black', Arial`
      oc.fillStyle    = 'white'
      oc.textAlign    = 'center'
      oc.textBaseline = 'middle'
      oc.fillText(word, canvas.width / 2, canvas.height / 2)

      const pixels = oc.getImageData(0, 0, canvas.width, canvas.height).data
      const coords = []
      for (let i = 0; i < pixels.length; i += PIXEL_STEP * 4) {
        if (pixels[i + 3] > 0) coords.push(i)
      }
      for (let i = coords.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[coords[i], coords[j]] = [coords[j], coords[i]]
      }

      let pi = 0
      for (const ci of coords) {
        const px = (ci / 4) % canvas.width
        const py = Math.floor(ci / 4 / canvas.width)
        let p
        if (pi < S.current.particles.length) {
          p = S.current.particles[pi]; p.isKilled = false; pi++
        } else {
          p = new Particle()
          const cx = canvas.width / 2, cy = canvas.height / 2
          const mag = (canvas.width + canvas.height) * 0.6
          const rx = Math.random() * canvas.width, ry = Math.random() * canvas.height
          const dx = rx - cx, dy = ry - cy
          const d  = Math.sqrt(dx * dx + dy * dy) || 1
          p.pos.x = cx + (dx / d) * mag
          p.pos.y = cy + (dy / d) * mag
          p.maxSpeed      = Math.random() * 3 + 2
          p.maxForce      = p.maxSpeed * 0.05
          p.colorBlendRate = Math.random() * 0.025 + 0.005
          S.current.particles.push(p)
        }
        const bl = {
          r: Math.round(p.startColor.r + (p.targetColor.r - p.startColor.r) * p.colorWeight),
          g: Math.round(p.startColor.g + (p.targetColor.g - p.startColor.g) * p.colorWeight),
          b: Math.round(p.startColor.b + (p.targetColor.b - p.startColor.b) * p.colorWeight),
        }
        p.startColor  = bl
        p.targetColor = color
        p.colorWeight = 0
        p.target.x    = px
        p.target.y    = py
      }
      for (let i = pi; i < S.current.particles.length; i++) S.current.particles[i].kill(canvas.width, canvas.height)

      setSubShow(false)
      setTimeout(() => { setSub(subText); setSubShow(true) }, 280)
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(12,10,9,0.84)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      for (let i = S.current.particles.length - 1; i >= 0; i--) {
        const p = S.current.particles[i]
        p.move(); p.draw(ctx)
        if (p.isKilled) {
          const { x, y } = p.pos
          if (x < -60 || x > canvas.width + 60 || y < -60 || y > canvas.height + 60)
            S.current.particles.splice(i, 1)
        }
      }
      S.current.animId = requestAnimationFrame(animate)
    }

    const timers = []

    const start = () => {
      loadWord(0)
      animate()
      SEQUENCE.forEach((_, i) => {
        if (i === 0) return
        timers.push(setTimeout(() => loadWord(i), i * WORD_HOLD))
      })
      timers.push(setTimeout(() => {
        S.current.particles.forEach(p => p.kill(canvas.width, canvas.height))
        setSubShow(false)
        setTimeout(() => {
          cancelAnimationFrame(S.current.animId)
          setOpacity(0)
          setTimeout(onComplete, FADE_MS)
        }, 250)
      }, SCATTER_AT))
    }

    // Wait for both fonts and full page load before beginning
    const pageLoaded = document.readyState === 'complete'
      ? Promise.resolve()
      : new Promise(res => window.addEventListener('load', res, { once: true }))

    Promise.all([document.fonts.ready, pageLoaded]).then(start)

    return () => {
      cancelAnimationFrame(S.current.animId)
      window.removeEventListener('resize', resize)
      timers.forEach(clearTimeout)
    }
  }, [onComplete])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#0C0A09',
      opacity,
      transition: `opacity ${FADE_MS}ms cubic-bezier(0.16,1,0.3,1)`,
    }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />

      {/* Bottom label */}
      <div style={{
        position: 'absolute', bottom: '8%', left: 0, right: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
        pointerEvents: 'none',
      }}>
        <p style={{
          fontFamily: '"Space Grotesk", sans-serif',
          fontWeight: 500,
          fontSize: 'clamp(8px, 0.8vw, 11px)',
          letterSpacing: '0.4em',
          color: '#F04E23',
          textTransform: 'uppercase',
          opacity: subShow ? 0.85 : 0,
          transition: 'opacity 0.35s ease',
        }}>
          {sub}
        </p>

        {/* Progress line */}
        <div style={{ width: 'clamp(80px, 12vw, 160px)', height: 1, background: 'rgba(225,224,204,0.18)', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: '#E1E0CC',
            transformOrigin: 'left',
            animation: `plProgress ${SCATTER_AT + 250}ms linear forwards`,
          }} />
        </div>
      </div>

      <style>{`@keyframes plProgress { from { transform: scaleX(0) } to { transform: scaleX(1) } }`}</style>
    </div>
  )
}
