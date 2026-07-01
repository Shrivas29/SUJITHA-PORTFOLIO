import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function TunnelReveal({ children }) {
  const ref = useRef(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center 60%'],
  })

  const scale   = useTransform(scrollYProgress, [0, 1], [0.78, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.35, 1], [0, 0.6, 1])
  const blur    = useTransform(scrollYProgress, [0, 0.55, 1], [18, 4, 0])
  const filter  = useTransform(blur, v => `blur(${v}px)`)
  const rotateX = useTransform(scrollYProgress, [0, 1], [6, 0])

  return (
    <motion.div
      ref={ref}
      style={{
        scale,
        opacity,
        filter,
        rotateX,
        transformOrigin: 'center top',
        willChange: 'transform, opacity, filter',
      }}
    >
      {children}
    </motion.div>
  )
}
