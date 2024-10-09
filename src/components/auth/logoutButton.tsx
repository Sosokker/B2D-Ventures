"use client";

import { createSupabaseClient } from "@/lib/supabase/clientComponentClient";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const supabase = createSupabaseClient();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();

    if (pathname === "/") {
      window.location.reload();
    } else {
      await router.push("/");
      window.location.reload();
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
}
