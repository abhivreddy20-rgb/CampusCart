import type { LucideIcon } from 'lucide-react'
import { Text, XStack } from 'tamagui'

export function TrustPill({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <XStack
      alignItems="center"
      gap="$2"
      backgroundColor="rgba(255, 253, 248, 0.84)"
      borderWidth={1}
      borderColor="#ded4c4"
      paddingHorizontal="$3"
      paddingVertical="$2"
      borderRadius={99}
      shadowColor="rgba(22, 31, 29, 0.08)"
      shadowRadius={16}
      shadowOffset={{ width: 0, height: 8 }}
    >
      <Icon size={16} color="#9d6a3f" />
      <Text
        color="#2f3c38"
        fontFamily="Inter"
        fontSize={15}
        lineHeight={24}
        fontWeight="500"
        $sm={{ fontSize: 12, lineHeight: 18 }}
      >
        {text}
      </Text>
    </XStack>
  )
}
