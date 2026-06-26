import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { COURSES } from '../data/courses'
import { useBreakpoint } from '../hooks/useBreakpoint'

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
      transition={{ delay: (index % 3) * 0.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/courses/${course.id}`)}
      data-cursor="Explore"
      style={{
        position: 'relative',
        aspectRatio: '4/3',
        border: '1px solid #DDD0C8',
        overflow: 'hidden',
        cursor: 'pointer',
        background: '#EDE5DA',
      }}
    >
      {/* Hover colour overlay */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0, y: hovered ? '0%' : '100%' }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: 'absolute', inset: 0, background: course.color, zIndex: 1 }}
      />

      {/* Subtle bg texture */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        background: `radial-gradient(ellipse 60% 60% at ${30 + index * 12}% ${40 + index * 7}%, rgba(181,41,78,0.05) 0%, transparent 70%)`,
      }} />

      {/* Content */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, padding: 'clamp(16px, 2.5vw, 32px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        {/* Number + age badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <span style={{ fontFamily: 'Syncopate, sans-serif', fontSize: 'clamp(8px, 0.8vw, 10px)', letterSpacing: '0.2em', color: hovered ? 'rgba(250,247,242,0.5)' : '#5C3D3D', transition: 'color 0.4s ease' }}>
            {course.number}
          </span>
          <motion.span
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : -8 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            style={{ fontFamily: 'Syncopate, sans-serif', fontSize: 8, letterSpacing: '0.15em', color: 'rgba(250,247,242,0.7)', textTransform: 'uppercase', border: '1px solid rgba(250,247,242,0.25)', padding: '4px 10px', borderRadius: 99 }}
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
                style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 'clamp(12px, 1vw, 14px)', color: 'rgba(237,227,213,0.75)', lineHeight: 1.6, marginBottom: '1.2em', fontWeight: 300, maxWidth: '88%' }}
              >
                {course.description.slice(0, 110)}…
              </motion.p>
            )}
          </AnimatePresence>

          <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(1.4rem, 2.6vw, 3.2rem)', fontWeight: 300, color: hovered ? '#FAF7F2' : '#1A1218', lineHeight: 1.05, letterSpacing: '-0.01em', transition: 'color 0.4s ease' }}>
            {course.title}
          </h3>

          {/* Meta */}
          <div style={{ display: 'flex', gap: '1.5em', marginTop: '0.6em', alignItems: 'center' }}>
            <span style={{ fontFamily: 'Syncopate, sans-serif', fontSize: 'clamp(7px, 0.7vw, 9px)', letterSpacing: '0.2em', color: hovered ? 'rgba(237,227,213,0.6)' : '#5C3D3D', textTransform: 'uppercase', transition: 'color 0.4s ease' }}>
              {course.duration}
            </span>
            <span style={{ width: 1, height: 10, background: hovered ? 'rgba(237,227,213,0.3)' : '#DDD0C8', transition: 'background 0.4s ease' }} />
            <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 'clamp(10px, 0.9vw, 12px)', color: hovered ? 'rgba(237,227,213,0.5)' : '#5C3D3D', transition: 'color 0.4s ease' }}>
              Online · Live
            </span>
          </div>
        </div>
      </div>

      {/* Arrow on hover */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -8 }}
        transition={{ duration: 0.28, delay: 0.06 }}
        style={{ position: 'absolute', top: 'clamp(16px,2.5vw,32px)', right: 'clamp(16px,2.5vw,32px)', zIndex: 3 }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M7 17L17 7M17 7H7M17 7V17" stroke="rgba(237,227,213,0.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.div>
    </motion.div>
  )
}

export default function CoursesSection() {
  const headerRef = useRef(null)
  const inView    = useInView(headerRef, { once: true, margin: '-5%' })
  const { isMobile, isTablet } = useBreakpoint()

  return (
    <section id="works" className="section" style={{ padding: '12vh 0' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 clamp(16px, 5vw, 80px)' }}>

        {/* Header */}
        <div ref={headerRef} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '6vh', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              style={{ fontFamily: 'Syncopate, sans-serif', fontSize: 9, letterSpacing: '0.3em', color: '#B5294E', textTransform: 'uppercase', marginBottom: 12 }}
            >
              Online Courses · Ages 10+
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(2.5rem, 6vw, 7rem)', fontWeight: 300, color: '#1A1218', letterSpacing: '-0.02em', lineHeight: 0.9 }}
            >
              The Courses
            </motion.h2>
          </div>
          {!isMobile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.3, duration: 0.8 }}
              style={{ textAlign: 'right' }}
            >
              <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 'clamp(11px, 1vw, 13px)', color: '#5C3D3D', lineHeight: 1.7, fontWeight: 300 }}>
                Digital skills for curious minds.<br />
                Click any course to explore.
              </p>
            </motion.div>
          )}
        </div>

        <div className="hr-gold" style={{ marginBottom: '6vh' }} />

        {/* Grid */}
        {isMobile ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {COURSES.map((c, i) => <CourseCard key={c.id} course={c} index={i} />)}
          </div>
        ) : isTablet ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            {COURSES.map((c, i) => <CourseCard key={c.id} course={c} index={i} />)}
          </div>
        ) : (
          /* Desktop: 3-col asymmetric */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
            {/* Row 1: large + 2 small */}
            <div style={{ gridColumn: '1', gridRow: '1', aspectRatio: '3/4' }}>
              <CourseCard course={COURSES[0]} index={0} />
            </div>
            <div style={{ gridColumn: '2/4', gridRow: '1', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <CourseCard course={COURSES[1]} index={1} />
              <CourseCard course={COURSES[2]} index={2} />
            </div>
            {/* Row 2: 2 small + large */}
            <div style={{ gridColumn: '1/3', gridRow: '2', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <CourseCard course={COURSES[3]} index={3} />
              <CourseCard course={COURSES[4]} index={4} />
            </div>
          </div>
        )}

      </div>
    </section>
  )
}
