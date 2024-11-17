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
import { createCalendarEvent, createMeetingLog, getFreeDate } from "./actions";
import { Session } from "@supabase/supabase-js";
import { createSupabaseClient } from "@/lib/supabase/clientComponentClient";
import { TimeInput } from "@nextui-org/date-input";
import { Calendar, DateValue } from "@nextui-org/calendar";
import { TimeValue } from "@react-types/datepicker";
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
// import { useLocale } from "@react-aria/i18n";
import { getMeetingLog } from "./actions";
import toast from "react-hot-toast";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { LegacyLoader } from "@/components/loading/LegacyLoader";
import { isEventOverlapping } from "./overlapEvent";

interface DialogProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  // eslint-disable-next-line no-unused-vars
  onOpenChange?(open: boolean): void;
  modal?: boolean;
  session: Session;
  projectName: string;
  projectId: number;
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

  const {
    data: freeDate,
    error: freeDateError,
    isLoading: isLoadingFreeDate,
  } = useQuery(getFreeDate(supabase, props.projectId), { enabled: !!props.projectId });

  useEffect(() => {
    if (props.projectName) {
      setEventName(`Meet with ${props.projectName}`);
    }
  }, [props.projectName]);

  const {
    data: meetingLog,
    error: meetingLogError,
    isLoading: isLoadingMeetingLog,
  } = useQuery(getMeetingLog(supabase, props.projectId), { enabled: !!props.projectId });

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

      const existingEvents = (meetingLog || []).map((log) => ({
        meet_date: log.meet_date,
        start_time: log.start_time,
        end_time: log.end_time,
      }));
      const hasOverlap = isEventOverlapping(eventDate, startTime, endTime, existingEvents);

      if (hasOverlap) {
        toast.error("This current selected date and time is overlaped with any existing events.");
        return;
      }

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

  const meetingLogRanges = (meetingLog || []).map((log) => {
    const [year, month, day] = log.meet_date.split("-").map(Number);
    const startDate = new CalendarDate(year, month, day);
    const endDate = new CalendarDate(year, month, day);
    return [startDate, endDate];
  });

  const freetimeLogRanges = (freeDate || []).map((log) => {
    const [year, month, day] = log.meet_date.split("-").map(Number);
    const startDate = new CalendarDate(year, month, day);
    const endDate = new CalendarDate(year, month, day);
    return [startDate, endDate];
  });

  // const disabledRanges = [...meetingLogRanges];
  // const { locale } = useLocale();

  const isDateUnavailable = (date: DateValue) => {
    const isFreeDate = freetimeLogRanges.some(
      (interval) => date.compare(interval[0]) >= 0 && date.compare(interval[1]) <= 0
    );
    const isMeetingDate = meetingLogRanges.some(
      (interval) => date.compare(interval[0]) >= 0 && date.compare(interval[1]) <= 0
    );
    return !isFreeDate || isMeetingDate;
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

        {meetingLogError || freeDateError ? (
          <div className="error-message">
            <p>Error loading meeting logs</p>
          </div>
        ) : !isLoadingMeetingLog || !isLoadingFreeDate ? (
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
            <div className="flex flex-col space-y-2">
              <Label>Date</Label>
              <Calendar
                value={eventDate}
                onChange={setEventDate}
                minValue={today(getLocalTimeZone())}
                isDateUnavailable={isDateUnavailable}
              />
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
        ) : (
          <LegacyLoader />
        )}

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
