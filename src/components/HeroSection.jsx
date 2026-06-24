import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useBreakpoint } from '../hooks/useBreakpoint'

const NAME = 'SUJITHA'

const SPARKLES = [
  { id: 1,  top: '-22%', left:  '1%',  size: 20, delay: 1.4, dur: 2.8 },
  { id: 2,  top: '-26%', left: '20%',  size: 13, delay: 1.9, dur: 3.4 },
  { id: 3,  top: '-18%', left: '47%',  size: 18, delay: 1.6, dur: 2.5 },
  { id: 4,  top: '-24%', left: '73%',  size: 11, delay: 2.2, dur: 3.1 },
  { id: 5,  top: '-14%', left: '97%',  size: 22, delay: 1.3, dur: 2.9 },
  { id: 6,  top:  '28%', left: '-5%',  size: 10, delay: 2.5, dur: 3.6 },
  { id: 7,  top:  '18%', left: '102%', size: 16, delay: 1.7, dur: 2.7 },
  { id: 8,  top:  '88%', left:  '6%',  size: 12, delay: 2.0, dur: 3.2 },
  { id: 9,  top:  '92%', left: '54%',  size: 9,  delay: 1.5, dur: 2.6 },
  { id: 10, top:  '82%', left: '93%',  size: 15, delay: 2.3, dur: 3.0 },
  { id: 11, top:  '-8%', left: '35%',  size: 8,  delay: 2.7, dur: 2.4 },
  { id: 12, top:  '55%', left: '-3%',  size: 11, delay: 1.8, dur: 3.3 },
]

function SparkleIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0 C12 0 13.2 8.8 14.8 10.2 C16.4 11.6 24 12 24 12 C24 12 16.4 12.4 14.8 13.8 C13.2 15.2 12 24 12 24 C12 24 10.8 15.2 9.2 13.8 C7.6 12.4 0 12 0 12 C0 12 7.6 11.6 9.2 10.2 C10.8 8.8 12 0 12 0 Z" />
    </svg>
  )
}

