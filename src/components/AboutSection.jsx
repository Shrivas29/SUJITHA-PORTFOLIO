import { useRef, useState, useEffect } from 'react'
import { motion, useInView, useScroll, useTransform, useMotionValue, animate } from 'framer-motion'
import { useBreakpoint } from '../hooks/useBreakpoint'

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

function StatCounter({ value, suffix, label, index, inView }) {
  const count = useMotionValue(0)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(count, value, {
      duration: 1.8,
      delay: index * 0.18,
      ease: [0.16, 1, 0.3, 1],
    })
    const unsub = count.on('change', v => setDisplay(Math.round(v)))
    return () => { controls.stop(); unsub() }
  }, [inView, value, index, count])

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.18, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
    >
      {/* Number */}
      <div style={{ display: 'flex', alignItems: 'flex-start', lineHeight: 1 }}>
        <span style={{
          fontFamily: '"Cormorant Garamond", serif',
          fontSize: 'clamp(3.5rem, 6vw, 7rem)',
          fontWeight: 300,
          color: '#B5294E',
          letterSpacing: '-0.03em',
          lineHeight: 0.9,
          fontStyle: 'italic',
        }}>
          {display}
        </span>
        <span style={{
          fontFamily: '"Cormorant Garamond", serif',
          fontSize: 'clamp(1.6rem, 2.8vw, 3.2rem)',
          fontWeight: 300,
          color: '#B5294E',
          lineHeight: 1,
          marginTop: '0.15em',
          fontStyle: 'italic',
        }}>
          {suffix}
        </span>
      </div>

      {/* Accent rule */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ delay: index * 0.18 + 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ height: 1, background: 'linear-gradient(90deg, #B5294E, transparent)', transformOrigin: 'left', width: '100%', opacity: 0.5 }}
      />

      {/* Label */}
      <p style={{
        fontFamily: 'Syncopate, sans-serif',
        fontSize: 'clamp(7px, 0.7vw, 9px)',
        letterSpacing: '0.25em',
        color: '#5C3D3D',
        textTransform: 'uppercase',
        fontWeight: 400,
      }}>
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
      transition={{ delay: index * 0.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      style={{ marginBottom: '2em' }}
    >
      <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(1rem, 1.8vw, 2rem)', fontWeight: 300, lineHeight: 1.6, color: '#5C3D3D', letterSpacing: '0.01em' }}>
        {words.map((word, wi) => {
          const stripped = word.replace(/[—,.'s]/, '')
          const isEm = fragment.em.some(e => e.toLowerCase().split(' ').includes(stripped.toLowerCase()))
          return (
            <span key={wi}>
              <span style={{ color: isEm ? '#1A1218' : 'inherit' }}>{word}</span>
              {wi < words.length - 1 ? ' ' : ''}
            </span>
          )
        })}
      </p>
    </motion.div>
  )
}

function PhotoPortrait({ src, alt, delay = 0 }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-5%' })
  const [loaded, setLoaded] = useState(false)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: 'relative', overflow: 'hidden', width: '100%' }}
    >
      {/* Earthy colour tint frame */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'linear-gradient(to bottom, transparent 55%, rgba(250,247,242,0.85) 100%)',
        pointerEvents: 'none',
      }} />
      {/* Subtle side vignette */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'linear-gradient(to right, rgba(250,247,242,0.3) 0%, transparent 20%, transparent 80%, rgba(250,247,242,0.3) 100%)',
        pointerEvents: 'none',
      }} />
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center top',
          display: 'block',
          filter: loaded ? 'sepia(15%) contrast(1.05) brightness(0.92)' : 'none',
          transition: 'filter 0.8s ease, opacity 0.6s ease',
          opacity: loaded ? 1 : 0,
        }}
      />
      {/* Placeholder while loading */}
      {!loaded && (
        <div style={{
          position: 'absolute', inset: 0,
          background: '#F0EAE1',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontFamily: 'Syncopate, sans-serif', fontSize: 9, letterSpacing: '0.2em', color: '#DDD0C8', textTransform: 'uppercase' }}>
            Loading
          </span>
        </div>
      )}
    </motion.div>
  )
}

