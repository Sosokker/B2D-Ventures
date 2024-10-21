import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type RecentDealData = {
  username: string;
  avatar_url: string;
  // email: string;
};

interface RecentFundsProps {
  recentDealData: RecentDealData[];
}

export function RecentFunds({ recentDealData }: RecentFundsProps) {
  return (
    <div className="space-y-8">
      {recentDealData?.map((person, index) => (
        <div className="flex items-center" key={index}>
          <Avatar className="h-9 w-9">
            <AvatarImage src={person.avatar_url} alt={person.username} />
            {<AvatarFallback>{person.username[0]}</AvatarFallback>}
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{person.username}</p>
            {/* <p className="text-sm text-muted-foreground">{person.email}</p> */}
          </div>
          {/* <div className="ml-auto font-medium">+${person.amount}</div> */}
        </div>
      ))}
    </div>
  );
}