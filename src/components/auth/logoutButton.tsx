"use client";

import { createSupabaseClient } from "@/lib/supabase/clientComponentClient";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const supabase = createSupabaseClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return <button onClick={handleLogout}>Logout</button>;
}
