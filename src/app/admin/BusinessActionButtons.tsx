"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { createSupabaseClient } from "@/lib/supabase/clientComponentClient";
import { rejectBusiness, approveBusiness } from "@/lib/data/applicationMutate";
import toast from "react-hot-toast";

interface BusinessActionButtonsProps {
  businessApplicationId: number;
}

export function BusinessActionButtons({ businessApplicationId }: BusinessActionButtonsProps) {
  const [isRejectLoading, setIsRejectLoading] = useState(false);
  const [isApproveLoading, setIsApproveLoading] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isApproveOpen, setIsApproveOpen] = useState(false);

  const onRejectBusiness = async () => {
    try {
      setIsRejectLoading(true);
      const client = createSupabaseClient();

      const { error } = await rejectBusiness(client, businessApplicationId);
      if (error) throw error;

      toast.success("Rejected successfully");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to reject business");
      console.error("Failed to reject business:", error);
    } finally {
      setIsRejectLoading(false);
      setIsRejectOpen(false);
    }
  };

  const onApproveBusiness = async () => {
    try {
      setIsApproveLoading(true);
      const client = createSupabaseClient();

      const { error } = await approveBusiness(client, businessApplicationId);
      if (error) throw error;

      toast.success("Approved successfully");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to approve business");
      console.error("Failed to approve business:", error);
    } finally {
      setIsApproveLoading(false);
      setIsApproveOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
        <DialogTrigger asChild>
          <Check className="border-[2px] border-black dark:border-white rounded-md hover:bg-primary cursor-pointer" />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Approve this Business</DialogTitle>
            <DialogDescription>Are you sure that you will approve this business?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="submit" variant="default" onClick={onApproveBusiness} disabled={isApproveLoading}>
              {isApproveLoading ? "Approving..." : "Approve"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <DialogTrigger asChild>
          <X className="border-[2px] border-black dark:border-white rounded-md hover:bg-destructive cursor-pointer" />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reject this Business</DialogTitle>
            <DialogDescription>Are you sure that you will reject this business?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="submit" variant="destructive" onClick={onRejectBusiness} disabled={isRejectLoading}>
              {isRejectLoading ? "Rejecting..." : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
