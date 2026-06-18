import { Input, Text } from "tamagui";

import { Field, FormGrid } from "../components/FormControls";
import { ScreenFrame } from "../components/ScreenFrame";
import type { FormState } from "../types";
import { formatPhoneNumber, isValidEmail, isValidPhoneNumber } from "../utils/validation";

export function RegistrationPage({
  form,
  isSavingRegistration,
  registrationError,
  updateForm,
  onBack,
  onNext,
}: {
  form: FormState;
  isSavingRegistration: boolean;
  registrationError: string;
  updateForm: <FieldName extends keyof FormState>(
    field: FieldName,
    value: FormState[FieldName],
  ) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const hasEmail = Boolean(form.email.trim());
  const hasPhone = Boolean(form.phone.trim());
  const emailIsValid = isValidEmail(form.email);
  const phoneIsValid = isValidPhoneNumber(form.phone);
  const isIncomplete =
    !form.parentName.trim() ||
    !emailIsValid ||
    !phoneIsValid ||
    form.password.trim().length < 8;

  return (
    <ScreenFrame
      eyebrow="Registration"
      title="Create the parent delivery account."
      subtitle="We use this information for login, order receipts, and delivery updates."
      onBack={onBack}
      onNext={onNext}
      nextLabel={isSavingRegistration ? "Saving..." : "Continue"}
      nextDisabled={isSavingRegistration || isIncomplete}
    >
      <FormGrid>
        <Field label="Full Name">
          <Input
            value={form.parentName}
            onChangeText={(value) => updateForm("parentName", value)}
            placeholder="Priya Sharma"
          />
        </Field>
        <Field label="Email address">
          <Input
            value={form.email}
            onChangeText={(value) => updateForm("email", value)}
            placeholder="parent@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {hasEmail && !emailIsValid ? (
            <Text color="#b42318" fontSize={13} fontWeight="800">
              Enter a valid email address.
            </Text>
          ) : null}
        </Field>
        <Field label="Phone number">
          <Input
            value={form.phone}
            onChangeText={(value) => updateForm("phone", formatPhoneNumber(value))}
            placeholder="555-014-8890"
            keyboardType="phone-pad"
          />
          {hasPhone && !phoneIsValid ? (
            <Text color="#b42318" fontSize={13} fontWeight="800">
              Enter a 10-digit phone number.
            </Text>
          ) : null}
        </Field>
        <Field label="Create password">
          <Input
            value={form.password}
            onChangeText={(value) => updateForm("password", value)}
            placeholder="At least 8 characters"
            secureTextEntry
          />
        </Field>
      </FormGrid>
      {registrationError ? (
        <Text color="#b42318" fontWeight="800">
          {registrationError}
        </Text>
      ) : null}
    </ScreenFrame>
  );
}
