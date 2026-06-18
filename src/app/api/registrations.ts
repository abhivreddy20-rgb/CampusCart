import { isSupabaseConfigured, supabase } from '../../lib/supabase'
import type { FormState, SavedRegistration } from '../types'

export async function saveRegistration(form: FormState): Promise<SavedRegistration> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Add your Supabase URL and anon key in .env to save registrations.')
  }

  const parentName = form.parentName.trim()
  const parentEmail = form.email.trim().toLowerCase()
  const parentPhone = form.phone.trim()

  const { error: authError } = await supabase.auth.signUp({
    email: parentEmail,
    password: form.password,
    options: {
      data: {
        parent_name: parentName,
        parent_phone: parentPhone,
      },
    },
  })

  if (authError) {
    throw authError
  }

  const { data, error } = await supabase
    .from('parent_profiles')
    .upsert(
      {
        parent_name: parentName,
        parent_email: parentEmail,
        parent_phone: parentPhone,
      },
      { onConflict: 'parent_email' },
    )
    .select('id')
    .single()

  if (error) {
    throw error
  }

  return { id: data.id }
}
