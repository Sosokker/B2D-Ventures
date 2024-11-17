"use client";

import React, { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login } from "./action";
import { LoginFormSchema } from "@/types/schemas/authentication.schema";
import toast from "react-hot-toast";
import HCaptcha from "@hcaptcha/react-hcaptcha";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; server?: string }>({});
  const [captchaToken, setCaptchaToken] = useState<string | undefined>(undefined);
  const captcha = useRef<HCaptcha | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = { email, password, options: { captchaToken } };

    const result = LoginFormSchema.safeParse(formData);

    if (!result.success) {
      const formErrors: { email?: string; password?: string } = {};
      result.error.errors.forEach((error) => {
        formErrors[error.path[0] as keyof typeof formErrors] = error.message;
      });
      setErrors(formErrors);
      return;
    }

    setErrors({});

    const form = new FormData();
    form.set("email", email);
    form.set("password", password);
    if (captchaToken) {
      form.set("captchaToken", captchaToken);
    }

    try {
      await login(form);
      captcha.current?.resetCaptcha();
      toast.success("Login succesfully!");
    } catch (authError: any) {
      captcha.current?.resetCaptcha();
      setErrors((prevErrors) => ({
        ...prevErrors,
        server: authError.message || "An error occurred during login.",
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
      <div>
        <Input id="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        {errors.email && <p className="text-red-600">{errors.email}</p>}
      </div>
      <div>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        {errors.password && <p className="text-red-600">{errors.password}</p>}
      </div>
      <HCaptcha
        ref={captcha}
        sitekey={process.env.NEXT_PUBLIC_SITEKEY!}
        onVerify={(token) => {
          setCaptchaToken(token);
        }}
      />
      {errors.server && <p className="text-red-600">{errors.server}</p>}
      <Button id="login" type="submit">
        Login
      </Button>
    </form>
  );
}
