"use client";

import React from "react";
import { createSupabaseClient } from "@/lib/supabase/clientComponentClient";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const supabase = createSupabaseClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    await supabase.auth.signInWithPassword({
      email,
      password,
    });
    router.push("/");
  };

  return (
    <div className="flex flex-col space-y-2">
      <Input id="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <Input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <Button id="login" onClick={handleLogin}>
        Login
      </Button>
    </div>
  );
}
