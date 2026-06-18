import type { ReactNode } from "react";
import { MailCheck, ShieldCheck } from "lucide-react";
import { XStack, YStack } from "tamagui";

import { TrustPill } from "./TrustPill";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <YStack minHeight="100vh" backgroundColor="#f4f1ea">
      <YStack
        width="100%"
        minHeight="100vh"
        paddingHorizontal="$5"
        paddingVertical="$4"
        gap="$3.5"
        $sm={{ paddingHorizontal: "$3", paddingVertical: "$3" }}
      >
        <XStack
          alignItems="center"
          justifyContent="space-between"
          gap="$3"
          paddingHorizontal="$2"
        >
          <XStack alignItems="center" gap="$3">
            <img
              src="/images/Logo-dormdrop.svg"
              alt="DormDrop Express"
              style={{
                display: "block",
                width: "clamp(130px, 15vw, 190px)",
                height: "auto",
                maxHeight: 86,
                objectFit: "contain",
                objectPosition: "left center",
              }}
            />
          </XStack>
          <XStack
            display="flex"
            $sm={{ display: "none" }}
            gap="$2"
            alignItems="center"
          >
            <TrustPill icon={ShieldCheck} text="Verified handoff" />
            <TrustPill icon={MailCheck} text="Email updates" />
          </XStack>
        </XStack>

        <YStack
          flex={1}
          minHeight={0}
          backgroundColor="#fbfaf7"
          borderWidth={1}
          borderColor="#e2d8c8"
          borderRadius={14}
          overflow="hidden"
          shadowColor="rgba(27, 35, 32, 0.14)"
          shadowRadius={34}
          shadowOffset={{ width: 0, height: 18 }}
        >
          {children}
        </YStack>
      </YStack>
    </YStack>
  );
}
