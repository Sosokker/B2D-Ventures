"use client";

import React, { useEffect, useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import convertToSubcurrency from "@/lib/convertToSubcurrency";
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
import { Button } from "@/components/ui/button";
import useSession from "@/lib/supabase/useSession";
import { createSupabaseClient } from "@/lib/supabase/clientComponentClient";
import { useRouter } from "next/navigation";

const CheckoutPage = ({
  amount,
  project_id,
  investor_id,
  isAcceptTermAndService,
}: {
  amount: number;
  project_id: number;
  investor_id: string;
  isAcceptTermAndService: () => boolean;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isAcceptTerm = isAcceptTermAndService();
  const router = useRouter();

  const { session } = useSession();
  const user = session?.user;

  useEffect(() => {
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: convertToSubcurrency(amount) }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [amount]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      return;
    }

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setErrorMessage(submitError.message);
      setLoading(false);
      return;
    }

    await stripe
      .confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      })
      .then(async (result) => {
        if (result.error) {
          setErrorMessage(result.error.message);
        } else {
          try {
            const supabase = createSupabaseClient();
            const { data, error } = await supabase.from("investment_deal").insert([
              {
                investorId: investor_id,
                projectId: project_id,
                dealAmount: amount,
              },
            ]);
            console.log("ADADSADWADWWAD");

            if (error) {
              console.error("Supabase Insert Error:", error.message);
            } else {
              console.log("Insert successful:", data);
              router.push(`http://www.localhost:3000/payment-success?amount=${amount}`);
            }
          } catch (err) {
            console.error("Unexpected error during Supabase insert:", err);
          }
        }
        setLoading(false);
      });
  };

  if (!clientSecret || !stripe || !elements) {
    return (
      <div className="flex items-center justify-center">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
          role="status">
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {clientSecret && <CardElement />}

      {errorMessage && <div>{errorMessage}</div>}

      {/* Trigger the dialog when the "Pay" button is clicked */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <button
            type="button"
            onClick={() => setIsDialogOpen(true)}
            disabled={!stripe || loading}
            className="text-white w-full p-5 bg-black mt-2 rounded-md font-bold disabled:opacity-50 disabled:animate-pulse">
            {!loading ? `Pay $${amount}` : "Processing..."}
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to proceed with the investment?</DialogTitle>
            <DialogDescription>This action cannot be undone, and the investment will be confirmed.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <form onSubmit={handleSubmit} className="bg-white p-2 rounded-md">
              <Button type="submit" disabled={!isAcceptTerm}>
                Confirm Payment
              </Button>
            </form>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
          {errorMessage && <p className="text-red-500 mt-2 text-lg font-bold">{errorMessage}</p>}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CheckoutPage;
