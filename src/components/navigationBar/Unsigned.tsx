"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import { Card } from "@/components/ui/card";
//   import ThemeToggle from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
//   import ShadcnKit from "@/components/icons/shadcn-kit";
//   import { nanoid } from "nanoid";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export function UnsignedNav() {
  const components = [
    {
      title: "Businesses",
      href: "",
      description:
        "A modal dialog that interrupts the user with important content and expects a response.",
    },
  ];
  return (
    <Card className="container bg-card py-3 px-4 border-0 flex items-center justify-between gap-6 rounded-2xl mt-5">
      {/* <ShadcnKit className="text-primary cursor-pointer" /> */}

      <ul className="hidden md:flex items-center gap-5 text-card-foreground ml-auto">
        <li className="text-primary font-medium">
          <a href="#home">Home</a>
        </li>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-base">Businesses</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] ">
                  {components.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-base font-medium ">
                Projects
              </NavigationMenuTrigger>
              <NavigationMenuContent>Lorem Ipsum</NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-base font-medium ">
                Blog
              </NavigationMenuTrigger>
              <NavigationMenuContent>Lorem Ipsum</NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <li>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <span className="cursor-pointer">Docs</span>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start">
              {landings.map((page) => (
                <DropdownMenuItem key={page.id}>
                  <Link href={page.route}>{page.title}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </li>
      </ul>

      <div className="flex items-center">
        <Button variant="secondary" className="hidden md:block px-2">
          Login
        </Button>
        <Button className="hidden md:block ml-2 mr-2">Sign up</Button>

        <div className="flex md:hidden mr-2 items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <span className="py-2 px-2 bg-gray-100 rounded-md">Pages</span>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start">
              {landings.map((page) => (
                <DropdownMenuItem key={page.id}>
                  <Link href={page.route}>{page.title}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5 rotate-0 scale-100" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <a href="#home">Home</a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <a href="#features">Features</a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <a href="#pricing">Pricing</a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <a href="#faqs">FAQs</a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Button variant="secondary" className="w-full text-sm">
                  Login
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Button className="w-full text-sm">Sign up</Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* <ThemeToggle /> */}
      </div>
    </Card>
  );
}

const landings = [
  {
    id: 1,
    title: "Landing 01",
    route: "/project-management",
  },
  {
    id: 2,
    title: "Landing 02",
    route: "/crm-landing",
  },
];
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <hr />
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
