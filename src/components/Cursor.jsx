import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function Cursor() {
  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  const x = useSpring(mouseX, { stiffness: 650, damping: 45, mass: 0.25 })
  const y = useSpring(mouseY, { stiffness: 650, damping: 45, mass: 0.25 })

  const [hovered, setHovered] = useState(false)
  const [label, setLabel]     = useState('')
  const [down, setDown]       = useState(false)
  const [hidden, setHidden]   = useState(false)

  useEffect(() => {
    const onMove = (e) => { mouseX.set(e.clientX); mouseY.set(e.clientY) }

    // Event delegation — one listener, no per-element binding, no observer leaks
    const onOver = (e) => {
      const target = e.target.closest?.('a, button, [data-cursor]')
      if (target) {
        setHovered(true)
        setLabel(target.dataset?.cursor || '')
      } else {
        setHovered(false)
        setLabel('')
      }
    }

    const onEnter = () => setHidden(false)
    const onLeave = () => setHidden(true)
    const onDown  = () => setDown(true)
    const onUp    = () => setDown(false)

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver, { passive: true })
    document.documentElement.addEventListener('mouseenter', onEnter)
    document.documentElement.addEventListener('mouseleave', onLeave)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.documentElement.removeEventListener('mouseenter', onEnter)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
    }
  }, [mouseX, mouseY])

  const showLabel = hovered && label

  return (
    <motion.div
      style={{
        x, y,
        position: 'fixed',
        top: 0, left: 0,
        pointerEvents: 'none',
        zIndex: 10000,
      }}
      animate={{ opacity: hidden ? 0 : 1 }}
      transition={{ duration: 0.2 }}
      aria-hidden="true"
    >
      <motion.div
        animate={{
          width:  showLabel ? 'auto' : hovered ? 40 : down ? 9 : 12,
          height: showLabel ? 34 : hovered ? 40 : down ? 9 : 12,
          borderRadius: 999,
        }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        style={{
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: hovered && !showLabel ? 'rgba(225,224,204,0.16)' : '#E1E0CC',
          border: hovered && !showLabel ? '1.5px solid #E1E0CC' : '1px solid rgba(12,10,9,0.5)',
          boxShadow: '0 1px 10px rgba(0,0,0,0.45)',
          paddingLeft:  showLabel ? 16 : 0,
          paddingRight: showLabel ? 16 : 0,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}
      >
        {showLabel && (
          <motion.span
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.16 }}
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontWeight: 500,
              fontSize: 10,
              letterSpacing: '0.1em',
              color: '#0C0A09',
              textTransform: 'uppercase',
            }}
          >
            {label}
          </motion.span>
        )}
      </motion.div>
    </motion.div>
  )
}
