"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { DataTable } from "./dataTable";

export function Modal() {
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button>View More</Button>
        </DialogTrigger>
        <DialogContent>
          {/* <DataTable /> */}
        </DialogContent>
      </Dialog>
    </div>
  );
}
