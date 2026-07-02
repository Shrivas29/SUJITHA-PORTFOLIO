import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useBreakpoint } from '../hooks/useBreakpoint'
import { WordsPullUpMultiStyle, FadeUp, EXPO } from './motion/Primitives'

const MARQUEE_TEXT = 'DATA IS THE LANGUAGE OF GROWTH · EVERY CLICK TELLS A STORY · STRATEGY MEETS CREATIVITY · RESULTS THAT MATTER · '

const grotesk = {
  fontFamily: 'var(--font-display)',
  fontWeight: 500,
  letterSpacing: '-0.04em',
  color: 'var(--cream)',
}

const serifItalic = {
  fontFamily: 'var(--font-serif)',
  fontWeight: 300,
  fontStyle: 'italic',
  letterSpacing: '0',
  color: 'var(--accent)',
}

function Marquee({ reverse = false, dim = false }) {
  return (
    <div style={{
      overflow: 'hidden',
      borderTop: '1px solid var(--hairline)',
      borderBottom: reverse ? 'none' : '1px solid var(--hairline)',
      padding: '16px 0',
    }}>
      <div className={reverse ? 'marquee-track-reverse' : 'marquee-track'}>
        {[...Array(4)].map((_, k) => (
          <span key={k} className="label" style={{
            fontSize: 'clamp(9px, 0.8vw, 11px)',
            letterSpacing: '0.28em',
            color: dim ? 'var(--cream-35)' : 'var(--cream-55)',
            paddingRight: '4em',
            whiteSpace: 'nowrap',
          }}>
            {MARQUEE_TEXT}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function ManifestoSection() {
  const ref = useRef(null)
  const { isMobile } = useBreakpoint()

  return (
    <section id="manifesto" ref={ref} className="section" style={{ padding: '14vh 0 12vh' }}>

      <Marquee />

      {/* Big statement */}
      <div style={{
        maxWidth: 1300,
        margin: '0 auto',
        padding: '14vh clamp(20px, 5vw, 80px) 0',
      }}>
        <FadeUp>
          <p className="label" style={{ color: 'var(--accent)', marginBottom: 'clamp(24px, 4vh, 40px)' }}>
            Manifesto
          </p>
        </FadeUp>

        <h2 style={{
          fontSize: isMobile ? 'clamp(2rem, 9.5vw, 3.2rem)' : 'clamp(2.6rem, 5.6vw, 6.4rem)',
          lineHeight: 1.04,
          margin: 0,
        }}>
          <WordsPullUpMultiStyle
            stagger={0.05}
            style={{ justifyContent: 'flex-start' }}
            segments={[
              { text: 'Every brand has a', style: grotesk },
              { text: 'story', style: serifItalic },
              { text: 'waiting to be found — through the right', style: grotesk },
              { text: 'strategy,', style: serifItalic },
              { text: 'the right', style: grotesk },
              { text: 'data,', style: serifItalic },
              { text: 'and the right', style: grotesk },
              { text: 'voice.', style: serifItalic },
            ]}
          />
        </h2>
      </div>

      {/* Philosophy quote */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ margin: '-10%', once: true }}
        transition={{ duration: 1, ease: EXPO }}
        style={{
          maxWidth: 1300,
          margin: '12vh auto 14vh',
          padding: '0 clamp(20px, 5vw, 80px)',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1.6fr',
          gap: isMobile ? 28 : 'clamp(32px, 5vw, 80px)',
          alignItems: 'start',
        }}
      >
        <div className="label" style={{ paddingTop: 6 }}>
          The philosophy
        </div>
        <div>
          <p style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.25rem, 2.2vw, 2.1rem)',
            fontStyle: 'italic',
            fontWeight: 300,
            color: 'var(--cream-70)',
            lineHeight: 1.55,
          }}>
            "Behind every great campaign lies a truth worth telling — and the
            data to prove it. My work lives where analytical precision meets
            human storytelling: numbers become narratives, and strategy
            becomes growth."
          </p>
          <p className="label" style={{ marginTop: '2em', color: 'var(--cream-55)' }}>
            — Sujitha M
          </p>
        </div>
      </motion.div>

      <Marquee reverse dim />
    </section>
  )
}
