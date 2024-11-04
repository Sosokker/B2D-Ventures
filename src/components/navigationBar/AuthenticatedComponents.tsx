"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Heart, Wallet } from "lucide-react";
import { LogoutButton } from "@/components/auth/logoutButton";
import { useUserRole } from "@/hooks/useUserRole";

interface AuthenticatedComponentsProps {
  uid: string;
}

export const AuthenticatedComponents = ({ uid }: AuthenticatedComponentsProps) => {
  const notifications = 100;
  const displayValue = notifications >= 100 ? "..." : notifications;
  const { data } = useUserRole();

  const businessClass =
    data?.role === "business" ? "border-2 border-[#FFD700] bg-[#FFF8DC] dark:bg-[#4B3E2B] rounded-md p-1" : "";

  return (
    <div className={`flex gap-3 pl-2 items-center ${businessClass}`}>
      <Link href={"/notification"}>
        <div className="relative inline-block">
          <Bell className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-600 rounded-full">
            {displayValue}
          </span>
        </div>
      </Link>
      <Heart />
      <Wallet />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
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
          {data?.role === "admin" && (
            <DropdownMenuItem>
              <Link href="/admin">Admin</Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogoutButton />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
