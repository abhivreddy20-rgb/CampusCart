import { isSupabaseConfigured, supabase } from '../../lib/supabase'
import type { College } from '../types'

export async function getActiveColleges(): Promise<College[]> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Add your Supabase URL and anon key in .env to load colleges.')
  }

  const { data, error } = await supabase
    .from('colleges')
    .select('id, name, city, state, logo_url')
    .eq('active', true)
    .order('name', { ascending: true })

  if (error) {
    throw new Error('Colleges could not be loaded. Please try again.')
  }

  return data ?? []
}
