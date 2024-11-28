"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export const UnAuthenticatedComponents = () => {
  return (
    <div className="flex gap-2 pl-2">
      <Link href="/auth">
        <Button variant="secondary" className="border-2 border-border">
          Login
        </Button>
      </Link>
      <Link href="/auth/signup">
        <Button>Sign up</Button>
      </Link>
    </div>
  );
};
