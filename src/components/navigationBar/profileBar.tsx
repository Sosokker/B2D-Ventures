"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, Heart, Wallet } from "lucide-react";
import { LogoutButton } from "@/components/auth/logoutButton";
import useSession from "@/lib/supabase/useSession";

const UnAuthenticatedComponents = () => {
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

const AuthenticatedComponents = ({ uid }: { uid: string }) => {
  let notifications = 100;
  const displayValue = notifications >= 100 ? "..." : notifications;
  return (
    <div className="flex gap-3 pl-2 items-center">
      <Link href={"/notification"}>
        <div className="relative inline-block">
          <Bell className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-600 rounded-full">
            {displayValue}
          </span>
        </div>
      </Link>
      <Heart />
      <Link href={"/portfolio/" + uid}>
        <Wallet className="cursor-pointer" />
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="overflow-hidden rounded-full"
          >
            <Avatar>
              <AvatarImage src="https://api.dicebear.com/9.x/pixel-art/svg" />
              <AvatarFallback>1</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Link href={`/profile/${uid}`}>Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogoutButton />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export function ProfileBar() {
  const { session } = useSession();
  const user = session?.user;
  const [sessionLoaded, setSessionLoaded] = useState(false);

  useEffect(() => {
    if (!session) {
      setSessionLoaded(true);
    }
  }, [session]);

  return (
    <>
      {sessionLoaded ? (
        user ? (
          <AuthenticatedComponents uid={user.id} />
        ) : (
          <UnAuthenticatedComponents />
        )
      ) : (
        <div>
          <Skeleton className="rounded-lg h-full w-[160px]" />
        </div>
      )}
    </>
  );
}
