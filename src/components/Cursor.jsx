import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function Cursor() {
  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  const x = useSpring(mouseX, { stiffness: 500, damping: 40, mass: 0.3 })
  const y = useSpring(mouseY, { stiffness: 500, damping: 40, mass: 0.3 })

  const [state, setState] = useState('default') // 'default' | 'hover' | 'click'
  const [label, setLabel] = useState('')
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const onMove  = (e) => { mouseX.set(e.clientX); mouseY.set(e.clientY) }
    const onEnter = () => setHidden(false)
    const onLeave = () => setHidden(true)
    const onDown  = () => setState(s => s === 'hover' ? 'hover' : 'click')
    const onUp    = () => setState(s => s === 'hover' ? 'hover' : 'default')

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseenter', onEnter)
    document.addEventListener('mouseleave', onLeave)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)

    const bind = () => {
      document.querySelectorAll('a, button, [data-cursor]').forEach(el => {
        el.addEventListener('mouseenter', () => {
          setState('hover')
          setLabel(el.dataset.cursor || '')
        })
        el.addEventListener('mouseleave', () => {
          setState('default')
          setLabel('')
        })
      })
    }

    bind()
    const observer = new MutationObserver(bind)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseenter', onEnter)
      document.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      observer.disconnect()
    }
  }, [mouseX, mouseY])

  const isHover = state === 'hover'
  const isClick = state === 'click'

  return (
    <motion.div
      style={{
        x, y,
        position: 'fixed',
        top: 0, left: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        mixBlendMode: 'exclusion',
      }}
      animate={{ opacity: hidden ? 0 : 1 }}
      transition={{ duration: 0.2 }}
      aria-hidden="true"
    >
      <motion.div
        animate={{
          width:  isHover && label ? 'auto' : isHover ? 72 : isClick ? 28 : 44,
          height: isHover ? 44 : isClick ? 28 : 44,
          borderRadius: isHover && label ? 999 : '50%',
          scale: isClick ? 0.85 : 1,
        }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: '#fff',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: isHover && label ? 80 : undefined,
          paddingLeft:  isHover && label ? 20 : 0,
          paddingRight: isHover && label ? 20 : 0,
          overflow: 'hidden',
          willChange: 'transform',
        }}
      >
        {isHover && label && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{
              fontFamily: 'Syncopate, sans-serif',
              fontSize: 8,
              letterSpacing: '0.15em',
              color: '#FAF7F2',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              mixBlendMode: 'normal',
            }}
          >
            {label}
          </motion.span>
        )}
      </motion.div>
    </motion.div>
  )
}
