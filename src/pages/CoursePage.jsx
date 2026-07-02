import { useParams, useNavigate } from 'react-router-dom'
import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { COURSES } from '../data/courses'
import { useBreakpoint } from '../hooks/useBreakpoint'
import { WordsPullUp, EXPO } from '../components/motion/Primitives'

function TimelineNode({ module, index, accent }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-8%' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -32 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.12, duration: 0.8, ease: EXPO }}
      style={{ display: 'flex', gap: 'clamp(20px, 4vw, 48px)', alignItems: 'flex-start', position: 'relative' }}
    >
      {/* Node indicator */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, paddingTop: 6 }}>
        <motion.div
          animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ delay: index * 0.12 + 0.1, duration: 0.5, ease: EXPO }}
          style={{
            width: 42, height: 42, borderRadius: '50%',
            background: 'transparent',
            border: `1px solid ${accent}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            boxShadow: `0 0 32px ${accent}30`,
          }}
        >
          <span className="label" style={{ fontSize: 10, color: accent, letterSpacing: '0.05em' }}>
            {String(index + 1).padStart(2, '0')}
          </span>
        </motion.div>
        {index < 3 && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ delay: index * 0.12 + 0.3, duration: 0.6 }}
            style={{
              width: 1, height: 'clamp(60px, 8vw, 100px)',
              background: `linear-gradient(to bottom, ${accent}, transparent)`,
              transformOrigin: 'top',
              opacity: 0.35,
            }}
          />
        )}
      </div>

      {/* Content */}
      <div style={{ paddingBottom: index < 3 ? 'clamp(32px, 5vw, 60px)' : 0 }}>
        <p className="label" style={{ color: accent, marginBottom: 10 }}>
          {module.week}
        </p>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.3rem, 2.6vw, 2.3rem)',
          fontWeight: 500,
          letterSpacing: '-0.035em',
          color: 'var(--cream)',
          lineHeight: 1.1,
          marginBottom: 20,
        }}>
          {module.title}
        </h3>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {module.points.map((pt, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: index * 0.12 + 0.2 + i * 0.08, duration: 0.6 }}
              style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}
            >
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: accent, flexShrink: 0, marginTop: 9 }} />
              <span style={{ fontSize: 'clamp(14px, 1.2vw, 16px)', color: 'var(--cream-55)', lineHeight: 1.6, fontWeight: 300 }}>
                {pt}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

function ContactForm({ accent }) {
  const [form, setForm]       = useState({ name: '', email: '', message: '' })
  const [sent, setSent]       = useState(false)
  const [focused, setFocused] = useState(null)

  const inputStyle = (field) => ({
    width: '100%',
    background: 'transparent',
    border: 'none',
    borderBottom: `1px solid ${focused === field ? accent : 'rgba(225,224,204,0.2)'}`,
    padding: '12px 0',
    fontFamily: 'var(--font-body)',
    fontSize: 'clamp(14px, 1.2vw, 16px)',
    fontWeight: 300,
    color: 'var(--cream)',
    outline: 'none',
    transition: 'border-color 0.3s ease',
    cursor: 'text',
    borderRadius: 0,
  })

  const labelStyle = {
    display: 'block', marginBottom: 8,
    fontSize: 9,
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div style={{ maxWidth: 560 }}>
      {sent ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EXPO }}
          style={{
            padding: 'clamp(24px, 4vw, 48px)',
            border: `1px solid ${accent}55`,
            background: `${accent}0D`,
            borderRadius: 16,
          }}
        >
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.2rem, 2.5vw, 2rem)', fontStyle: 'italic', fontWeight: 300, color: 'var(--cream)', lineHeight: 1.5, marginBottom: 12 }}>
            "We'll be in touch soon."
          </p>
          <p className="label" style={{ color: accent }}>
            — Sujitha M
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div>
            <label htmlFor="cp-name" className="label" style={labelStyle}>Your Name</label>
            <input
              id="cp-name"
              required
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              onFocus={() => setFocused('name')}
              onBlur={() => setFocused(null)}
              placeholder="First name"
              style={inputStyle('name')}
            />
          </div>
          <div>
            <label htmlFor="cp-email" className="label" style={labelStyle}>Email Address</label>
            <input
              id="cp-email"
              required type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              onFocus={() => setFocused('email')}
              onBlur={() => setFocused(null)}
              placeholder="your@email.com"
              style={inputStyle('email')}
            />
          </div>
          <div>
            <label htmlFor="cp-message" className="label" style={labelStyle}>Message</label>
            <textarea
              id="cp-message"
              required
              rows={4}
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              onFocus={() => setFocused('message')}
              onBlur={() => setFocused(null)}
              placeholder="Tell us about your child, their age, and which course interests you…"
              style={{ ...inputStyle('message'), resize: 'none', lineHeight: 1.7 }}
            />
          </div>
          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            style={{
              background: 'var(--cream)',
              color: '#0C0A09',
              border: 'none',
              borderRadius: 999,
              padding: 'clamp(14px, 2vw, 17px) clamp(32px, 4vw, 48px)',
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(13px, 1vw, 15px)',
              fontWeight: 500,
              cursor: 'pointer',
              alignSelf: 'flex-start',
              transition: 'opacity 0.25s ease',
              minHeight: 48,
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = 0.85}
            onMouseLeave={e => e.currentTarget.style.opacity = 1}
          >
            Send message
          </motion.button>
        </form>
      )}
    </div>
  )
}

function ContactTile({ href, label, value, iconBg, icon, accent }) {
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: 'clamp(16px, 2vw, 24px)',
        border: '1px solid var(--hairline)',
        borderRadius: 16,
        background: 'var(--surface)',
        textDecoration: 'none',
        marginBottom: 12,
        transition: 'border-color 0.3s ease, background 0.3s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.background = 'var(--surface-2)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(225,224,204,0.14)'; e.currentTarget.style.background = '#151210' }}
    >
      <div style={{ width: 44, height: 44, borderRadius: '50%', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icon}
      </div>
      <div style={{ overflow: 'hidden' }}>
        <p className="label" style={{ fontSize: 8, marginBottom: 4 }}>{label}</p>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(13px, 1.3vw, 17px)',
          fontWeight: 400,
          color: 'var(--cream)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflowEllipsis: 'ellipsis', textOverflow: 'ellipsis',
        }}>{value}</p>
      </div>
      <svg style={{ marginLeft: 'auto', flexShrink: 0 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(225,224,204,0.55)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M7 17L17 7M17 7H7M17 7V17"/>
      </svg>
    </a>
  )
}

export default function CoursePage() {
  const { id }       = useParams()
  const navigate     = useNavigate()
  const { isMobile } = useBreakpoint()
  const course       = COURSES.find(c => c.id === id)

  // Always land at the top
  useEffect(() => { window.scrollTo(0, 0) }, [id])

  if (!course) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 500, color: 'var(--cream)' }}>Course not found.</p>
          <button onClick={() => navigate('/')} className="label" style={{ marginTop: 24, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}>
            ← Back Home
          </button>
        </div>
      </div>
    )
  }

  const accent = '#F04E23'

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* Fixed back nav */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: 'clamp(16px, 2.5vh, 24px) clamp(20px, 4vw, 48px)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'rgba(12,10,9,0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--hairline)',
      }}>
        <button
          onClick={() => navigate('/')}
          className="label"
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--cream-55)',
            transition: 'color 0.3s ease',
            minHeight: 44,
          }}
          onMouseEnter={e => e.currentTarget.style.color = accent}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(225,224,204,0.55)'}
        >
          <svg width="16" height="10" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 5H1M5 1L1 5L5 9"/>
          </svg>
          All Courses
        </button>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(13px, 1vw, 15px)', fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--cream)' }}>
          Sujitha M<span style={{ color: accent }}>*</span>
        </span>
      </div>

      {/* Hero */}
      <div style={{
        minHeight: '72vh',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: 'clamp(80px, 12vh, 120px) clamp(20px, 6vw, 96px) clamp(48px, 8vh, 80px)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Accent glow */}
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 80% 60% at 20% 85%, ${accent}1A 0%, transparent 60%)`, pointerEvents: 'none' }} />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="label"
          style={{ color: accent, marginBottom: 24 }}
        >
          Course {course.number} &nbsp;·&nbsp; Ages {course.age} &nbsp;·&nbsp; {course.duration}
        </motion.p>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.8rem, 9.5vw, 10.5rem)',
          fontWeight: 500,
          color: 'var(--cream)',
          lineHeight: 0.92,
          letterSpacing: '-0.055em',
          marginBottom: 'clamp(16px, 2.5vw, 32px)',
          margin: 0,
        }}>
          <WordsPullUp text={course.title} delay={0.1} />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.9, ease: EXPO }}
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic', fontWeight: 300,
            fontSize: 'clamp(1.05rem, 2.1vw, 2rem)',
            color: 'var(--cream-55)',
            maxWidth: 640, lineHeight: 1.5,
            marginTop: 'clamp(16px, 2.5vw, 32px)',
          }}
        >
          {course.tagline}
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 1, ease: EXPO }}
          style={{ height: 1, background: `linear-gradient(90deg, ${accent}, transparent)`, maxWidth: 360, marginTop: 40, transformOrigin: 'left', opacity: 0.6 }}
        />
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(20px, 6vw, 96px)' }}>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          style={{ paddingBottom: 'clamp(48px, 8vh, 96px)', borderBottom: '1px solid var(--hairline)', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 'clamp(24px, 5vw, 64px)', alignItems: 'center' }}
        >
          <p style={{ fontSize: 'clamp(15px, 1.3vw, 18px)', color: 'var(--cream-70)', lineHeight: 1.75, fontWeight: 300 }}>
            {course.description}
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[['Target Age', course.age], ['Duration', course.duration], ['Format', 'Online · Live']].map(([label, val]) => (
              <div key={label} style={{
                border: '1px solid var(--hairline)',
                borderRadius: 14,
                background: 'var(--surface)',
                padding: 'clamp(12px, 2vw, 20px) clamp(16px, 2.5vw, 28px)',
              }}>
                <p className="label" style={{ fontSize: 8, marginBottom: 6 }}>{label}</p>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1rem, 1.7vw, 1.5rem)', fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--cream)' }}>{val}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Timeline */}
        <div style={{ padding: 'clamp(48px, 8vh, 96px) 0' }}>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="label"
            style={{ color: accent, marginBottom: 16 }}
          >
            Curriculum
          </motion.p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5vw, 5rem)',
            fontWeight: 500,
            color: 'var(--cream)',
            letterSpacing: '-0.05em',
            lineHeight: 0.92,
            marginBottom: 'clamp(40px, 7vh, 72px)',
            marginTop: 0,
          }}>
            <WordsPullUp text="What you'll learn" />
          </h2>

          <div style={{ paddingLeft: isMobile ? 0 : 'clamp(0px, 2vw, 24px)' }}>
            {course.modules.map((mod, i) => (
              <TimelineNode key={i} module={mod} index={i} accent={accent} />
            ))}
          </div>
        </div>

        {/* Enrol section */}
        <div style={{ borderTop: '1px solid var(--hairline)', padding: 'clamp(48px, 8vh, 96px) 0 clamp(64px, 12vh, 120px)' }}>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="label"
            style={{ color: accent, marginBottom: 16 }}
          >
            Enrol now
          </motion.p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5vw, 5rem)',
            fontWeight: 500,
            color: 'var(--cream)',
            letterSpacing: '-0.05em',
            lineHeight: 0.92,
            marginBottom: 'clamp(32px, 5vh, 56px)',
            marginTop: 0,
          }}>
            <WordsPullUp text="Let's get started" />
          </h2>

          {/* Two-col: form + direct contact */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 'clamp(40px, 8vw, 96px)', alignItems: 'flex-start' }}>

            {/* Left: form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.8, ease: EXPO }}
            >
              <p style={{ fontSize: 'clamp(14px, 1.2vw, 16px)', color: 'var(--cream-55)', lineHeight: 1.7, marginBottom: 'clamp(24px, 4vh, 40px)', fontWeight: 300 }}>
                Interested in <em style={{ fontStyle: 'italic', fontFamily: 'var(--font-serif)', color: 'var(--cream)' }}>{course.title}</em>? Send a message and Sujitha will reply within 24 hours.
              </p>
              <ContactForm accent={accent} />
            </motion.div>

            {/* Right: direct contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.28, duration: 0.8, ease: EXPO }}
              style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(24px, 4vh, 40px)' }}
            >
              <div>
                <p className="label" style={{ marginBottom: 20 }}>
                  Or reach directly
                </p>

                <ContactTile
                  href="https://www.instagram.com/godigital8337/?hl=en"
                  label="Instagram"
                  value="@godigital8337"
                  accent={accent}
                  iconBg="linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)"
                  icon={
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  }
                />

                <ContactTile
                  href="https://wa.me/919791674104"
                  label="WhatsApp"
                  value="+91 97916 74104"
                  accent={accent}
                  iconBg="#25D366"
                  icon={
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  }
                />

                <ContactTile
                  href="mailto:sujitha.stackroute@gmail.com"
                  label="Email"
                  value="sujitha.stackroute@gmail.com"
                  accent={accent}
                  iconBg="var(--surface-2)"
                  icon={
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E1E0CC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  }
                />
              </div>

              <p style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(13px, 1.05vw, 15px)',
                color: 'var(--cream-55)',
                lineHeight: 1.7, fontWeight: 300, fontStyle: 'italic',
              }}>
                Sujitha personally responds to every inquiry within 24 hours.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
