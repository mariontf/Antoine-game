'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import { Image, Vote, Gift } from 'lucide-react'

const DEADLINE = new Date('2026-06-30T23:59:59')

function useCountdown() {
  const [t, setT] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  useEffect(() => {
    function tick() {
      const diff = DEADLINE.getTime() - Date.now()
      if (diff <= 0) return
      setT({ days: Math.floor(diff / 86400000), hours: Math.floor((diff / 3600000) % 24), minutes: Math.floor((diff / 60000) % 60), seconds: Math.floor((diff / 1000) % 60) })
    }
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id)
  }, [])
  return t
}

function FlipNum({ value }: { value: number }) {
  const d = String(value).padStart(2, '0')
  return (
    <div className="relative w-14 h-14 sm:w-16 sm:h-16 overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div key={d}
          initial={{ y: -28, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 28, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="absolute inset-0 rounded-xl flex items-center justify-center text-xl sm:text-2xl font-black tabular-nums"
          style={{ background: '#EFF6FF', border: '1px solid #CBD5E1', color: '#0F172A' }}
        >{d}</motion.div>
      </AnimatePresence>
    </div>
  )
}

function CountBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <FlipNum value={value} />
      <span className="text-[9px] uppercase tracking-[0.16em] font-bold" style={{ color: '#CBD5E1' }}>{label}</span>
    </div>
  )
}

function LightBlobs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(2,100,144,0.05) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(20,48,85,0.04) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />
    </div>
  )
}

const bullets = [
  { icon: Image,  text: 'Proposez votre logo',               iconColor: '#2563EB', bg: '#EFF6FF' },
  { icon: Vote,   text: 'Votez pour votre favori',            iconColor: '#0F172A', bg: '#EFF6FF' },
  { icon: Gift,   text: 'Gagnez une bouteille de champagne',  iconColor: '#F59E0B', bg: '#FAF7F3' },
]


export default function HeroSection() {
  const { days, hours, minutes, seconds } = useCountdown()
  const mouseX = useMotionValue(0); const mouseY = useMotionValue(0)
  const sx = useSpring(mouseX, { stiffness: 35, damping: 22 })
  const sy = useSpring(mouseY, { stiffness: 35, damping: 22 })
  const ref = useRef<HTMLElement>(null)

  const stagger = {
    c: { initial: {}, animate: { transition: { staggerChildren: 0.1 } } },
    i: { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } } },
  }

  return (
    <section ref={ref}
      onMouseMove={e => { const r = ref.current?.getBoundingClientRect(); if (!r) return; mouseX.set(((e.clientX - r.left) / r.width - 0.5) * 8); mouseY.set(((e.clientY - r.top) / r.height - 0.5) * 5) }}
      onMouseLeave={() => { mouseX.set(0); mouseY.set(0) }}
      className="relative overflow-hidden"
      style={{ background: '#FFFFFF' }}
    >
      <LightBlobs />

      {/* ── Bloc 1 : Concours ── */}
      <div className="min-h-dvh flex flex-col items-center justify-center px-6 py-20 text-center relative z-10">
        <motion.div style={{ x: sx, y: sy }} className="max-w-xl w-full">
          <motion.div variants={stagger.c} initial="initial" animate="animate" className="flex flex-col items-center">

            {/* Titre */}
            <motion.div variants={stagger.i} className="mb-5">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight text-slate-900">
                Concours<br />
                Créez l&apos;identité de{' '}
                <span className="gradient-text">Sildia</span>
              </h1>
            </motion.div>

            {/* Sous-titre */}
            <motion.p variants={stagger.i} className="text-base sm:text-lg mb-8 max-w-sm mx-auto leading-relaxed" style={{ color: '#64748B' }}>
              Participez au concours de logo de notre nouvelle plateforme IA.
            </motion.p>

            {/* Bullets */}
            <motion.div variants={stagger.i} className="flex flex-col items-center gap-3 mb-10">
              {bullets.map((b, i) => (
                <motion.div key={b.text}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + i * 0.12, ease: 'easeOut' }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: b.bg }}>
                    <b.icon size={15} style={{ color: b.iconColor }} />
                  </div>
                  <span className="text-sm font-semibold" style={{ color: '#0F172A' }}>{b.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Countdown */}
            <motion.div variants={stagger.i}>
              <p className="text-[10px] uppercase tracking-[0.22em] mb-4 font-bold" style={{ color: '#CBD5E1' }}>Temps restant</p>
              <div className="flex items-start justify-center gap-2.5 sm:gap-4">
                <CountBlock value={days} label="jours" />
                <span className="text-xl font-black mt-3" style={{ color: '#CBD5E1' }}>:</span>
                <CountBlock value={hours} label="heures" />
                <span className="text-xl font-black mt-3" style={{ color: '#CBD5E1' }}>:</span>
                <CountBlock value={minutes} label="min" />
                <span className="text-xl font-black mt-3" style={{ color: '#CBD5E1' }}>:</span>
                <CountBlock value={seconds} label="sec" />
              </div>
            </motion.div>

          </motion.div>
        </motion.div>

        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
        >
          <span className="text-[10px] uppercase tracking-[0.22em] font-semibold" style={{ color: '#CBD5E1' }}>Scroll</span>
          <motion.div className="w-px h-7 bg-gradient-to-b from-slate-300 to-transparent"
            animate={{ scaleY: [0.3, 1, 0.3] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }} />
        </motion.div>
      </div>

      {/* ── Bloc 2 : Qu'est-ce que Sildia ? ── */}
      <div className="px-6 py-20 sm:py-28 flex flex-col items-center text-center relative z-10" style={{ borderTop: '1px solid #EFF6FF' }}>
        <motion.div className="max-w-xl w-full"
          initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight mb-5 text-slate-900">
            Qu&apos;est-ce que{' '}
            <span className="gradient-text">Sildia</span>{' '}?
          </h2>

          <p className="text-base sm:text-lg leading-relaxed mb-10 max-w-md mx-auto" style={{ color: '#64748B' }}>
            Sildia est notre plateforme interne de génération de présentations par l&apos;IA.
          </p>

          <div className="flex flex-col gap-8 w-full max-w-lg mx-auto text-left">
            {[
              { title: 'Analyse instantanée',   desc: "L'IA lit vos documents et génère le brief : contexte, acteurs, livrables, KPIs.", color: '#2563EB' },
              { title: 'Brief vivant',           desc: "Chaque section s'affine à la demande, à partir des documents que vous choisissez.", color: '#7C3AED' },
              { title: 'Slides à la charte',     desc: 'Vos templates par client, des présentations PowerPoint générées en un clic.', color: '#06B6D4' },
            ].map((item, i) => (
              <motion.div key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.45, delay: i * 0.14, ease: [0.22, 1, 0.36, 1] }}
              >
                <h3 className="text-xl sm:text-2xl font-black mb-2" style={{ color: item.color }}>{item.title}</h3>
                <p className="text-slate-500 text-base leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

    </section>
  )
}
