import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface RecentFundsProps {
  data?: { name?: string; amount?: number; avatar?: string; date?: Date }[];
}
export function RecentFunds(props: RecentFundsProps) {
  return (
    <div className="space-y-8">
      {(props?.data || []).map((deal, index) => (
        <div className="flex items-center" key={index}>
          <Avatar className="h-9 w-9">
            <AvatarImage src={deal.avatar} alt={deal.name} />
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
