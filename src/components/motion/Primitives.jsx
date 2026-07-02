import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

export const EXPO = [0.16, 1, 0.3, 1]

/* ── WordsPullUp — staggered word reveal ─────────────────────── */
export function WordsPullUp({ text, className = '', showAsterisk = false, style, delay = 0, stagger = 0.08 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const words = text.split(' ')

  return (
    <div ref={ref} className={className} style={{ display: 'inline-flex', flexWrap: 'wrap', ...style }}>
      {words.map((word, i) => {
        const isLast = i === words.length - 1
        return (
          <motion.span
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: delay + i * stagger, ease: EXPO }}
            style={{ display: 'inline-block', position: 'relative', marginRight: isLast ? 0 : '0.25em' }}
          >
            {word}
            {showAsterisk && isLast && (
              <span style={{
                position: 'absolute', top: '0.65em', right: '-0.3em',
                fontSize: '0.31em',
              }}>*</span>
            )}
          </motion.span>
        )
      })}
    </div>
  )
}

/* ── WordsPullUpMultiStyle — per-segment styling ─────────────── */
export function WordsPullUpMultiStyle({ segments, className = '', style, delay = 0, stagger = 0.08 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const words = []
  segments.forEach(seg => {
    seg.text.split(' ').forEach(w => {
      if (w) words.push({ word: w, style: seg.style })
    })
  })

  return (
    <div ref={ref} className={className} style={{ display: 'inline-flex', flexWrap: 'wrap', ...style }}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          initial={{ y: 20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: delay + i * stagger, ease: EXPO }}
          style={{ display: 'inline-block', marginRight: '0.25em', ...w.style }}
        >
          {w.word}
        </motion.span>
      ))}
    </div>
  )
}

/* ── LineMask — clipped line rising from below ───────────────── */
export function LineMask({ children, delay = 0, once = true, style }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: '-8%' })

  return (
    <div ref={ref} style={{ overflow: 'hidden', ...style }}>
      <motion.div
        initial={{ y: '110%' }}
        animate={isInView ? { y: '0%' } : {}}
        transition={{ duration: 0.9, delay, ease: EXPO }}
      >
        {children}
      </motion.div>
    </div>
  )
}

/* ── FadeUp — soft rise for body copy / blocks ───────────────── */
export function FadeUp({ children, delay = 0, y = 24, style, once = true }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: '-8%' })

  return (
    <motion.div
      ref={ref}
      initial={{ y, opacity: 0 }}
      animate={isInView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.9, delay, ease: EXPO }}
      style={style}
    >
      {children}
    </motion.div>
  )
}

/* ── ArrowIcon — inline SVG, no icon dependency ──────────────── */
export function ArrowIcon({ size = 16, color = '#E1E0CC', direction = 'right' }) {
  const rotation = { right: 0, 'up-right': -45, down: 90, left: 180 }[direction] ?? 0
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none"
      style={{ transform: `rotate(${rotation}deg)` }}
      aria-hidden="true"
    >
      <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ── PillButton — cream pill, black arrow circle ─────────────── */
export function PillButton({ children, onClick, href, delay = 0, dark = false, cursorLabel }) {
  const [hovered, setHovered] = useState(false)
  const Tag = href ? motion.a : motion.button

  const pillBg   = dark ? 'var(--surface-2)' : 'var(--cream)'
  const pillText = dark ? 'var(--cream)' : '#0C0A09'
  const circBg   = dark ? 'var(--cream)' : '#0C0A09'
  const arrowCol = dark ? '#0C0A09' : '#E1E0CC'

  return (
    <Tag
      href={href}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-cursor={cursorLabel}
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, ease: EXPO }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: hovered ? 14 : 10,
        alignSelf: 'flex-start',
        borderRadius: 999,
        background: pillBg,
        border: dark ? '1px solid var(--hairline)' : 'none',
        padding: '5px 5px 5px 22px',
        fontFamily: 'var(--font-body)',
        fontSize: 'clamp(13px, 1vw, 15px)',
        fontWeight: 500,
        color: pillText,
        textDecoration: 'none',
        cursor: 'pointer',
        transition: 'gap 0.3s cubic-bezier(0.16,1,0.3,1)',
        minHeight: 48,
      }}
    >
      {children}
      <span
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 38, height: 38, borderRadius: '50%',
          background: circBg,
          transform: hovered ? 'scale(1.1) rotate(0deg)' : 'scale(1)',
          transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1)',
          flexShrink: 0,
        }}
      >
        <ArrowIcon size={15} color={arrowCol} />
      </span>
    </Tag>
  )
}
