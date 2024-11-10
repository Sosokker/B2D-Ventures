"use client";

import { useState } from "react";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { Card, CardContent } from "@/components/ui/card";
import { BellIcon } from "lucide-react";
import { createSupabaseClient } from "@/lib/supabase/clientComponentClient";
import { getNotificationByUserId } from "@/lib/data/notificationQuery";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import useSession from "@/lib/supabase/useSession";
import { LegacyLoader } from "@/components/loading/LegacyLoader";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date);
};

export default function Notification() {
  const supabase = createSupabaseClient();
  const router = useRouter();
  const { session, loading } = useSession();

  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const {
    data: notifications,
    error,
    isLoading,
    refetch,
  } = useQuery(getNotificationByUserId(supabase, session?.user.id), { enabled: !!session });

  if (loading) {
    return <LegacyLoader />;
  }

  if (!session) {
    return (
      <div className="container max-w-screen-xl my-5">
        <p className="text-red-600">Error fetching data. Please try again.</p>={" "}
        <Button className="mt-4" onClick={() => router.refresh()}>
          Refresh
        </Button>
      </div>
    );
  }

  const filteredNotifications = showUnreadOnly
    ? notifications?.filter((notification) => !notification.is_read)
    : notifications;

  const markAsRead = async (id: number) => {
    const { error } = await supabase.from("notification").update({ is_read: true }).eq("id", id);
    if (!error) {
      refetch();
    }
  };

  if (isLoading) return <LegacyLoader />;
  if (error) return <p>Error loading notifications: {error.message}</p>;

  return (
    <div className="container max-w-screen-xl my-4">
      <h1 className="text-3xl font-bold mb-6 border-b pb-2">Notifications</h1>

      <div className="mb-4 flex justify-end">
        <label className="text-sm mr-2 font-medium">Show Unread Only</label>
        <input
          type="checkbox"
          checked={showUnreadOnly}
          onChange={() => setShowUnreadOnly((prev) => !prev)}
          className="cursor-pointer"
        />
      </div>

      <Card className="shadow-lg rounded-lg border border-gray-200">
        <CardContent className="p-4 space-y-4">
          {filteredNotifications?.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-center justify-between p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-150 border ${
                notification.is_read ? "bg-gray-100 text-gray-400" : "bg-white text-gray-800"
              }`}
            >
              <div className="flex items-center">
                <BellIcon className={`w-5 h-5 mr-3 ${notification.is_read ? "text-gray-400" : "text-blue-500"}`} />
                <div>
                  <p className="text-sm font-medium">{notification.message}</p>
                  <p className="text-xs text-gray-500">{formatDate(notification.created_at)}</p>
                </div>
              </div>

              {!notification.is_read && (
                <button
                  onClick={() => markAsRead(notification.id)}
                  className="text-xs text-blue-500 hover:text-blue-600 transition duration-150"
                >
                  Mark as read
                </button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
