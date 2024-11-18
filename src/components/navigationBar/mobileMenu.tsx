"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import { AnimatePresence, motion } from "framer-motion";
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
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 w-full bg-white dark:bg-slate-900 border-b dark:border-slate-800 shadow-sm z-50"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <button
                    onClick={() => setIsVisible(false)}
                    className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <NavigationMenu className="ml-6">
                    <NavigationMenuList className="flex space-x-4">
                      <NavigationMenuItem>
                        <NavigationMenuTrigger className="text-sm font-medium">Businesses</NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="w-[240px] p-4 gap-3">
                            {businessComponents.map((component) => (
                              <ListItem key={component.title} title={component.title} href={component.href}>
                                {component.description}
                              </ListItem>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </NavigationMenuItem>

                      <NavigationMenuItem>
                        <NavigationMenuTrigger className="text-sm font-medium">Projects</NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="w-[240px] p-4 gap-3">
                            {projectComponents.map((component) => (
                              <ListItem key={component.title} title={component.title} href={component.href}>
                                {component.description}
                              </ListItem>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </NavigationMenuItem>

                      <NavigationMenuItem>
                        <NavigationMenuTrigger className="text-sm font-medium">Dataroom</NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="w-[240px] p-4 gap-3">
                            {dataroomComponents.map((component) => (
                              <ListItem key={component.title} title={component.title} href={component.href}>
                                {component.description}
                              </ListItem>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <SearchBar />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
