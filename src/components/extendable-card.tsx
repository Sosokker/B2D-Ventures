import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

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
}

export function ExtendableCard(props: ExtendableCardProps) {
  return (
    <div className="group relative w-full max-w-sm overflow-hidden rounded-lg bg-card shadow-md transition-all hover:shadow-lg">
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
        <div className="mt-2 flex items-center text-muted-foreground">
          <span className="text-sm">{props.joinDate}</span>
        </div>
        <div className="mt-2 flex items-center text-muted-foreground">
          <span className="text-sm">{props.location}</span>
        </div>
        <div className="mt-4 hidden group-hover:block">
          <p className="text-sm text-muted-foreground">
            {props.description}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" alt="@jaredpalmer" />
                <AvatarFallback>JP</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-card-foreground">
                  Jared Palmer
                </p>
                <p className="text-xs text-muted-foreground">Photographer</p>
              </div>
            </div>
            <Link
              href="#"
              className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              prefetch={false}
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
