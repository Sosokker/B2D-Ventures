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
          className="fixed top-0 left-0 w-full bg-gray-800 text-white flex"
        >
          <X className="cursor-pointer w-10" onClick={() => setIsVisible(false)} />
          <NavigationMenu>
            <NavigationMenuList className="grid grid-cols-3">
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
        </motion.div>
      )}
    </div>
  );
}
