"use client";

import React from "react";
import { createSupabaseClient } from "@/lib/supabase/clientComponentClient";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function SignupForm() {
  const router = useRouter();
  const supabase = createSupabaseClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Account created successfully!");
      router.push("/");
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <Input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <Input
        id="confirmPassword"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm Password"
      />
      <Button id="signup" onClick={handleSignup}>
        Sign Up
      </Button>
    </div>
  );
}
