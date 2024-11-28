"use client";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { DataTable } from "./dataTable";

export type ModalProps = {
  date: Date;
  amount: number;
  name: string;
  investorId?: string;
  profileURL?: string;
  logoURL?: string;
  status?: string;
};

export function Modal({ data }: { data: ModalProps[] }) {
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button>View More</Button>
        </DialogTrigger>
        <DialogContent className="max-w-screen-md md:max-w-screen-lg ">
          <DataTable data={data} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
