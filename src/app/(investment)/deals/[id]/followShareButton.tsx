"use client";

/* eslint-disable */

import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ShareIcon, StarIcon } from "lucide-react";
import { deleteFollow, insertFollow } from "@/lib/data/followQuery";
import toast from "react-hot-toast";
import { createSupabaseClient } from "@/lib/supabase/clientComponentClient";

interface FollowShareButtons {
  isFollow: boolean;
  userId: string;
  projectId: number;
}

const FollowShareButtons = ({ isFollow, userId, projectId }: FollowShareButtons) => {
  const supabase = createSupabaseClient();
  const [isFollowState, setIsFollowState] = useState<boolean>(isFollow);

  const handleShare = () => {
    const currentUrl = window.location.href;
    if (document.hasFocus()) {
      navigator.clipboard.writeText(currentUrl).then(() => {
        toast.success("URL copied to clipboard!");
      });
    }
  };
  const handleFollow = async () => {
    if (!isFollowState) {
      const error = await insertFollow(supabase, userId, projectId);
      if (error) {
        toast.error("Error occur!");
      } else {
        toast.success("You have followed the project!", { icon: "❤️" });
        setIsFollowState(true);
      }
    } else {
      const error = await deleteFollow(supabase, userId, projectId);
      if (error) {
        toast.error("Error occur!");
      } else {
        toast.success("You have unfollowed the project!", { icon: "💔" });
        setIsFollowState(false);
      }
    }
  };

  return (
    <div className="grid grid-cols-2 gap-5 justify-self-end ">
      <div className="mt-2 cursor-pointer" onClick={handleFollow}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <StarIcon id="follow" fill={isFollowState ? "#fcb30e" : "#fff"} strokeWidth={2} />
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
