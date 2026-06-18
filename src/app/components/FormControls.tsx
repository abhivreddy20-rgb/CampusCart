import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Check, ChevronRight } from 'lucide-react'
import { Button, Label, Square, Text, XStack, YStack } from 'tamagui'

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <YStack gap="$2">
      <Label
        color="#24312d"
        fontFamily="Inter"
        fontWeight="400"
        fontSize={14}
        lineHeight={22}
        $sm={{ fontSize: 12, lineHeight: 18 }}
      >
        {label}
      </Label>
      {children}
    </YStack>
  )
}

export function FormGrid({ children }: { children: ReactNode }) {
  return (
    <YStack gap="$4" $gtSm={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      {children}
    </YStack>
  )
}

export function OptionRow({
  active,
  icon: Icon,
  imageUrl,
  imageAlt,
  fallbackText,
  title,
  description,
  details,
  onPress,
}: {
  active: boolean
  icon: LucideIcon
  imageUrl?: string | null
  imageAlt?: string
  fallbackText?: string
  title: string
  description: string
  details?: { label: string; value: string }[]
  onPress: () => void
}) {
  return (
    <Button
      unstyled
      onPress={onPress}
      borderWidth={1}
      borderColor={active ? '#9d6a3f' : '#ddd3c4'}
      backgroundColor={active ? '#f5eadc' : '#fffdf8'}
      borderRadius={18}
      padding="$4"
      cursor="pointer"
      shadowColor={active ? 'rgba(24, 35, 31, 0.14)' : 'rgba(24, 35, 31, 0.06)'}
      shadowRadius={active ? 18 : 10}
      shadowOffset={{ width: 0, height: active ? 10 : 5 }}
    >
      <XStack alignItems="center" gap="$3">
        <Square
          size={48}
          borderRadius={12}
          backgroundColor={active ? '#b7602d' : '#f3eadb'}
          borderColor={active ? '#d28a54' : '#e3d7c7'}
          borderWidth={1}
          overflow="hidden"
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={imageAlt ?? title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                padding: 6,
                backgroundColor: '#fffdf8',
              }}
            />
          ) : fallbackText ? (
            <Text
              color={active ? '#fff8ed' : '#8a623d'}
              fontFamily="Inter"
              fontWeight="600"
              fontSize={15}
              lineHeight={24}
            >
              {fallbackText}
            </Text>
          ) : (
            <Icon size={24} color={active ? '#fff8ed' : '#8a623d'} />
          )}
        </Square>
        <YStack flex={1} minWidth={0} gap="$1">
          <Text
            color="#18231f"
            fontFamily="Sora"
            fontWeight="600"
            fontSize={20}
            lineHeight={28}
            $sm={{ fontSize: 16, lineHeight: 22 }}
          >
            {title}
          </Text>
          <Text
            color="#63716c"
            fontFamily="Inter"
            fontSize={16}
            lineHeight={26}
            fontWeight="400"
            $sm={{ fontSize: 13, lineHeight: 20 }}
          >
            {description}
          </Text>
          {details?.length ? (
            <YStack gap="$1" paddingTop="$1">
              {details.map((detail) => (
                <XStack key={detail.label} gap="$2" alignItems="baseline" flexWrap="wrap">
                  <Text
                    color="#8a4a24"
                    fontFamily="Inter"
                    fontSize={14}
                    lineHeight={22}
                    fontWeight="400"
                    textTransform="uppercase"
                  >
                    {detail.label}
                  </Text>
                  <Text
                    color="#4f5d58"
                    fontFamily="Inter"
                    fontSize={16}
                    lineHeight={26}
                    fontWeight="400"
                    flex={1}
                    $sm={{ fontSize: 13, lineHeight: 20 }}
                  >
                    {detail.value}
                  </Text>
                </XStack>
              ))}
            </YStack>
          ) : null}
        </YStack>
        {active ? <Check size={22} color="#9d6a3f" /> : <ChevronRight size={19} color="#87908c" />}
      </XStack>
    </Button>
  )
}

export function SummaryLine({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <XStack justifyContent="space-between" gap="$4" alignItems="center">
      <Text
        color="#63716c"
        fontFamily="Inter"
        fontSize={16}
        lineHeight={26}
        fontWeight="400"
        $sm={{ fontSize: 13, lineHeight: 20 }}
      >
        {label}
      </Text>
      <Text
        color="#18231f"
        fontFamily={strong ? 'Sora' : 'Inter'}
        fontWeight={strong ? '600' : '400'}
        fontSize={strong ? 20 : 16}
        lineHeight={strong ? 28 : 26}
        textAlign="right"
        flex={1}
        $sm={{ fontSize: strong ? 16 : 13, lineHeight: strong ? 22 : 20 }}
      >
        {value}
      </Text>
    </XStack>
  )
}
