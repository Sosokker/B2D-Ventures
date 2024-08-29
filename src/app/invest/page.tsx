"use client";

import React from "react";
import Image from "next/image";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"

export default function Invest() {
  return (
    <div className=" w-[90%] h-[500px] bg-red-500 ml-20 mt-12">
      <div>
        <div className="flex">
          <Image src="./logo.svg" alt="logo" width={50} height={50} />
          <h1 className="mt-3 font-bold text-3xl">NVIDIA</h1>
        </div>
        <p className="mt-2"> World's first non-metal sustainable battery</p>
        <div className="flex mt-3">
          {["Technology", "Gaming"].map((tag) => (
            <span
              key={tag}
              className="text-xs rounded-md bg-slate-200 dark:bg-slate-700 p-1 mx-1"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
