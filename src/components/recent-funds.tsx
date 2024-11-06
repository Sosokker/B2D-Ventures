import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export type RecentDealData = {
  created_time: Date;
  deal_amount: number;
  investor_id: string;
  username: string;
  logo_url?: string;
  // email: string;
};

interface RecentFundsProps {
  data?: { name?: string; amount?: number; avatar?: string; date?: Date; logo_url?: string }[];
}

export function RecentFunds(props: RecentFundsProps) {
  return (
    <div className="space-y-8">
      {(props?.data || []).map((deal, index) => (
        <div className="flex items-center" key={index}>
          <Avatar className="h-9 w-9">
            <AvatarImage src={deal.logo_url} alt={deal.name} />
            <AvatarFallback>{(deal.name ?? "").slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{deal.name}</p>
            <p className="text-xs text-muted-foreground">{deal?.date?.toLocaleDateString()}</p>
          </div>
          <div className="ml-auto font-medium">+${deal.amount}</div>
        </div>
      ))}
    </div>
  );
}
