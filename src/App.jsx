import { useState, useEffect, useRef } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { useBreakpoint } from './hooks/useBreakpoint'

import Cursor           from './components/Cursor'
import Preloader        from './components/Preloader'
import DottedSurface    from './components/DottedSurface'
import Navigation       from './components/Navigation'
import HeroSection      from './components/HeroSection'
import ManifestoSection from './components/ManifestoSection'
import CoursesSection   from './components/CoursesSection'
import AboutSection     from './components/AboutSection'
import ContactSection   from './components/ContactSection'
import CoursePage       from './pages/CoursePage'

export default function App() {
  const [loading, setLoading] = useState(true)
  const mainRef  = useRef(null)
  const { isMobile } = useBreakpoint()

  // Fade particles as user scrolls deep into content
  const { scrollYProgress } = useScroll()
  const particleOpacity = useTransform(scrollYProgress, [0, 0.15, 0.75, 0.9], [1, 0.25, 0.1, 0.3])
  const [pOpacity, setPOpacity] = useState(1)
  useEffect(() => particleOpacity.on('change', v => setPOpacity(v)), [particleOpacity])

  const hr = (
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformOrigin: 'left' }}
      className="hr-gold"
    />
  )

  const HomePage = (
    <>
      {/* Film grain overlay */}
      <div className="grain-overlay" aria-hidden="true" />
      {!isMobile && <Cursor />}
      {!loading && <DottedSurface opacity={pOpacity} />}

      <AnimatePresence mode="wait">
        {loading ? (
          <Preloader key="preloader" onComplete={() => setLoading(false)} />
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            ref={mainRef}
            style={{ position: 'relative', zIndex: 1 }}
          >
            <Navigation />
            <main>
              <HeroSection />
              {hr}
              <ManifestoSection />
              {hr}
              <CoursesSection />
              {hr}
              <AboutSection />
              {hr}
              <ContactSection />
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )

  return (
    <Routes>
      <Route path="/" element={HomePage} />
      <Route path="/courses/:id" element={<CoursePage />} />
    </Routes>
  )
}
