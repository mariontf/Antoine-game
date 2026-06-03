import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

function getClient(): SupabaseClient {
  if (_client) return _client
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key || !url.startsWith('http')) {
    throw new Error('Supabase non configuré — renseignez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans .env.local')
  }
  _client = createClient(url, key)
  return _client
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    return getClient()[prop as keyof SupabaseClient]
  },
})

export type Logo = {
  id: string
  author_name: string
  slogan: string | null
  image_url: string
  created_at: string
  score?: number
  user_id?: string
}

export type Vote = {
  id: string
  voter_name: string
  rank1_logo_id: string
  rank2_logo_id: string
  rank3_logo_id: string
  created_at: string
}
