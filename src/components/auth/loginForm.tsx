"use client";

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
      <Input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <Button onClick={handleLogin}>Login</Button>
    </div>
  );
}
