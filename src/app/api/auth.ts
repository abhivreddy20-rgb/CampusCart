import { isSupabaseConfigured, supabase } from '../../lib/supabase'
import type { ParentProfile } from '../types'
import { normalizeEmail } from '../utils/input'
import { isValidEmail } from '../utils/validation'

export async function loginWithEmail(email: string, password: string) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Login is not configured yet. Add Supabase environment variables to enable account access.')
  }

  const parentEmail = normalizeEmail(email)
  if (!isValidEmail(parentEmail)) {
    throw new Error('Enter a valid email address.')
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: parentEmail,
    password,
  })

  if (error) {
    throw new Error('Login could not be completed. Check your email and password.')
  }

  const { data: profile, error: profileError } = await supabase
    .from('parent_profiles')
    .select('id, parent_name, parent_email, parent_phone')
    .eq('user_id', data.user.id)
    .maybeSingle<ParentProfile>()

  if (profileError) {
    throw new Error('Account profile could not be loaded. Please try again.')
  }

  return { user: data.user, profile }
}
