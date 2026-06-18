import { MapPin, Search } from "lucide-react";
import { Input, Text, XStack, YStack } from "tamagui";

import { OptionRow } from "../components/FormControls";
import { ScreenFrame } from "../components/ScreenFrame";
import type { College, FormState } from "../types";

export function CollegePage({
  form,
  collegeQuery,
  filteredColleges,
  isLoadingColleges,
  collegeError,
  setCollegeQuery,
  updateForm,
  onBack,
  onNext,
}: {
  form: FormState;
  collegeQuery: string;
  filteredColleges: College[];
  isLoadingColleges: boolean;
  collegeError: string;
  setCollegeQuery: (value: string) => void;
  updateForm: <FieldName extends keyof FormState>(
    field: FieldName,
    value: FormState[FieldName],
  ) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <ScreenFrame
      eyebrow="College List"
      title="Choose the student college."
      subtitle="Search available campuses for the one-day delivery service."
      onBack={onBack}
      onNext={onNext}
      nextDisabled={isLoadingColleges || Boolean(collegeError) || !form.college}
    >
      <XStack
        alignItems="center"
        gap="$2"
        borderWidth={1}
        borderColor="#d8d0c3"
        backgroundColor="#ffffff"
        borderRadius={16}
        overflow="hidden"
        paddingHorizontal="$3"
        height={54}
      >
        <Search size={19} color="#66736f" />
        <Input
          flex={1}
          height="100%"
          borderWidth={0}
          borderRadius={0}
          outlineWidth={0}
          backgroundColor="transparent"
          value={collegeQuery}
          onChangeText={setCollegeQuery}
          placeholder="Search colleges"
          focusStyle={{
            borderWidth: 0,
            outlineWidth: 0,
          }}
        />
      </XStack>
      <YStack gap="$3">
        {isLoadingColleges ? (
          <Text color="#66736f" fontWeight="800">
            Loading colleges from Supabase...
          </Text>
        ) : null}
        {collegeError ? (
          <Text color="#b42318" fontWeight="800">
            {collegeError}
          </Text>
        ) : null}
        {!isLoadingColleges &&
        !collegeError &&
        filteredColleges.length === 0 ? (
          <Text color="#66736f" fontWeight="800">
            No active colleges found.
          </Text>
        ) : null}
        {filteredColleges.map((college) => (
          <OptionRow
            key={college.id}
            active={form.college === college.name}
            icon={MapPin}
            imageUrl={college.logo_url}
            imageAlt={`${college.name} logo`}
            fallbackText={getCollegeInitials(college.name)}
            title={college.name}
            description={formatCollegeLocation(college)}
            onPress={() => updateForm("college", college.name)}
          />
        ))}
      </YStack>
    </ScreenFrame>
  );
}

function formatCollegeLocation(college: College) {
  const location = [college.city, college.state].filter(Boolean).join(", ");
  return location || "Available for parent-to-student campus delivery";
}

function getCollegeInitials(name: string) {
  return name
    .replace(/\b(university|college|of|the|at|and)\b/gi, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}
