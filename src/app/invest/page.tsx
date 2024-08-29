"use client";

import React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

export default function Invest() {
  return (
    <div className=" w-[90%] h-[500px]-500 ml-20 mt-12">
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
        <div className="flex">
          {/* image carousel */}
          <Carousel className="w-[55%] mt-4">
            <CarouselContent className="h-[450px]">
              {Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem>
                  <img src="./boiler1.jpg" alt="" className="rounded-lg" />
                </CarouselItem>
              ))}
            </CarouselContent>{" "}
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          <div className="bg-emerald-800 w-1/3 h-[400px] ml-[5%]"></div>
        </div>
      </div>
    </div>
  );
}
