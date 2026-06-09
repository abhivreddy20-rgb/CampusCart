import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  Cake,
  Check,
  ChevronRight,
  CreditCard,
  FileText,
  Gift,
  Home,
  MailCheck,
  MapPin,
  Package,
  Phone,
  Salad,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import {
  Button,
  Card,
  Checkbox,
  H1,
  H2,
  Input,
  Label,
  Paragraph,
  ScrollView,
  Select,
  Separator,
  Square,
  Text,
  TextArea,
  XStack,
  YStack,
} from 'tamagui'

import { isSupabaseConfigured, supabase } from './lib/supabase'

type StepId =
  | 'home'
  | 'registration'
  | 'college'
  | 'category'
  | 'student'
  | 'terms'
  | 'payment'
  | 'confirmation'

type FormState = {
  parentName: string
  email: string
  phone: string
  college: string
  category: string
  itemDetails: string
  studentName: string
  studentPhone: string
  dorm: string
  room: string
  instructions: string
  acceptedTerms: boolean
  paymentMethod: string
}

type SavedOrder = {
  order_number: string
}

const steps: { id: StepId; label: string }[] = [
  { id: 'home', label: 'Motto' },
  { id: 'registration', label: 'Register' },
  { id: 'college', label: 'College' },
  { id: 'category', label: 'Item' },
  { id: 'student', label: 'Student' },
  { id: 'terms', label: 'Terms' },
  { id: 'payment', label: 'Payment' },
  { id: 'confirmation', label: 'Email' },
]

const colleges = [
  'Stanford University',
  'University of California, Berkeley',
  'University of Southern California',
  'UCLA',
  'Arizona State University',
  'University of Texas at Austin',
  'New York University',
  'Boston University',
]

const categories = [
  {
    id: 'Food',
    title: 'Food',
    description: 'Meals, snacks, drinks, comfort food, and quick treats.',
    icon: Salad,
  },
  {
    id: 'Documents',
    title: 'Documents',
    description: 'Important papers, forms, certificates, and envelopes.',
    icon: FileText,
  },
  {
    id: 'Birthday Gifts',
    title: 'Birthday Gifts',
    description: 'Cakes, flowers, cards, surprises, and celebration bundles.',
    icon: Cake,
  },
  {
    id: 'Essentials',
    title: 'Essentials',
    description: 'Medicines, chargers, stationery, care items, and supplies.',
    icon: Package,
  },
  {
    id: 'Custom Gift',
    title: 'Custom Gift',
    description: 'Anything approved for campus delivery with special notes.',
    icon: Gift,
  },
]

const initialForm: FormState = {
  parentName: '',
  email: '',
  phone: '',
  college: colleges[0],
  category: 'Food',
  itemDetails: '',
  studentName: '',
  studentPhone: '',
  dorm: '',
  room: '',
  instructions: '',
  acceptedTerms: false,
  paymentMethod: 'Card',
}