export default function AboutSection() {
  const ref         = useRef(null)
  const statsRef    = useRef(null)
  const statsInView = useInView(statsRef, { once: true, margin: '-10%' })
  const headerRef   = useRef(null)
  const headerView  = useInView(headerRef, { once: true, margin: '-5%' })
  const { isMobile } = useBreakpoint()

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const photoY  = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])
  const photo2Y = useTransform(scrollYProgress, [0, 1], ['4%', '-4%'])

  const content = (
    <div style={{ paddingTop: isMobile ? '2vh' : '4vh' }}>
      {FRAGMENTS.map((frag, i) => (
        <TextFragment key={i} fragment={frag} index={i} />
      ))}

      {/* Stats */}
      <div ref={statsRef} style={{ display: 'flex', gap: 'clamp(32px, 6vw, 72px)', marginTop: '3em', marginBottom: '3em', paddingTop: '2em', borderTop: '1px solid #DDD0C8', flexWrap: 'wrap' }}>
        {STATS.map(({ value, suffix, label }, i) => (
          <StatCounter key={i} value={value} suffix={suffix} label={label} index={i} inView={statsInView} />
        ))}
      </div>

      {/* Skills */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ delay: 0.3, duration: 0.8 }}
        style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: '3em' }}
      >
        {['SEO', 'SEM', 'PPC', 'Google Analytics', 'Content Marketing', 'Email Marketing', 'E-commerce', 'Amazon Ads', 'Digital Strategy', 'Campaign Management'].map(skill => (
          <span
            key={skill}
            style={{
              fontFamily: 'Syncopate, sans-serif',
              fontSize: 8, letterSpacing: '0.15em',
              color: '#5C3D3D', textTransform: 'uppercase',
              border: '1px solid #DDD0C8',
              padding: '8px 14px', borderRadius: 1,
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => { e.target.style.borderColor = '#B5294E'; e.target.style.color = '#B5294E' }}
            onMouseLeave={e => { e.target.style.borderColor = '#DDD0C8'; e.target.style.color = '#5C3D3D' }}
          >
            {skill}
          </span>
        ))}
      </motion.div>

      {/* Pull quote */}
      <motion.blockquote
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ delay: 0.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{ borderLeft: '1px solid #B5294E', paddingLeft: 'clamp(16px, 2vw, 28px)' }}
      >
        <p style={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', fontSize: 'clamp(1.1rem, 2vw, 2.2rem)', fontWeight: 300, color: '#1A1218', lineHeight: 1.5 }}>
          "I don't just run campaigns — I build growth engines. Every decision is backed by data, every strategy built to last."
        </p>
      </motion.blockquote>
    </div>
  )

  const photos = (
    <div style={{
      position: isMobile ? 'relative' : 'sticky',
      top: isMobile ? 'auto' : '10vh',
    }}>
      <motion.div style={{ y: isMobile ? 0 : photoY, aspectRatio: '3/4' }}>
        <PhotoPortrait
          src="/images/sujitha-work.jpg"
          alt="Sujitha M working at her laptop by a window"
          delay={0}
        />
      </motion.div>
    </div>
  )

  return (
    <section id="about" ref={ref} className="section" style={{ padding: '12vh 0' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 clamp(16px, 5vw, 80px)' }}>

        {/* Header */}
        <div ref={headerRef} style={{ marginBottom: '8vh' }}>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={headerView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            style={{ fontFamily: 'Syncopate, sans-serif', fontSize: 9, letterSpacing: '0.3em', color: '#B5294E', textTransform: 'uppercase', marginBottom: 12 }}
          >
            The Influencer
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={headerView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(2.5rem, 6vw, 7rem)', fontWeight: 300, color: '#1A1218', letterSpacing: '-0.02em', lineHeight: 0.9 }}
          >
            About
          </motion.h2>
        </div>

        <div className="hr-gold" style={{ marginBottom: '8vh' }} />

        {isMobile ? (
          /* Mobile: content first, photos below */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(32px, 6vw, 60px)' }}>
            {content}
            {photos}
          </div>
        ) : (
          /* Desktop/Tablet: side-by-side */
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 'clamp(32px, 5vw, 80px)', alignItems: 'start' }}>
            {photos}
            {content}
          </div>
        )}
      </div>
    </section>
  )
}
