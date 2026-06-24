import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { useBreakpoint } from '../hooks/useBreakpoint'

const MARQUEE_TEXT = 'DATA IS THE LANGUAGE OF GROWTH · EVERY CLICK TELLS A STORY · STRATEGY MEETS CREATIVITY · RESULTS THAT MATTER · '

const MANIFESTO_LINES = [
  { words: ['Every', 'brand'], big: true },
  { words: ['has a story'], big: false },
  { words: ['waiting to be'], big: false },
  { words: ['FOUND'], big: true },
  { words: ['through the right'], big: false },
  { words: ['strategy, data,'], big: false },
  { words: ['and the right'], big: false },
  { words: ['VOICE'], big: true },
]

function ManifestoLine({ words, big, index }) {
  const ref   = useRef(null)
  const inView = useInView(ref, { margin: '-10% 0px', once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{
        lineHeight: big ? 0.92 : 1.2,
        marginBottom: big ? '0.08em' : '0.2em',
      }}
    >
      <span style={{
        fontFamily: '"Cormorant Garamond", serif',
        fontSize: big ? 'clamp(3rem, 9vw, 11rem)' : 'clamp(1.1rem, 2.8vw, 3.8rem)',
        fontWeight: big ? 300 : 300,
        fontStyle: big ? 'normal' : 'italic',
        color: big ? '#1A1218' : '#8B6F6F',
        letterSpacing: big ? '-0.02em' : '0.02em',
        display: 'block',
      }}>
        {words.join(' ')}
      </span>
    </motion.div>
  )
}

export default function ManifestoSection() {
  const ref = useRef(null)
  const { isMobile } = useBreakpoint()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const marqSpeed = useTransform(scrollYProgress, [0, 1], ['0%', '-5%'])

  return (
    <section id="manifesto" ref={ref} className="section" style={{ padding: '10vh 0', overflow: 'hidden' }}>

      {/* Dual marquee */}
      <div style={{ overflow: 'hidden', borderTop: '1px solid #DDD0C8', borderBottom: '1px solid #DDD0C8', padding: '14px 0', marginBottom: '10vh' }}>
        <div className="marquee-track">
          {[...Array(4)].map((_, k) => (
            <span key={k} style={{ fontFamily: 'Syncopate, sans-serif', fontSize: 'clamp(8px, 0.9vw, 11px)', letterSpacing: '0.28em', color: '#8B6F6F', paddingRight: '4em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
              {MARQUEE_TEXT}
            </span>
          ))}
        </div>
      </div>

      {/* Main manifesto text */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 clamp(24px, 6vw, 96px)' }}>
        {MANIFESTO_LINES.map(({ words, big }, i) => (
          <ManifestoLine key={i} words={words} big={big} index={i} />
        ))}
      </div>

      {/* Reverse marquee */}
      <div style={{ overflow: 'hidden', borderTop: '1px solid #DDD0C8', padding: '14px 0', marginTop: '10vh' }}>
        <div className="marquee-track-reverse">
          {[...Array(4)].map((_, k) => (
            <span key={k} style={{ fontFamily: 'Syncopate, sans-serif', fontSize: 'clamp(8px, 0.9vw, 11px)', letterSpacing: '0.28em', color: '#DDD0C8', paddingRight: '4em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
              {MARQUEE_TEXT}
            </span>
          ))}
        </div>
      </div>

      {/* Philosophy pull-quote */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ margin: '-10%', once: true }}
        transition={{ duration: 1.2, delay: 0.3 }}
        style={{ maxWidth: '1200px', margin: '12vh auto 0', padding: '0 clamp(24px, 6vw, 96px)', display: 'flex', alignItems: 'flex-start', gap: isMobile ? '1.5vw' : '3vw', flexDirection: isMobile ? 'column' : 'row' }}
      >
        <span style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: isMobile ? '3rem' : 'clamp(5rem, 12vw, 14rem)', fontWeight: 300, color: '#DDD0C8', lineHeight: 0.8, flexShrink: 0 }}>&ldquo;</span>
        <div>
          <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(1rem, 2.4vw, 3rem)', fontStyle: 'italic', color: '#8B6F6F', lineHeight: 1.55, fontWeight: 300 }}>
            I believe that behind every great marketing campaign lies a truth worth telling — and the data to prove it. My work lives at the intersection of analytical precision and human storytelling, where numbers become narratives and strategy becomes growth.
          </p>
          <p style={{ marginTop: '1.5em', fontFamily: 'Syncopate, sans-serif', fontSize: 9, letterSpacing: '0.3em', color: '#B5294E', textTransform: 'uppercase' }}>
            — Sujitha M
          </p>
        </div>
      </motion.div>
    </section>
  )
}
