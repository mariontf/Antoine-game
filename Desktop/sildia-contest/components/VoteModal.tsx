'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trophy, CheckCircle, AlertCircle, GripVertical } from 'lucide-react'
import { supabase, Logo } from '@/lib/supabase'

type Props = { logos: Logo[]; voterName: string; onClose: () => void; onVoted: () => void }

const rankColors = ['text-amber-500', 'text-slate-400', 'text-orange-400']

export default function VoteModal({ logos, voterName, onClose, onVoted }: Props) {
  const [ranked, setRanked] = useState<Logo[]>([])
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const others = logos.filter(l => l.author_name.toLowerCase() !== voterName.toLowerCase())
  const unranked = others.filter(l => !ranked.find(r => r.id === l.id))

  function addToRank(logo: Logo) { if (ranked.length < 3) setRanked(p => [...p, logo]) }
  function removeFromRank(id: string) { setRanked(p => p.filter(r => r.id !== id)) }

  async function submitVote() {
    if (ranked.length !== 3) return
    setStatus('submitting'); setErrorMsg('')
    try {
      const { data: existing } = await supabase.from('votes').select('id').ilike('voter_name', voterName.trim()).limit(1)
      if (existing && existing.length > 0) {
        setErrorMsg('Vous avez déjà voté. Un seul vote par personne est autorisé.')
        setStatus('error'); return
      }
      const { error } = await supabase.from('votes').insert({
        voter_name: voterName.trim(),
        rank1_logo_id: ranked[0].id, rank2_logo_id: ranked[1].id, rank3_logo_id: ranked[2].id,
      })
      if (error) throw error
      setStatus('success'); onVoted()
    } catch {
      setErrorMsg("Erreur lors de l'enregistrement. Réessayez.")
      setStatus('error')
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative w-full sm:max-w-2xl bg-white rounded-t-3xl sm:rounded-3xl max-h-[90dvh] overflow-y-auto shadow-2xl"
        >
          <div className="flex justify-center pt-3 pb-1 sm:hidden">
            <div className="w-10 h-1 rounded-full bg-slate-200" />
          </div>

          <div className="p-5 sm:p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-slate-900 font-extrabold text-lg">Classez vos 3 favoris</h2>
                <p className="text-slate-400 text-xs mt-0.5">Appuyez sur un logo pour l&apos;ajouter à votre classement</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer" aria-label="Fermer">
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            {status === 'success' ? (
              <div className="text-center py-10">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 280, damping: 16 }}>
                  <CheckCircle size={52} className="text-green-500 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-slate-900 font-extrabold text-xl mb-2">Vote enregistré !</h3>
                <p className="text-slate-500 text-sm mb-6">Merci ! Les scores sont mis à jour en temps réel.</p>
                <button onClick={onClose} className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-2.5 rounded-full text-sm font-bold cursor-pointer shadow-lg shadow-blue-200">
                  Voir le classement
                </button>
              </div>
            ) : (
              <>
                {/* Ranked */}
                <div className="mb-5">
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">Votre classement ({ranked.length}/3)</p>
                  <div className="space-y-2 min-h-[80px]">
                    {ranked.length === 0 && (
                      <p className="text-slate-400 text-sm text-center py-4 border-2 border-dashed border-slate-100 rounded-xl">
                        Choisissez 3 logos ci-dessous
                      </p>
                    )}
                    {ranked.map((logo, idx) => (
                      <motion.div key={logo.id} layout initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2"
                      >
                        <GripVertical size={16} className="text-slate-300" />
                        <span className={`text-sm font-black w-6 shrink-0 ${rankColors[idx]}`}>#{idx + 1}</span>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={logo.image_url} alt={`Logo de ${logo.author_name}`} className="w-8 h-8 rounded-lg object-contain bg-white border border-slate-100" />
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-900 text-sm font-semibold truncate">{logo.author_name}</p>
                          {logo.slogan && <p className="text-slate-400 text-xs truncate italic">{logo.slogan}</p>}
                        </div>
                        <button onClick={() => removeFromRank(logo.id)} className="p-1 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" aria-label={`Retirer le logo de ${logo.author_name}`}>
                          <X size={14} className="text-slate-300 hover:text-red-400" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Available */}
                <div className="mb-5">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Logos disponibles</p>
                  {unranked.length === 0 && ranked.length === 3 ? (
                    <p className="text-slate-400 text-sm text-center py-3">Tous les logos sont classés.</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {unranked.map(logo => (
                        <motion.button
                          key={logo.id}
                          onClick={() => addToRank(logo)}
                          disabled={ranked.length >= 3}
                          className="card rounded-xl p-3 text-left hover:shadow-md hover:border-blue-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer touch-manipulation"
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={logo.image_url} alt={`Logo de ${logo.author_name}`} className="w-full aspect-square object-contain rounded-lg bg-slate-50 mb-2" />
                          <p className="text-slate-900 text-xs font-bold truncate">{logo.author_name}</p>
                          {logo.slogan && <p className="text-slate-400 text-xs truncate mt-0.5 italic">{logo.slogan}</p>}
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>

                {errorMsg && (
                  <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl p-3 text-red-600 text-sm mb-4">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />{errorMsg}
                  </div>
                )}

                <motion.button
                  onClick={submitVote}
                  disabled={ranked.length !== 3 || status === 'submitting'}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all cursor-pointer text-sm shadow-lg shadow-blue-200"
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                >
                  <Trophy size={16} />
                  {status === 'submitting' ? 'Envoi…' : 'Valider mon classement'}
                </motion.button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
