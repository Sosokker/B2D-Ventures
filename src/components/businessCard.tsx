import Image from "next/image";
import { Card, CardFooter, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDaysIcon } from "lucide-react";

export function BusinessCard() {
  return (
    <Card>
      <CardHeader>
        <div className="h-[200px] pb-2">
          <Image
            src={"/money.png"}
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: "100%", height: "100%" }}
            alt="nvidia"
          />
        </div>
        <CardTitle>NVIDIA</CardTitle>
        <CardDescription>
          Founded in 1993, NVIDIA is a key innovator of computer graphics and AI technology
          <span className="flex items-center pt-2">
            <CalendarDaysIcon width={20} />
            <p>Joined December 2021</p>
          </span>
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex-col items-start">
        Bangkok, Thailand
        <span className="text-xs rounded-md bg-slate-200 dark:bg-slate-700 p-1">Technology</span>
      </CardFooter>
    </Card>
  );
}
