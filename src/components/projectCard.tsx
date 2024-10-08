"use client";

import { CalendarDaysIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface XMap {
  [tag: string]: string;
}

interface ProjectCardProps {
  name: string;
  description: string;
  joinDate: string;
  location: string;
  tags: XMap | null | never[] | string[];
  imageUri: string | null;
  minInvestment: number;
  totalInvestor: number;
  totalRaised: number;
  className?: string;
}

export function ProjectCard(props: ProjectCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col group border-[1px] border-border relative hover:shadow-md rounded-xl h-[450px]",
        props.className
      )}>
      <div className="flex flex-col h-full">
        {/* Image */}
        <div className="relative h-3/4 w-full">
          {props.imageUri ? (
            <Image
              src={props.imageUri}
              alt="Card image"
              fill
              className="rounded-t-xl bg-background dark:bg-background h-full"
            />
          ) : (
            <Image
              src="/money.png"
              alt="Card image"
              fill
              className="rounded-t-xl bg-background dark:bg-background h-full"
            />
          )}
        </div>
        <div className="flex flex-col h-full justify-between">
          {/* Info 0 overlaps Image */}
          <div className="bg-background dark:bg-background transition-all ease-out transform group-hover:-translate-y-24 duration-1000 group-hover:bg-opacity-100 z-10 p-4">
            <div className="font-semibold text-card-foreground transition-colors duration-1000 group-hover:text-primary">
              {props.name}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-3">{props.description}</p>
          </div>

          {/* Info 1 */}
          <div>
            <div className="transition-transform duration-500 transform opacity-100 group-hover:opacity-0 p-4">
              <div className="flex items-center text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CalendarDaysIcon width={20} />
                  <div className="text-xs">Joined {props.joinDate}</div>
                </span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <span className="text-xs">{props.location}</span>
              </div>
              <div className="flex flex-wrap mt-1 items-center text-muted-foreground">
                {props.tags.map((tag) => (
                  <span id="tag" key={tag} className="text-[10px] rounded-md bg-slate-200 dark:bg-slate-700 p-1 mr-1">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Info 2 */}
          <div className="hidden group-hover:flex group-hover:absolute group-hover:bottom-4 p-4">
            {/* Info 2 (Visible on hover) */}
            <div className="transition-transform duration-500 transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
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
        </div>
      </div>
    </div>
  );
}
