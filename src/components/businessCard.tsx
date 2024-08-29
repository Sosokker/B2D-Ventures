import Image from "next/image";
import {
  Card,
  CardFooter,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarDaysIcon } from "lucide-react";

interface XMap {
  // tagName: colorCode
  [tag: string]: string;
}

interface BusinessCardProps {
  name: string;
  description: string;
  joinDate: string;
  location: string;
  tags: XMap | null;
}

export function BusinessCard(props: BusinessCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="h-[200px] hover:h-[100px] duration-75 pb-2">
          <Image
            src={"/money.png"}
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: "100%", height: "100%" }}
            alt="nvidia"
          />
        </div>
        <CardTitle>{props.name}</CardTitle>
        <CardDescription>
          {props.description}
          <span className="flex items-center pt-2 gap-1">
            <CalendarDaysIcon width={20} />
            Joined {props.joinDate}
          </span>
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex-col items-start">
        {props.location}
        <span className="text-xs rounded-md bg-slate-200 dark:bg-slate-700 p-1">
          Technology
        </span>
      </CardFooter>
    </Card>
  );
}
