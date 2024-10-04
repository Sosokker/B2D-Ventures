"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import CountUp from "react-countup";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ShareIcon, StarIcon } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import useSession from "@/lib/supabase/useSession";
import { redirect } from "next/navigation";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";

export default function Invest() {
  const [progress, setProgress] = useState(0);
  const [tab, setTab] = useState("Pitch");
  const { session, loading } = useSession();
  const user = session?.user;
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const [isFollow, setIsFollow] = useState(false);

  useEffect(() => {
    // set sessionLoaded to true once session is confirmed
    if (!loading) {
      setSessionLoaded(true);
    }
  }, [loading]);
  const handleClick = (item: string) => {
    setTab(item);
  };

  const handleShare = () => {
    const currentUrl = window.location.href;
    if (document.hasFocus()) {
      navigator.clipboard.writeText(currentUrl).then(() => {
        toast.success("URL copied to clipboard!");
      });
    }
  };
  const handleFollow = () => {
    if (user) {
      setIsFollow((prevState) => !prevState);
      // save follow to database
    } else {
      redirect("/login");
    }
  };
  useEffect(() => {
    // percent success
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div>
      <div>
        <Toaster position="top-right" reverseOrder={false} />
      </div>
      <div className="w-[90%] h-[450px]-500 md:m-auto mt-12 md:mt-12 pl-14 md:pl-24">
        <div>
          {/* Name, star and share button packed */}
          <div className="grid grid-cols-4">
            <div className="flex col-span-2">
              <Image src="./logo.svg" alt="logo" width={50} height={50} className="sm:scale-75" />
              <div className="mt-3 font-bold  text-lg md:text-3xl">NVIDIA</div>
            </div>
            <div className="grid grid-cols-2 gap-5 justify-self-end ">
              <div className="mt-2 cursor-pointer" onClick={handleFollow}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <StarIcon id="follow" fill={isFollow ? "#FFFF00" : "#fff"} strokeWidth={2} />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Follow NIVIDIA</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div onClick={handleShare} className=" cursor-pointer  mt-2">
                <ShareIcon />
              </div>
            </div>
          </div>
          {/* end of pack */}
          <p className="mt-2 sm:text-sm"> World's first non-metal sustainable battery</p>
          <div className="flex flex-wrap mt-3">
            {["Technology", "Gaming"].map((tag) => (
              <span key={tag} className="text-xs rounded-md bg-slate-200 dark:bg-slate-700 p-1 mx-1 mb-1">
                {tag}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-2 mt-5">
            {/* image carousel */}
            <div>
              <Carousel className="w-full mt-20 md:mt-0">
                <CarouselContent className="h-[400px] flex h-full">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <CarouselItem key={index}>
                      <img src="./boiler1.jpg" alt="" className="rounded-lg self-center" />
                    </CarouselItem>
                  ))}
                </CarouselContent>{" "}
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
              <Carousel className="w-2/3 md:w-full ml-10 md:ml-0 mt-5 md:mt-10 ">
                <CarouselContent>
                  {/* boiler plate for an actual pictures */}
                  <CarouselItem className="pl-1 md:basis-1/2 lg:basis-1/3">
                    <img src="./boiler1.jpg" alt="" className="rounded-lg" />
                  </CarouselItem>
                  <CarouselItem className="pl-1 md:basis-1/2 lg:basis-1/3">
                    <img src="./boiler1.jpg" alt="" className="rounded-lg" />
                  </CarouselItem>
                  <CarouselItem className="pl-1 md:basis-1/2 lg:basis-1/3">
                    <img src="./boiler1.jpg" alt="" className="rounded-lg" />
                  </CarouselItem>
                  <CarouselItem className="pl-1 md:basis-1/2 lg:basis-1/3">
                    <img src="./boiler1.jpg" alt="" className="rounded-lg" />
                  </CarouselItem>
                  <CarouselItem className="pl-1 md:basis-1/2 lg:basis-1/3">
                    <img src="./boiler1.jpg" alt="" className="rounded-lg" />
                  </CarouselItem>
                </CarouselContent>
              </Carousel>
            </div>
            <div className=" w-2/3 mt-4  m-auto grid-rows-5">
              <div className="pl-5">
                <h1 className="font-semibold text-xl md:text-4xl mt-8">
                  <CountUp start={0} end={100000} duration={2} prefix="$" className="" />
                </h1>
                <p className="text-sm md:text-lg"> 5% raised of $5M max goal</p>
                <Progress value={progress} className="w-[60%] h-3 mt-3" />
                <h1 className="font-semibold text-4xl md:mt-8">
                  {" "}
                  <CountUp start={0} end={1000} duration={2} className="text-xl md:text-4xl" />
                </h1>
                <p className="text-sm md:text-lg"> Investors</p>
              </div>
              <Separator decorative className="mt-3 w-3/4 ml-5" />
              <h1 className="font-semibold text-xl md:text-4xl mt-8 ml-5">
                <CountUp start={0} end={5800} duration={2} className="text-xl md:text-4xl" /> hours
              </h1>
              <p className="ml-5"> Left to invest</p>
              <Button className="mt-5 md:mt-10 ml-0 md:ml-[25%] scale-75 md:scale-100">
                <Link href="/invest/1">Invest in NVIDIA</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* menu */}
      <div className="flex w-[90%] mt-24 m-auto ml-10 md:ml-32">
        <ul className="list-none flex gap-10 text-lg md:text-xl ">
          <li>
            <a onClick={() => handleClick("Pitch")} className={tab === "Pitch" ? "text-blue-600" : ""}>
              Pitch
            </a>
          </li>
          <li>
            <a onClick={() => handleClick("General Data")} className={tab === "General Data" ? "text-blue-600" : ""}>
              General Data
            </a>
          </li>
          <li>
            <a onClick={() => handleClick("Updates")} className={tab === "Updates" ? "text-blue-600" : ""}>
              Updates
            </a>
          </li>
        </ul>
      </div>
      <hr className="mt-2" />
      {/* Card section */}
      <div className="flex w-full mt-10">
        {/* Cards */}
        <Card className="m-auto border-slate-800 w-3/4 p-6">
          <CardContent>
            <Card>
              <CardContent>{tab}</CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}