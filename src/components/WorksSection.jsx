import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useBreakpoint } from '../hooks/useBreakpoint'

const WORKS = [
  {
    id: '01',
    title: 'E-Commerce Velocity',
    category: 'Growth Campaign',
    year: '2024',
    description: 'A full-funnel e-commerce growth strategy — combining SEO, email automation, and conversion optimisation to drive a 3x increase in qualified traffic.',
    color: 'linear-gradient(135deg, #B5294E 0%, #7A1030 100%)',
    size: 'large',
  },
  {
    id: '02',
    title: 'Search Dominance',
    category: 'SEO Strategy',
    year: '2024',
    description: 'End-to-end SEO transformation for a B2B brand — keyword architecture, content clusters, and technical fixes that moved 40+ pages to page one.',
    color: 'linear-gradient(135deg, #9B6E8B 0%, #6B3E6B 100%)',
    size: 'small',
  },
  {
    id: '03',
    title: 'Amazon Ascent',
    category: 'PPC Optimisation',
    year: '2023',
    description: 'Amazon PPC restructure that cut ACoS by 38% while scaling ad spend — built on granular keyword harvesting and bid automation.',
    color: 'linear-gradient(135deg, #C87060 0%, #8B4050 100%)',
    size: 'small',
  },
  {
    id: '04',
    title: 'Content Universe',
    category: 'Content Marketing',
    year: '2023',
    description: 'A pillar-and-cluster content strategy for a SaaS brand — 60+ articles mapped to buyer intent, driving a 5x increase in organic leads.',
    color: 'linear-gradient(135deg, #8B2950 0%, #5A1030 100%)',
    size: 'small',
  },
  {
    id: '05',
    title: 'Brand Amplifier',
    category: 'Digital Strategy',
    year: '2023',
    description: 'A 360° digital strategy overhaul — aligning SEO, paid, social, and email into a single cohesive growth engine for a D2C brand.',
    color: 'linear-gradient(135deg, #7A4E7A 0%, #4A2450 100%)',
    size: 'small',
  },
  {
    id: '06',
    title: 'Data Pulse',
    category: 'Analytics & Insights',
    year: '2022',
    description: 'Custom Google Analytics and Data Studio reporting framework — turning raw campaign data into clear business intelligence that guided quarterly strategy.',
    color: 'linear-gradient(135deg, #A05070 0%, #6B2045 100%)',
    size: 'large',
  },
]

