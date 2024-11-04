"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signup } from "./action";
import { signupSchema } from "@/types/schemas/authentication.schema";

export function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
    formData.append("email", email);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);

    try {
      await signup(formData);
      toast.success("Account created successfully!");
      router.push("/");
    } catch (error: any) {
      setError(error.message);
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
      {error && <p className="text-red-600">{error}</p>}
      <Button id="signup" type="submit">
        Sign Up
      </Button>
    </form>
  );
}
