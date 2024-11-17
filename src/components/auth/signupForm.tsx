"use client";

import React, { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signup } from "./action";
import { signupSchema } from "@/types/schemas/authentication.schema";
import HCaptcha from "@hcaptcha/react-hcaptcha";

export function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | undefined>(undefined);
  const [isSendingForm, setIsSendingForm] = useState(false);
  const captcha = useRef<HCaptcha | null>(null);

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsedData = signupSchema.safeParse({
      email,
      password,
      confirmPassword,
    });

    if (!parsedData.success) {
      setError(parsedData.error.errors[0].message);
      return;
    }

    const formData = new FormData();
    formData.set("email", email);
    formData.set("password", password);
    formData.set("confirmPassword", confirmPassword);

    if (captchaToken) {
      formData.set("captchaToken", captchaToken);
    }

    try {
      setIsSendingForm(true);
      await signup(formData);
      captcha.current?.resetCaptcha();
      toast.success("Account created successfully!");
      router.push(`/verify?email=${formData.get("email") as string}`);
    } catch (error: any) {
      captcha.current?.resetCaptcha();
      setError(error.message);
    } finally {
      setIsSendingForm(false);
    }
  };

  return (
    <form onSubmit={handleSignup} className="flex flex-col space-y-2">
      <Input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <Input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <Input
        id="confirmPassword"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm Password"
        required
      />
      <HCaptcha
        ref={captcha}
        sitekey={process.env.NEXT_PUBLIC_SITEKEY!}
        onVerify={(token) => {
          setCaptchaToken(token);
        }}
      />
      {error && <p className="text-red-600">{error}</p>}
      <Button id="signup" type="submit" disabled={isSendingForm}>
        {isSendingForm ? "Sending" : "Sign Up"}
      </Button>
    </form>
  );
}
