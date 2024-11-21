"use client";

import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CheckoutPage from "./checkoutPage";
import convertToSubcurrency from "@/lib/convertToSubcurrency";
import { Button } from "@/components/ui/button";

interface PaymentDialogProps {
  open: boolean;
  // eslint-disable-next-line no-unused-vars
  onOpenChange: (open: boolean) => void;
  amount: number;
  stripePromise: Promise<any>;
  isAcceptTermAndService: () => boolean;
  projectId: number;
  investorId: string;
}

export function PaymentDialog({
  open,
  onOpenChange,
  amount,
  stripePromise,
  isAcceptTermAndService,
  projectId,
  investorId,
}: PaymentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Payment Information</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>Proceed with the payment to complete your investment.</p>
          <Elements
            stripe={stripePromise}
            options={{
              mode: "payment",
              amount: convertToSubcurrency(amount),
              currency: "usd",
            }}
          >
            <CheckoutPage
              amount={amount}
              isAcceptTermAndService={isAcceptTermAndService}
              project_id={projectId}
              investor_id={investorId}
            />
          </Elements>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
