import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export type RecentDealData = {
  created_time: Date;
  deal_amount: number;
  investor_id: string;
  username: string;
  avatar_url?: string;
  // email: string;
};

interface RecentFundsProps {
  recentDealData: RecentDealData[];
}

export function RecentFunds({ recentDealData }: RecentFundsProps) {
  return (
    <div className="space-y-8">
      {recentDealData?.length > 0 ? (
        recentDealData.map((data) => (
          <div className="flex items-center" key={data.investor_id}>
            <Avatar className="h-9 w-9">
              <AvatarImage src={data.avatar_url} alt={data.username} />
              {/* #TODO make this not quick fix */}
              <AvatarFallback>{data.username ? data.username[0] : ""}</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">{data.username}</p>
              {/* <p className="text-sm text-muted-foreground">{data.email}</p> */}
            </div>
            <div className="ml-auto font-medium">+${data.deal_amount}</div>
          </div>
        ))
      ) : (
        <p>No recent deals available.</p>
      )}
    </div>
  );
}
