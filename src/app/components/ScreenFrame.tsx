import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button, H2, Paragraph, ScrollView, Text, XStack, YStack } from 'tamagui'

export function ScreenFrame({
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
  children: ReactNode
  onBack: () => void
  onNext: () => void
  nextLabel?: string
  nextIcon?: LucideIcon
  nextDisabled?: boolean
}) {
  const NextIcon = nextIcon

  return (
    <YStack flex={1}>
      <ScrollView flex={1}>
        <YStack
          padding="$6"
          gap="$5"
          maxWidth={850}
          width="100%"
          marginHorizontal="auto"
          $sm={{ padding: "$4" }}
        >
          <YStack gap="$2">
            <Text color="#8a623d" fontSize={12} fontWeight="900" textTransform="uppercase">
              {eyebrow}
            </Text>
            <H2
              color="#151f1c"
              fontSize={36}
              lineHeight={42}
              fontWeight="900"
              $sm={{ fontSize: 29, lineHeight: 35 }}
            >
              {title}
            </H2>
            <Paragraph color="#63716c" fontSize={17} lineHeight={27}>
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
        borderColor="#e1d7c8"
        backgroundColor="rgba(251, 250, 247, 0.95)"
      >
        <Button
          borderRadius={8}
          backgroundColor="#fffdf8"
          borderColor="#d9cfbf"
          borderWidth={1}
          color="#60452e"
          icon={ArrowLeft}
          onPress={onBack}
        >
          Back
        </Button>
        <Button
          borderRadius={8}
          backgroundColor={nextDisabled ? '#c7ad95' : '#b7602d'}
          color="#fbfaf7"
          iconAfter={NextIcon}
          shadowColor="rgba(183, 96, 45, 0.24)"
          shadowRadius={16}
          shadowOffset={{ width: 0, height: 8 }}
          onPress={onNext}
          disabled={nextDisabled}
        >
          {nextLabel}
        </Button>
      </XStack>
    </YStack>
  )
}
