import { isSupabaseConfigured, supabase } from '../../lib/supabase'
import type { FormState, SavedRegistration } from '../types'
import { normalizeEmail, normalizePhone, normalizeText } from '../utils/input'
import { isValidEmail, isValidPhoneNumber } from '../utils/validation'

export async function saveRegistration(form: FormState): Promise<SavedRegistration> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Add your Supabase URL and anon key in .env to save registrations.')
  }

  const parentName = normalizeText(form.parentName, 120)
  const parentEmail = normalizeEmail(form.email)
  const parentPhone = normalizePhone(form.phone)

  if (!parentName || !isValidEmail(parentEmail) || !isValidPhoneNumber(parentPhone)) {
    throw new Error('Please enter valid account information.')
  }

  const { data: authData, error: authError } = await supabase.auth.signUp({
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
    throw new Error('Account could not be created. Please try again.')
  }

  if (!authData.session || !authData.user) {
    throw new Error('Please verify your email address, then log in to continue.')
  }

  const { data, error } = await supabase
    .from('parent_profiles')
    .upsert(
      {
        user_id: authData.user.id,
        parent_name: parentName,
        parent_email: parentEmail,
        parent_phone: parentPhone,
      },
      { onConflict: 'user_id' },
    )
    .select('id')
    .single()

  if (error) {
    throw new Error('Account profile could not be saved. Please try again.')
  }

  return { id: data.id }
}
