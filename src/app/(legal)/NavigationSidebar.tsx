"use client";

import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export function NavSidebar() {
  return (
    <div className="w-64 p-6 bg-gray-100 dark:bg-gray-800 text-white shadow-lg rounded-lg border-2 border-gray-300 dark:border-gray-600">
      <ul className="space-y-4 sticky top-24 text-black dark:text-white">
        <Link href="/about">
          <li className="flex items-center p-2 relative group hover:scale-105 transition-all duration-200 ease-in-out rounded-md">
            <span>About</span>
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-all duration-300"></div>
          </li>
        </Link>
        <Separator className="bg-gray-200 dark:bg-gray-700" />

        <Link href="/privacy">
          <li className="flex items-center p-2 relative group hover:scale-105 transition-all duration-200 ease-in-out rounded-md">
            <span>Privacy</span>
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-all duration-300"></div>
          </li>
        </Link>
        <Separator className="bg-gray-200 dark:bg-gray-700" />

        <Link href="/risks">
          <li className="flex items-center p-2 relative group hover:scale-105 transition-all duration-200 ease-in-out rounded-md">
            <span>Risks</span>
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-all duration-300"></div>
          </li>
        </Link>
        <Separator className="bg-gray-200 dark:bg-gray-700" />

        <Link href="/terms">
          <li className="flex items-center p-2 relative group hover:scale-105 transition-all duration-200 ease-in-out rounded-md">
            <span>Terms</span>
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-all duration-300"></div>
          </li>
        </Link>
        <Separator className="bg-gray-200 dark:bg-gray-700" />
      </ul>
    </div>
  );
}
