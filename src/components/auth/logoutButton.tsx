"use client";

import { logout } from "./action"; // Adjust the import path accordingly
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function LogoutButton() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      if (pathname === "/") {
        window.location.reload();
      } else {
        await router.push("/");
        window.location.reload();
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred during logout.");
    }
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
