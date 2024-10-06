"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function SearchBar() {
  const [searchActive, setSearchActive] = React.useState(false);
  const router = useRouter();

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const query = (e.target as HTMLInputElement).value.trim();
      if (query) {
        router.push(`/find?query=${encodeURIComponent(query)}`);
      }
    }
  };

  return (
    <div className="flex items-center">
      <Search onClick={() => setSearchActive(!searchActive)} className="cursor-pointer" />
      <input
        type="text"
        placeholder="Enter business name..."
        className={cn(
          "ml-2 border rounded-md px-2 py-1 transition-all duration-300 ease-in-out",
          searchActive ? "w-48 opacity-100" : "w-0 opacity-0"
        )}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
