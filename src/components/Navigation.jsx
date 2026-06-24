import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBreakpoint } from '../hooks/useBreakpoint'

const NAV_ITEMS = [
  { id: 'hero',       label: 'Home' },
  { id: 'manifesto',  label: 'Manifesto' },
  { id: 'works',      label: 'Works' },
  { id: 'about',      label: 'About' },
  { id: 'contact',    label: 'Contact' },
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
      {/* Wordmark */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        onClick={() => scrollTo('hero')}
        data-cursor="Home"
        style={{
          position: 'fixed',
          top: 'clamp(16px, 2.8vh, 28px)',
          left: 'clamp(20px, 3vw, 36px)',
          zIndex: 1001,
          fontFamily: '"Cormorant Garamond", serif',
          fontSize: 'clamp(13px, 1.2vw, 17px)',
          letterSpacing: '0.12em',
          color: menuOpen ? '#B5294E' : '#1A1218',
          fontWeight: 300,
          opacity: scrolled ? 1 : 0.7,
          transition: 'opacity 0.4s ease, color 0.4s ease',
          cursor: isMobile ? 'pointer' : 'none',
        }}
      >
        SUJITHA M
      </motion.div>

      {/* Desktop: availability tag */}
      {!isMobile && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          style={{
            position: 'fixed',
            top: 'clamp(16px, 2.8vh, 28px)',
            right: 'clamp(20px, 3vw, 36px)',
            zIndex: 1001, display: 'flex', alignItems: 'center', gap: 8,
            fontFamily: 'Syncopate, sans-serif',
            fontSize: 'clamp(7px, 0.7vw, 9px)', letterSpacing: '0.2em',
            color: '#8B6F6F', textTransform: 'uppercase',
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2E7D32', display: 'inline-block', animation: 'pulse-gold 2s infinite' }} />
          Available for work
        </motion.div>
      )}

      {/* Mobile: hamburger */}
      {isMobile && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          style={{
            position: 'fixed',
            top: 'clamp(12px, 2.5vh, 20px)',
            right: 'clamp(20px, 4vw, 36px)',
            zIndex: 1002, background: 'none', border: 'none',
            cursor: 'pointer', padding: 8,
            display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'flex-end',
          }}
        >
          <motion.span
            animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 6.5 : 0 }}
            transition={{ duration: 0.28 }}
            style={{ display: 'block', width: 24, height: 1.5, background: '#1A1218', borderRadius: 1, transformOrigin: 'center' }}
          />
          <motion.span
            animate={{ opacity: menuOpen ? 0 : 1, scaleX: menuOpen ? 0 : 1 }}
            transition={{ duration: 0.2 }}
            style={{ display: 'block', width: 16, height: 1.5, background: '#1A1218', borderRadius: 1 }}
          />
          <motion.span
            animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -6.5 : 0 }}
            transition={{ duration: 0.28 }}
            style={{ display: 'block', width: 20, height: 1.5, background: '#1A1218', borderRadius: 1, transformOrigin: 'center' }}
          />
        </motion.button>
      )}

      {/* Desktop: dot navigation */}
      {!isMobile && (
        <motion.nav
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          aria-label="Page sections"
          style={{
            position: 'fixed', right: 28, top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 1000,
            display: 'flex', flexDirection: 'column', gap: 20,
            alignItems: 'flex-end',
          }}
        >
          {NAV_ITEMS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              onMouseEnter={() => setHovered(id)}
              onMouseLeave={() => setHovered(null)}
              aria-label={`Go to ${label}`}
              style={{ background: 'none', border: 'none', cursor: 'none', display: 'flex', alignItems: 'center', gap: 10 }}
            >
              <AnimatePresence>
                {hovered === id && (
                  <motion.span
                    key="label"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    style={{ fontFamily: 'Syncopate, sans-serif', fontSize: 9, letterSpacing: '0.2em', color: '#B5294E', textTransform: 'uppercase', whiteSpace: 'nowrap' }}
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
              <motion.div
                animate={{
                  width: active === id ? 20 : 6,
                  height: 6,
                  borderRadius: active === id ? 3 : '50%',
                  backgroundColor: active === id ? '#B5294E' : hovered === id ? 'rgba(196,98,45,0.6)' : 'rgba(237,227,213,0.25)',
                }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              />
            </button>
          ))}
        </motion.nav>
      )}

      {/* Mobile: full-screen overlay menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed', inset: 0,
              background: '#FAF7F2',
              zIndex: 1000,
              display: 'flex', flexDirection: 'column',
              justifyContent: 'center',
              padding: '0 clamp(24px, 8vw, 56px)',
            }}
          >
            <nav style={{ display: 'flex', flexDirection: 'column' }}>
              {NAV_ITEMS.map(({ id, label }, i) => (
                <motion.button
                  key={id}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.055, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => scrollTo(id)}
                  style={{
                    fontFamily: '"Cormorant Garamond", serif',
                    fontSize: 'clamp(2.8rem, 11vw, 5rem)',
                    fontWeight: 300,
                    color: active === id ? '#B5294E' : '#1A1218',
                    background: 'none', border: 'none',
                    cursor: 'pointer', textAlign: 'left',
                    padding: '0.1em 0',
                    letterSpacing: '-0.015em',
                    lineHeight: 1.1,
                    borderBottom: '1px solid #F0EAE1',
                  }}
                >
                  {label}
                </motion.button>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.38 }}
              style={{
                position: 'absolute',
                bottom: 'clamp(24px, 6vh, 48px)',
                left: 'clamp(24px, 8vw, 56px)',
                display: 'flex', alignItems: 'center', gap: 8,
                fontFamily: 'Syncopate, sans-serif',
                fontSize: 9, letterSpacing: '0.2em',
                color: '#8B6F6F', textTransform: 'uppercase',
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2E7D32', display: 'inline-block', animation: 'pulse-gold 2s infinite' }} />
              Available for work
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
