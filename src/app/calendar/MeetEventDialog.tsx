"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Clock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { createCalendarEvent, createMeetingLog } from "./actions";
import { Session } from "@supabase/supabase-js";
import { createSupabaseClient } from "@/lib/supabase/clientComponentClient";
import { TimeInput } from "@nextui-org/date-input";
import { Calendar } from "@nextui-org/calendar";
import { TimeValue } from "@react-types/datepicker";
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import toast from "react-hot-toast";

interface DialogProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  // eslint-disable-next-line no-unused-vars
  onOpenChange?(open: boolean): void;
  modal?: boolean;
  session: Session;
  projectName: string;
  projectId?: number;
}

export function MeetEventDialog(props: DialogProps) {
  const supabase = createSupabaseClient();
  const timezone = getLocalTimeZone();
  const [eventDate, setEventDate] = useState<CalendarDate | undefined>(undefined);
  const [startTime, setStartTime] = useState<TimeValue | undefined>(undefined);
  const [endTime, setEndTime] = useState<TimeValue | undefined>(undefined);
  const [eventName, setEventName] = useState(`Meet with ${props.projectName}`);
  const [eventDescription, setEventDescription] = useState(
    "Meet and gather more information on business in B2DVentures"
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [noteToBusiness, setNoteToBusiness] = useState<string>("");
  const session = props.session;

  useEffect(() => {
    if (props.projectName) {
      setEventName(`Meet with ${props.projectName}`);
    }
  }, [props.projectName]);

  const handleCreateEvent = async () => {
    if (!session || !eventDate || !startTime || !endTime || !eventName) {
      toast.error("Please fill in all event details.");
      return;
    }

    setIsSubmitting(true);

    try {
      const startDate = eventDate.toDate(timezone);
      startDate.setHours(startTime.hour, startTime.minute);

      const endDate = eventDate.toDate(timezone);
      endDate.setHours(endTime.hour, startTime.minute);

      await createCalendarEvent(session, startDate, endDate, eventName, eventDescription);

      const { status, error } = await createMeetingLog({
        client: supabase,
        meet_date: eventDate.toString().split("T")[0],
        start_time: startTime.toString(),
        end_time: endTime.toString(),
        note: noteToBusiness,
        userId: session.user.id,
        projectId: props.projectId!,
      });

      if (!status) {
        console.error("Meeting log error:", error);
        toast.error("Failed to log the meeting. Please try again.");
        return;
      }

      toast.success("Meeting event created successfully!");
      props.onOpenChange?.(false);
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("There was an error creating the event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-md overflow-y-auto h-[80%]">
        <DialogHeader>
          <DialogTitle className="flex gap-2 items-center">
            <Clock />
            Arrange Meeting
          </DialogTitle>
          <DialogDescription>
            Arrange a meeting with the business you&apos;re interested in for more information.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 w-[90%]">
          <div>
            <Label htmlFor="eventName">Event Name</Label>
            <Input
              id="eventName"
              placeholder="Enter event name"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="eventDescription">Event Description</Label>
            <Input
              id="eventDescription"
              placeholder="Enter event description"
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="eventDescription">Event Description</Label>
            <Input
              id="note"
              placeholder="Your note to business"
              value={noteToBusiness}
              onChange={(e) => setNoteToBusiness(e.target.value)}
            />
          </div>
          <div>
            <Label>Date</Label>
            <Calendar value={eventDate} onChange={setEventDate} minValue={today(getLocalTimeZone())} />
          </div>
          <div>
            <div>
              <Label>Start Time</Label>
              <TimeInput label="Start Time" value={startTime} onChange={setStartTime} />
            </div>
            <div>
              <Label>End Time</Label>
              <TimeInput label="End Time" value={endTime} onChange={setEndTime} />
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-start mt-4">
          <Button type="button" onClick={handleCreateEvent} className="mr-2" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Event"}
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
