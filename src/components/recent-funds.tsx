import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export type RecentDealData = {
  created_time: Date;
  deal_amount: number;
  investor_id: string;
  username: string;
  logo_url?: string;
  status?: string;
  // email: string;
};

interface RecentFundsProps {
  data?: { name?: string; amount?: number; avatar?: string; date?: Date; logo_url?: string; status?: string; profile_url?: string }[];
}

export function RecentFunds(props: RecentFundsProps) {
  const content = (
    <div>
      
    </div>
  )
  return (
    <div className="space-y-8">
      {(props?.data || []).map((deal, index) => (
        <div key={index}>
          {deal.profile_url ? (
            <Link
              href={deal.profile_url}
              className="flex items-center w-full"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Avatar className="h-9 w-9">
                <AvatarImage src={deal.logo_url ? deal.logo_url : deal.avatar} alt={deal.name} />
                <AvatarFallback>{(deal.name ?? "").slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{deal.name}</p>
                <p className="text-xs text-muted-foreground">{deal?.date?.toLocaleDateString()}</p>
                {deal.status && (
                  <div className="flex items-center space-x-1">
                    <span className="relative flex h-3 w-3">
                      <span
                        className={`animate-ping absolute inline-flex h-3 w-3 rounded-full opacity-75 ${
                          deal?.status === "In Progress"
                            ? "bg-sky-400"
                            : deal?.status === "Completed"
                              ? "bg-green-400"
                              : "bg-yellow-400"
                        }`}
                      ></span>
                      <span
                        className={`relative inline-flex rounded-full h-2 w-2 mt-[2px] ml-0.5 ${
                          deal?.status === "In Progress"
                            ? "bg-sky-500"
                            : deal?.status === "Completed"
                              ? "bg-green-500"
                              : "bg-yellow-500"
                        }`}
                      ></span>
                    </span>
                    <p
                      className={`text-xs m-0 ${
                        deal?.status === "In Progress"
                          ? "text-sky-500"
                          : deal?.status === "Completed"
                            ? "text-green-500"
                            : "text-yellow-500"
                      }`}
                    >
                      {deal?.status}
                    </p>
                  </div>
                )}
              </div>
              <div className="ml-auto font-medium">+${deal.amount}</div>
            </Link>
          ) : (
            <div className="flex items-center w-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src={deal.logo_url ? deal.logo_url : deal.avatar} alt={deal.name} />
                <AvatarFallback>{(deal.name ?? "").slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{deal.name}</p>
                <p className="text-xs text-muted-foreground">{deal?.date?.toLocaleDateString()}</p>
                {deal.status && (
                  <div className="flex items-center space-x-1">
                    <span className="relative flex h-3 w-3">
                      <span
                        className={`animate-ping absolute inline-flex h-3 w-3 rounded-full opacity-75 ${
                          deal?.status === "In Progress"
                            ? "bg-sky-400"
                            : deal?.status === "Completed"
                              ? "bg-green-400"
                              : "bg-yellow-400"
                        }`}
                      ></span>
                      <span
                        className={`relative inline-flex rounded-full h-2 w-2 mt-[2px] ml-0.5 ${
                          deal?.status === "In Progress"
                            ? "bg-sky-500"
                            : deal?.status === "Completed"
                              ? "bg-green-500"
                              : "bg-yellow-500"
                        }`}
                      ></span>
                    </span>
                    <p
                      className={`text-xs m-0 ${
                        deal?.status === "In Progress"
                          ? "text-sky-500"
                          : deal?.status === "Completed"
                            ? "text-green-500"
                            : "text-yellow-500"
                      }`}
                    >
                      {deal?.status}
                    </p>
                  </div>
                )}
              </div>
              <div className="ml-auto font-medium">+${deal.amount}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

}
