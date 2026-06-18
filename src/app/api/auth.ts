import { isSupabaseConfigured, supabase } from '../../lib/supabase'
import type { ParentProfile } from '../types'

export async function loginWithEmail(email: string, password: string) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Login is not configured yet. Add Supabase environment variables to enable account access.')
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  const parentEmail = data.user.email ?? email.trim().toLowerCase()
  const { data: profile, error: profileError } = await supabase
    .from('parent_profiles')
    .select('id, parent_name, parent_email, parent_phone')
    .eq('parent_email', parentEmail)
    .maybeSingle<ParentProfile>()

  if (profileError) {
    throw profileError
  }

  return { user: data.user, profile }
}
