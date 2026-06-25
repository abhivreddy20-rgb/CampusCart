import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Check, ChevronDown, FileText, Route, ShieldCheck } from "lucide-react";
import {
  Button,
  Dialog,
  Input,
  Label,
  ScrollView,
  Select,
  Square,
  Text,
  XStack,
  YStack,
} from "tamagui";

import { savePreRegistration } from "../api/preRegistrations";
import { ScreenFrame } from "../components/ScreenFrame";
import { liabilityPoints, terms } from "../data/catalog";
import type { PreRegistrationForm } from "../types";
import {
  formatPhoneNumber,
  isValidEmail,
  isValidPhoneNumber,
} from "../utils/validation";

const collegeOptions = ["UCLA"];
const privacyPoints = [
  "We collect only the information required to manage your pre-registration, including your name, email address, phone number, and selected college.",
  "Your information is used to confirm your interest, provide launch updates, coordinate early access, and support future DormDrop service communication.",
  "We maintain appropriate safeguards designed to protect your personal information from unauthorized access, disclosure, alteration, or misuse.",
  "We do not sell, rent, or trade your personal information. Information is shared only when necessary to operate our services, comply with legal obligations, or protect users and the platform.",
  "You may request access, correction, or deletion of your pre-registration information by contacting DormDrop support.",
];
const howItWorksPoints = [
  {
    title: "Choose Your Delivery Plan",
    details: [
      "One-Time Delivery: for occasional food, documents, gifts, or essentials.",
      "Monthly Subscription: up to 4 deliveries per month for families who regularly send items to students.",
    ],
  },
  {
    title: "Parent Drop-Off",
    details: [
      "Parent drop-off is available on Sunday morning.",
      "Parents must bring their item to a designated drop-off location.",
    ],
  },
  {
    title: "Secure Verification",
    details: [
      "Both the sender and student provide the required verification details.",
      "This helps ensure the package reaches the correct recipient safely.",
    ],
  },
  {
    title: "Same-Day Campus Delivery",
    details: [
      "After verification, the package is delivered to a designated loaction on the campus the same day.",
      "The Parent receives confirmation when delivery is completed.",
    ],
  },
];

type PolicyPoint =
  | string
  | {
      title: string;
      details: string[];
    };

