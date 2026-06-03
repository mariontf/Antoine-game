'use client'

import { motion } from 'framer-motion'
import { Trophy, Medal } from 'lucide-react'
import { Logo } from '@/lib/supabase'

type Props = { logos: Logo[] }

const medals = [
  { color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200', icon: Trophy, label: '1er',  barH: 96 },
  { color: 'text-slate-500', bg: 'bg-slate-50',  border: 'border-slate-200', icon: Medal,  label: '2ème', barH: 64 },
  { color: 'text-orange-400', bg: 'bg-orange-50', border: 'border-orange-200', icon: Medal, label: '3ème', barH: 48 },
]

const podiumOrder = [1, 0, 2] // 2ème – 1er – 3ème

export default function Leaderboard({ logos }: Props) {
  const sorted = [...logos].sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
  const top3 = sorted.slice(0, 3)
  const rest = sorted.slice(3)

  if (logos.length === 0) {
    return (
      <div className="text-center py-10">
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>
          <Trophy size={40} className="text-slate-300 mx-auto mb-3" />
        </motion.div>
        <p className="text-slate-400 text-sm">Les scores s&apos;afficheront ici dès les premiers votes.</p>
      </div>
    )
  }

  return (
    <div>
      {top3.length > 0 && (
        <div>
          {/* Podium visuel */}
          {top3.length >= 2 && (
            <div className="flex items-end justify-center gap-3 mb-8">
              {podiumOrder.map((rankIdx) => {
                const logo = top3[rankIdx]
                const m = medals[rankIdx]
                if (!logo) return null
                return (
                  <motion.div
                    key={logo.id}
                    className="flex flex-col items-center gap-2"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: rankIdx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={logo.image_url} alt={logo.author_name}
                      className="w-10 h-10 rounded-xl object-contain bg-white border border-slate-100 shadow-sm" />
                    <motion.div
                      className={`w-20 sm:w-24 rounded-t-xl border ${m.border} flex items-start justify-center pt-2`}
                      style={{ backgroundColor: m.bg.replace('bg-', '') }}
                      initial={{ height: 0 }}
                      animate={{ height: m.barH }}
                      transition={{ duration: 0.5, delay: rankIdx * 0.08 + 0.15, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <span className={`text-xs font-black ${m.color}`}>{rankIdx + 1}</span>
                    </motion.div>
                  </motion.div>
                )
              })}
            </div>
          )}

          {/* Cards détail */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {top3.map((logo, idx) => {
              const m = medals[idx]
              return (
                <motion.div key={logo.id}
                  className={`card rounded-2xl p-4 border-2 ${m.border}`}
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  whileHover={{ y: -3, transition: { duration: 0.18 } }}
                >
                  <div className="flex items-start gap-4">
                    {/* Logo + slogan */}
                    <div className="shrink-0">
                      <div className="w-28 h-28 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={logo.image_url} alt={logo.author_name} className="w-full h-full object-contain" />
                      </div>
                      {logo.slogan && (
                        <p className="text-slate-400 text-xs mt-1.5 italic leading-tight w-28 line-clamp-2">&ldquo;{logo.slogan}&rdquo;</p>
                      )}
                    </div>

                    {/* Rank + nom + pts */}
                    <div className="flex-1 min-w-0 pt-1">
                      <p className={`text-sm font-bold leading-none mb-2 ${m.color}`}>{m.label}</p>
                      <p className="text-slate-900 font-bold text-base truncate">{logo.author_name}</p>
                      <motion.p
                        key={logo.score}
                        className="text-slate-300 text-sm font-semibold mt-1"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
                      >
                        {logo.score ?? 0} pts
                      </motion.p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {rest.length > 0 && (
        <div className="space-y-2">
          {rest.map((logo, idx) => (
            <motion.div key={logo.id}
              className="card flex items-center gap-3 rounded-xl px-4 py-3"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.04 }}
            >
              <span className="text-slate-300 text-sm font-mono w-6 shrink-0 font-bold">#{idx + 4}</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logo.image_url} alt={logo.author_name} className="w-10 h-10 rounded-lg object-contain bg-slate-50 border border-slate-100 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-slate-900 text-sm font-semibold truncate">{logo.author_name}</p>
                {logo.slogan && <p className="text-slate-400 text-xs truncate italic">{logo.slogan}</p>}
              </div>
              <motion.span key={logo.score}
                className="text-slate-500 text-sm font-bold shrink-0"
                initial={{ color: '#2563EB' }} animate={{ color: '#64748B' }} transition={{ duration: 0.5 }}
              >
                {logo.score ?? 0} pts
              </motion.span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
