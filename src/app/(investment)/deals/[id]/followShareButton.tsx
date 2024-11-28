"use client";

/* eslint-disable */

import { useState, useEffect } from "react";
import CustomTooltip from "@/components/customToolTip";
import { ShareIcon, StarIcon } from "lucide-react";
import { deleteFollow, getFollow, insertFollow } from "@/lib/data/followQuery";
import toast from "react-hot-toast";
import { createSupabaseClient } from "@/lib/supabase/clientComponentClient";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";

interface FollowShareButtons {
  userId: string;
  projectId: number;
  projectName: string;
}

const FollowShareButtons = ({ userId, projectId, projectName }: FollowShareButtons) => {
  const supabase = createSupabaseClient();
  const { data: follow, isLoading: followIsLoading } = useQuery(getFollow(supabase, userId, projectId), {
    staleTime: 0,
  });

  const [isFollowState, setIsFollowState] = useState<boolean>(false);

  useEffect(() => {
    if (follow) {
      setIsFollowState(!!follow);
    }
  }, [follow]);

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
        toast.error("Error occurred!");
      } else {
        toast.success("You have followed the project!", { icon: "❤️" });
        setIsFollowState(true);
      }
    } else {
      const error = await deleteFollow(supabase, userId, projectId);
      if (error) {
        toast.error("Error occurred!");
      } else {
        toast.success("You have unfollowed the project!", { icon: "💔" });
        setIsFollowState(false);
      }
    }
  };

  if (followIsLoading) {
    return (
      <div className="grid grid-cols-2 gap-5 justify-self-end">
        <div onClick={handleShare} className="cursor-pointer mt-2">
          <ShareIcon />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-5 justify-self-end ">
      <div className="mt-2 cursor-pointer" onClick={handleFollow}>
        <CustomTooltip message={`Follow ${projectName}`}>
          <StarIcon id="follow" fill={isFollowState ? "#fcb30e" : "#fff"} strokeWidth={2} />
        </CustomTooltip>
      </div>
      <div onClick={handleShare} className="cursor-pointer mt-2">
        <ShareIcon />
      </div>
    </div>
  );
};

export default FollowShareButtons;