export function PreRegistrationPage({
  onBack,
  onSuccess,
}: {
  onBack: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState<PreRegistrationForm>({
    name: "",
    email: "",
    phone: "",
    college: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isComplete = Boolean(
    form.name.trim() &&
    isValidEmail(form.email) &&
    isValidPhoneNumber(form.phone) &&
    form.college,
  );

  const updateForm = (field: keyof typeof form, value: string) => {
    setErrorMessage("");
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submitPreRegistration = async () => {
    if (!isComplete) {
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      await savePreRegistration(form);
      onSuccess();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Pre-registration could not be saved";
      setErrorMessage(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScreenFrame
      eyebrow="Pre Registration"
      title="Get Early Access to DormDrop."
      subtitle="We're preparing to launch at UCLA. Sign up to receive updates, launch announcements, and priority access."
      onBack={onBack}
      onNext={submitPreRegistration}
      nextLabel={isSaving ? "Saving..." : "Register"}
      nextDisabled={!isComplete || isSaving}
    >
      {/*
      <XStack gap="$3" flexWrap="wrap">
        <PriceTile eyebrow="Monthly subscription" regular="$200" preorder="$175" />
        <PriceTile eyebrow="One-time delivery" regular="$75" preorder="$60" />
      </XStack>
      */}

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
              onChangeText={(value) => updateForm("name", value)}
              placeholder="Parent name"
            />
          </YStack>
          <YStack gap="$2" flex={1} minWidth={240}>
            <Label color="#24312d" fontWeight="900" fontSize={14}>
              Email
            </Label>
            <Input
              value={form.email}
              onChangeText={(value) => updateForm("email", value)}
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
              onChangeText={(value) =>
                updateForm("phone", formatPhoneNumber(value))
              }
              placeholder="555-014-8890"
              keyboardType="phone-pad"
            />
          </YStack>
          <YStack gap="$2" flex={1} minWidth={240}>
            <Label color="#24312d" fontWeight="900" fontSize={14}>
              College
            </Label>
            <Select
              value={form.college}
              onValueChange={(value) => updateForm("college", value)}
            >
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

      <XStack alignItems="center" gap="$1.5" flexWrap="wrap">
        <Text color="#20332f" lineHeight={22}>
          Please review
        </Text>
        <PolicyDialog
          triggerLabel="How It Works"
          title="How It Works"
          description=""
          sections={[
            {
              title: "",
              icon: Route,
              points: howItWorksPoints,
              hideHeader: true,
            },
          ]}
        />
        <Text color="#20332f" lineHeight={22}>
          ,
        </Text>
        <PolicyDialog
          triggerLabel="Terms & Conditions"
          title="Terms & Conditions"
          description="Key terms for pre-registration and campus delivery."
          sections={[
            { title: "Terms & Conditions", icon: FileText, points: terms },
            {
              title: "Liability Points",
              icon: FileText,
              points: liabilityPoints,
            },
          ]}
        />
        <Text color="#20332f" lineHeight={22}>
          , and
        </Text>
        <PolicyDialog
          triggerLabel="Privacy Policy"
          title="Privacy Policy"
          description="How pre-registration contact details are collected and used."
          sections={[
            {
              title: "Privacy Policy",
              icon: ShieldCheck,
              points: privacyPoints,
            },
          ]}
        />
        <Text color="#20332f" lineHeight={22}>
          before submitting.
        </Text>
      </XStack>
    </ScreenFrame>
  );
}

function PolicyDialog({
  triggerLabel,
  title,
  description,
  sections,
}: {
  triggerLabel: string;
  title: string;
  description: string;
  sections: {
    title: string;
    icon: LucideIcon;
    points: PolicyPoint[];
    hideHeader?: boolean;
  }[];
}) {
  return (
    <Dialog modal>
      <Dialog.Trigger asChild>
        <Button
          unstyled
          borderRadius={8}
          backgroundColor="transparent"
          color="#8a4a24"
          cursor="pointer"
          fontFamily="Inter"
          fontSize={14}
          lineHeight={22}
          fontWeight="800"
          padding={0}
          hoverStyle={{
            backgroundColor: "transparent",
            color: "#b7602d",
            textDecorationLine: "underline",
          }}
          pressStyle={{
            backgroundColor: "transparent",
            color: "#864721",
          }}
        >
          {triggerLabel}
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
            <YStack
              padding="$4"
              gap="$1"
              borderBottomWidth={1}
              borderColor="#eadfce"
            >
              <Dialog.Title color="#151f1c" fontSize={24} fontWeight="900">
                {title}
              </Dialog.Title>
              <Dialog.Description color="#63716c" lineHeight={22}>
                {description}
              </Dialog.Description>
            </YStack>

            <ScrollView maxHeight="62vh">
              <YStack padding="$4" gap="$5">
                {sections.map((section) => (
                  <PolicySection
                    key={section.title}
                    title={section.title}
                    icon={section.icon}
                    points={section.points}
                    hideHeader={section.hideHeader}
                  />
                ))}
              </YStack>
            </ScrollView>

            <XStack
              justifyContent="flex-end"
              padding="$4"
              borderTopWidth={1}
              borderColor="#eadfce"
            >
              <Dialog.Close asChild>
                <Button
                  borderRadius={8}
                  backgroundColor="#b7602d"
                  color="#fbfaf7"
                >
                  Close
                </Button>
              </Dialog.Close>
            </XStack>
          </YStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}

function PolicySection({
  title,
  icon: Icon,
  points,
  hideHeader = false,
}: {
  title: string;
  icon: LucideIcon;
  points: PolicyPoint[];
  hideHeader?: boolean;
}) {
  return (
    <YStack gap="$3">
      {!hideHeader ? (
        <XStack alignItems="center" gap="$2">
          <Square size={34} borderRadius={8} backgroundColor="#fff3e3">
            <Icon size={18} color="#b7602d" />
          </Square>
          <Text color="#18231f" fontSize={18} fontWeight="900">
            {title}
          </Text>
        </XStack>
      ) : null}
      <YStack gap="$2">
        {points.map((point) => {
          const key = typeof point === "string" ? point : point.title;

          return (
            <XStack key={key} gap="$3" alignItems="flex-start">
              <Square size={24} borderRadius={6} backgroundColor="#f1dfc8">
                <Check size={14} color="#b7602d" />
              </Square>
              {typeof point === "string" ? (
                <Text flex={1} color="#4f5d58" fontSize={13} lineHeight={19}>
                  {point}
                </Text>
              ) : (
                <YStack flex={1} gap="$1">
                  <Text color="#24312d" fontWeight="900" lineHeight={22}>
                    {point.title}
                  </Text>
                  {point.details.map((detail) => (
                    <Text
                      key={detail}
                      color="#4f5d58"
                      fontSize={13}
                      lineHeight={19}
                    >
                      {detail}
                    </Text>
                  ))}
                </YStack>
              )}
            </XStack>
          );
        })}
      </YStack>
    </YStack>
  );
}

function PriceTile({
  eyebrow,
  regular,
  preorder,
}: {
  eyebrow: string;
  regular: string;
  preorder: string;
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
        <Text
          color="#68746f"
          fontFamily="Inter"
          fontSize={14}
          lineHeight={20}
          fontWeight="600"
        >
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
        <Text
          color="#8a4a24"
          fontFamily="Inter"
          fontSize={14}
          lineHeight={20}
          fontWeight="700"
        >
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
  );
}