function WorkCard({ work, index }) {
  const [hovered, setHovered] = useState(false)
  const ref    = useRef(null)
  const inView = useInView(ref, { margin: '-5%', once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: (index % 3) * 0.12, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-cursor="View"
      style={{
        position: 'relative',
        aspectRatio: work.size === 'large' ? '4/3' : '1/1',
        border: '1px solid #DDD0C8',
        overflow: 'hidden',
        cursor: 'none',
        background: '#EDE5DA',
      }}
    >
      {/* Hover color overlay */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0, y: hovered ? '0%' : '100%' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: 'absolute', inset: 0, background: work.color, zIndex: 1 }}
      />

      {/* Abstract background texture */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        background: `radial-gradient(ellipse 60% 60% at ${30 + index * 10}% ${40 + index * 8}%, rgba(196,98,45,0.06) 0%, transparent 70%)`,
      }} />

      {/* Content */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, padding: 'clamp(16px, 3vw, 32px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        {/* Number */}
        <span style={{
          fontFamily: 'Syncopate, sans-serif',
          fontSize: 'clamp(8px, 0.9vw, 11px)',
          letterSpacing: '0.2em',
          color: hovered ? 'rgba(250,247,242,0.5)' : '#5C3D3D',
          transition: 'color 0.4s ease',
        }}>
          {work.id}
        </span>

        <div>
          {/* Description on hover */}
          <AnimatePresence>
            {hovered && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                style={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontSize: 'clamp(12px, 1.1vw, 14px)',
                  color: 'rgba(237,227,213,0.75)',
                  lineHeight: 1.6,
                  marginBottom: '1.5em',
                  fontWeight: 300,
                  maxWidth: '90%',
                }}
              >
                {work.description}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Title */}
          <h3 style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: 'clamp(1.4rem, 3vw, 3.5rem)',
            fontWeight: 300,
            color: hovered ? '#FAF7F2' : '#1A1218',
            lineHeight: 1.05,
            letterSpacing: '-0.01em',
            transition: 'color 0.4s ease',
          }}>
            {work.title}
          </h3>

          {/* Meta row */}
          <div style={{ display: 'flex', gap: '1.5em', marginTop: '0.6em', alignItems: 'center' }}>
            <span style={{
              fontFamily: 'Syncopate, sans-serif',
              fontSize: 'clamp(7px, 0.75vw, 9px)',
              letterSpacing: '0.2em',
              color: hovered ? 'rgba(237,227,213,0.6)' : '#5C3D3D',
              textTransform: 'uppercase',
              transition: 'color 0.4s ease',
            }}>
              {work.category}
            </span>
            <span style={{ width: 1, height: 12, background: hovered ? 'rgba(237,227,213,0.3)' : '#DDD0C8', transition: 'background 0.4s ease' }} />
            <span style={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: 'clamp(10px, 0.9vw, 12px)',
              color: hovered ? 'rgba(237,227,213,0.5)' : '#5C3D3D',
              transition: 'color 0.4s ease',
            }}>
              {work.year}
            </span>
          </div>
        </div>
      </div>

      {/* Arrow icon on hover */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -8 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        style={{ position: 'absolute', top: 'clamp(16px,3vw,32px)', right: 'clamp(16px,3vw,32px)', zIndex: 3 }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M7 17L17 7M17 7H7M17 7V17" stroke="rgba(237,227,213,0.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.div>
    </motion.div>
  )
}

export default function WorksSection() {
  const headerRef = useRef(null)
  const inView    = useInView(headerRef, { once: true, margin: '-5%' })
  const { isMobile, isTablet } = useBreakpoint()

  return (
    <section id="works" className="section" style={{ padding: '12vh 0' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 clamp(16px, 5vw, 80px)' }}>

        {/* Section header */}
        <div ref={headerRef} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '6vh', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              style={{ fontFamily: 'Syncopate, sans-serif', fontSize: 9, letterSpacing: '0.3em', color: '#B5294E', textTransform: 'uppercase', marginBottom: 12 }}
            >
              Selected Works
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(2.5rem, 6vw, 7rem)', fontWeight: 300, color: '#1A1218', letterSpacing: '-0.02em', lineHeight: 0.9 }}
            >
              The Work
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
                SEO. PPC. Content.<br />
                Growth, by the numbers.
              </p>
            </motion.div>
          )}
        </div>

        <div className="hr-gold" style={{ marginBottom: '6vh' }} />

        {/* Works grid — responsive */}
        {isMobile ? (
          /* Mobile: single column */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {WORKS.map((work, i) => (
              <WorkCard key={work.id} work={{ ...work, size: 'large' }} index={i} />
            ))}
          </div>
        ) : isTablet ? (
          /* Tablet: 2-column grid */
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            {WORKS.map((work, i) => (
              <WorkCard key={work.id} work={{ ...work, size: 'small' }} index={i} />
            ))}
          </div>
        ) : (
          /* Desktop: asymmetric layout */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridAutoRows: 'auto', gap: 2 }}>
            <div style={{ gridColumn: '1', gridRow: '1' }}>
              <WorkCard work={WORKS[0]} index={0} />
            </div>
            <div style={{ gridColumn: '2 / 4', gridRow: '1', display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 2 }}>
              <WorkCard work={WORKS[1]} index={1} />
              <WorkCard work={WORKS[2]} index={2} />
              <WorkCard work={WORKS[3]} index={3} />
              <WorkCard work={WORKS[4]} index={4} />
            </div>
            <div style={{ gridColumn: '1 / 4', gridRow: '2', marginTop: 2 }}>
              <div style={{ maxWidth: '66.66%' }}>
                <WorkCard work={WORKS[5]} index={5} />
              </div>
            </div>
          </div>
        )}

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          style={{ marginTop: '6vh', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 16 }}
        >
          <span style={{ fontFamily: 'Syncopate, sans-serif', fontSize: 9, letterSpacing: '0.25em', color: '#5C3D3D', textTransform: 'uppercase' }}>
            View all works
          </span>
          <svg width="32" height="1" aria-hidden="true">
            <line x1="0" y1="0.5" x2="32" y2="0.5" stroke="#5C3D3D" strokeWidth="1"/>
          </svg>
        </motion.div>
      </div>
    </section>
  )
}
