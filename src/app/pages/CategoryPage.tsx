import { CheckCircle2 } from "lucide-react";
import { Select, Square, Text, TextArea, XStack, YStack } from "tamagui";

import { categories } from "../data/catalog";
import { Field, OptionRow } from "../components/FormControls";
import { ScreenFrame } from "../components/ScreenFrame";
import type { FormState, PickupLocation } from "../types";

export function CategoryPage({
  form,
  pickupLocations,
  isLoadingPickupLocations,
  pickupLocationError,
  updateForm,
  onBack,
  onNext,
}: {
  form: FormState;
  pickupLocations: PickupLocation[];
  isLoadingPickupLocations: boolean;
  pickupLocationError: string;
  updateForm: <FieldName extends keyof FormState>(
    field: FieldName,
    value: FormState[FieldName],
  ) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const selectedCategory =
    categories.find((category) => category.id === form.category) ??
    categories[0];

  return (
    <ScreenFrame
      eyebrow="Delivery Item"
      title="What do you want to send?"
      subtitle="Choose one category and add details for the delivery team."
      onBack={onBack}
      onNext={onNext}
    >
      <YStack gap="$3">
        {categories.map((category) => (
          <OptionRow
            key={category.id}
            active={form.category === category.id}
            icon={category.icon}
            title={category.title}
            description={category.description}
            onPress={() => updateForm("category", category.id)}
          />
        ))}
      </YStack>
      <YStack
        gap="$3"
        padding="$4"
        borderRadius={8}
        borderWidth={1}
        borderColor="#e0d2bf"
        backgroundColor="#fff8ed"
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
            How to pack it
          </Text>
          <Text
            color="#18231f"
            fontFamily="Sora"
            fontSize={20}
            lineHeight={28}
            fontWeight="600"
            $sm={{ fontSize: 16, lineHeight: 22 }}
          >
            {selectedCategory.title} packing instructions
          </Text>
        </YStack>
        <YStack gap="$2">
          {selectedCategory.packingInstructions.map((instruction) => (
            <XStack key={instruction} gap="$3" alignItems="flex-start">
              <Square size={24} borderRadius={6} backgroundColor="#f1dfc8">
                <CheckCircle2 size={15} color="#b7602d" />
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
                {instruction}
              </Text>
            </XStack>
          ))}
        </YStack>
      </YStack>
      <Field label="Parent Drop off location">
        <Select
          value={form.pickupLocation}
          onValueChange={(value) => updateForm("pickupLocation", value)}
          disabled={isLoadingPickupLocations || pickupLocations.length === 0}
        >
          <Select.Trigger>
            <Select.Value
              placeholder={
                isLoadingPickupLocations
                  ? "Loading drop off locations"
                  : "Choose drop off location"
              }
            />
          </Select.Trigger>
          <Select.Content>
            <Select.Viewport>
              {pickupLocations.map((location, index) => (
                <Select.Item index={index} key={location.id} value={location.name}>
                  <Select.ItemText>{formatPickupLocationLabel(location)}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select>
        {pickupLocationError ? (
          <Text color="#b42318" fontSize={13} fontWeight="700">
            {pickupLocationError}
          </Text>
        ) : null}
      </Field>
      <Field label="Item details">
        <TextArea
          minHeight={110}
          value={form.itemDetails}
          onChangeText={(value) => updateForm("itemDetails", value)}
          placeholder="Example: chocolate cake, handwritten note, and a small flower bouquet."
        />
      </Field>
    </ScreenFrame>
  );
}

function formatPickupLocationLabel(location: PickupLocation) {
  const addressParts = [location.address, location.city, location.state]
    .filter(Boolean)
    .join(", ");

  return addressParts ? `${location.name} - ${addressParts}` : location.name;
}
