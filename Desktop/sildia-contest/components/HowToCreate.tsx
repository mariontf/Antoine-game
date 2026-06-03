'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Copy, Check, ChevronLeft, ChevronRight } from 'lucide-react'

const EXAMPLE_PROMPT = `Crée un logo minimaliste pour "Sildia", une plateforme IA de génération de slides professionnelles.
Style moderne, couleurs bleu et cyan, typographie épurée,
avec une icône évoquant les slides ou la présentation.
Fond transparent, format carré.`

const steps = [
  {
    num: '1',
    title: 'Ouvrez Gemini ou Nano Banana',
    desc: <>Rendez-vous sur <a href="https://gemini.google.com" target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline" style={{ color: '#2563EB' }}>gemini.google.com</a> ou utilisez Nano Banana dans Gemini pour la génération d&apos;images.</>,
    color: '#2563EB',
  },
  {
    num: '2',
    title: 'Décrivez votre logo',
    desc: "Copiez et adaptez le prompt d'exemple ci-dessous, ou créez le vôtre pour exprimer votre vision.",
    color: '#7C3AED',
  },
  {
    num: '3',
    title: 'Téléchargez votre création',
    desc: 'Exportez votre logo en PNG ou SVG, fond transparent. Taille recommandée : 512×512px.',
    color: '#06B6D4',
  },
]

const rules = [
  { num: '01', title: 'Nommez la marque',      desc: 'Incluez toujours "Sildia" dans le prompt. L\'IA s\'en servira pour orienter le style lettering.' },
  { num: '02', title: "Décrivez l'univers",    desc: '"Plateforme IA de génération de slides, B2B, conseil, professionnel" — plus le contexte est riche, plus le résultat est pertinent.' },
  { num: '03', title: 'Ciblez un style visuel', desc: 'Minimaliste, géométrique, typographique… Évitez les descriptions vagues comme "beau" ou "moderne".' },
  { num: '04', title: 'Imposez les couleurs',  desc: 'Donnez des couleurs précises : "bleu marine #0F2240 et cyan #06B6D4". L\'IA suit bien les codes hex.' },
  { num: '05', title: 'Précisez le format',    desc: '"Fond transparent, format carré 512×512px, sans texte autour du logo" — évite les mauvaises surprises à l\'export.' },
]

function RulesCarousel() {
  const [current, setCurrent] = useState(0)
  const [dir, setDir] = useState(1)

  function go(next: number) {
    setDir(next > current ? 1 : -1)
    setCurrent(next)
  }
  function prev() { if (current > 0) go(current - 1) }
  function next() { if (current < rules.length - 1) go(current + 1) }

  const rule = rules[current]

  return (
    <div>
      <div className="relative overflow-hidden" style={{ minHeight: 180 }}>
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={current}
            custom={dir}
            variants={{
              enter: (d: number) => ({ x: d * 60, opacity: 0 }),
              center: { x: 0, opacity: 1 },
              exit: (d: number) => ({ x: d * -60, opacity: 0 }),
            }}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="card rounded-2xl p-7 text-left"
          >
            <span className="text-xs font-black text-blue-600 uppercase tracking-[0.18em] mb-3 block">{rule.num}</span>
            <h4 className="text-lg sm:text-xl font-black text-blue-600 mb-3 leading-tight">{rule.title}</h4>
            <p className="text-slate-900 text-sm sm:text-base leading-relaxed">{rule.desc}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={prev} disabled={current === 0}
          className="w-10 h-10 rounded-full flex items-center justify-center border border-slate-200 text-slate-400 hover:text-slate-700 hover:border-slate-300 disabled:opacity-25 disabled:cursor-not-allowed transition-all cursor-pointer touch-manipulation"
          aria-label="Précédent"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Dots */}
        <div className="flex items-center gap-2">
          {rules.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className={`rounded-full transition-all cursor-pointer ${i === current ? 'w-5 h-2 bg-blue-600' : 'w-2 h-2 bg-slate-200 hover:bg-slate-300'}`}
              aria-label={`Règle ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={next} disabled={current === rules.length - 1}
          className="w-10 h-10 rounded-full flex items-center justify-center border border-slate-200 text-slate-400 hover:text-slate-700 hover:border-slate-300 disabled:opacity-25 disabled:cursor-not-allowed transition-all cursor-pointer touch-manipulation"
          aria-label="Suivant"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}

export default function HowToCreate() {
  const [copied, setCopied] = useState(false)

  function copyPrompt() {
    navigator.clipboard.writeText(EXAMPLE_PROMPT)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-3xl mx-auto">

      {/* ── Titre ── */}
      <motion.div className="text-center mb-10"
        initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
          Générer votre logo avec <span className="gradient-text">l&apos;IA</span>
        </h2>
        <p className="text-slate-500 text-sm sm:text-base">Pas d&apos;expérience en design ? Pas de problème.</p>
      </motion.div>

      {/* ── Étapes ── */}
      <div className="relative space-y-4 mb-10">
        <motion.div
          className="absolute left-5 top-10 bottom-10 w-0.5 bg-gradient-to-b from-blue-300 via-purple-300 to-cyan-300 hidden sm:block"
          initial={{ scaleY: 0, originY: 0 }} whileInView={{ scaleY: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
        />
        {steps.map((s, i) => (
          <motion.div key={s.num}
            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ x: 5, transition: { duration: 0.18 } }}
            className="card rounded-2xl p-5 flex gap-4"
          >
            <motion.div
              className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-black z-10"
              style={{ background: `linear-gradient(135deg, ${s.color}, ${s.color}cc)` }}
              initial={{ scale: 0, rotate: -90 }} whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 300, damping: 16, delay: i * 0.12 + 0.1 }}
            >
              {s.num}
            </motion.div>
            <div>
              <h3 className="text-slate-900 font-bold text-sm sm:text-base mb-1">{s.title}</h3>
              <div className="text-slate-500 text-sm leading-relaxed">{s.desc}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Prompt exemple ── */}
      <motion.div className="card rounded-2xl p-5 mb-12"
        initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Prompt exemple</span>
          <button onClick={copyPrompt}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 transition-colors cursor-pointer touch-manipulation font-medium"
          >
            <motion.div animate={copied ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.2 }}>
              {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
            </motion.div>
            {copied ? 'Copié !' : 'Copier'}
          </button>
        </div>
        <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{EXAMPLE_PROMPT}</p>
      </motion.div>

      {/* ── Carousel règles ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="text-center mb-6">
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-1">5 règles pour un prompt réussi</h3>
          <p className="text-slate-400 text-sm">Ce qui fait vraiment la différence</p>
        </div>
        <RulesCarousel />
      </motion.div>

    </div>
  )
}
