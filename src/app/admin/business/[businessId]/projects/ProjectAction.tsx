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
import { approveProject, rejectBusiness } from "@/lib/data/applicationMutate";
import toast from "react-hot-toast";

interface ProjectActionsProps {
  projectId: number;
}

export default function ProjectActions({ projectId }: ProjectActionsProps) {
  const [isRejectLoading, setIsRejectLoading] = useState(false);
  const [isApproveLoading, setIsApproveLoading] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isApproveOpen, setIsApproveOpen] = useState(false);

  const onRejectProject = async () => {
    try {
      setIsRejectLoading(true);
      const client = createSupabaseClient();

      const { error } = await rejectBusiness(client, projectId);
      if (error) throw error;

      toast.success("Project rejected successfully");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to reject project");
      console.error("Failed to reject project:", error);
    } finally {
      setIsRejectLoading(false);
      setIsRejectOpen(false);
    }
  };

  const onApproveProject = async () => {
    try {
      setIsApproveLoading(true);
      const client = createSupabaseClient();

      const { error } = await approveProject(client, projectId);
      if (error) throw error;

      toast.success("Project approved successfully");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to approve project");
      console.error("Failed to approve project:", error);
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
            <DialogTitle>Approve this Project</DialogTitle>
            <DialogDescription>Are you sure you want to approve this project?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="submit" variant="default" onClick={onApproveProject} disabled={isApproveLoading}>
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
            <DialogTitle>Reject this Project</DialogTitle>
            <DialogDescription>Are you sure you want to reject this project?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="submit" variant="destructive" onClick={onRejectProject} disabled={isRejectLoading}>
              {isRejectLoading ? "Rejecting..." : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
