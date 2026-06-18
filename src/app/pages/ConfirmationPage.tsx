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
        <Text
          color="#fd8828"
          fontFamily="Inter"
          fontWeight="400"
          textTransform="uppercase"
          fontSize={14}
          lineHeight={22}
          $sm={{ fontSize: 11, lineHeight: 16 }}
        >
          Email Confirmation
        </Text>
        <H2
          color="#17211f"
          fontFamily="Sora"
          textAlign="center"
          fontSize={32}
          lineHeight={40}
          fontWeight="700"
          $sm={{ fontSize: 24, lineHeight: 32 }}
        >
          Your CampusCart order is confirmed.
        </H2>
        <Paragraph
          color="#66736f"
          fontFamily="Inter"
          textAlign="center"
          fontSize={16}
          lineHeight={26}
          fontWeight="400"
          $sm={{ fontSize: 13, lineHeight: 20 }}
        >
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
      <Button
        borderRadius={8}
        backgroundColor="#fd8828"
        color="#fffaf2"
        icon={Home}
        fontFamily="Inter"
        fontSize={15}
        lineHeight={24}
        fontWeight="600"
        $sm={{ fontSize: 13, lineHeight: 20 }}
        onPress={onRestart}
      >
        Start New Delivery
      </Button>
    </YStack>
  )
}
