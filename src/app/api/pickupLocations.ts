import { isSupabaseConfigured, supabase } from '../../lib/supabase'
import type { PickupLocation } from '../types'

export async function getActivePickupLocations(): Promise<PickupLocation[]> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Add your Supabase URL and anon key in .env to load pickup locations.')
  }

  const { data, error } = await supabase
    .from('pickup_locations')
    .select('id, college_id, name, address, city, state')
    .eq('active', true)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    throw error
  }

  return data ?? []
}
