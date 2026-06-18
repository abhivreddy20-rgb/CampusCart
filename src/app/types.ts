export type StepId =
  | 'home'
  | 'login'
  | 'registration'
  | 'college'
  | 'category'
  | 'student'
  | 'terms'
  | 'payment'
  | 'confirmation'

export type FormState = {
  parentName: string
  email: string
  phone: string
  password: string
  college: string
  category: string
  pickupLocation: string
  itemDetails: string
  studentName: string
  studentPhone: string
  dorm: string
  room: string
  instructions: string
  acceptedTerms: boolean
  paymentMethod: string
}

export type SavedOrder = {
  order_number: string
}

export type SavedRegistration = {
  id: string
}

export type ParentProfile = {
  id: string
  parent_name: string
  parent_email: string
  parent_phone: string
}

export type College = {
  id: number
  name: string
  city: string | null
  state: string | null
  logo_url: string | null
}

export type PickupLocation = {
  id: number
  college_id: number
  name: string
  address: string | null
  city: string | null
  state: string | null
}
