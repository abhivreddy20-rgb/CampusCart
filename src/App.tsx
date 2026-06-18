import { useEffect, useMemo, useState } from 'react'

import { getActiveColleges } from './app/api/colleges'
import { createOrder } from './app/api/orders'
import { getActivePickupLocations } from './app/api/pickupLocations'
import { saveRegistration } from './app/api/registrations'
import { AppShell } from './app/components/AppShell'
import { initialForm, steps } from './app/data/catalog'
import { CategoryPage } from './app/pages/CategoryPage'
import { CollegePage } from './app/pages/CollegePage'
import { ConfirmationPage } from './app/pages/ConfirmationPage'
import { HomePage } from './app/pages/HomePage'
import { LoginPage } from './app/pages/LoginPage'
import { PaymentPage } from './app/pages/PaymentPage'
import { PreRegistrationPage } from './app/pages/PreRegistrationPage'
import { RegistrationPage } from './app/pages/RegistrationPage'
import { StudentPage } from './app/pages/StudentPage'
import { TermsPage } from './app/pages/TermsPage'
import type { College, FormState, ParentProfile, PickupLocation, SavedOrder, StepId } from './app/types'

function App() {
  const [currentStep, setCurrentStep] = useState<StepId>('home')
  const [stepHistory, setStepHistory] = useState<StepId[]>([])
  const [form, setForm] = useState<FormState>(initialForm)
  const [colleges, setColleges] = useState<College[]>([])
  const [isLoadingColleges, setIsLoadingColleges] = useState(true)
  const [collegeError, setCollegeError] = useState('')
  const [pickupLocations, setPickupLocations] = useState<PickupLocation[]>([])
  const [isLoadingPickupLocations, setIsLoadingPickupLocations] = useState(true)
  const [pickupLocationError, setPickupLocationError] = useState('')
  const [collegeQuery, setCollegeQuery] = useState('')
  const [savedOrder, setSavedOrder] = useState<SavedOrder | null>(null)
  const [registrationId, setRegistrationId] = useState('')
  const [isSavingRegistration, setIsSavingRegistration] = useState(false)
  const [registrationError, setRegistrationError] = useState('')
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false)
  const [paymentError, setPaymentError] = useState('')

  const orderSteps = steps.filter((step) => !['home', 'login', 'confirmation'].includes(step.id))
  const orderStepIndex = orderSteps.findIndex((step) => step.id === currentStep)
  const filteredColleges = useMemo(() => {
    return colleges.filter((college) =>
      college.name.toLowerCase().includes(collegeQuery.trim().toLowerCase()),
    )
  }, [collegeQuery, colleges])
  const selectedCollege = useMemo(() => {
    return colleges.find((college) => college.name === form.college) ?? null
  }, [colleges, form.college])
  const collegePickupLocations = useMemo(() => {
    if (!selectedCollege) {
      return []
    }

    return pickupLocations.filter((location) => location.college_id === selectedCollege.id)
  }, [pickupLocations, selectedCollege])

  useEffect(() => {
    let isMounted = true

    async function loadColleges() {
      try {
        setCollegeError('')
        setIsLoadingColleges(true)
        const backendColleges = await getActiveColleges()

        if (!isMounted) {
          return
        }

        setColleges(backendColleges)
        setForm((current) => {
          if (current.college || backendColleges.length === 0) {
            return current
          }

          return { ...current, college: backendColleges[0].name }
        })
      } catch (error) {
        if (!isMounted) {
          return
        }

        const message = error instanceof Error ? error.message : 'Colleges could not be loaded'
        setCollegeError(message)
      } finally {
        if (isMounted) {
          setIsLoadingColleges(false)
        }
      }
    }

    async function loadPickupLocations() {
      try {
        setPickupLocationError('')
        setIsLoadingPickupLocations(true)
        const backendPickupLocations = await getActivePickupLocations()

        if (!isMounted) {
          return
        }

        setPickupLocations(backendPickupLocations)
      } catch (error) {
        if (!isMounted) {
          return
        }

        const message = error instanceof Error ? error.message : 'Pickup locations could not be loaded'
        setPickupLocationError(message)
      } finally {
        if (isMounted) {
          setIsLoadingPickupLocations(false)
        }
      }
    }

    loadColleges()
    loadPickupLocations()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!form.college || isLoadingPickupLocations) {
      return
    }

    const pickupLocationIsValid = collegePickupLocations.some(
      (location) => location.name === form.pickupLocation,
    )

    if (pickupLocationIsValid) {
      return
    }

    const nextPickupLocation = collegePickupLocations[0]?.name ?? ''
    if (form.pickupLocation === nextPickupLocation) {
      return
    }

    setForm((current) => ({
      ...current,
      pickupLocation: nextPickupLocation,
    }))
  }, [collegePickupLocations, form.college, form.pickupLocation, isLoadingPickupLocations])

  const updateForm = <Field extends keyof FormState>(field: Field, value: FormState[Field]) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const navigateTo = (step: StepId) => {
    setStepHistory((current) => [...current, currentStep])
    setCurrentStep(step)
  }

  const replaceWith = (step: StepId, history: StepId[] = stepHistory) => {
    setStepHistory(history)
    setCurrentStep(step)
  }

  const goNext = () => {
    const nextStep = orderSteps[Math.min(orderStepIndex + 1, orderSteps.length - 1)]
    navigateTo(nextStep.id)
  }

  const goBack = () => {
    const previousStep = stepHistory.at(-1) ?? 'home'
    setStepHistory((current) => current.slice(0, -1))
    setCurrentStep(previousStep)
  }

  const submitRegistration = async () => {
    setIsSavingRegistration(true)
    setRegistrationError('')

    try {
      const registration = await saveRegistration(form)
      setRegistrationId(registration.id)
      goNext()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration could not be saved'
      setRegistrationError(message)
    } finally {
      setIsSavingRegistration(false)
    }
  }

  const submitOrder = async () => {
    setIsSubmittingOrder(true)
    setPaymentError('')

    try {
      const order = await createOrder(form, registrationId)
      setSavedOrder(order)
      navigateTo('confirmation')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Payment could not be completed'
      setPaymentError(message)
    } finally {
      setIsSubmittingOrder(false)
    }
  }

  const handleLoginSuccess = (profile: ParentProfile | null, email: string) => {
    if (!profile) {
      setForm((current) => ({ ...current, email }))
      replaceWith('registration', ['home'])
      return
    }

    setRegistrationId(profile.id)
    setForm((current) => ({
      ...current,
      parentName: profile.parent_name,
      email: profile.parent_email,
      phone: profile.parent_phone,
      password: '',
      college: current.college || colleges[0]?.name || '',
    }))
    replaceWith('college', ['home'])
  }

  const restartOrder = () => {
    setSavedOrder(null)
    setRegistrationId('')
    setForm({
      ...initialForm,
      college: colleges[0]?.name ?? '',
      pickupLocation: collegePickupLocations[0]?.name ?? '',
    })
    setCollegeQuery('')
    setRegistrationError('')
    setPaymentError('')
    replaceWith('home', [])
  }

  return (
    <AppShell>
      {currentStep === 'home' && (
        <HomePage onPreRegister={() => navigateTo('preRegistration')} />
      )}

      {currentStep === 'preRegistration' && (
        <PreRegistrationPage onBack={goBack} onSuccess={() => replaceWith('home', [])} />
      )}

      {currentStep === 'login' && <LoginPage onBack={goBack} onSuccess={handleLoginSuccess} />}

      {currentStep === 'registration' && (
        <RegistrationPage
          form={form}
          isSavingRegistration={isSavingRegistration}
          registrationError={registrationError}
          updateForm={updateForm}
          onBack={goBack}
          onNext={submitRegistration}
        />
      )}

      {currentStep === 'college' && (
        <CollegePage
          form={form}
          collegeQuery={collegeQuery}
          filteredColleges={filteredColleges}
          isLoadingColleges={isLoadingColleges}
          collegeError={collegeError}
          setCollegeQuery={setCollegeQuery}
          updateForm={updateForm}
          onBack={goBack}
          onNext={goNext}
        />
      )}

      {currentStep === 'category' && (
        <CategoryPage
          form={form}
          pickupLocations={collegePickupLocations}
          isLoadingPickupLocations={isLoadingPickupLocations}
          pickupLocationError={pickupLocationError}
          updateForm={updateForm}
          onBack={goBack}
          onNext={goNext}
        />
      )}

      {currentStep === 'student' && (
        <StudentPage form={form} updateForm={updateForm} onBack={goBack} onNext={goNext} />
      )}

      {currentStep === 'terms' && (
        <TermsPage form={form} updateForm={updateForm} onBack={goBack} onNext={goNext} />
      )}

      {currentStep === 'payment' && (
        <PaymentPage
          form={form}
          isSubmittingOrder={isSubmittingOrder}
          paymentError={paymentError}
          updateForm={updateForm}
          onBack={goBack}
          onSubmit={submitOrder}
        />
      )}

      {currentStep === 'confirmation' && (
        <ConfirmationPage
          form={form}
          orderNumber={savedOrder?.order_number ?? 'CC-PENDING'}
          onRestart={restartOrder}
        />
      )}
    </AppShell>
  )
}

export default App
