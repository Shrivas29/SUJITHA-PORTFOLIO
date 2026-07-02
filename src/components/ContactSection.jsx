import { useState } from 'react'
import { motion } from 'framer-motion'
import { useBreakpoint } from '../hooks/useBreakpoint'
import { WordsPullUpMultiStyle, FadeUp, PillButton, ArrowIcon, EXPO } from './motion/Primitives'

const EMAIL = 'sujitha.stackroute@gmail.com'

const SOCIALS = [
  {
    label: 'Instagram',
    handle: '@godigital8337',
    href: 'https://www.instagram.com/godigital8337/?hl=en',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    handle: '+91 97916 74104',
    href: 'https://wa.me/919791674104',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    handle: 'Sujitha M',
    href: 'https://www.linkedin.com/in/sujitha-m-274537246/',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
]

const grotesk = {
  fontFamily: 'var(--font-display)',
  fontWeight: 500,
  letterSpacing: '-0.05em',
  color: 'var(--cream)',
}

const serifItalic = {
  fontFamily: 'var(--font-serif)',
  fontWeight: 300,
  fontStyle: 'italic',
  letterSpacing: '0',
  color: 'var(--accent)',
}

function EmailLink() {
  const [hovered, setHovered] = useState(false)

  return (
    <a
      href={`mailto:${EMAIL}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-cursor="Email"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: hovered ? 18 : 12,
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(1.15rem, 3vw, 2.8rem)',
        fontWeight: 400,
        letterSpacing: '-0.03em',
        color: hovered ? 'var(--accent)' : 'var(--cream)',
        textDecoration: 'none',
        transition: 'color 0.4s ease, gap 0.3s cubic-bezier(0.16,1,0.3,1)',
        cursor: 'none',
        wordBreak: 'break-all',
      }}
    >
      {EMAIL}
      <span style={{ flexShrink: 0, display: 'inline-flex' }}>
        <ArrowIcon size={22} direction="up-right" color={hovered ? 'var(--accent)' : 'var(--cream)'} />
      </span>
    </a>
  )
}

export default function ContactSection() {
  const { isMobile } = useBreakpoint()

  return (
    <section id="contact" className="section" style={{ padding: 'var(--frame-gap)', minHeight: '100svh' }}>
      <div style={{
        position: 'relative',
        minHeight: 'calc(100svh - var(--frame-gap) * 2)',
        borderRadius: 'var(--radius-frame)',
        background: 'var(--surface)',
        border: '1px solid var(--hairline)',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between',
        padding: isMobile
          ? 'clamp(48px, 10vh, 80px) clamp(20px, 5vw, 32px) clamp(20px, 4vh, 32px)'
          : 'clamp(64px, 12vh, 120px) clamp(32px, 4vw, 64px) clamp(24px, 4vh, 40px)',
      }}>

        {/* Ambient accent glow */}
        <div style={{
          position: 'absolute',
          bottom: '-20%', right: '-10%',
          width: '55%', aspectRatio: '1',
          background: 'radial-gradient(circle, rgba(240,78,35,0.1) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        <div>
          <FadeUp>
            <p className="label" style={{ color: 'var(--accent)', marginBottom: 'clamp(24px, 4vh, 48px)' }}>
              Get in touch
            </p>
          </FadeUp>

          {/* Massive headline */}
          <h2 style={{
            fontSize: isMobile ? 'clamp(2.6rem, 12.5vw, 4rem)' : 'clamp(3.4rem, 8.2vw, 9.5rem)',
            lineHeight: 0.98,
            margin: 0,
            marginBottom: 'clamp(32px, 6vh, 64px)',
            maxWidth: '11em',
          }}>
            <WordsPullUpMultiStyle
              stagger={0.07}
              style={{ justifyContent: 'flex-start' }}
              segments={[
                { text: "Let's make", style: grotesk },
                { text: 'something', style: serifItalic },
                { text: 'beautiful.', style: grotesk },
              ]}
            />
          </h2>

          {/* Email */}
          <FadeUp delay={0.35} style={{ marginBottom: 'clamp(28px, 5vh, 48px)' }}>
            <EmailLink />
          </FadeUp>

          {/* CTA pills */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <PillButton href="https://www.instagram.com/godigital8337/?hl=en" delay={0.45} cursorLabel="Instagram">
              Message on Instagram
            </PillButton>
            <PillButton href="https://wa.me/919791674104" delay={0.55} dark cursorLabel="WhatsApp">
              Chat on WhatsApp
            </PillButton>
          </div>
        </div>

        {/* Footer row */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 1, ease: EXPO }}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'flex-start' : 'flex-end',
            flexDirection: isMobile ? 'column' : 'row',
            gap: 20,
            borderTop: '1px solid var(--hairline)',
            paddingTop: 'clamp(20px, 3vh, 32px)',
            marginTop: 'clamp(40px, 8vh, 80px)',
          }}
        >
          {/* Socials */}
          <div style={{ display: 'flex', gap: 'clamp(16px, 2.5vw, 32px)', flexWrap: 'wrap' }}>
            {SOCIALS.map(({ label, handle, href, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${label}: ${handle}`}
                data-cursor={label}
                className="label"
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  color: 'var(--cream-55)', textDecoration: 'none',
                  fontSize: 9,
                  cursor: 'none',
                  transition: 'color 0.3s ease',
                  minHeight: 44,
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--cream)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(225,224,204,0.55)'}
              >
                {icon}
                <span>{handle}</span>
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="label" style={{ fontSize: 9, color: 'var(--cream-35)' }}>
            © 2026 Sujitha M — All rights reserved
          </p>
        </motion.div>
      </div>
    </section>
  )
}
