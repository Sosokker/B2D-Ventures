"use client";

import { Card, CardContent } from "@/components/ui/card";
import { BellIcon } from "lucide-react";

export default function Notification() {
  const sampleNotifications = [
    { message: "New message from John Doe", time: "5 minutes ago" },
    { message: "Your order has been shipped", time: "2 hours ago" },
    { message: "Meeting reminder: Team sync at 3 PM", time: "1 day ago" },
  ];
  return (
    <div>
      <div className="ml-24 md:ml-56 mt-16 ">
        <h1 className="font-bold text-2xl md:text-3xl h-0">Notifications</h1>
        <div className=" w-full mt-20 ">
          {/* Cards */}
          <Card className=" border-slate-800 w-3/4 p-6">
            <CardContent>
              <Card>
                <CardContent>
                  {sampleNotifications.map((notification, _) => (
                    <div className="flex items-center justify-between p-4  border-b border-gray-200">
                      <div className="flex items-center">
                        <BellIcon className="w-5 h-5 text-blue-500 mr-3" />
                        <div>
                          <p className="text-sm font-medium ">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                      <button className="text-sm text-blue-500 hover:text-blue-600">
                        Mark as read
                      </button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
