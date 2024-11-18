"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import React from "react";
import { SearchBar } from "./serchBar";
import ListItem from "../listItem";
import { businessComponents, projectComponents, dataroomComponents } from "./menu";
import { ThemeToggle } from "../theme-toggle";

export function MobileMenu() {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <div>
      <Button onClick={() => setIsVisible((prev) => !prev)}>
        <Menu />
      </Button>
      {isVisible && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 w-full bg-blue-500  flex items-center"
        >
          <X className="cursor-pointer w-8" onClick={() => setIsVisible(false)} />
          <NavigationMenu>
            <NavigationMenuList className="grid grid-cols-3 space-x-4 mt-1">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-base">Businesses</NavigationMenuTrigger>
                <NavigationMenuContent>
                  {businessComponents.map((component) => (
                    <ListItem key={component.title} title={component.title} href={component.href}>
                      {component.description}
                    </ListItem>
                  ))}
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-base ">Projects</NavigationMenuTrigger>
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
                <NavigationMenuTrigger className="text-base  ">Dataroom</NavigationMenuTrigger>
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

              <NavigationMenuItem className="pl-5 flex mt-5 flex">
                <ThemeToggle />
                <SearchBar />
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </motion.div>
      )}
    </div>
  );
}
