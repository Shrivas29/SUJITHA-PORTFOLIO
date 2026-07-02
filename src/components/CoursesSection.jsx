import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { COURSES } from '../data/courses'
import { useBreakpoint } from '../hooks/useBreakpoint'
import { WordsPullUp, FadeUp, ArrowIcon, EXPO } from './motion/Primitives'

function CourseCard({ course, index }) {
  const [hovered, setHovered] = useState(false)
  const ref    = useRef(null)
  const inView = useInView(ref, { margin: '-5%', once: true })
  const navigate = useNavigate()

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: (index % 3) * 0.1, duration: 0.9, ease: EXPO }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/courses/${course.id}`)}
      data-cursor="Explore"
      style={{
        position: 'relative',
        aspectRatio: '4/3',
        border: '1px solid var(--hairline)',
        borderRadius: 'clamp(14px, 1.5vw, 22px)',
        overflow: 'hidden',
        cursor: 'pointer',
        background: 'var(--surface)',
      }}
    >
      {/* Hover flood — solid cream, editorial invert */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0, y: hovered ? '0%' : '100%' }}
        transition={{ duration: 0.55, ease: EXPO }}
        style={{ position: 'absolute', inset: 0, background: 'var(--cream)', zIndex: 1 }}
      />

      {/* Content */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, padding: 'clamp(18px, 2.5vw, 32px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        {/* Number + age badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <span className="label" style={{
            fontSize: 'clamp(9px, 0.8vw, 11px)',
            letterSpacing: '0.12em',
            color: hovered ? 'rgba(12,10,9,0.55)' : 'var(--cream-35)',
            transition: 'color 0.4s ease',
          }}>
            ({course.number})
          </span>
          <motion.span
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : -8 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="label"
            style={{
              fontSize: 9,
              color: 'rgba(12,10,9,0.8)',
              border: '1px solid rgba(12,10,9,0.35)',
              padding: '5px 12px', borderRadius: 99,
            }}
          >
            Ages {course.age}
          </motion.span>
        </div>

        <div>
          {/* Description on hover */}
          <AnimatePresence>
            {hovered && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, delay: 0.08 }}
                style={{
                  fontSize: 'clamp(12px, 1vw, 14px)',
                  color: 'rgba(12,10,9,0.72)',
                  lineHeight: 1.55, marginBottom: '1.2em',
                  fontWeight: 400, maxWidth: '90%',
                }}
              >
                {course.description.slice(0, 110)}…
              </motion.p>
            )}
          </AnimatePresence>

          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.3rem, 2.3vw, 2.6rem)',
            fontWeight: 500,
            letterSpacing: '-0.035em',
            color: hovered ? '#0C0A09' : 'var(--cream)',
            lineHeight: 1.05,
            transition: 'color 0.4s ease',
          }}>
            {course.title}
          </h3>

          {/* Meta */}
          <div style={{ display: 'flex', gap: 14, marginTop: '0.8em', alignItems: 'center' }}>
            <span className="label" style={{
              fontSize: 'clamp(9px, 0.75vw, 11px)',
              letterSpacing: '0.1em',
              whiteSpace: 'nowrap',
              color: hovered ? 'rgba(12,10,9,0.65)' : 'var(--cream-55)',
              transition: 'color 0.4s ease',
            }}>
              {course.duration}
            </span>
            <span style={{ width: 1, height: 11, background: hovered ? 'rgba(12,10,9,0.3)' : 'rgba(225,224,204,0.25)', flexShrink: 0, transition: 'background 0.4s ease' }} />
            <span className="label" style={{
              fontSize: 'clamp(9px, 0.75vw, 11px)',
              letterSpacing: '0.1em',
              whiteSpace: 'nowrap',
              color: hovered ? 'rgba(12,10,9,0.5)' : 'var(--cream-35)',
              transition: 'color 0.4s ease',
            }}>
              Online · Live
            </span>
          </div>
        </div>
      </div>

      {/* Arrow circle on hover */}
      <motion.div
        animate={{
          opacity: hovered ? 1 : 0,
          scale: hovered ? 1 : 0.6,
        }}
        transition={{ duration: 0.3, delay: 0.06, ease: EXPO }}
        style={{
          position: 'absolute',
          top: 'clamp(14px, 2vw, 26px)', right: 'clamp(14px, 2vw, 26px)',
          zIndex: 3,
          width: 42, height: 42, borderRadius: '50%',
          background: '#0C0A09',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <ArrowIcon size={16} direction="up-right" />
      </motion.div>
    </motion.div>
  )
}

export default function CoursesSection() {
  const headerRef = useRef(null)
  const inView    = useInView(headerRef, { once: true, margin: '-5%' })
  const { isMobile, isTablet } = useBreakpoint()

  return (
    <section id="courses" className="section" style={{ padding: '12vh 0' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 clamp(16px, 5vw, 80px)' }}>

        {/* Header */}
        <div ref={headerRef} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '7vh', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="label"
              style={{ color: 'var(--accent)', marginBottom: 16 }}
            >
              Online courses · Ages 10+
            </motion.p>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.6rem, 7.5vw, 7.5rem)',
              fontWeight: 500,
              letterSpacing: '-0.05em',
              color: 'var(--cream)',
              lineHeight: 0.92,
              margin: 0,
            }}>
              <WordsPullUp text="The Courses" />
            </h2>
          </div>
          {!isMobile && (
            <FadeUp delay={0.3} style={{ textAlign: 'right', paddingBottom: 8 }}>
              <p style={{ fontSize: 'clamp(12px, 1vw, 14px)', color: 'var(--cream-55)', lineHeight: 1.7, fontWeight: 300 }}>
                Digital skills for curious minds.<br />
                Click any course to explore.
              </p>
            </FadeUp>
          )}
        </div>

        <div className="hr-line" style={{ marginBottom: '7vh' }} />

        {/* Grid */}
        {isMobile ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {COURSES.map((c, i) => <CourseCard key={c.id} course={c} index={i} />)}
          </div>
        ) : isTablet ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {COURSES.map((c, i) => <CourseCard key={c.id} course={c} index={i} />)}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
            <div style={{ gridColumn: 'span 3' }}><CourseCard course={COURSES[0]} index={0} /></div>
            <div style={{ gridColumn: 'span 3' }}><CourseCard course={COURSES[1]} index={1} /></div>
            <div style={{ gridColumn: 'span 2' }}><CourseCard course={COURSES[2]} index={2} /></div>
            <div style={{ gridColumn: 'span 2' }}><CourseCard course={COURSES[3]} index={3} /></div>
            <div style={{ gridColumn: 'span 2' }}><CourseCard course={COURSES[4]} index={4} /></div>
          </div>
        )}
      </div>
    </section>
  )
}
