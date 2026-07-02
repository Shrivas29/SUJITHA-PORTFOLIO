import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { WordsPullUp, EXPO } from './motion/Primitives'

const NAV_ITEMS = [
  { id: 'hero',      label: 'Home' },
  { id: 'manifesto', label: 'Manifesto' },
  { id: 'courses',   label: 'Courses' },
  { id: 'about',     label: 'About' },
  { id: 'contact',   label: 'Contact' },
]

// Set to a video URL to switch the hero back to a video background.
const VIDEO_SRC = null

export default function HeroSection() {
  const [hoveredNav, setHoveredNav] = useState(null)
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section id="hero" className="h-screen w-full" style={{ padding: 'var(--frame-gap)' }}>
      <div className="relative h-full w-full overflow-hidden rounded-2xl md:rounded-[2rem]">

        {/* Background — her photo with a slow cinematic zoom (or video when VIDEO_SRC is set) */}
        {VIDEO_SRC ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="/images/sujitha-work.jpg"
            className="absolute inset-0 h-full w-full object-cover"
            src={VIDEO_SRC}
          />
        ) : (
          <motion.img
            src="/images/sujitha-work.jpg"
            alt=""
            initial={{ scale: 1.02 }}
            animate={{ scale: 1.14 }}
            transition={{ duration: 34, ease: 'linear', repeat: Infinity, repeatType: 'reverse' }}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: 'center 30%', filter: 'brightness(0.78) saturate(0.92)', willChange: 'transform' }}
          />
        )}

        {/* Noise overlay */}
        <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.7] mix-blend-overlay" />

        {/* Gradient overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

        {/* Navbar — attached to top of frame, liquid hover highlight */}
        <nav className="absolute left-1/2 top-0 z-20 w-max -translate-x-1/2" aria-label="Site sections">
          <div
            className="flex items-center rounded-b-2xl bg-black/90 px-3 py-1.5 backdrop-blur-md md:rounded-b-3xl md:px-6 md:py-2"
            onMouseLeave={() => setHoveredNav(null)}
          >
            {NAV_ITEMS.map(({ id, label }) => {
              const isLit = hoveredNav === id
              return (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={(e) => { e.preventDefault(); scrollTo(id) }}
                  onMouseEnter={() => setHoveredNav(id)}
                  className="relative whitespace-nowrap rounded-full px-3 py-2 text-[10px] sm:text-xs md:px-6 md:text-sm"
                  style={{
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    letterSpacing: '0.01em',
                    outline: 'none',
                  }}
                >
                  {isLit && (
                    <motion.span
                      layoutId="hero-nav-liquid"
                      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: 999,
                        background: '#E1E0CC',
                      }}
                    />
                  )}
                  <span style={{
                    position: 'relative',
                    zIndex: 1,
                    color: isLit ? '#0C0A09' : 'rgba(225, 224, 204, 0.75)',
                    transition: 'color 0.25s ease',
                  }}>
                    {label}
                  </span>
                </a>
              )
            })}
          </div>
        </nav>

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-2 sm:px-6 md:px-10">
          <div className="grid grid-cols-12 items-end gap-4">

            <div className="col-span-12 lg:col-span-8">
              <h1
                className="font-medium leading-[0.85] tracking-[-0.07em] text-[26vw] sm:text-[24vw] md:text-[22vw] lg:text-[20vw] xl:text-[19vw] 2xl:text-[20vw]"
                style={{ color: '#E1E0CC', fontFamily: 'var(--font-display)' }}
              >
                <WordsPullUp text="Sujitha" showAsterisk />
              </h1>
            </div>

            <div className="col-span-12 flex flex-col gap-5 pb-6 lg:col-span-4 lg:pb-10">

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: EXPO }}
                className="text-xs text-primary/70 sm:text-sm md:text-base"
                style={{ lineHeight: 1.2 }}
              >
                Sujitha M is a digital marketing influencer and mentor —
                turning data into growth for brands and teaching the next
                generation to do the same, one campaign, one story and one
                curious young mind at a time.
              </motion.p>

              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7, ease: EXPO }}
                onClick={() => scrollTo('courses')}
                data-cursor="Courses"
                className="group inline-flex items-center gap-2 self-start rounded-full bg-primary py-1 pl-5 pr-1 text-sm font-medium text-black transition-all hover:gap-3 sm:text-base"
                style={{ cursor: 'pointer', minHeight: 44 }}
              >
                Explore the courses
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black transition-transform group-hover:scale-110 sm:h-10 sm:w-10">
                  <ArrowRight className="h-4 w-4" style={{ color: '#E1E0CC' }} />
                </span>
              </motion.button>

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
