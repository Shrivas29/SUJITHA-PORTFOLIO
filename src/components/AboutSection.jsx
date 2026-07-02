import { useRef, useState, useEffect } from 'react'
import { motion, useInView, useScroll, useTransform, useMotionValue, animate } from 'framer-motion'
import { useBreakpoint } from '../hooks/useBreakpoint'
import { WordsPullUp, FadeUp, EXPO } from './motion/Primitives'

const STATS = [
  { value: 3,  suffix: '+', label: 'Years of Experience' },
  { value: 50, suffix: '+', label: 'Campaigns Delivered' },
  { value: 20, suffix: '+', label: 'Skills & Disciplines' },
]

const FRAGMENTS = [
  {
    text: 'Sujitha M is a Digital Marketing Influencer at the intersection of data, creativity, and measurable growth.',
    em: ['data', 'creativity', 'measurable growth'],
  },
  {
    text: "With a Master's in Mathematics, every campaign is built on analytical precision — transforming raw data into strategies that move businesses forward.",
    em: ['analytical precision', 'strategies'],
  },
  {
    text: 'She teaches digital marketing to the next generation — making SEO, social media, and paid campaigns accessible to curious young minds worldwide.',
    em: ['SEO', 'social media', 'paid campaigns'],
  },
]

const SKILLS = ['SEO', 'SEM', 'PPC', 'Google Analytics', 'Content Marketing', 'Email Marketing', 'E-commerce', 'Amazon Ads', 'Digital Strategy', 'Campaign Management']

function StatCounter({ value, suffix, label, index, inView }) {
  const count = useMotionValue(0)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(count, value, {
      duration: 1.8,
      delay: index * 0.18,
      ease: EXPO,
    })
    const unsub = count.on('change', v => setDisplay(Math.round(v)))
    return () => { controls.stop(); unsub() }
  }, [inView, value, index, count])

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.18, duration: 0.8, ease: EXPO }}
      style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', lineHeight: 1 }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(3.2rem, 5.5vw, 6.2rem)',
          fontWeight: 500,
          color: 'var(--cream)',
          letterSpacing: '-0.05em',
          lineHeight: 0.9,
        }}>
          {display}
        </span>
        <span style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(1.5rem, 2.6vw, 3rem)',
          fontWeight: 300,
          fontStyle: 'italic',
          color: 'var(--accent)',
          lineHeight: 1,
          marginTop: '0.1em',
        }}>
          {suffix}
        </span>
      </div>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ delay: index * 0.18 + 0.4, duration: 0.8, ease: EXPO }}
        style={{ height: 1, background: 'linear-gradient(90deg, var(--accent-soft), transparent)', transformOrigin: 'left', width: '100%' }}
      />

      <p className="label" style={{ fontSize: 'clamp(8px, 0.7vw, 10px)' }}>
        {label}
      </p>
    </motion.div>
  )
}

function TextFragment({ fragment, index }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { margin: '-10%', once: true })
  const words  = fragment.text.split(' ')

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.12, duration: 0.9, ease: EXPO }}
      style={{ marginBottom: '1.8em' }}
    >
      <p style={{
        fontSize: 'clamp(1rem, 1.5vw, 1.45rem)',
        fontWeight: 300,
        lineHeight: 1.6,
        color: 'var(--cream-55)',
        letterSpacing: '0.005em',
      }}>
        {words.map((word, wi) => {
          const stripped = word.replace(/[—,.'s]/, '')
          const isEm = fragment.em.some(e => e.toLowerCase().split(' ').includes(stripped.toLowerCase()))
          return (
            <span key={wi}>
              <span style={{ color: isEm ? 'var(--cream)' : 'inherit', fontWeight: isEm ? 400 : 300 }}>{word}</span>
              {wi < words.length - 1 ? ' ' : ''}
            </span>
          )
        })}
      </p>
    </motion.div>
  )
}

