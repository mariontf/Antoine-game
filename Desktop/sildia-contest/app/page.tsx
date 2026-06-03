'use client'

export const dynamic = 'force-dynamic'

import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase, Logo } from '@/lib/supabase'
import HeroSection from '@/components/HeroSection'
import ContestRules from '@/components/ContestRules'
import HowToCreate from '@/components/HowToCreate'
import SubmitForm from '@/components/SubmitForm'
import GalleryGrid from '@/components/GalleryGrid'
import Leaderboard from '@/components/Leaderboard'

function SectionHeading({ title, sub }: { title: React.ReactNode; sub: string }) {
  return (
    <motion.div
      className="text-center mb-10"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">{title}</h2>
      <p className="text-slate-500 text-sm sm:text-base">{sub}</p>
    </motion.div>
  )
}

export default function HomePage() {
  const [logos, setLogos] = useState<Logo[]>([])
  const [loading, setLoading] = useState(true)

  const fetchLogos = useCallback(async () => {
    const { data: logosData } = await supabase
      .from('logos').select('*').order('created_at', { ascending: false })
    const { data: scoresData } = await supabase.from('borda_scores').select('*')
    if (logosData) {
      const scoresMap = new Map<string, number>(
        (scoresData ?? []).map((s: { logo_id: string; score: number }) => [s.logo_id, Number(s.score)])
      )
      setLogos(logosData.map((l: Logo) => ({ ...l, score: scoresMap.get(l.id) ?? 0 })))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchLogos()
    const channel = supabase
      .channel('realtime-logos-votes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'logos' }, fetchLogos)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'votes' }, fetchLogos)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [fetchLogos])

  return (
    <main className="bg-white overflow-x-hidden">
      <HeroSection />

      {/* Règles — bento grid */}
      <section className="px-4 py-16 sm:py-24 bg-white">
        <ContestRules />
      </section>

      {/* How to */}
      <section className="px-4 py-16 sm:py-20 bg-white">
        <HowToCreate />
      </section>

      {/* Déposer */}
      <section id="participer" className="px-4 py-16 sm:py-20 bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50">
        <div className="max-w-xl mx-auto">
          <SectionHeading
            title={<>Déposez votre <span className="gradient-text">logo</span></>}
            sub="Un seul dépôt par personne. Jusqu'au 30 juin 2026."
          />
          <SubmitForm onLogoAdded={fetchLogos} />
        </div>
      </section>

      {/* Galerie */}
      <section className="px-4 py-16 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto">
          <SectionHeading
            title={<>Les <span className="gradient-text">créations</span></>}
            sub={logos.length > 0
              ? `${logos.length} logo${logos.length > 1 ? 's' : ''} déposé${logos.length > 1 ? 's' : ''} — votez pour vos favoris`
              : 'Soyez le premier à soumettre votre logo'}
          />
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-2xl aspect-square bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : (
            <GalleryGrid logos={logos} onRefresh={fetchLogos} />
          )}
        </div>
      </section>

      {/* Leaderboard */}
      <section id="leaderboard" className="px-4 py-16 sm:py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <SectionHeading
            title={<>🏆 <span className="gradient-text">Classement</span></>}
            sub="Mis à jour en temps réel — classé 1er = 3pts, 2ème = 2pts, 3ème = 1pt"
          />
          <Leaderboard logos={logos} />
        </div>
      </section>

      <footer className="border-t border-slate-100 px-4 py-8 text-center bg-white">
        <p className="text-slate-400 text-sm">
          Sildia © 2026 — tfactory — Concours ouvert jusqu&apos;au 30 juin 2026
        </p>
      </footer>
    </main>
  )
}
