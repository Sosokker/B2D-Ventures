"use client";

import { CalendarDaysIcon } from "lucide-react";
import Image from "next/image";

interface XMap {
  [tag: string]: string;
}

interface ExtendableCardProps {
  name: string;
  description: string;
  joinDate: string;
  location: string;
  tags: XMap | null | never[] | string[];
  minInvestment: number;
  totalInvestor: number;
  totalRaised: number;
}

export function ExtendableCard(props: ExtendableCardProps) {
  return (
    <div className="flex flex-col h-full group">
      {/* Image */}
      <div className="relative">
        <Image src="/money.png" alt="Card image" width={400} height={300} layout="responsive" objectFit="cover" />
        {/* Info 0 overlaps Image */}
        <div className="group-hover:absolute group-hover:bottom-0 group-hover:left-0 group-hover:right-0 p-4 bg-opacity-75 bg-white transition-all duration-300 group-hover:bg-opacity-100 z-10">
          <div className="font-semibold text-card-foreground transition-colors duration-1000 group-hover:text-primary">
            {props.name}
          </div>
          <p className="text-sm text-muted-foreground">{props.description}</p>
        </div>
      </div>
      {/* Info 1 (Hidden on hover) */}
      <div className="transition-opacity duration-300 group-hover:opacity-0">
        <div className="mt-2 flex items-center text-muted-foreground">
          <span className="flex items-center pt-2 gap-1">
            <CalendarDaysIcon width={20} />
            <div className="text-xs md:text-lg">Joined {props.joinDate}</div>
          </span>
        </div>
        <div className="mt-2 flex items-center text-muted-foreground">
          <span className="text-xs md:text-sm">{props.location}</span>
        </div>
        <div className="mt-2 flex flex-wrap items-center text-muted-foreground">
          {props.tags.map((tag) => (
            <span
              id="tag"
              key={tag}
              className="text-[10px] md:text-xs rounded-md bg-slate-200 dark:bg-slate-700 p-1 mx-1 mb-1">
              {tag}
            </span>
          ))}
        </div>
      </div>
      {/* Info 2 (Visible on hover) */}
      <div className="transition-transform duration-300 transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
        <hr className="-ml-4 mb-2" />
        <p className="text-base">
          <strong>${props.totalRaised.toLocaleString()}</strong> committed and reserved
        </p>
        <hr className="-ml-4 mb-2 mt-2" />
        <p className="mb-2 text-base">
          <strong>{props.totalInvestor.toLocaleString()}</strong> investors
        </p>
        <hr className="-ml-4 mb-2" />
        <p className="text-base">
          <strong>${props.minInvestment.toLocaleString()}</strong> min. investment
        </p>
      </div>
    </div>
  );
}