export default function HeroSection() {
  const ref = useRef(null)
  const { isMobile } = useBreakpoint()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  const nameY     = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const subtitleY = useTransform(scrollYProgress, [0, 1], ['0%', '40%'])
  const opacity   = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const letterVariants = {
    hidden:  { y: 120, opacity: 0, rotateX: -60 },
    visible: (i) => ({
      y: 0, opacity: 1, rotateX: 0,
      transition: { delay: 0.05 + i * 0.07, duration: 1.1, ease: [0.16, 1, 0.3, 1] }
    })
  }

  const metaVariants = {
    hidden:  { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { delay: 0.9, duration: 0.9, ease: [0.16, 1, 0.3, 1] } }
  }

  const sparkleColors = ['#B5294E', '#D4547A', '#9B6E8B']

  return (
    <section
      id="hero"
      ref={ref}
      className="section"
      style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative' }}
    >
      {/* Soft vignette */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 30%, rgba(250,247,242,0.8) 100%)'
      }} />

      {/* Name + sparkles */}
      <motion.div
        style={{ y: nameY, opacity, position: 'relative', zIndex: 2, perspective: '1000px' }}
        initial="hidden"
        animate="visible"
      >
        <div style={{ position: 'relative' }}>
          {/* Letters */}
          <div style={{ display: 'flex', overflow: 'visible', gap: 'clamp(2px, 0.8vw, 14px)', lineHeight: 1, alignItems: 'baseline' }}>
            {NAME.split('').map((letter, i) => (
              <motion.span
                key={i}
                custom={i}
                variants={letterVariants}
                style={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontSize: 'clamp(4.5rem, 14vw, 16rem)',
                  fontWeight: 700,
                  color: '#1A1218',
                  display: 'inline-block',
                  lineHeight: 0.88,
                  letterSpacing: '-0.02em',
                  willChange: 'transform',
                }}
              >
                {letter}
              </motion.span>
            ))}
          </div>

          {/* Sparkles */}
          {SPARKLES.map(({ id, top, left, size, delay, dur }) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, scale: 0, rotate: 0 }}
              animate={{
                opacity: [0, 1, 0.7, 1, 0],
                scale:   [0, 1.1, 0.8, 1.3, 0],
                rotate:  [0, 20, -15, 25, 0],
              }}
              transition={{
                delay,
                duration: dur,
                repeat: Infinity,
                repeatDelay: 0.8 + (id % 3) * 0.4,
                ease: 'easeInOut',
              }}
              style={{
                position: 'absolute',
                top, left,
                color: sparkleColors[id % 3],
                pointerEvents: 'none',
                zIndex: 4,
                filter: 'drop-shadow(0 0 4px currentColor)',
              }}
            >
              <SparkleIcon size={size} />
            </motion.div>
          ))}
        </div>

        {/* Accent rule below name */}
        <motion.div
          variants={metaVariants}
          style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.18em' }}
        >
          <div className="hr-gold" style={{ width: '38%' }} />
        </motion.div>
      </motion.div>

      {/* Subtitle */}
      <motion.div
        style={{ y: subtitleY, opacity, position: 'relative', zIndex: 2, marginTop: '2.5vh', textAlign: 'center' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <p style={{
          fontFamily: 'Syncopate, sans-serif',
          fontSize: 'clamp(8px, 1.6vw, 12px)',
          letterSpacing: isMobile ? '0.18em' : '0.35em',
          color: '#8B6F6F',
          textTransform: 'uppercase',
          lineHeight: isMobile ? 2 : 1,
        }}>
          {isMobile ? (
            <>Digital Marketing Influencer<br />Growth Marketer<br />Data-Driven Thinker</>
          ) : (
            <>Digital Marketing Influencer&nbsp;&nbsp;·&nbsp;&nbsp;Growth Marketer&nbsp;&nbsp;·&nbsp;&nbsp;Data-Driven Thinker</>
          )}
        </p>
      </motion.div>

      {/* Stick figure scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        style={{
          position: 'absolute', bottom: '5%', left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        }}
      >
        {/* Running track */}
        <div style={{ width: 90, height: 52, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div
            animate={{ x: [-32, 32, -32], scaleX: [1, 1, -1, -1, 1] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: [0.45, 0, 0.55, 1], times: [0, 0.5, 0.5, 1, 1] }}
          >
            <svg
              viewBox="0 0 30 52"
              width="22"
              height="44"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              stroke="#B5294E"
              strokeWidth="2.2"
              style={{ overflow: 'visible' }}
            >
              {/* Head */}
              <circle cx="15" cy="5" r="4" />
              {/* Body */}
              <line x1="15" y1="9" x2="15" y2="27" />
              {/* Left arm */}
              <line x1="15" y1="15" x2="6" y2="23"
                style={{ transformBox: 'view-box', transformOrigin: '15px 15px', animation: 'sArmL 0.38s ease-in-out infinite alternate' }} />
              {/* Right arm */}
              <line x1="15" y1="15" x2="24" y2="23"
                style={{ transformBox: 'view-box', transformOrigin: '15px 15px', animation: 'sArmR 0.38s ease-in-out infinite alternate', animationDelay: '0.19s' }} />
              {/* Left leg */}
              <line x1="15" y1="27" x2="8" y2="43"
                style={{ transformBox: 'view-box', transformOrigin: '15px 27px', animation: 'sLegL 0.38s ease-in-out infinite alternate' }} />
              {/* Right leg */}
              <line x1="15" y1="27" x2="22" y2="43"
                style={{ transformBox: 'view-box', transformOrigin: '15px 27px', animation: 'sLegR 0.38s ease-in-out infinite alternate', animationDelay: '0.19s' }} />
            </svg>
          </motion.div>
        </div>

        {/* Bouncing arrow */}
        <motion.svg
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
          width="14" height="16" viewBox="0 0 14 16"
          fill="none" stroke="#8B6F6F" strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="M7 1 L7 12 M3 9 L7 13 L11 9" />
        </motion.svg>

        <style>{`
          @keyframes sArmL { from { transform: rotate(-32deg); } to { transform: rotate(28deg); } }
          @keyframes sArmR { from { transform: rotate(28deg);  } to { transform: rotate(-32deg); } }
          @keyframes sLegL { from { transform: rotate(-32deg); } to { transform: rotate(28deg); } }
          @keyframes sLegR { from { transform: rotate(28deg);  } to { transform: rotate(-32deg); } }
        `}</style>
      </motion.div>

      {/* Corner tag — desktop only */}
      {!isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          style={{
            position: 'absolute', bottom: '8%', right: '5%', zIndex: 2,
            fontFamily: 'Syncopate, sans-serif', fontSize: 8,
            letterSpacing: '0.2em', color: '#DDD0C8', textTransform: 'uppercase',
            writingMode: 'vertical-rl',
          }}
        >
          Portfolio 2024
        </motion.div>
      )}
    </section>
  )
}
