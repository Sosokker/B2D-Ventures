"use client";

import Image from "next/image";
import { createSupabaseClient } from "@/lib/supabase/clientComponentClient";
import { Button } from "@/components/ui/button";

export function LoginButton(props: { nextUrl?: string }) {
  const supabase = createSupabaseClient();

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback?next=${props.nextUrl || ""}`,
        scopes: "https://www.googleapis.com/auth/calendar",
      },
    });
  };

  return (
    <Button className="bg-foreground gap-2 rounded-xl" onClick={handleLogin}>
      <Image src={"/logo/google.svg"} width={30} height={30} alt={"Google"} />
      Continue with Google
    </Button>
  );
}
