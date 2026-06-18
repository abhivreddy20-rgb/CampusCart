import { isSupabaseConfigured, supabase } from '../../lib/supabase'
import type { PreRegistrationForm, SavedPreRegistration } from '../types'

export async function savePreRegistration(
  form: PreRegistrationForm,
): Promise<SavedPreRegistration> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Add your Supabase URL and anon key in .env to save pre-registrations.')
  }

  const { error } = await supabase
    .from('pre_registrations')
    .insert({
      parent_name: form.name.trim(),
      parent_email: form.email.trim().toLowerCase(),
      parent_phone: form.phone.trim(),
      college_name: form.college,
    })

  if (error) {
    throw error
  }

  return {}
}
