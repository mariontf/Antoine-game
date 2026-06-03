'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, CheckCircle, LogOut, AlertCircle } from 'lucide-react'
import { signInWithMagicLink, signOut } from '@/lib/auth'
import { useAuth } from './AuthProvider'

export function UserBadge() {
  const { user } = useAuth()
  if (!user) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between gap-3 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3 mb-6"
    >
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-black">
          {user.email?.[0].toUpperCase()}
        </div>
        <span className="text-blue-800 text-sm font-semibold truncate">{user.email}</span>
      </div>
      <button
        onClick={() => signOut()}
        className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer touch-manipulation"
        aria-label="Se déconnecter"
      >
        <LogOut size={15} />
      </button>
    </motion.div>
  )
}

export function LoginForm({ reason }: { reason: string }) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    if (!email.trim().toLowerCase().endsWith('@tfactory.fr')) {
      setError('Accès réservé aux collaborateurs @tfactory.fr')
      return
    }
    setLoading(true); setError('')
    const { error: err } = await signInWithMagicLink(email.trim())
    setLoading(false)
    if (err) { setError(err.message); return }
    setSent(true)
  }

  if (sent) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="card rounded-2xl p-6 text-center"
      >
        <CheckCircle size={40} className="text-green-500 mx-auto mb-3" />
        <h3 className="text-slate-900 font-bold text-base mb-1">Vérifiez votre boîte mail</h3>
        <p className="text-slate-400 text-sm">Un lien de connexion a été envoyé à <span className="font-semibold text-slate-600">{email}</span></p>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="card rounded-2xl p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Mail size={18} className="text-blue-500" />
        <h3 className="text-slate-900 font-bold text-sm">{reason}</h3>
      </div>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <input
          type="email" value={email}
          onChange={e => { setEmail(e.target.value); setError('') }}
          placeholder="prenom.nom@tfactory.fr"
          required
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
        />
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl p-3 text-red-600 text-xs"
            >
              <AlertCircle size={14} className="shrink-0 mt-0.5" />{error}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button type="submit" disabled={loading || !email.trim()}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-40 text-white font-bold py-3 rounded-xl text-sm shadow-lg shadow-blue-200 cursor-pointer"
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
        >
          {loading ? 'Envoi…' : 'Recevoir le lien de connexion'}
        </motion.button>
      </form>
    </motion.div>
  )
}
