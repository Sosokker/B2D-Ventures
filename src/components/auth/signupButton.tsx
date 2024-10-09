"use client";

import Image from "next/image";
import { createSupabaseClient } from "@/lib/supabase/clientComponentClient";
import { Button } from "@/components/ui/button";

export function SignupButton(props: { nextUrl?: string }) {
  const supabase = createSupabaseClient();

  const handleSignup = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback?next=${props.nextUrl || ""}`,
      },
    });
  };

  return (
    <Button className="bg-foreground gap-2 rounded-xl" onClick={handleSignup}>
      <Image src={"/logo/google.svg"} width={30} height={30} alt={"Google"} />
      Sign Up with Google
    </Button>
  );
}