function PhotoPortrait({ src, alt }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-5%' })
  const [loaded, setLoaded] = useState(false)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.98 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 1.1, ease: EXPO }}
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%', height: '100%',
        borderRadius: 'clamp(14px, 1.5vw, 22px)',
        border: '1px solid var(--hairline)',
        background: 'var(--surface)',
      }}
    >
      {/* Bottom scrim */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'linear-gradient(to bottom, transparent 60%, rgba(12,10,9,0.55) 100%)',
        pointerEvents: 'none',
      }} />
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        style={{
          width: '100%', height: '100%',
          objectFit: 'cover',
          objectPosition: 'center top',
          display: 'block',
          filter: loaded ? 'brightness(0.9) saturate(0.92)' : 'none',
          transition: 'filter 0.8s ease, opacity 0.6s ease',
          opacity: loaded ? 1 : 0,
        }}
      />
      {!loaded && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'var(--surface-2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span className="label" style={{ color: 'var(--cream-35)' }}>Loading</span>
        </div>
      )}
    </motion.div>
  )
}

export default function AboutSection() {
  const ref         = useRef(null)
  const statsRef    = useRef(null)
  const statsInView = useInView(statsRef, { once: true, margin: '-10%' })
  const { isMobile } = useBreakpoint()

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const photoY = useTransform(scrollYProgress, [0, 1], ['-4%', '4%'])

  const content = (
    <div style={{ paddingTop: isMobile ? '2vh' : '4vh' }}>
      {FRAGMENTS.map((frag, i) => (
        <TextFragment key={i} fragment={frag} index={i} />
      ))}

      {/* Stats */}
      <div ref={statsRef} style={{
        display: 'flex',
        gap: 'clamp(32px, 6vw, 72px)',
        marginTop: '3em', marginBottom: '3em',
        paddingTop: '2.5em',
        borderTop: '1px solid var(--hairline)',
        flexWrap: 'wrap',
      }}>
        {STATS.map(({ value, suffix, label }, i) => (
          <StatCounter key={i} value={value} suffix={suffix} label={label} index={i} inView={statsInView} />
        ))}
      </div>

      {/* Skills */}
      <FadeUp delay={0.2} style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: '3em' }}>
        {SKILLS.map(skill => (
          <span
            key={skill}
            className="label"
            style={{
              fontSize: 9,
              color: 'var(--cream-55)',
              border: '1px solid var(--hairline)',
              padding: '10px 16px', borderRadius: 99,
              transition: 'all 0.3s ease',
              cursor: 'default',
            }}
            onMouseEnter={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.color = 'var(--accent)' }}
            onMouseLeave={e => { e.target.style.borderColor = 'rgba(225,224,204,0.14)'; e.target.style.color = 'rgba(225,224,204,0.55)' }}
          >
            {skill}
          </span>
        ))}
      </FadeUp>

      {/* Pull quote */}
      <motion.blockquote
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ delay: 0.2, duration: 0.9, ease: EXPO }}
        style={{ borderLeft: '1px solid var(--accent)', paddingLeft: 'clamp(16px, 2vw, 28px)' }}
      >
        <p style={{
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          fontSize: 'clamp(1.15rem, 1.9vw, 1.9rem)',
          fontWeight: 300,
          color: 'var(--cream)',
          lineHeight: 1.5,
        }}>
          "I don't just run campaigns — I build growth engines. Every decision
          is backed by data, every strategy built to last."
        </p>
      </motion.blockquote>
    </div>
  )

  const photos = (
    <div style={{
      position: isMobile ? 'relative' : 'sticky',
      top: isMobile ? 'auto' : '12vh',
    }}>
      <motion.div style={{ y: isMobile ? 0 : photoY, aspectRatio: '3/4' }}>
        <PhotoPortrait
          src="/images/sujitha-work.jpg"
          alt="Sujitha M working at her laptop by a window"
        />
      </motion.div>
    </div>
  )

  return (
    <section id="about" ref={ref} className="section" style={{ padding: '12vh 0' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 clamp(16px, 5vw, 80px)' }}>

        {/* Header */}
        <div style={{ marginBottom: '7vh' }}>
          <FadeUp>
            <p className="label" style={{ color: 'var(--accent)', marginBottom: 16 }}>
              The Influencer
            </p>
          </FadeUp>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.6rem, 7.5vw, 7.5rem)',
            fontWeight: 500,
            letterSpacing: '-0.05em',
            color: 'var(--cream)',
            lineHeight: 0.92,
            margin: 0,
          }}>
            <WordsPullUp text="About" />
          </h2>
        </div>

        <div className="hr-line" style={{ marginBottom: '7vh' }} />

        {isMobile ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(32px, 6vw, 60px)' }}>
            {content}
            {photos}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 'clamp(32px, 5vw, 80px)', alignItems: 'start' }}>
            {photos}
            {content}
          </div>
        )}
      </div>
    </section>
  )
}
