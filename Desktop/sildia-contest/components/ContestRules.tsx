'use client'

import { motion } from 'framer-motion'

const steps = [
  { num: '01', title: "Créez votre logo avec l'IA",   desc: 'Utilisez Gemini, Nano Banana ou votre outil favori pour générer un logo original pour Sildia.', numColor: '#2563EB', bar: '#2563EB' },
  { num: '02', title: 'Déposez avant le 30 juin',      desc: 'Uploadez votre logo (PNG ou SVG) avec un slogan optionnel. Un seul dépôt par personne.',          numColor: '#06B6D4', bar: '#06B6D4' },
  { num: '03', title: 'Votez pour vos favoris',        desc: 'Classez vos 3 logos préférés dans l\'ordre. 1er choix = 3pts, 2ème = 2pts, 3ème = 1pt. Le total désigne le gagnant.',             numColor: '#7C3AED', bar: '#7C3AED' },
  { num: '04', title: 'Gagnez le champagne 🍾',        desc: "Le logo le mieux classé par l'ensemble des consultants repart avec une bouteille de champagne !",  numColor: '#F59E0B', bar: '#F59E0B' },
]

function Step({ s, index }: { s: typeof steps[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: false, amount: 0.5 }}
      transition={{ duration: 0.5, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      className="relative pl-8 sm:pl-12"
    >
      <motion.div
        className="absolute left-0 top-0 w-[3px] rounded-full"
        style={{ backgroundColor: s.bar }}
        whileInView={{ height: ['16px', '100%'] }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      />

      <motion.span className="block text-xs font-black uppercase tracking-[0.2em] mb-2"
        style={{ color: s.numColor }}>
        Étape {s.num}
      </motion.span>

      <motion.h3
        className="font-black tracking-tight leading-none mb-3 cursor-default"
        whileInView={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#0F172A' }}
        viewport={{ once: false, amount: 0.5 }}
        initial={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: '#CBD5E1' }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {s.title}
      </motion.h3>

      <motion.p
        className="text-base sm:text-lg leading-relaxed text-slate-500"
        initial={{ opacity: 0, height: 0 }}
        whileInView={{ opacity: 1, height: 'auto' }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        {s.desc}
      </motion.p>
    </motion.div>
  )
}

export default function ContestRules() {
  return (
    <div className="max-w-3xl mx-auto px-4">
      <motion.div className="text-center mb-16"
        initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-2 text-slate-900">Comment ça marche ?</h2>
        <p className="text-slate-500">Scrollez pour découvrir chaque étape</p>
      </motion.div>

      <div className="space-y-14 sm:space-y-20">
        {steps.map((s, i) => <Step key={s.num} s={s} index={i} />)}
      </div>

      {/* Podium score Borda */}
      <motion.div
        className="mt-16"
        initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-[0.18em] mb-8">Système de vote</p>

        <div className="flex items-end justify-center gap-4">
          {/* 2ème */}
          <motion.div className="flex flex-col items-center gap-3"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="text-center">
              <div className="text-2xl font-black text-slate-400">2</div>
              <div className="text-xs text-slate-400 font-semibold">pts</div>
            </div>
            <div className="w-20 sm:w-24 text-center">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">2ème</div>
              <motion.div
                className="rounded-t-2xl bg-slate-100 border border-slate-200 flex items-end justify-center pb-3"
                style={{ height: 80 }}
                initial={{ scaleY: 0, originY: 1 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="text-slate-400 font-black text-sm">🥈</span>
              </motion.div>
            </div>
          </motion.div>

          {/* 1er */}
          <motion.div className="flex flex-col items-center gap-3"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0 }}
          >
            <div className="text-center">
              <div className="text-3xl font-black text-blue-600">3</div>
              <div className="text-xs text-blue-400 font-semibold">pts</div>
            </div>
            <div className="w-20 sm:w-24 text-center">
              <div className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-2">1er</div>
              <motion.div
                className="rounded-t-2xl flex items-end justify-center pb-3"
                style={{ height: 120, background: 'linear-gradient(180deg, #EFF6FF 0%, #DBEAFE 100%)', border: '1px solid #BFDBFE' }}
                initial={{ scaleY: 0, originY: 1 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.span
                  className="text-lg"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >🥇</motion.span>
              </motion.div>
            </div>
          </motion.div>

          {/* 3ème */}
          <motion.div className="flex flex-col items-center gap-3"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="text-center">
              <div className="text-xl font-black text-slate-300">1</div>
              <div className="text-xs text-slate-300 font-semibold">pt</div>
            </div>
            <div className="w-20 sm:w-24 text-center">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">3ème</div>
              <motion.div
                className="rounded-t-2xl bg-slate-50 border border-slate-100 flex items-end justify-center pb-3"
                style={{ height: 56 }}
                initial={{ scaleY: 0, originY: 1 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="text-slate-300 font-black text-sm">🥉</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.p
          className="text-center text-slate-400 text-xs mt-6"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ delay: 0.5 }}
        >
          Chaque consultant classe ses 3 logos favoris · Le plus haut score total gagne
        </motion.p>
      </motion.div>
    </div>
  )
}
