import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const data = [
  {
    name: "Olivia Martin",
    email: "olivia.martin@email.com",
    amount: "1900.00",
    avatar: "/avatars/01.png", // psuedo avatar image
    initials: "OM",
  },
  {
    name: "Jackson Lee",
    email: "jackson.lee@email.com",
    amount: "39.00",
    avatar: "/avatars/02.png",
    initials: "JL",
  },
  {
    name: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    amount: "299.00",
    avatar: "/avatars/03.png",
    initials: "IN",
  },
  {
    name: "William Kim",
    email: "will@email.com",
    amount: "99.00",
    avatar: "/avatars/04.png",
    initials: "WK",
  },
  {
    name: "Sofia Davis",
    email: "sofia.davis@email.com",
    amount: "39.00",
    avatar: "/avatars/05.png",
    initials: "SD",
  },
];

interface RecentFundsProps{
  name?: string; 
  email?: string;
  amount?: number; 
  avatar?: string;
}
export function RecentFunds(props: RecentFundsProps) {
  return (
    <div className="space-y-8">
      {data.map((person, index) => (
        <div className="flex items-center" key={index}>
          <Avatar className="h-9 w-9">
            <AvatarImage src={person.avatar} alt={person.name} />
            <AvatarFallback>{person.initials}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{person.name}</p>
            <p className="text-sm text-muted-foreground">{person.email}</p>
          </div>
          <div className="ml-auto font-medium">+${person.amount}</div>
        </div>
      ))}
    </div>
  );
}
