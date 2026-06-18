import { AlertTriangle, Check } from 'lucide-react'
import { Checkbox, Label, Square, Text, XStack, YStack } from 'tamagui'

import { ScreenFrame } from '../components/ScreenFrame'
import { liabilityPoints, terms } from '../data/catalog'
import type { FormState } from '../types'

export function TermsPage({
  form,
  updateForm,
  onBack,
  onNext,
}: {
  form: FormState
  updateForm: <FieldName extends keyof FormState>(field: FieldName, value: FormState[FieldName]) => void
  onBack: () => void
  onNext: () => void
}) {
  return (
    <ScreenFrame
      eyebrow="Terms And Conditions"
      title="Review the delivery rules."
      subtitle="CampusCart can only deliver approved items with accurate recipient details."
      onBack={onBack}
      onNext={onNext}
      nextDisabled={!form.acceptedTerms}
    >
      <YStack gap="$3">
        {terms.map((term) => (
          <XStack key={term} gap="$3" alignItems="flex-start">
            <Square size={28} borderRadius={6} backgroundColor="#ffe4cf">
              <Check size={17} color="#fd8828" />
            </Square>
            <Text
              flex={1}
              color="#33413e"
              fontFamily="Inter"
              fontSize={16}
              lineHeight={26}
              fontWeight="400"
              $sm={{ fontSize: 13, lineHeight: 20 }}
            >
              {term}
            </Text>
          </XStack>
        ))}
      </YStack>
      <YStack
        gap="$3"
        padding="$4"
        borderWidth={1}
        borderColor="#e0d2bf"
        backgroundColor="#fff8ed"
        borderRadius={8}
      >
        <YStack gap="$1">
          <Text
            color="#8a4a24"
            fontFamily="Inter"
            fontSize={12}
            lineHeight={18}
            fontWeight="400"
            textTransform="uppercase"
            $sm={{ fontSize: 11, lineHeight: 16 }}
          >
            Liability points
          </Text>
          <Text
            color="#18231f"
            fontFamily="Sora"
            fontSize={20}
            lineHeight={28}
            fontWeight="600"
            $sm={{ fontSize: 16, lineHeight: 22 }}
          >
            Please review before confirming
          </Text>
        </YStack>
        <YStack gap="$2">
          {liabilityPoints.map((point) => (
            <XStack key={point} gap="$3" alignItems="flex-start">
              <Square size={28} borderRadius={6} backgroundColor="#f1dfc8">
                <AlertTriangle size={16} color="#b7602d" />
              </Square>
              <Text
                flex={1}
                color="#5f6b66"
                fontFamily="Inter"
                fontSize={16}
                lineHeight={26}
                fontWeight="400"
                $sm={{ fontSize: 13, lineHeight: 20 }}
              >
                {point}
              </Text>
            </XStack>
          ))}
        </YStack>
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
            <Check size={16} color="#fd8828" />
          </Checkbox.Indicator>
        </Checkbox>
        <Label
          htmlFor="terms"
          flex={1}
          color="#20332f"
          fontFamily="Inter"
          fontSize={16}
          lineHeight={26}
          fontWeight="400"
          $sm={{ fontSize: 13, lineHeight: 20 }}
        >
          I agree to the terms and conditions for this CampusCart delivery.
        </Label>
      </XStack>
    </ScreenFrame>
  )
}
