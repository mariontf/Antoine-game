'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, CheckCircle, AlertCircle, X, ImageIcon } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './AuthProvider'
import { LoginForm, UserBadge } from './LoginGate'

type Status = 'idle' | 'uploading' | 'success' | 'error'

export default function SubmitForm({ onLogoAdded }: { onLogoAdded?: () => void }) {
  const { user, loading } = useAuth()
  const [displayName, setDisplayName] = useState('')
  const [slogan, setSlogan] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFile(f: File | null) {
    if (!f) return
    if (!['image/png', 'image/svg+xml', 'image/jpeg', 'image/webp'].includes(f.type)) {
      setErrorMsg('Format non supporté. Utilisez PNG, SVG ou JPG.')
      return
    }
    if (f.size > 5 * 1024 * 1024) {
      setErrorMsg('Fichier trop lourd (max 5 MB).')
      return
    }
    setErrorMsg('')
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !displayName.trim() || !file) return
    setStatus('uploading'); setErrorMsg('')
    try {
      // Vérifier si cet utilisateur a déjà soumis
      const { data: existing } = await supabase.from('logos').select('id').eq('user_id', user.id).limit(1)
      if (existing && existing.length > 0) {
        setErrorMsg('Vous avez déjà déposé un logo. Un seul dépôt par personne.')
        setStatus('error'); return
      }
      const ext = file.name.split('.').pop()
      const fileName = `${Date.now()}-${user.id.slice(0, 8)}.${ext}`
      const { error: uploadError } = await supabase.storage.from('logos').upload(fileName, file, { contentType: file.type })
      if (uploadError) throw uploadError
      const { data: urlData } = supabase.storage.from('logos').getPublicUrl(fileName)
      const { error: insertError } = await supabase.from('logos').insert({
        author_name: displayName.trim(),
        slogan: slogan.trim() || null,
        image_url: urlData.publicUrl,
        user_id: user.id,
      })
      if (insertError) throw insertError
      setStatus('success'); onLogoAdded?.()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : JSON.stringify(err)
      setErrorMsg(`Erreur : ${msg}`)
      setStatus('error')
    }
  }

  function reset() {
    setDisplayName(''); setSlogan(''); setFile(null); setPreview(null); setStatus('idle'); setErrorMsg('')
  }

  if (loading) return <div className="h-32 flex items-center justify-center"><div className="w-6 h-6 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" /></div>

  if (!user) return <LoginForm reason="Connectez-vous pour déposer votre logo" />

  if (status === 'success') {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} className="card rounded-2xl p-8 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 16, delay: 0.1 }}>
          <CheckCircle size={52} className="text-green-500 mx-auto mb-4" />
        </motion.div>
        <h3 className="text-slate-900 font-extrabold text-xl mb-2">Logo déposé !</h3>
        <p className="text-slate-500 text-sm mb-6">Votre création est visible dans la galerie. Bonne chance !</p>
        <button onClick={reset} className="text-sm text-blue-600 hover:text-blue-700 font-medium underline cursor-pointer">
          Déposer un autre logo
        </button>
      </motion.div>
    )
  }

  return (
    <motion.form onSubmit={handleSubmit} className="card rounded-2xl p-6 sm:p-8 space-y-5"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <UserBadge />

      {/* Nom affiché */}
      <div>
        <label htmlFor="dname" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Votre prénom et nom <span className="text-red-500">*</span>
        </label>
        <input id="dname" type="text" value={displayName}
          onChange={e => setDisplayName(e.target.value)}
          placeholder="Marie Dupont" required
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
        />
      </div>

      {/* Upload */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Logo <span className="text-red-500">*</span>
          <span className="text-slate-400 font-normal ml-1">(PNG, SVG, JPG — max 5 MB)</span>
        </label>
        <button type="button" onClick={() => inputRef.current?.click()}
          className="w-full border-2 border-dashed border-slate-200 hover:border-blue-300 bg-slate-50 hover:bg-blue-50/50 rounded-xl p-6 transition-all cursor-pointer touch-manipulation flex flex-col items-center gap-3 group"
        >
          {preview ? (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Aperçu" className="max-h-32 max-w-full rounded-lg object-contain" />
              <button type="button"
                onClick={e => { e.stopPropagation(); setFile(null); setPreview(null) }}
                className="absolute -top-2 -right-2 bg-white border border-slate-200 shadow rounded-full p-0.5 hover:bg-red-50 transition-colors"
                aria-label="Supprimer"
              ><X size={14} className="text-slate-400" /></button>
            </div>
          ) : (
            <>
              <ImageIcon size={30} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
              <div className="text-center">
                <p className="text-slate-500 text-sm font-medium">Cliquez pour sélectionner votre logo</p>
                <p className="text-slate-400 text-xs mt-0.5">ou glissez-déposez votre fichier ici</p>
              </div>
            </>
          )}
        </button>
        <input ref={inputRef} type="file" accept="image/png,image/svg+xml,image/jpeg,image/webp" className="hidden"
          onChange={e => handleFile(e.target.files?.[0] ?? null)} />
      </div>

      {/* Slogan */}
      <div>
        <label htmlFor="slogan" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Slogan <span className="text-slate-400 font-normal">(optionnel, max 80 car.)</span>
        </label>
        <input id="slogan" type="text" value={slogan}
          onChange={e => setSlogan(e.target.value.slice(0, 80))}
          placeholder="Ex : Vos idées en slides, instantanément."
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
        />
        <p className="text-right text-xs text-slate-400 mt-1">{slogan.length}/80</p>
      </div>

      <AnimatePresence>
        {errorMsg && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl p-3 text-red-600 text-sm"
          >
            <AlertCircle size={16} className="shrink-0 mt-0.5" />{errorMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button type="submit"
        disabled={!displayName.trim() || !file || status === 'uploading'}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all cursor-pointer touch-manipulation text-sm shadow-lg shadow-blue-200"
        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
      >
        {status === 'uploading' ? (
          <><svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>Envoi en cours…</>
        ) : (
          <><Upload size={16} />Soumettre ma création</>
        )}
      </motion.button>
    </motion.form>
  )
}