function App() {
  const [currentStep, setCurrentStep] = useState<StepId>('home')
  const [form, setForm] = useState<FormState>(initialForm)
  const [collegeQuery, setCollegeQuery] = useState('')
  const [savedOrder, setSavedOrder] = useState<SavedOrder | null>(null)
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false)
  const [paymentError, setPaymentError] = useState('')

  const stepIndex = steps.findIndex((step) => step.id === currentStep)
  const selectedCategory = categories.find((category) => category.id === form.category)

  const filteredColleges = useMemo(() => {
    return colleges.filter((college) =>
      college.toLowerCase().includes(collegeQuery.trim().toLowerCase()),
    )
  }, [collegeQuery])

  const updateForm = <Field extends keyof FormState>(field: Field, value: FormState[Field]) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const goNext = () => {
    const nextStep = steps[Math.min(stepIndex + 1, steps.length - 1)]
    setCurrentStep(nextStep.id)
  }

  const goBack = () => {
    const previousStep = steps[Math.max(stepIndex - 1, 0)]
    setCurrentStep(previousStep.id)
  }

  const submitOrder = async () => {
    setIsSubmittingOrder(true)
    setPaymentError('')

    try {
      if (!isSupabaseConfigured || !supabase) {
        throw new Error('Add your Supabase URL and anon key in .env to save orders.')
      }

      const orderNumber = createOrderNumber()
      const { error } = await supabase.from('orders').insert({
        order_number: orderNumber,
        parent_name: form.parentName,
        parent_email: form.email,
        parent_phone: form.phone,
        college_name: form.college,
        category: form.category,
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

      setSavedOrder({ order_number: orderNumber })
      setCurrentStep('confirmation')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Payment could not be completed'
      setPaymentError(message)
    } finally {
      setIsSubmittingOrder(false)
    }
  }

  return (
    <YStack minHeight="100vh" backgroundColor="#f7f4ee">
      <YStack
        width="100%"
        minHeight="100vh"
        paddingHorizontal="$4"
        paddingVertical="$4"
        gap="$4"
        $sm={{ paddingHorizontal: '$3', paddingVertical: '$3' }}
      >
        <XStack alignItems="center" justifyContent="space-between" gap="$3">
          <XStack alignItems="center" gap="$3">
            <Square size={44} borderRadius={8} backgroundColor="#c45a1d">
              <BookOpenCheck color="#fffaf2" size={24} />
            </Square>
            <YStack>
              <Text color="#20332f" fontSize={21} fontWeight="800">
                CampusCart
              </Text>
              <Text color="#66736f" fontSize={13}>
                Same-day campus delivery
              </Text>
            </YStack>
          </XStack>
          <XStack display="flex" $sm={{ display: 'none' }} gap="$2" alignItems="center">
            <TrustPill icon={ShieldCheck} text="Verified handoff" />
            <TrustPill icon={MailCheck} text="Email updates" />
          </XStack>
        </XStack>

        <YStack
          flex={1}
          minHeight={0}
          backgroundColor="#fffaf2"
          overflow="hidden"
        >
          {currentStep === 'home' && <HomeStep onStart={() => setCurrentStep('registration')} />}

          {currentStep === 'registration' && (
            <ScreenFrame
              eyebrow="Registration"
              title="Create the parent delivery profile."
              subtitle="We use this information for order receipts and delivery updates."
              onBack={goBack}
              onNext={goNext}
            >
              <FormGrid>
                <Field label="Parent or guardian name">
                  <Input
                    value={form.parentName}
                    onChangeText={(value) => updateForm('parentName', value)}
                    placeholder="Priya Sharma"
                  />
                </Field>
                <Field label="Email confirmation address">
                  <Input
                    value={form.email}
                    onChangeText={(value) => updateForm('email', value)}
                    placeholder="parent@example.com"
                    keyboardType="email-address"
                  />
                </Field>
                <Field label="Phone number">
                  <Input
                    value={form.phone}
                    onChangeText={(value) => updateForm('phone', value)}
                    placeholder="+1 555 014 8890"
                  />
                </Field>
              </FormGrid>
            </ScreenFrame>
          )}

          {currentStep === 'college' && (
            <ScreenFrame
              eyebrow="College List"
              title="Choose the student college."
              subtitle="Search available campuses for the one-day delivery service."
              onBack={goBack}
              onNext={goNext}
            >
              <XStack
                alignItems="center"
                gap="$2"
                borderWidth={1}
                borderColor="#d8d0c3"
                backgroundColor="#ffffff"
                borderRadius={8}
                paddingHorizontal="$3"
              >
                <Search size={19} color="#66736f" />
                <Input
                  flex={1}
                  borderWidth={0}
                  backgroundColor="transparent"
                  value={collegeQuery}
                  onChangeText={setCollegeQuery}
                  placeholder="Search colleges"
                />
              </XStack>
              <YStack gap="$3">
                {filteredColleges.map((college) => (
                  <OptionRow
                    key={college}
                    active={form.college === college}
                    icon={MapPin}
                    title={college}
                    description="Available for parent-to-student campus delivery"
                    onPress={() => updateForm('college', college)}
                  />
                ))}
              </YStack>
            </ScreenFrame>
          )}

          {currentStep === 'category' && (
            <ScreenFrame
              eyebrow="Delivery Item"
              title="What do you want to send?"
              subtitle="Choose one category and add details for the delivery team."
              onBack={goBack}
              onNext={goNext}
            >
              <YStack gap="$3">
                {categories.map((category) => (
                  <OptionRow
                    key={category.id}
                    active={form.category === category.id}
                    icon={category.icon}
                    title={category.title}
                    description={category.description}
                    onPress={() => updateForm('category', category.id)}
                  />
                ))}
              </YStack>
              <Field label="Item details">
                <TextArea
                  minHeight={110}
                  value={form.itemDetails}
                  onChangeText={(value) => updateForm('itemDetails', value)}
                  placeholder="Example: chocolate cake, handwritten note, and a small flower bouquet."
                />
              </Field>
            </ScreenFrame>
          )}

          {currentStep === 'student' && (
            <ScreenFrame
              eyebrow="Student Information"
              title="Where should we deliver it?"
              subtitle="Clear student details help us complete the campus handoff quickly."
              onBack={goBack}
              onNext={goNext}
            >
              <FormGrid>
                <Field label="Student name">
                  <Input
                    value={form.studentName}
                    onChangeText={(value) => updateForm('studentName', value)}
                    placeholder="Aarav Sharma"
                  />
                </Field>
                <Field label="Student phone">
                  <Input
                    value={form.studentPhone}
                    onChangeText={(value) => updateForm('studentPhone', value)}
                    placeholder="+1 555 019 2145"
                  />
                </Field>
                <Field label="Dorm, hostel, or building">
                  <Input
                    value={form.dorm}
                    onChangeText={(value) => updateForm('dorm', value)}
                    placeholder="Maple Hall"
                  />
                </Field>
                <Field label="Room number">
                  <Input
                    value={form.room}
                    onChangeText={(value) => updateForm('room', value)}
                    placeholder="Room 312"
                  />
                </Field>
              </FormGrid>
              <Field label="Delivery instructions or gift message">
                <TextArea
                  minHeight={120}
                  value={form.instructions}
                  onChangeText={(value) => updateForm('instructions', value)}
                  placeholder="Please call before delivery. Message: Happy birthday, we love you."
                />
              </Field>
            </ScreenFrame>
          )}

          {currentStep === 'terms' && (
            <ScreenFrame
              eyebrow="Terms And Conditions"
              title="Review the delivery rules."
              subtitle="CampusCart can only deliver approved items with accurate recipient details."
              onBack={goBack}
              onNext={goNext}
              nextDisabled={!form.acceptedTerms}
            >
              <YStack gap="$3">
                {[
                  'Restricted, unsafe, or prohibited campus items cannot be delivered.',
                  'Food, documents, and gifts must include accurate student contact details.',
                  'Same-day delivery depends on campus availability and successful student contact.',
                  'Refunds and cancellations are reviewed before pickup confirmation.',
                ].map((term) => (
                  <XStack key={term} gap="$3" alignItems="flex-start">
                    <Square size={28} borderRadius={6} backgroundColor="#ffe4cf">
                      <Check size={17} color="#c45a1d" />
                    </Square>
                    <Text flex={1} color="#33413e" lineHeight={22}>
                      {term}
                    </Text>
                  </XStack>
                ))}
              </YStack>
              <XStack
                alignItems="center"
                gap="$3"
                padding="$4"
                borderWidth={1}
                borderColor="#d8d0c3"
                backgroundColor="#ffffff"
                borderRadius={8}
              >
                <Checkbox
                  id="terms"
                  size="$5"
                  checked={form.acceptedTerms}
                  onCheckedChange={(checked) => updateForm('acceptedTerms', checked === true)}
                >
                  <Checkbox.Indicator>
                    <Check size={16} color="#c45a1d" />
                  </Checkbox.Indicator>
                </Checkbox>
                <Label htmlFor="terms" flex={1} color="#20332f" lineHeight={22}>
                  I agree to the terms and conditions for this CampusCart delivery.
                </Label>
              </XStack>
            </ScreenFrame>
          )}

          {currentStep === 'payment' && (
            <ScreenFrame
              eyebrow="Payment Gateway"
              title="Confirm and pay for the delivery."
              subtitle="This prototype uses a mock payment confirmation."
              onBack={goBack}
              onNext={submitOrder}
              nextLabel={isSubmittingOrder ? 'Processing...' : 'Pay $18.00'}
              nextIcon={CreditCard}
              nextDisabled={isSubmittingOrder}
            >
              <YStack
                borderWidth={1}
                borderColor="#d8d0c3"
                backgroundColor="#ffffff"
                borderRadius={8}
                padding="$4"
                gap="$3"
              >
                <SummaryLine label="College" value={form.college} />
                <SummaryLine label="Item" value={selectedCategory?.title ?? form.category} />
                <SummaryLine label="Student" value={form.studentName || 'Student name'} />
                <Separator borderColor="#e7dfd1" />
                <SummaryLine label="Delivery fee" value="$12.00" />
                <SummaryLine label="Service fee" value="$6.00" />
                <SummaryLine label="Total" value="$18.00" strong />
              </YStack>
              <Field label="Payment method">
                <Select
                  value={form.paymentMethod}
                  onValueChange={(value) => updateForm('paymentMethod', value)}
                >
                  <Select.Trigger>
                    <Select.Value placeholder="Choose payment method" />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Viewport>
                      {['Card', 'Apple Pay', 'UPI', 'Wallet'].map((method, index) => (
                        <Select.Item index={index} key={method} value={method}>
                          <Select.ItemText>{method}</Select.ItemText>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                  </Select.Content>
                </Select>
              </Field>
              {paymentError ? (
                <Text color="#b42318" fontWeight="800">
                  {paymentError}
                </Text>
              ) : null}
            </ScreenFrame>
          )}

          {currentStep === 'confirmation' && (
            <ConfirmationStep
              form={form}
              orderNumber={savedOrder?.order_number ?? 'CC-PENDING'}
              onRestart={() => {
                setSavedOrder(null)
                setCurrentStep('home')
              }}
            />
          )}
        </YStack>
      </YStack>
    </YStack>
  )
}

function HomeStep({ onStart }: { onStart: () => void }) {
  return (
    <YStack flex={1}>
      <XStack
        flex={1}
        minHeight="calc(100vh - 108px)"
        $md={{ flexDirection: 'column' }}
        backgroundColor="#fffaf2"
      >
        <YStack flex={1.1} padding="$6" justifyContent="center" gap="$5">
          <XStack alignSelf="flex-start" gap="$2" alignItems="center" backgroundColor="#ffe4cf" padding="$2" borderRadius={99}>
            <Sparkles size={17} color="#c45a1d" />
            <Text color="#c45a1d" fontWeight="800" fontSize={13}>
              One-day delivery for college families
            </Text>
          </XStack>
          <YStack gap="$3">
            <H1 color="#17211f" fontSize={54} lineHeight={58} $sm={{ fontSize: 38, lineHeight: 42 }}>
              Deliver love to your college kid in one day.
            </H1>
            <Paragraph color="#56625f" fontSize={19} lineHeight={30} maxWidth={650}>
              CampusCart helps parents send food, important documents, birthday presents, and
              essentials directly to students on campus.
            </Paragraph>
          </YStack>
          <XStack gap="$3" flexWrap="wrap">
            <Button
              size="$5"
              borderRadius={8}
              backgroundColor="#c45a1d"
              color="#fffaf2"
              iconAfter={ArrowRight}
              onPress={onStart}
            >
              Start Delivery
            </Button>
            <Button size="$5" borderRadius={8} backgroundColor="#ffffff" color="#c45a1d" icon={Phone}>
              Parent Support
            </Button>
          </XStack>
          <XStack gap="$3" flexWrap="wrap" paddingTop="$2">
            <TrustPill icon={BadgeCheck} text="Same-day campus dropoff" />
            <TrustPill icon={Gift} text="Birthday ready" />
            <TrustPill icon={FileText} text="Document safe handling" />
          </XStack>
        </YStack>
        <YStack
          flex={0.9}
          minHeight={420}
          backgroundColor="#ffd0aa"
          padding="$5"
          justifyContent="center"
          gap="$4"
        >
          <Card borderRadius={8} backgroundColor="#ffffff" padding="$4" gap="$4">
            <XStack alignItems="center" justifyContent="space-between">
              <Text color="#20332f" fontSize={18} fontWeight="800">
                Today’s campus run
              </Text>
              <Text color="#c45a1d" fontWeight="800">
                Live
              </Text>
            </XStack>
            {[
              ['Food', 'Warm meal to Maple Hall', Salad],
              ['Documents', 'Sealed envelope to Admin Block', FileText],
              ['Birthday Gift', 'Cake and note to East Dorm', Cake],
            ].map(([title, detail, Icon]) => (
              <XStack key={String(title)} gap="$3" alignItems="center">
                <Square size={46} borderRadius={8} backgroundColor="#fff4dc">
                  <Icon size={23} color="#8f5f18" />
                </Square>
                <YStack flex={1}>
                  <Text color="#20332f" fontWeight="800">
                    {title}
                  </Text>
                  <Text color="#66736f">{detail}</Text>
                </YStack>
                <ChevronRight size={18} color="#87908c" />
              </XStack>
            ))}
          </Card>
        </YStack>
      </XStack>
    </YStack>
  )
}

function ScreenFrame({
  eyebrow,
  title,
  subtitle,
  children,
  onBack,
  onNext,
  nextLabel = 'Continue',
  nextIcon = ArrowRight,
  nextDisabled = false,
}: {
  eyebrow: string
  title: string
  subtitle: string
  children: React.ReactNode
  onBack: () => void
  onNext: () => void
  nextLabel?: string
  nextIcon?: typeof ArrowRight
  nextDisabled?: boolean
}) {
  const NextIcon = nextIcon

  return (
    <YStack flex={1}>
      <ScrollView flex={1}>
        <YStack padding="$6" gap="$5" maxWidth={850} width="100%" marginHorizontal="auto">
          <YStack gap="$2">
            <Text color="#c45a1d" fontSize={13} fontWeight="900" textTransform="uppercase">
              {eyebrow}
            </Text>
            <H2 color="#17211f" fontSize={34} lineHeight={40} $sm={{ fontSize: 28, lineHeight: 34 }}>
              {title}
            </H2>
            <Paragraph color="#66736f" fontSize={17} lineHeight={27}>
              {subtitle}
            </Paragraph>
          </YStack>
          {children}
        </YStack>
      </ScrollView>
      <XStack
        padding="$4"
        gap="$3"
        justifyContent="space-between"
        borderTopWidth={1}
        borderColor="#e7dfd1"
        backgroundColor="#fffaf2"
      >
        <Button borderRadius={8} backgroundColor="#ffffff" color="#c45a1d" icon={ArrowLeft} onPress={onBack}>
          Back
        </Button>
        <Button
          borderRadius={8}
          backgroundColor={nextDisabled ? '#d8a17b' : '#c45a1d'}
          color="#fffaf2"
          iconAfter={NextIcon}
          onPress={onNext}
          disabled={nextDisabled}
        >
          {nextLabel}
        </Button>
      </XStack>
    </YStack>
  )
}

function ConfirmationStep({
  form,
  orderNumber,
  onRestart,
}: {
  form: FormState
  orderNumber: string
  onRestart: () => void
}) {
  return (
    <YStack flex={1} alignItems="center" justifyContent="center" padding="$6" gap="$5">
      <Square size={76} borderRadius={18} backgroundColor="#ffe4cf">
        <MailCheck size={42} color="#c45a1d" />
      </Square>
      <YStack alignItems="center" gap="$2" maxWidth={680}>
        <Text color="#c45a1d" fontWeight="900" textTransform="uppercase" fontSize={13}>
          Email Confirmation
        </Text>
        <H2 color="#17211f" textAlign="center" fontSize={36} lineHeight={42}>
          Your CampusCart order is confirmed.
        </H2>
        <Paragraph color="#66736f" textAlign="center" fontSize={17} lineHeight={27}>
          A confirmation email has been prepared for {form.email || 'the parent email'} with order
          ID {orderNumber}, delivery details, and tracking instructions.
        </Paragraph>
      </YStack>
      <YStack
        width="100%"
        maxWidth={560}
        borderWidth={1}
        borderColor="#d8d0c3"
        backgroundColor="#ffffff"
        borderRadius={8}
        padding="$4"
        gap="$3"
      >
        <SummaryLine label="Order ID" value={orderNumber} strong />
        <SummaryLine label="College" value={form.college} />
        <SummaryLine label="Category" value={form.category} />
        <SummaryLine label="Student" value={form.studentName || 'Student name'} />
        <SummaryLine label="Delivery window" value="Today, before 8:00 PM" />
      </YStack>
      <Button borderRadius={8} backgroundColor="#c45a1d" color="#fffaf2" icon={Home} onPress={onRestart}>
        Start New Delivery
      </Button>
    </YStack>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <YStack gap="$2">
      <Label color="#20332f" fontWeight="800">
        {label}
      </Label>
      {children}
    </YStack>
  )
}

function FormGrid({ children }: { children: React.ReactNode }) {
  return (
    <YStack gap="$4" $gtSm={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      {children}
    </YStack>
  )
}

function OptionRow({
  active,
  icon: Icon,
  title,
  description,
  onPress,
}: {
  active: boolean
  icon: typeof Gift
  title: string
  description: string
  onPress: () => void
}) {
  return (
    <Button
      unstyled
      onPress={onPress}
      borderWidth={1}
      borderColor={active ? '#c45a1d' : '#d8d0c3'}
      backgroundColor={active ? '#ffe4cf' : '#ffffff'}
      borderRadius={8}
      padding="$4"
      cursor="pointer"
    >
      <XStack alignItems="center" gap="$3">
        <Square size={48} borderRadius={8} backgroundColor={active ? '#c45a1d' : '#fff4dc'}>
          <Icon size={24} color={active ? '#fffaf2' : '#8f5f18'} />
        </Square>
        <YStack flex={1} minWidth={0} gap="$1">
          <Text color="#20332f" fontWeight="900" fontSize={17}>
            {title}
          </Text>
          <Text color="#66736f" lineHeight={21}>
            {description}
          </Text>
        </YStack>
        {active ? <Check size={22} color="#c45a1d" /> : <ChevronRight size={19} color="#87908c" />}
      </XStack>
    </Button>
  )
}

function TrustPill({ icon: Icon, text }: { icon: typeof Gift; text: string }) {
  return (
    <XStack
      alignItems="center"
      gap="$2"
      backgroundColor="#ffffff"
      borderWidth={1}
      borderColor="#e7dfd1"
      paddingHorizontal="$3"
      paddingVertical="$2"
      borderRadius={99}
    >
      <Icon size={16} color="#c45a1d" />
      <Text color="#33413e" fontSize={13} fontWeight="800">
        {text}
      </Text>
    </XStack>
  )
}

function SummaryLine({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <XStack justifyContent="space-between" gap="$4" alignItems="center">
      <Text color="#66736f">{label}</Text>
      <Text color="#20332f" fontWeight={strong ? '900' : '700'} textAlign="right" flex={1}>
        {value}
      </Text>
    </XStack>
  )
}

function createOrderNumber() {
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `CC-${suffix}`
}

export default App
