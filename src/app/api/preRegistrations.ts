import { isSupabaseConfigured, supabase } from '../../lib/supabase'
import type { PreRegistrationForm, SavedPreRegistration } from '../types'
import { normalizeEmail, normalizePhone, normalizeText } from '../utils/input'
import { isValidEmail, isValidPhoneNumber } from '../utils/validation'

export async function savePreRegistration(
  form: PreRegistrationForm,
): Promise<SavedPreRegistration> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Add your Supabase URL and anon key in .env to save pre-registrations.')
  }

  const parentEmail = normalizeEmail(form.email)
  const parentPhone = normalizePhone(form.phone)

  if (!isValidEmail(parentEmail) || !isValidPhoneNumber(parentPhone)) {
    throw new Error('Please enter valid contact information.')
  }

  const { error } = await supabase
    .from('pre_registrations')
    .insert({
      parent_name: normalizeText(form.name, 120),
      parent_email: parentEmail,
      parent_phone: parentPhone,
      college_name: normalizeText(form.college, 120),
    })

  if (error) {
    throw new Error('Pre-registration could not be saved. Please try again.')
  }

  return {}
}
