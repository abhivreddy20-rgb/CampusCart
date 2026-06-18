import { Input, TextArea } from "tamagui";

import { Field, FormGrid } from "../components/FormControls";
import { ScreenFrame } from "../components/ScreenFrame";
import type { FormState } from "../types";

export function StudentPage({
  form,
  updateForm,
  onBack,
  onNext,
}: {
  form: FormState;
  updateForm: <FieldName extends keyof FormState>(
    field: FieldName,
    value: FormState[FieldName],
  ) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <ScreenFrame
      eyebrow="Student Information"
      title="Where should we deliver it?"
      subtitle="Clear student details help us complete the campus handoff quickly."
      onBack={onBack}
      onNext={onNext}
    >
      <FormGrid>
        <Field label="Student Full Name">
          <Input
            value={form.studentName}
            onChangeText={(value) => updateForm("studentName", value)}
            placeholder="Aarav Sharma"
          />
        </Field>
        <Field label="Student Phone Number">
          <Input
            value={form.studentPhone}
            onChangeText={(value) => updateForm("studentPhone", value)}
            placeholder="+1 555 019 2145"
          />
        </Field>
      </FormGrid>
      <Field label="Delivery instructions or gift message">
        <TextArea
          minHeight={120}
          value={form.instructions}
          onChangeText={(value) => updateForm("instructions", value)}
          placeholder="Please call before delivery. Message: Happy birthday, we love you."
        />
      </Field>
    </ScreenFrame>
  );
}
