import { CreditCard } from 'lucide-react'
import { Select, Separator, Text, YStack } from 'tamagui'

import { Field, SummaryLine } from '../components/FormControls'
import { ScreenFrame } from '../components/ScreenFrame'
import { categories, paymentMethods } from '../data/catalog'
import type { FormState } from '../types'

export function PaymentPage({
  form,
  isSubmittingOrder,
  paymentError,
  updateForm,
  onBack,
  onSubmit,
}: {
  form: FormState
  isSubmittingOrder: boolean
  paymentError: string
  updateForm: <FieldName extends keyof FormState>(field: FieldName, value: FormState[FieldName]) => void
  onBack: () => void
  onSubmit: () => void
}) {
  const selectedCategory = categories.find((category) => category.id === form.category)

  return (
    <ScreenFrame
      eyebrow="Payment Gateway"
      title="Confirm and pay for the delivery."
      subtitle="This prototype uses a mock payment confirmation."
      onBack={onBack}
      onNext={onSubmit}
      nextLabel={isSubmittingOrder ? 'Processing...' : 'Pay $18.00'}
      nextIcon={CreditCard}
      nextDisabled={isSubmittingOrder}
    >
      <YStack borderWidth={1} borderColor="#d8d0c3" backgroundColor="#ffffff" borderRadius={8} padding="$4" gap="$3">
        <SummaryLine label="College" value={form.college} />
        <SummaryLine label="Item" value={selectedCategory?.title ?? form.category} />
        <SummaryLine label="Pickup location" value={form.pickupLocation} />
        <SummaryLine label="Student" value={form.studentName || 'Student name'} />
        <Separator borderColor="#e7dfd1" />
        <SummaryLine label="Delivery fee" value="$12.00" />
        <SummaryLine label="Service fee" value="$6.00" />
        <SummaryLine label="Total" value="$18.00" strong />
      </YStack>
      <Field label="Payment method">
        <Select value={form.paymentMethod} onValueChange={(value) => updateForm('paymentMethod', value)}>
          <Select.Trigger>
            <Select.Value placeholder="Choose payment method" />
          </Select.Trigger>
          <Select.Content>
            <Select.Viewport>
              {paymentMethods.map((method, index) => (
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
  )
}
