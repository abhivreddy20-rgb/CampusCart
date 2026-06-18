import { useState } from 'react'
import { Check, ChevronDown, FileText, ShieldCheck } from 'lucide-react'
import { Button, Dialog, Input, Label, ScrollView, Select, Square, Text, XStack, YStack } from 'tamagui'

import { savePreRegistration } from '../api/preRegistrations'
import { ScreenFrame } from '../components/ScreenFrame'
import { liabilityPoints, terms } from '../data/catalog'
import type { PreRegistrationForm } from '../types'
import { formatPhoneNumber, isValidEmail, isValidPhoneNumber } from '../utils/validation'

const collegeOptions = ['UCLA', 'USC']
const privacyPoints = [
  'We collect your name, email, phone number, and selected college only for pre-registration and launch communication.',
  'Your contact details may be used to confirm your interest, share launch updates, and coordinate early access pricing.',
  'Your pre-registration details are stored in our Supabase backend and are not shown publicly in the app.',
  'We do not sell your personal information.',
  'You can request correction or removal of your pre-registration details by contacting DormDrop support.',
]

export function PreRegistrationPage({
  onBack,
  onSuccess,
}: {
  onBack: () => void
  onSuccess: () => void
}) {
  const [form, setForm] = useState<PreRegistrationForm>({
    name: '',
    email: '',
    phone: '',
    college: '',
  })
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const isComplete = Boolean(
    form.name.trim() && isValidEmail(form.email) && isValidPhoneNumber(form.phone) && form.college,
  )

  const updateForm = (field: keyof typeof form, value: string) => {
    setErrorMessage('')
    setForm((current) => ({ ...current, [field]: value }))
  }

  const submitPreRegistration = async () => {
    if (!isComplete) {
      return
    }

    setIsSaving(true)
    setErrorMessage('')

    try {
      await savePreRegistration(form)
      onSuccess()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Pre-registration could not be saved'
      setErrorMessage(message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <ScreenFrame
      eyebrow="Pre Registration"
      title="Lock in pre-release delivery pricing."
      subtitle="Share your details for launch access at UCLA or USC."
      onBack={onBack}
      onNext={submitPreRegistration}
      nextLabel={isSaving ? 'Saving...' : 'Register'}
      nextDisabled={!isComplete || isSaving}
    >
      <XStack gap="$3" flexWrap="wrap">
        <PriceTile eyebrow="Monthly subscription" regular="$200" preorder="$175" />
        <PriceTile eyebrow="One-time delivery" regular="$75" preorder="$60" />
      </XStack>

      <YStack
        gap="$4"
        padding="$4"
        borderRadius={8}
        borderWidth={1}
        borderColor="#e2d4c0"
        backgroundColor="#fffdf8"
      >
        <XStack gap="$3" flexWrap="wrap">
          <YStack gap="$2" flex={1} minWidth={240}>
            <Label color="#24312d" fontWeight="900" fontSize={14}>
              Full name
            </Label>
            <Input
              value={form.name}
              onChangeText={(value) => updateForm('name', value)}
              placeholder="Parent name"
            />
          </YStack>
          <YStack gap="$2" flex={1} minWidth={240}>
            <Label color="#24312d" fontWeight="900" fontSize={14}>
              Email
            </Label>
            <Input
              value={form.email}
              onChangeText={(value) => updateForm('email', value)}
              placeholder="parent@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </YStack>
        </XStack>

        <XStack gap="$3" flexWrap="wrap">
          <YStack gap="$2" flex={1} minWidth={240}>
            <Label color="#24312d" fontWeight="900" fontSize={14}>
              Phone number
            </Label>
            <Input
              value={form.phone}
              onChangeText={(value) => updateForm('phone', formatPhoneNumber(value))}
              placeholder="555-014-8890"
              keyboardType="phone-pad"
            />
          </YStack>
          <YStack gap="$2" flex={1} minWidth={240}>
            <Label color="#24312d" fontWeight="900" fontSize={14}>
              College
            </Label>
            <Select value={form.college} onValueChange={(value) => updateForm('college', value)}>
              <Select.Trigger
                backgroundColor="#fffdf8"
                borderColor="#d7cdbc"
                borderWidth={1}
                color="#18231f"
                borderRadius={8}
                iconAfter={<ChevronDown size={18} color="#8a623d" />}
              >
                <Select.Value placeholder="Choose college" />
              </Select.Trigger>
              <Select.Content>
                <Select.Viewport>
                  {collegeOptions.map((college, index) => (
                    <Select.Item index={index} key={college} value={college}>
                      <Select.ItemText>{college}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select>
          </YStack>
        </XStack>

        {errorMessage ? (
          <Text color="#b42318" fontWeight="800">
            {errorMessage}
          </Text>
        ) : null}
      </YStack>

      <XStack
        alignItems="center"
        gap="$3"
        padding="$4"
        borderWidth={1}
        borderColor="#d8d0c3"
        backgroundColor="#ffffff"
        borderRadius={8}
        flexWrap="wrap"
      >
        <Text flex={1} color="#20332f" lineHeight={22} minWidth={220}>
          View how pre-registration, privacy, terms, and liability work before submitting.
        </Text>
        <PolicyDialog />
      </XStack>
    </ScreenFrame>
  )
}

function PolicyDialog() {
  return (
    <Dialog modal>
      <Dialog.Trigger asChild>
        <Button
          borderRadius={8}
          backgroundColor="#fffdf8"
          borderColor="#d9cfbf"
          borderWidth={1}
          color="#60452e"
          icon={FileText}
        >
          View Policy
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.42}
          backgroundColor="#000000"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Dialog.Content
          bordered
          elevate
          key="content"
          animation="quick"
          width="min(92vw, 720px)"
          maxHeight="86vh"
          borderRadius={8}
          backgroundColor="#fffdf8"
          borderColor="#e0d2bf"
          padding="$0"
          enterStyle={{ opacity: 0, scale: 0.98, y: 8 }}
          exitStyle={{ opacity: 0, scale: 0.98, y: 8 }}
        >
          <YStack gap="$0">
            <YStack padding="$4" gap="$1" borderBottomWidth={1} borderColor="#eadfce">
              <Dialog.Title color="#151f1c" fontSize={24} fontWeight="900">
                Privacy Policy & Terms
              </Dialog.Title>
              <Dialog.Description color="#63716c" lineHeight={22}>
                Please review these points before completing pre-registration.
              </Dialog.Description>
            </YStack>

            <ScrollView maxHeight="62vh">
              <YStack padding="$4" gap="$5">
                <PolicySection title="Privacy Policy" icon={ShieldCheck} points={privacyPoints} />
                <PolicySection title="Terms & Conditions" icon={FileText} points={terms} />
                <PolicySection title="Liability Points" icon={FileText} points={liabilityPoints} />
              </YStack>
            </ScrollView>

            <XStack justifyContent="flex-end" padding="$4" borderTopWidth={1} borderColor="#eadfce">
              <Dialog.Close asChild>
                <Button borderRadius={8} backgroundColor="#b7602d" color="#fbfaf7">
                  Close
                </Button>
              </Dialog.Close>
            </XStack>
          </YStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}

function PolicySection({
  title,
  icon: Icon,
  points,
}: {
  title: string
  icon: typeof ShieldCheck
  points: string[]
}) {
  return (
    <YStack gap="$3">
      <XStack alignItems="center" gap="$2">
        <Square size={34} borderRadius={8} backgroundColor="#fff3e3">
          <Icon size={18} color="#b7602d" />
        </Square>
        <Text color="#18231f" fontSize={18} fontWeight="900">
          {title}
        </Text>
      </XStack>
      <YStack gap="$2">
        {points.map((point) => (
          <XStack key={point} gap="$3" alignItems="flex-start">
            <Square size={24} borderRadius={6} backgroundColor="#f1dfc8">
              <Check size={14} color="#b7602d" />
            </Square>
            <Text flex={1} color="#4f5d58" lineHeight={22}>
              {point}
            </Text>
          </XStack>
        ))}
      </YStack>
    </YStack>
  )
}

function PriceTile({
  eyebrow,
  regular,
  preorder,
}: {
  eyebrow: string
  regular: string
  preorder: string
}) {
  return (
    <YStack
      flex={1}
      minWidth={250}
      gap="$2"
      padding="$3"
      borderRadius={8}
      borderWidth={1}
      borderColor="#d9c3aa"
      backgroundColor="#fff8ed"
      $sm={{ minWidth: 0, padding: "$2.5", gap: "$1.5" }}
    >
      <Text
        color="#8a4a24"
        fontFamily="Inter"
        fontSize={12}
        lineHeight={18}
        fontWeight="700"
        textTransform="uppercase"
        $sm={{ fontSize: 11, lineHeight: 16 }}
      >
        {eyebrow}
      </Text>
      <XStack justifyContent="space-between" gap="$3" alignItems="baseline">
        <Text color="#68746f" fontFamily="Inter" fontSize={14} lineHeight={20} fontWeight="600">
          Regular
        </Text>
        <Text
          color="#18231f"
          fontFamily="Sora"
          fontSize={18}
          lineHeight={24}
          fontWeight="600"
          textDecorationLine="line-through"
          opacity={0.58}
          $sm={{ fontSize: 16, lineHeight: 22 }}
        >
          {regular}
        </Text>
      </XStack>
      <XStack justifyContent="space-between" gap="$3" alignItems="baseline">
        <Text color="#8a4a24" fontFamily="Inter" fontSize={14} lineHeight={20} fontWeight="700">
          Pre-register
        </Text>
        <Text
          color="#b7602d"
          fontFamily="Sora"
          fontSize={22}
          lineHeight={28}
          fontWeight="700"
          $sm={{ fontSize: 18, lineHeight: 24 }}
        >
          {preorder}
        </Text>
      </XStack>
    </YStack>
  )
}
