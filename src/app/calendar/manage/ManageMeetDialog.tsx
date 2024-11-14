"use client";

import React from "react";
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
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock } from "lucide-react";
import { createSupabaseClient } from "@/lib/supabase/clientComponentClient";

import getMeetingLog from "./actions";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { LegacyLoader } from "@/components/loading/LegacyLoader";

interface DialogProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  // eslint-disable-next-line no-unused-vars
  onOpenChange?(open: boolean): void;
  modal?: boolean;
  projectId: number;
}

export function ManageMeetDialog(props: DialogProps) {
  const supabase = createSupabaseClient();
  const {
    data: meetingLog,
    error: meetingLogError,
    isLoading: isLoadingMeetingLog,
  } = useQuery(getMeetingLog(supabase, props.projectId), {
    enabled: !!props.projectId,
  });

  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-md overflow-y-auto h-[80%]">
        <DialogHeader>
          <DialogTitle className="flex gap-2 items-center">
            <Clock />
            Meeting Request
          </DialogTitle>
          <DialogDescription>List of meeting you need to attend.</DialogDescription>
        </DialogHeader>

        {meetingLogError ? (
          <div>Error Loading data</div>
        ) : isLoadingMeetingLog ? (
          <LegacyLoader />
        ) : meetingLog && meetingLog.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Date</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>End Time</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Note</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {meetingLog.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.meet_date}</TableCell>
                  <TableCell>{log.start_time}</TableCell>
                  <TableCell>{log.end_time}</TableCell>
                  <TableCell>{log.user_id}</TableCell>
                  <TableCell>{log.note || "No note provided"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={5} className="text-right">
                  Total Meetings: {meetingLog.length}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        ) : (
          <div>No meeting logs available</div>
        )}

        <DialogFooter className="sm:justify-start mt-4">
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
