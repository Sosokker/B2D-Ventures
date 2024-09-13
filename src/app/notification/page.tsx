"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function Notification() {
  const sampleNotifications = [
    { message: "New message from John Doe", time: "5 minutes ago" },
    { message: "Your order has been shipped", time: "2 hours ago" },
    { message: "Meeting reminder: Team sync at 3 PM", time: "1 day ago" },
  ];
  return (
    <div>
      <div className="ml-56 mt-16 ">
        <h1 className="font-bold text-3xl h-0">Notifications</h1>
        <div className=" w-full mt-20 ">
          {/* Cards */}
          <Card className=" border-slate-800 w-3/4 p-6">
            <CardContent>
              <Card>
                <CardContent>1</CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
