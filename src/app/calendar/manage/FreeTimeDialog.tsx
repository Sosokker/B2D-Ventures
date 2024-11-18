import React, { useState } from "react";
import { createSupabaseClient } from "@/lib/supabase/clientComponentClient";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, DateValue } from "@nextui-org/calendar";
import { specifyFreeDate, getFreeDate } from "../actions";
import toast from "react-hot-toast";
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import { Label } from "@/components/ui/label";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { LegacyLoader } from "@/components/loading/LegacyLoader";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface DialogProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  // eslint-disable-next-line no-unused-vars
  onOpenChange?(open: boolean): void;
  modal?: boolean;
  projectId: number;
}

export default function FreeTimeDialog(props: DialogProps) {
  const supabase = createSupabaseClient();
  const timezone = getLocalTimeZone();
  const [selectedDate, setSelectedDate] = useState<CalendarDate | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [deleteDateId, setDeleteDateId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);

  const {
    data: freeDate,
    error: freeDateError,
    isLoading: isLoadingFreeDate,
    refetch: refetchFreeDate,
  } = useQuery(getFreeDate(supabase, props.projectId), { enabled: !!props.projectId });

  const handleSpecifyFreeDate = async () => {
    if (!selectedDate) {
      toast.error("Please select a date.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formattedDate = selectedDate.toString().split("T")[0];
      const { status, error } = await specifyFreeDate({
        client: supabase,
        meet_date: formattedDate,
        projectId: props.projectId,
      });

      if (!status || error) {
        toast.error("Failed to save the free date. Please try again.");
        return;
      }
      refetchFreeDate();
      toast.success("Free time specified successfully!");
      props.onOpenChange?.(false);
    } catch (error) {
      toast.error("There was an error specifying the free date. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFreeDate = async () => {
    if (deleteDateId === null) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("project_meeting_time").delete().eq("id", deleteDateId);

      if (error) {
        toast.error("Failed to delete the free date. Please try again.");
        return;
      }

      refetchFreeDate();
      toast.success("Free date deleted successfully!");
    } catch (error) {
      toast.error("There was an error deleting the free date. Please try again.");
    } finally {
      setIsSubmitting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const meetingLogRanges = (freeDate || []).map((log) => {
    const [year, month, day] = log.meet_date.split("-").map(Number);
    const startDate = new CalendarDate(year, month, day);
    const endDate = new CalendarDate(year, month, day);
    return [startDate, endDate];
  });

  const disabledRanges = [...meetingLogRanges];

  const isDateUnavailable = (date: DateValue) =>
    disabledRanges.some((interval) => date.compare(interval[0]) >= 0 && date.compare(interval[1]) <= 0);

  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-md overflow-y-auto h-[80%]">
        <DialogHeader>
          <DialogTitle className="flex gap-2 items-center">Specify Your Free Time</DialogTitle>
          <DialogDescription>Select a date when you are available for a meeting with the investor.</DialogDescription>
        </DialogHeader>

        {freeDateError ? (
          <div>Error Loading data</div>
        ) : isLoadingFreeDate ? (
          <LegacyLoader />
        ) : (
          <div className="flex flex-col space-y-4 w-[90%] mt-4">
            <div className="flex flex-col space-y-2">
              <Label>Date</Label>
              <Calendar
                value={selectedDate}
                onChange={setSelectedDate}
                minValue={today(timezone)}
                isDateUnavailable={isDateUnavailable}
              />
            </div>
            <div className="flex flex-col space-y-2 mt-4">
              <Label>Current Free Dates</Label>
              <div className="p-2 border rounded-md space-y-2">
                {freeDate && freeDate.length > 0 ? (
                  freeDate.map((date) => (
                    <div
                      key={date.id}
                      className="bg-gray-100 p-2 rounded cursor-pointer hover:bg-red-400"
                      onClick={() => {
                        setDeleteDateId(date.id);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      {date.meet_date || "No date specified"}
                    </div>
                  ))
                ) : (
                  <div>No free dates specified</div>
                )}
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="sm:justify-start mt-4">
          <Button onClick={handleSpecifyFreeDate} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Free Date"}
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the free date.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteFreeDate}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
