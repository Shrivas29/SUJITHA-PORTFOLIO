import { useState, useRef } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useBreakpoint } from './hooks/useBreakpoint'

import Cursor           from './components/Cursor'
import Preloader        from './components/Preloader'
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

  const HomePage = (
    <>
      <div className="grain-overlay" aria-hidden="true" />

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
              <ManifestoSection />
              <div className="hr-line" />
              <CoursesSection />
              <div className="hr-line" />
              <AboutSection />
              <ContactSection />
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )

  return (
    <>
      {!isMobile && <Cursor />}
      <Routes>
        <Route path="/" element={HomePage} />
        <Route path="/courses/:id" element={<CoursePage />} />
      </Routes>
    </>
  )
}
