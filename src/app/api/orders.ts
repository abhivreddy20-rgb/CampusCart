import { isSupabaseConfigured, supabase } from '../../lib/supabase'
import type { FormState, SavedOrder } from '../types'
import { categories, paymentMethods } from '../data/catalog'
import {
  normalizeEmail,
  normalizeOptionalText,
  normalizePhone,
  normalizeText,
} from '../utils/input'
import { isValidEmail, isValidPhoneNumber } from '../utils/validation'

export async function createOrder(form: FormState, parentProfileId?: string): Promise<SavedOrder> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Add your Supabase URL and anon key in .env to save orders.')
  }

  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData.user) {
    throw new Error('Please log in before placing an order.')
  }

  const { data: parentProfile, error: profileError } = await supabase
    .from('parent_profiles')
    .select('id, parent_name, parent_email, parent_phone')
    .eq('user_id', userData.user.id)
    .maybeSingle()

  if (profileError) {
    throw new Error('Account profile could not be loaded. Please try again.')
  }

  if (!parentProfile) {
    throw new Error('Please complete registration before placing an order.')
  }

  const categoryIsValid = categories.some((category) => category.id === form.category)
  const paymentMethodIsValid = paymentMethods.includes(form.paymentMethod)
  const parentEmail = normalizeEmail(parentProfile.parent_email)
  const parentPhone = normalizePhone(parentProfile.parent_phone)
  const studentPhone = normalizePhone(form.studentPhone)

  if (
    !categoryIsValid ||
    !paymentMethodIsValid ||
    !isValidEmail(parentEmail) ||
    !isValidPhoneNumber(parentPhone) ||
    !isValidPhoneNumber(studentPhone)
  ) {
    throw new Error('Please review the order details and try again.')
  }

  const orderNumber = createOrderNumber()
  const { error } = await supabase.from('orders').insert({
    order_number: orderNumber,
    parent_profile_id: parentProfileId || parentProfile.id,
    parent_name: normalizeText(parentProfile.parent_name, 120),
    parent_email: parentEmail,
    parent_phone: parentPhone,
    college_name: normalizeText(form.college, 120),
    category: form.category,
    pickup_location: normalizeOptionalText(form.pickupLocation, 160),
    item_details: normalizeOptionalText(form.itemDetails, 1000),
    student_name: normalizeText(form.studentName, 120),
    student_phone: studentPhone,
    dorm: normalizeText(form.dorm, 120),
    room: normalizeOptionalText(form.room, 40),
    instructions: normalizeOptionalText(form.instructions, 1000),
    payment_method: form.paymentMethod,
    total_cents: 1800,
  })

  if (error) {
    throw new Error('Order could not be saved. Please try again.')
  }

  return { order_number: orderNumber }
}

function createOrderNumber() {
  const values = new Uint8Array(6)
  crypto.getRandomValues(values)
  const suffix = Array.from(values, (value) => (value % 36).toString(36))
    .join('')
    .toUpperCase()

  return `CC-${suffix}`
}
