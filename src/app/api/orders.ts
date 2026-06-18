import { isSupabaseConfigured, supabase } from '../../lib/supabase'
import type { FormState, SavedOrder } from '../types'

export async function createOrder(form: FormState, parentProfileId?: string): Promise<SavedOrder> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Add your Supabase URL and anon key in .env to save orders.')
  }

  const orderNumber = createOrderNumber()
  const { error } = await supabase.from('orders').insert({
    order_number: orderNumber,
    parent_profile_id: parentProfileId || null,
    parent_name: form.parentName,
    parent_email: form.email,
    parent_phone: form.phone,
    college_name: form.college,
    category: form.category,
    pickup_location: form.pickupLocation,
    item_details: form.itemDetails,
    student_name: form.studentName,
    student_phone: form.studentPhone,
    dorm: form.dorm,
    room: form.room,
    instructions: form.instructions,
    payment_method: form.paymentMethod,
    total_cents: 1800,
  })

  if (error) {
    throw error
  }

  return { order_number: orderNumber }
}

function createOrderNumber() {
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `CC-${suffix}`
}
