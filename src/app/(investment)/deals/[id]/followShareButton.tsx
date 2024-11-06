"use client";

/* eslint-disable */

import { useState, useEffect } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ShareIcon, StarIcon } from "lucide-react";
import { redirect } from "next/navigation";
import useSession from "@/lib/supabase/useSession";
import toast from "react-hot-toast";

const FollowShareButtons = () => {
  const { session, loading } = useSession();
  const user = session?.user;
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const [isFollow, setIsFollow] = useState(false);

  useEffect(() => {
    if (!loading) {
      setSessionLoaded(true);
    }
  }, [loading]);

  const handleShare = () => {
    const currentUrl = window.location.href;
    if (document.hasFocus()) {
      navigator.clipboard.writeText(currentUrl).then(() => {
        toast.success("URL copied to clipboard!");
      });
    }
  };
  const handleFollow = () => {
    if (user) {
      setIsFollow((prevState) => !prevState);
    } else {
      redirect("/login");
    }
  };

  return (
    <div className="grid grid-cols-2 gap-5 justify-self-end ">
      <div className="mt-2 cursor-pointer" onClick={handleFollow}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <StarIcon id="follow" fill={isFollow ? "#FFFF00" : "#fff"} strokeWidth={2} />
            </TooltipTrigger>
            <TooltipContent>
              <p>Follow NVIDIA</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div onClick={handleShare} className="cursor-pointer mt-2">
        <ShareIcon />
      </div>
    </div>
  );
};

export default FollowShareButtons;
