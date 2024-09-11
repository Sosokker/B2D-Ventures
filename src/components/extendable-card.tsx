"use client";
import { CalendarDaysIcon } from "lucide-react";

interface XMap {
  // tagName: colorCode
  [tag: string]: string;
}

interface ExtendableCardProps {
  name: string;
  description: string;
  joinDate: string;
  location: string;
  tags: XMap | null;
  minInvestment: number;
  totalInvestor: number;
  totalRaised: number;
}

export function ExtendableCard(props: ExtendableCardProps) {
  return (
    <div className="group relative w-full max-w-sm overflow-hidden rounded-lg bg-card shadow-md transition-all duration-500 hover:shadow-lg">
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src="/placeholder.svg"
          alt="Card image"
          width="400"
          height="300"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          style={{ aspectRatio: "400/300", objectFit: "cover" }}
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-card-foreground transition-colors duration-500 group-hover:text-primary">
          {props.name}
        </h3>

        {/* Default content (visible when not hovered) */}
        <div className="mt-2 flex items-center text-muted-foreground group-hover:hidden">
          <span className="flex items-center pt-2 gap-1">
            <CalendarDaysIcon width={20} />
            Joined {props.joinDate}
          </span>
        </div>
        <div className="mt-2 flex items-center text-muted-foreground group-hover:hidden">
          <span className="text-sm">{props.location}</span>
        </div>
        <div className="mt-2 flex flex-wrap items-center text-muted-foreground group-hover:hidden">
          {["Technology", "Gaming"].map((tag) => (
            <span
              key={tag}
              className="text-xs rounded-md bg-slate-200 dark:bg-slate-700 p-1 mx-1 mb-1"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Hover content (appears when hovered) */}
        <div className="mt-4 max-h-0 overflow-hidden opacity-0 group-hover:max-h-[500px] group-hover:opacity-100 transition-all duration-500 ease-in-out">
          <p className="text-sm text-muted-foreground">{props.description}</p>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div>
                <hr className="w-screen -ml-4 mb-2" />
                <p>
                  <strong>${props.totalRaised.toLocaleString()}</strong>{" "}
                  committed and reserved
                </p>
                <hr className="w-screen -ml-4 mb-2 mt-2" />
                <p className="mb-2">
                  <strong>{props.totalInvestor.toLocaleString()}</strong>{" "}
                  investors
                </p>
                <hr className="w-screen -ml-4 mb-2" />
                <p>
                  <strong>${props.minInvestment.toLocaleString()}</strong> min.
                  investment
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
