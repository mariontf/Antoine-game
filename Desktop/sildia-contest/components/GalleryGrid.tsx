'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, CheckCircle, AlertCircle, X } from 'lucide-react'
import { Logo, supabase } from '@/lib/supabase'
import { useAuth } from './AuthProvider'
import { LoginForm, UserBadge } from './LoginGate'

type Props = { logos: Logo[]; onRefresh: () => void }

const rankColors = [
  { bg: 'bg-blue-600',   text: 'text-white', ring: 'ring-blue-400',   label: '1er'  },
  { bg: 'bg-violet-500', text: 'text-white', ring: 'ring-violet-400', label: '2ème' },
  { bg: 'bg-cyan-500',   text: 'text-white', ring: 'ring-cyan-400',   label: '3ème' },
]

export default function GalleryGrid({ logos, onRefresh }: Props) {
  const { user, loading } = useAuth()
  const [ranked, setRanked]   = useState<Logo[]>([])
  const [status, setStatus]   = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  function toggleRank(logo: Logo) {
    const idx = ranked.findIndex(r => r.id === logo.id)
    if (idx >= 0) setRanked(prev => prev.filter(r => r.id !== logo.id))
    else if (ranked.length < 3) setRanked(prev => [...prev, logo])
  }

  function rankOf(logo: Logo) { return ranked.findIndex(r => r.id === logo.id) }

  async function submitVote() {
    if (ranked.length !== 3 || !user) return
    setStatus('submitting'); setErrorMsg('')
    try {
      // Upsert : insert ou update si vote existant
      const { error } = await supabase.from('votes').upsert({
        user_id: user.id,
        voter_name: user.email ?? user.id,
        rank1_logo_id: ranked[0].id,
        rank2_logo_id: ranked[1].id,
        rank3_logo_id: ranked[2].id,
      }, { onConflict: 'user_id' })
      if (error) throw error
      setStatus('success'); onRefresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : JSON.stringify(err)
      setErrorMsg(`Erreur : ${msg}`)
      setStatus('error')
    }
  }

  if (logos.length === 0) {
    return (
      <motion.div className="text-center py-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <motion.div animate={{ y: [0, -8, 0], rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
          <Sparkles size={42} className="text-blue-300 mx-auto mb-3" />
        </motion.div>
        <p className="text-slate-600 text-base font-semibold">Aucun logo déposé pour l&apos;instant.</p>
        <p className="text-slate-400 text-sm mt-1">Soyez le premier à participer !</p>
      </motion.div>
    )
  }

  return (
    <div>
      {/* Bandeau succès */}
      <AnimatePresence>
        {status === 'success' && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-2xl px-5 py-4 mb-6"
          >
            <CheckCircle size={20} className="text-green-500 shrink-0" />
            <p className="text-green-700 text-sm font-semibold">Vote enregistré ! Vous pouvez modifier votre classement à tout moment.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      <motion.div className="text-center mb-8" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-slate-500 text-sm">
          Cliquez sur les logos dans l&apos;ordre de préférence —{' '}
          <span className="font-semibold text-slate-700">{ranked.length}/3 sélectionnés</span>
        </p>
      </motion.div>

      {/* Grille */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
        {logos.map((logo, i) => {
          const rank = rankOf(logo)
          const isRanked = rank >= 0
          const c = isRanked ? rankColors[rank] : null
          const canSelect = !isRanked && ranked.length < 3
          const isOwn = user && logo.user_id === user.id

          return (
            <motion.button key={logo.id}
              onClick={() => { if (!isOwn) toggleRank(logo) }}
              initial={{ opacity: 0, scale: 0.9, y: 16 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.35, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
              whileHover={canSelect && !isOwn ? { y: -4, boxShadow: '0 12px 32px rgba(37,99,235,0.12)' } : {}}
              whileTap={{ scale: 0.97 }}
              className={`card rounded-2xl overflow-hidden text-left transition-all duration-200 touch-manipulation relative
                ${isRanked ? `ring-2 ${c!.ring}` : ''}
                ${!canSelect && !isRanked && !isOwn ? 'opacity-40' : ''}
                ${isOwn ? 'cursor-default' : 'cursor-pointer'}
              `}
              disabled={isOwn || (!canSelect && !isRanked)}
              aria-label={isOwn ? `Votre logo` : isRanked ? `Retirer ${logo.author_name}` : `Classer ${logo.author_name}`}
            >
              {/* Badge rang */}
              <AnimatePresence>
                {isRanked && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                    className={`absolute top-2 left-2 z-10 w-8 h-8 rounded-full ${c!.bg} ${c!.text} flex items-center justify-center text-xs font-black shadow-lg`}
                  >{rank + 1}</motion.div>
                )}
              </AnimatePresence>

              {/* Retirer */}
              <AnimatePresence>
                {isRanked && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-white border border-slate-200 shadow flex items-center justify-center"
                  ><X size={12} className="text-slate-400" /></motion.div>
                )}
              </AnimatePresence>

              {/* Badge "Votre logo" */}
              {isOwn && (
                <div className="absolute top-2 right-2 z-10 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Vous</div>
              )}

              <div className={`aspect-square flex items-center justify-center p-4 ${isRanked ? 'bg-blue-50/50' : 'bg-gradient-to-br from-slate-50 to-blue-50/30'}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logo.image_url} alt={`Logo de ${logo.author_name}`} className="w-full h-full object-contain" />
              </div>
              <div className="p-3 border-t border-slate-50">
                <p className="text-slate-900 text-sm font-bold truncate">{logo.author_name}</p>
                {logo.slogan && <p className="text-slate-400 text-xs mt-0.5 line-clamp-1 italic">&ldquo;{logo.slogan}&rdquo;</p>}
                {isRanked && <p className={`text-xs font-bold mt-1 ${rankColors[rank].bg.replace('bg-', 'text-')}`}>{rankColors[rank].label}</p>}
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Zone de vote / connexion */}
      {loading ? null : !user ? (
        <div className="max-w-md mx-auto">
          <LoginForm reason="Connectez-vous pour voter" />
        </div>
      ) : (
        <AnimatePresence>
          {ranked.length > 0 && status !== 'success' && (
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }}
              className="card rounded-2xl p-5 max-w-md mx-auto"
            >
              <UserBadge />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Votre classement</p>

              <div className="flex gap-3 mb-5">
                {[0, 1, 2].map(i => {
                  const logo = ranked[i]; const c = rankColors[i]
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                      <div className={`w-8 h-8 rounded-full ${c.bg} flex items-center justify-center text-xs font-black ${c.text}`}>{i + 1}</div>
                      {logo ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={logo.image_url} alt={logo.author_name} className="w-12 h-12 rounded-xl object-contain bg-slate-50 border border-slate-100" />
                          <p className="text-xs text-slate-600 font-semibold text-center leading-tight truncate w-full">{logo.author_name}</p>
                        </>
                      ) : (
                        <div className="w-12 h-12 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center">
                          <span className="text-slate-300 text-lg">?</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              <AnimatePresence>
                {errorMsg && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl p-3 text-red-600 text-xs mb-3"
                  >
                    <AlertCircle size={14} className="shrink-0 mt-0.5" />{errorMsg}
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {ranked.length === 3 && (
                  <motion.button initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    onClick={submitVote}
                    disabled={status === 'submitting'}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-40 text-white font-bold py-3.5 rounded-xl text-sm shadow-lg shadow-blue-200 cursor-pointer touch-manipulation"
                  >
                    {status === 'submitting' ? 'Envoi…' : 'Valider mon classement'}
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}
