"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login } from "./action";
import { LoginFormSchema } from "@/types/schemas/authentication.schema";
import toast from "react-hot-toast";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; server?: string }>({});

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = { email, password };

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
    form.append("email", email);
    form.append("password", password);

    try {
      await login(form);
      toast.success("Login succesfully!");
    } catch (authError: any) {
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
      {errors.server && <p className="text-red-600">{errors.server}</p>}
      <Button id="login" type="submit">
        Login
      </Button>
    </form>
  );
}
