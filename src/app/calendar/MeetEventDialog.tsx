"use client";

import React, { useState } from "react";
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
import { DateTimePicker, TimePicker } from "@/components/ui/datetime-picker";
import { Label } from "@/components/ui/label";
import { createCalendarEvent } from "./actions";
import { Session } from "@supabase/supabase-js";

interface DialogProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  // eslint-disable-next-line no-unused-vars
  onOpenChange?(open: boolean): void;
  modal?: boolean;
  session: Session;
  projectName: string;
}

export function MeetEventDialog(props: DialogProps) {
  const [eventDate, setEventDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState<Date | undefined>(undefined);
  const [endTime, setEndTime] = useState<Date | undefined>(undefined);
  const [eventName, setEventName] = useState(`Meet with ${props.projectName}`);
  const [eventDescription, setEventDescription] = useState(
    "Meet and gather more information on business in B2DVentures"
  );
  const [noteToBusiness, setNoteToBusiness] = useState<string>("");
  const session = props.session;

  const handleCreateEvent = async () => {
    if (!session || !eventDate || !startTime || !endTime || !eventName) {
      alert("Please fill in all event details.");
      return;
    }

    const startDate = new Date(eventDate);
    startDate.setHours(startTime.getHours(), startTime.getMinutes());

    const endDate = new Date(eventDate);
    endDate.setHours(endTime.getHours(), endTime.getMinutes());
    await createCalendarEvent(session, startDate, endDate, eventName, eventDescription);
    props.onOpenChange?.(false);
  };

  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-md">
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
            <DateTimePicker granularity="day" hourCycle={24} value={eventDate} onChange={setEventDate} />
          </div>
          <div>
            <div>
              <Label>Start Time</Label>
              <TimePicker date={startTime} onChange={setStartTime} />
            </div>
            <div>
              <Label>End Time</Label>
              <TimePicker date={endTime} onChange={setEndTime} />
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-start mt-4">
          <Button type="button" onClick={handleCreateEvent} className="mr-2">
            Create Event
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
