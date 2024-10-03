"use client";

import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { CardsPaymentMethod } from "@/components/paymentMethod";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const term_data = [
  {
    term: "Minimum Investment",
    description: "The minimum investment amount is $500.",
  },
  {
    term: "Investment Horizon",
    description: "Investments are typically locked for a minimum of 12 months.",
  },
  {
    term: "Fees",
    description: "A management fee of 2% will be applied annually.",
  },
  {
    term: "Returns",
    description: "Expected annual returns are between 8% and 12%.",
  },
  {
    term: "Risk Disclosure",
    description: "Investments carry risks, including the loss of principal.",
  },
  {
    term: "Withdrawal Policy",
    description: "Withdrawals can be made after the lock-in period.",
  },
];

export default function Invest() {
  const [checkedTerms, setCheckedTerms] = useState(Array(term_data.length).fill(false));
  const [error, setError] = useState("");
  const router = useRouter(); // Initialize the router

  const handleCheckboxChange = (index) => {
    const updatedCheckedTerms = [...checkedTerms];
    updatedCheckedTerms[index] = !updatedCheckedTerms[index];
    setCheckedTerms(updatedCheckedTerms);
  };

  const handleTermServiceClick = () => {
    if (checkedTerms.some((checked) => !checked)) {
      setError("Please accept all terms before proceeding with the investment.");
    } else {
      setError("");
      handleInvestmentSuccess();
    }
  };

  const handleInvestmentSuccess = () => {
    toast.success("You successfully invested!");

    setTimeout(() => {
      router.push("/");
    }, 1000);
  };

  return (
    <div className="mx-40 my-10">
      <h1 className="text-4xl font-bold">Invest on NVIDIA</h1>
      <Separator className="my-4" />

      <div>
        <div className="w-1/2 space-y-2">
          <h2 className="text-2xl">Investment Amount</h2>
          <Input type="number" placeholder="min $500" />
        </div>
        <Separator className="my-4" />

        <div className="w-1/2 space-y-2">
          <h2 className="text-2xl">Payment Information</h2>
          <CardsPaymentMethod />
        </div>
        <Separator className="my-4" />

        <div className="w-2/3 space-y-2">
          <h2 className="text-2xl">Terms and Services</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Select</TableHead>
                <TableHead>Term</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {term_data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <input type="checkbox" checked={checkedTerms[index]} onChange={() => handleCheckboxChange(index)} />
                  </TableCell>
                  <TableCell>{item.term}</TableCell>
                  <TableCell>{item.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="mt-4">Invest</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>This action cannot be undone. This will permanently!</DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-start">
              <Button type="submit" onClick={handleTermServiceClick}>
                Confirm
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
            {error && <p className="text-red-500 mt-2 text-lg font-bold">{error}</p>}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
