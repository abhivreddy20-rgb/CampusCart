import { Home, MailCheck } from 'lucide-react'
import { Button, H2, Paragraph, Square, Text, YStack } from 'tamagui'

import { SummaryLine } from '../components/FormControls'
import type { FormState } from '../types'

export function ConfirmationPage({
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
        <MailCheck size={42} color="#fd8828" />
      </Square>
      <YStack alignItems="center" gap="$2" maxWidth={680}>
        <Text color="#fd8828" fontWeight="900" textTransform="uppercase" fontSize={13}>
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
      <YStack width="100%" maxWidth={560} borderWidth={1} borderColor="#d8d0c3" backgroundColor="#ffffff" borderRadius={8} padding="$4" gap="$3">
        <SummaryLine label="Order ID" value={orderNumber} strong />
        <SummaryLine label="College" value={form.college} />
        <SummaryLine label="Category" value={form.category} />
        <SummaryLine label="Pickup location" value={form.pickupLocation || 'Pickup location'} />
        <SummaryLine label="Student" value={form.studentName || 'Student name'} />
        <SummaryLine label="Delivery window" value="Today, before 8:00 PM" />
      </YStack>
      <Button borderRadius={8} backgroundColor="#fd8828" color="#fffaf2" icon={Home} onPress={onRestart}>
        Start New Delivery
      </Button>
    </YStack>
  )
}
