import {
  ArrowRight,
  BadgeCheck,
  Cake,
  FileText,
  Gift,
  MapPin,
  Package,
  Salad,
  Sparkles,
} from "lucide-react";
import { Button, H1, Paragraph, Square, Text, XStack, YStack } from "tamagui";

import { TrustPill } from "../components/TrustPill";

const campusRunItems = [
  {
    title: "Food and snacks",
    detail: "Meals, coffee, fruit bowls, treats, and comfort food.",
    icon: Salad,
  },
  {
    title: "Documents",
    detail: "Sealed papers, forms, certificates, and envelopes.",
    icon: FileText,
  },
  {
    title: "Gifts and surprises",
    detail: "Birthday cakes, flowers, notes, and celebration bundles.",
    icon: Cake,
  },
  {
    title: "Daily essentials",
    detail: "Useful items students need quickly on campus.",
    icon: Package,
  },
];

export function HomePage({
  onStart,
  onLogin,
}: {
  onStart: () => void;
  onLogin: () => void;
}) {
  return (
    <YStack flex={1}>
      <XStack
        flex={1}
        minHeight="calc(100vh - 124px)"
        $md={{ flexDirection: "column" }}
        backgroundColor="#fbfaf7"
      >
        <YStack
          flex={1.02}
          padding="$7"
          justifyContent="center"
          gap="$5"
          $sm={{ padding: "$5" }}
        >
          <XStack
            alignSelf="flex-start"
            gap="$2"
            alignItems="center"
            backgroundColor="#f3eadb"
            borderColor="#ddd0bb"
            borderWidth={1}
            paddingHorizontal="$3"
            paddingVertical="$2"
            borderRadius={99}
          >
            <Sparkles size={16} color="#9d6a3f" />
            <Text
              color="#6f4b2d"
              fontWeight="900"
              fontSize={12}
              textTransform="uppercase"
            >
              One-day campus delivery, handled with care
            </Text>
          </XStack>
          <YStack gap="$3">
            <H1
              color="#151f1c"
              fontSize={58}
              lineHeight={62}
              fontWeight="900"
              maxWidth={680}
              $sm={{ fontSize: 39, lineHeight: 43 }}
            >
              From home to dorm, delivered today.
            </H1>
            <Paragraph
              color="#57645f"
              fontSize={19}
              lineHeight={31}
              maxWidth={650}
            >
              DormDrop helps families send meals, important documents, gifts,
              and everyday essentials directly to students through secure,
              same-day campus delivery and verified handoff.
            </Paragraph>
          </YStack>
          <XStack gap="$3" flexWrap="wrap">
            <Button
              size="$5"
              borderRadius={8}
              backgroundColor="#b7602d"
              color="#fbfaf7"
              iconAfter={ArrowRight}
              shadowColor="rgba(183, 96, 45, 0.28)"
              shadowRadius={18}
              shadowOffset={{ width: 0, height: 10 }}
              onPress={onStart}
            >
              Get Started
            </Button>
            <Button
              size="$5"
              borderRadius={8}
              backgroundColor="#fbfaf7"
              borderColor="#cdbfae"
              borderWidth={1}
              color="#1f2b27"
              onPress={onLogin}
            >
              Login
            </Button>
          </XStack>
          <XStack gap="$3" flexWrap="wrap" paddingTop="$1">
            <TrustPill icon={BadgeCheck} text="Same-day campus dropoff" />
            <TrustPill icon={FileText} text="Document safe handling" />
          </XStack>
          <XStack
            gap="$5"
            flexWrap="wrap"
            paddingTop="$3"
            borderTopWidth={1}
            borderColor="#e7ddcf"
            maxWidth={620}
          >
            <YStack gap="$1">
              <Text color="#151f1c" fontSize={25} fontWeight="900">
                4
              </Text>
              <Text color="#6b766f" fontSize={13} fontWeight="700">
                Delivery categories
              </Text>
            </YStack>
            <YStack gap="$1">
              <Text color="#151f1c" fontSize={25} fontWeight="900">
                1 day
              </Text>
              <Text color="#6b766f" fontSize={13} fontWeight="700">
                Campus coordination
              </Text>
            </YStack>
            <YStack gap="$1">
              <Text color="#151f1c" fontSize={25} fontWeight="900">
                Email
              </Text>
              <Text color="#6b766f" fontSize={13} fontWeight="700">
                Updates after checkout
              </Text>
            </YStack>
          </XStack>
        </YStack>
        <YStack
          flex={0.98}
          minHeight={520}
          position="relative"
          overflow="hidden"
          backgroundColor="#8f4b24"
          $md={{ minHeight: 600 }}
          $sm={{ minHeight: 540 }}
        >
          <img
            src="/images/campus-concierge-hero.png"
            alt="Premium campus care package handoff with flowers, pastry, and document envelope"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              position: "absolute",
              inset: 0,
            }}
          />
          <YStack
            position="absolute"
            inset={0}
            backgroundColor="rgba(92, 47, 25, 0.12)"
          />
          <YStack
            position="absolute"
            left="$5"
            right="$5"
            bottom="$5"
            backgroundColor="rgba(255, 253, 248, 0.92)"
            borderColor="rgba(255, 255, 255, 0.7)"
            borderWidth={1}
            borderRadius={8}
            padding="$4"
            gap="$3"
            maxWidth={520}
            shadowColor="rgba(0, 0, 0, 0.22)"
            shadowRadius={26}
            shadowOffset={{ width: 0, height: 16 }}
            $sm={{ left: "$3", right: "$3", bottom: "$3" }}
          >
            <YStack gap="$1">
              <XStack
                alignItems="center"
                justifyContent="space-between"
                gap="$3"
              >
                <Text color="#18231f" fontSize={18} fontWeight="900">
                  Today’s campus run
                </Text>
                <MapPin size={19} color="#9d6a3f" />
              </XStack>
              <Text color="#61706a" fontSize={13} lineHeight={20}>
                A curated handoff for useful, urgent, and personal items.
              </Text>
            </YStack>

            <YStack
              backgroundColor="#f4ecdf"
              borderColor="#e2d4c0"
              borderWidth={1}
              borderRadius={8}
              padding="$3"
              gap="$2"
            >
              <XStack alignItems="center" gap="$3">
                <Square size={42} borderRadius={8} backgroundColor="#b7602d">
                  <Gift size={21} color="#fff8ed" />
                </Square>
                <YStack flex={1} gap="$1">
                  <Text color="#18231f" fontWeight="900" fontSize={15}>
                    Concierge handoff
                  </Text>
                  <Text color="#6a5a43" fontSize={13} lineHeight={19}>
                    Tell us what to send, where the student is, and we
                    coordinate the dropoff.
                  </Text>
                </YStack>
              </XStack>
            </YStack>

            <YStack gap="$2">
              {campusRunItems.map(({ title, detail, icon: Icon }) => (
                <XStack
                  key={title}
                  gap="$3"
                  alignItems="center"
                  paddingVertical="$1.5"
                  borderBottomWidth={title === "Daily essentials" ? 0 : 1}
                  borderColor="#e8ded0"
                >
                  <Square size={40} borderRadius={8} backgroundColor="#f3eadb">
                    <Icon size={20} color="#8a623d" />
                  </Square>
                  <YStack flex={1} minWidth={0} gap="$1">
                    <Text color="#18231f" fontWeight="900" fontSize={15}>
                      {title}
                    </Text>
                    <Text color="#61706a" fontSize={13} lineHeight={18}>
                      {detail}
                    </Text>
                  </YStack>
                </XStack>
              ))}
            </YStack>
          </YStack>
        </YStack>
      </XStack>
    </YStack>
  );
}
