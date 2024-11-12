"use client";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { DataTable } from "./dataTable";

export type Payment = {
  data?: {
    name?: string;
    amount?: number;
    avatar?: string;
    date?: Date;
    logo_url?: string;
    status?: string;
    profile_url?: string;
  }[];
};
export function Modal({ data }: { data: Payment[] }) {
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button>View More</Button>
        </DialogTrigger>
        <DialogContent>
          <DataTable data={data} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
