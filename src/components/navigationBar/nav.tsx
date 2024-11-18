import * as React from "react";
import Link from "next/link";
import Image from "next/image";

import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { SearchBar } from "./serchBar";
import { AuthenticatedComponents } from "./AuthenticatedComponents";
import { UnAuthenticatedComponents } from "./UnAuthenticatedComponents";

import { createSupabaseClient } from "@/lib/supabase/serverComponentClient";
import { getUserId } from "@/lib/supabase/actions/getUserId";
import { getUnreadNotificationCountByUserId } from "@/lib/data/notificationQuery";

import { MobileMenu } from "./mobileMenu";
import ListItem from "../listItem";
import { businessComponents, projectComponents, dataroomComponents } from "./menu";

export async function NavigationBar() {
  const client = createSupabaseClient();
  const userId = await getUserId();
  const { data: avatarUrl } = await client.from("profiles").select("avatar_url").eq("id", userId).single();
  let notification_count = 0;
  if (userId != null) {
    const { count: notiCount, error: notiError } = (await getUnreadNotificationCountByUserId(client, userId)) ?? {};
    notification_count = notiError ? 0 : (notiCount ?? 0);
  } else {
    notification_count = 0;
  }

  return (
    <header className="sticky top-0 flex flex-wrap w-full bg-card text-sm py-3 border-b-2 border-border z-50">
      <nav className="max-w-screen-xl w-full mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <Link
              className="flex-none text-xl font-semibold dark:text-white focus:outline-none focus:opacity-80"
              href="/"
              aria-label="Brand"
            >
              <span className="lg:inline-flex flex items-center gap-x-2 text-xl font-semibold dark:text-white">
                <Image src="/logo.svg" alt="logo" width={50} height={50} className="w-10 h-10 sm:w-16 sm:h-16" />
                <span className="block lg:inline">
                  B2D<span className=" lg:inline">Ventures</span>
                </span>
              </span>
            </Link>
          </div>
          <div className="md:hidden grid grid-cols-2">
            <div className="flex justify-end w-10">
              {userId ? (
                <AuthenticatedComponents
                  uid={userId}
                  avatarUrl={avatarUrl?.avatar_url}
                  notificationCount={notification_count}
                />
              ) : (
                <UnAuthenticatedComponents />
              )}
            </div>
            <div className="justify-end flex">
              <MobileMenu />
            </div>
          </div>

          <div className="hidden md:flex items-center ">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-base">Businesses</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] ">
                      {businessComponents.map((component) => (
                        <ListItem key={component.title} title={component.title} href={component.href}>
                          {component.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-base font-medium ">Projects</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] ">
                      {projectComponents.map((component) => (
                        <ListItem key={component.title} title={component.title} href={component.href}>
                          {component.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-base font-medium ">Dataroom</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] ">
                      {dataroomComponents.map((component) => (
                        <ListItem key={component.title} title={component.title} href={component.href}>
                          {component.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem className="pl-5 flex">
                  <SearchBar />
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <div className="hidden md:flex gap-2 pl-2">
              <div className="mt-1">
                <ThemeToggle />
              </div>
              <Separator orientation="vertical" className="mx-3" />
              {userId ? (
                <AuthenticatedComponents
                  uid={userId}
                  avatarUrl={avatarUrl?.avatar_url}
                  notificationCount={notification_count}
                />
              ) : (
                <UnAuthenticatedComponents />
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
