"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

export function SearchBar() {
  const [searchActive, setSearchActive] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const trimmedQuery = query.trim();
      if (trimmedQuery) {
        router.push(`/find?query=${encodeURIComponent(trimmedQuery)}`);
        setSearchActive(false);
        setQuery("");
      }
    } else if (e.key === "Escape") {
      setSearchActive(false);
      setQuery("");
    }
  };

  // Handle clicks outside of search bar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setSearchActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus input when search becomes active
  useEffect(() => {
    if (searchActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchActive]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex items-center transition-all duration-300",
        searchActive &&
          "fixed inset-0 bg-white/95 dark:bg-slate-900/95 z-50 px-4 md:relative md:bg-transparent md:dark:bg-transparent md:px-0"
      )}
    >
      {/* Mobile overlay header when search is active */}
      {searchActive && (
        <div className="absolute top-0 left-0 right-0 flex items-center p-4 md:hidden">
          <X
            className="w-6 h-6 cursor-pointer text-slate-600 dark:text-slate-400"
            onClick={() => {
              setSearchActive(false);
              setQuery("");
            }}
          />
        </div>
      )}

      <div className={cn("flex items-center w-full md:w-auto", searchActive ? "mt-16 md:mt-0" : "")}>
        <Search
          onClick={() => setSearchActive(!searchActive)}
          className={cn(
            "w-5 h-5 cursor-pointer transition-colors",
            searchActive ? "text-blue-500" : "text-slate-600 dark:text-slate-400",
            "md:hover:text-blue-500"
          )}
        />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter business name..."
          className={cn(
            "ml-2 rounded-md transition-all duration-300 ease-in-out outline-none",
            "placeholder:text-slate-400 dark:placeholder:text-slate-500",
            "bg-transparent md:bg-slate-100 md:dark:bg-slate-800",
            "md:px-3 md:py-1.5",
            searchActive
              ? "w-full opacity-100 border-b md:border md:w-48 lg:w-64 md:border-slate-200 md:dark:border-slate-700"
              : "w-0 opacity-0 border-transparent"
          )}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
}
