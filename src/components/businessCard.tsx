import { Card, CardFooter, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDaysIcon } from "lucide-react";
import { BusinessCardProps } from "@/types/BusinessCard";
import Image from "next/image";

export function BusinessCard(props: BusinessCardProps) {
  return (
    <Card className="rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow h-full">
      <CardHeader className="flex flex-row items-center gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="relative w-14 h-14 flex-shrink-0">
          <Image
            src="/money.png"
            alt="Business logo"
            fill
            className="rounded-full object-cover bg-white dark:bg-sky-900"
          />
        </div>
        <div>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">{props.business_name}</CardTitle>
          <CardDescription className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            <span className="flex items-center gap-1">
              <CalendarDaysIcon width={16} />
              Joined {props.joined_date}
            </span>
          </CardDescription>
        </div>
      </CardHeader>
      <CardFooter className="flex flex-col gap-2 pt-4">
        <span className="text-sm text-gray-700 dark:text-gray-300">{props.location}</span>
        <span className="text-xs font-medium rounded-md bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1">
          {props.business_type}
        </span>
      </CardFooter>
    </Card>
  );
}
