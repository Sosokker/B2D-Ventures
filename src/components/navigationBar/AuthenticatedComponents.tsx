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
import { Bell, Heart, Wallet, ChartPie } from "lucide-react";
import { LogoutButton } from "@/components/auth/logoutButton";
import { useUserRole } from "@/hooks/useUserRole";
import CustomTooltip from "../customToolTip";

interface AuthenticatedComponentsProps {
  uid: string;
  avatarUrl?: string | null;
  notificationCount: number;
}

export const AuthenticatedComponents = ({ uid, avatarUrl, notificationCount }: AuthenticatedComponentsProps) => {
  const { data } = useUserRole();

  const businessClass =
    data?.role === "business" ? "border-2 border-[#FFD700] bg-[#FFF8DC] dark:bg-[#4B3E2B] rounded-md p-1" : "";

  return (
    <div className={`flex gap-3 pl-2 items-center ${businessClass}`}>
      <CustomTooltip message="Notification">
        <Link href={"/notification"}>
          <div className="relative inline-block">
            <Bell className="h-6 w-6 " />
            {notificationCount >= 1 && (
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-600 rounded-full animate-ping">
                {notificationCount}
              </span>
            )}
          </div>
        </Link>
      </CustomTooltip>
      <CustomTooltip message="Followed">
        <Link href="/follow">
          <Heart />
        </Link>
      </CustomTooltip>
      <CustomTooltip message="Portfolio">
        <Link href={"/portfolio/" + uid}>
          <Wallet className="cursor-pointer" />
        </Link>
      </CustomTooltip>
      {/*chart pie icon for bussiness's dashboard */}
      {data?.role === "business" && (
        <CustomTooltip message="Dashboard">
          <Link href="/dashboard">
            <ChartPie />
          </Link>
        </CustomTooltip>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
            <Avatar>
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt="profile" />
              ) : (
                <AvatarImage src="https://api.dicebear.com/9.x/pixel-art/svg" alt="profile" />
              )}

              <AvatarFallback>1</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Link href={`/profile/${uid}`}>Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {data?.role === "admin" && (
            <DropdownMenuItem>
              <Link href="/admin">Admin</Link>
            </DropdownMenuItem>
          )}
          {data != null && data != undefined && data.role === "business" && (
            <DropdownMenuItem>
              <Link href="/dataroom/manage">Dataroom</Link>
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
