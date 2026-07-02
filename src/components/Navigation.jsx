import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBreakpoint } from '../hooks/useBreakpoint'
import { EXPO } from './motion/Primitives'

const NAV_ITEMS = [
  { id: 'hero',      label: 'Home' },
  { id: 'manifesto', label: 'Manifesto' },
  { id: 'courses',   label: 'Courses' },
  { id: 'about',     label: 'About' },
  { id: 'contact',   label: 'Contact' },
]

export default function Navigation() {
  const [active, setActive]     = useState('hero')
  const [hovered, setHovered]   = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { isMobile } = useBreakpoint()

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80)
      for (const { id } of NAV_ITEMS) {
        const el = document.getElementById(id)
        if (!el) continue
        const { top } = el.getBoundingClientRect()
        if (top <= window.innerHeight * 0.5) setActive(id)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const scrollTo = (id) => {
    const delay = menuOpen ? 380 : 0
    setMenuOpen(false)
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), delay)
  }

  return (
    <>
      {/* Wordmark — top left, above the frame */}
      <motion.button
        initial={{ y: -14 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5, duration: 0.9, ease: EXPO }}
        onClick={() => scrollTo('hero')}
        data-cursor="Top"
        aria-label="Back to top"
        style={{
          position: 'fixed',
          top: 'clamp(18px, 3vh, 30px)',
          left: 'clamp(20px, 3vw, 40px)',
          zIndex: 1001,
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(13px, 1vw, 15px)',
          fontWeight: 500,
          letterSpacing: '-0.02em',
          color: 'var(--cream)',
          background: 'none',
          border: 'none',
          cursor: isMobile ? 'pointer' : 'none',
          opacity: scrolled || menuOpen ? 1 : 0,
          pointerEvents: scrolled || menuOpen ? 'auto' : 'none',
          transition: 'opacity 0.5s ease',
          mixBlendMode: menuOpen ? 'normal' : 'difference',
        }}
      >
        Sujitha M<span style={{ color: 'var(--accent)' }}>*</span>
      </motion.button>

      {/* Desktop: top-center pill nav */}
      {!isMobile && (
        <motion.nav
          initial={false}
          animate={{ opacity: scrolled ? 1 : 0, y: scrolled ? 0 : -24 }}
          transition={{ duration: 0.6, ease: EXPO }}
          aria-label="Page sections"
          style={{
            position: 'fixed',
            top: 14,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            pointerEvents: scrolled ? 'auto' : 'none',
          }}
        >
          <div
            onMouseLeave={() => setHovered(null)}
            style={{
              display: 'flex', alignItems: 'center',
              gap: 'clamp(2px, 0.4vw, 6px)',
              borderRadius: 999,
              background: 'rgba(12,10,9,0.72)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid var(--hairline)',
              padding: '6px 8px',
            }}
          >
            {NAV_ITEMS.map(({ id, label }) => {
              // Liquid highlight sits on hover; rests on the active section
              const isLit = hovered ? hovered === id : active === id
              return (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  onMouseEnter={() => setHovered(id)}
                  aria-label={`Go to ${label}`}
                  aria-current={active === id ? 'true' : undefined}
                  style={{
                    position: 'relative',
                    fontFamily: 'var(--font-body)',
                    fontSize: 'clamp(11px, 0.85vw, 13px)',
                    fontWeight: 400,
                    letterSpacing: '0.01em',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: 999,
                    padding: '9px 16px',
                    cursor: 'none',
                    minHeight: 36,
                  }}
                >
                  {isLit && (
                    <motion.span
                      layoutId="pill-nav-liquid"
                      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: 999,
                        background: 'var(--cream)',
                      }}
                    />
                  )}
                  <span style={{
                    position: 'relative',
                    zIndex: 1,
                    color: isLit ? '#0C0A09' : 'rgba(225,224,204,0.7)',
                    transition: 'color 0.25s ease',
                  }}>
                    {label}
                  </span>
                </button>
              )
            })}
          </div>
        </motion.nav>
      )}

      {/* Desktop: availability tag — top right */}
      {!isMobile && (
        <motion.div
          initial={{ y: -14 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.9, duration: 0.9, ease: EXPO }}
          className="label"
          style={{
            position: 'fixed',
            top: 'clamp(18px, 3vh, 30px)',
            right: 'clamp(20px, 3vw, 40px)',
            zIndex: 1001,
            display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 9,
            color: 'var(--cream-55)',
            opacity: scrolled ? 1 : 0,
            pointerEvents: 'none',
            transition: 'opacity 0.5s ease',
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#5FBF77', display: 'inline-block', animation: 'pulse-dot 2.4s infinite' }} />
          Available for work
        </motion.div>
      )}

      {/* Mobile: pill hamburger */}
      {isMobile && (
        <motion.button
          initial={false}
          animate={{
            opacity: scrolled || menuOpen ? 1 : 0,
            y: scrolled || menuOpen ? 0 : -14,
          }}
          transition={{ duration: 0.5, ease: EXPO }}
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          style={{
            pointerEvents: scrolled || menuOpen ? 'auto' : 'none',
            position: 'fixed',
            top: 14,
            right: 14,
            zIndex: 1002,
            width: 48, height: 48,
            borderRadius: '50%',
            background: menuOpen ? 'var(--cream)' : 'rgba(12,10,9,0.72)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid var(--hairline)',
            cursor: 'pointer',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 5,
            transition: 'background 0.35s ease',
          }}
        >
          <motion.span
            animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 3.25 : 0 }}
            transition={{ duration: 0.3, ease: EXPO }}
            style={{ display: 'block', width: 18, height: 1.5, background: menuOpen ? '#0C0A09' : 'var(--cream)', borderRadius: 1 }}
          />
          <motion.span
            animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -3.25 : 0 }}
            transition={{ duration: 0.3, ease: EXPO }}
            style={{ display: 'block', width: 18, height: 1.5, background: menuOpen ? '#0C0A09' : 'var(--cream)', borderRadius: 1 }}
          />
        </motion.button>
      )}

      {/* Mobile: full-screen overlay menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EXPO }}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(12,10,9,0.97)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              zIndex: 1000,
              display: 'flex', flexDirection: 'column',
              justifyContent: 'center',
              padding: '0 clamp(24px, 8vw, 56px)',
            }}
          >
            <nav style={{ display: 'flex', flexDirection: 'column' }}>
              {NAV_ITEMS.map(({ id, label }, i) => (
                <div key={id} style={{ overflow: 'hidden', borderBottom: '1px solid var(--hairline)' }}>
                  <motion.button
                    initial={{ y: '105%' }}
                    animate={{ y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.08 + i * 0.06, duration: 0.7, ease: EXPO }}
                    onClick={() => scrollTo(id)}
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(2.6rem, 11vw, 4.6rem)',
                      fontWeight: 500,
                      letterSpacing: '-0.04em',
                      color: active === id ? 'var(--accent)' : 'var(--cream)',
                      background: 'none', border: 'none',
                      cursor: 'pointer', textAlign: 'left',
                      padding: '0.18em 0',
                      lineHeight: 1,
                      width: '100%',
                    }}
                  >
                    {label}
                  </motion.button>
                </div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="label"
              style={{
                position: 'absolute',
                bottom: 'clamp(24px, 6vh, 48px)',
                left: 'clamp(24px, 8vw, 56px)',
                display: 'flex', alignItems: 'center', gap: 8,
                color: 'var(--cream-55)',
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#5FBF77', display: 'inline-block', animation: 'pulse-dot 2.4s infinite' }} />
              Available for work
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
