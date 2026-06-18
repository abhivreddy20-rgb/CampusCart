import { useState } from "react";
import { LogIn } from "lucide-react";
import { Input, Text } from "tamagui";

import { loginWithEmail } from "../api/auth";
import { Field, FormGrid } from "../components/FormControls";
import { ScreenFrame } from "../components/ScreenFrame";
import type { ParentProfile } from "../types";
import { isValidEmail } from "../utils/validation";

export function LoginPage({
  onBack,
  onSuccess,
}: {
  onBack: () => void;
  onSuccess: (profile: ParentProfile | null, email: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState("");

  const hasEmail = Boolean(email.trim());
  const emailIsValid = isValidEmail(email);
  const isIncomplete = !emailIsValid || !password.trim();

  const submitLogin = async () => {
    setIsLoggingIn(true);
    setLoginError("");

    try {
      const result = await loginWithEmail(email.trim(), password);
      onSuccess(result.profile, result.user.email ?? email.trim());
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Login could not be completed";
      setLoginError(message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <ScreenFrame
      eyebrow="Login"
      title="Welcome back to DormDrop."
      subtitle="Access your account to continue managing campus deliveries."
      onBack={onBack}
      onNext={submitLogin}
      nextLabel={isLoggingIn ? "Logging in..." : "Login"}
      nextIcon={LogIn}
      nextDisabled={isLoggingIn || isIncomplete}
    >
      <FormGrid>
        <Field label="Email address">
          <Input
            value={email}
            onChangeText={setEmail}
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
        <Field label="Password">
          <Input
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
          />
        </Field>
      </FormGrid>
      {loginError ? (
        <Text color="#b42318" fontWeight="800">
          {loginError}
        </Text>
      ) : null}
    </ScreenFrame>
  );
}
