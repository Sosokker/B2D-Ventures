"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";

import convertToSubcurrency from "@/lib/convertToSubcurrency";
import CheckoutPage from "./checkoutPage";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { getProjectDataQuery } from "@/lib/data/projectQuery";
import { createSupabaseClient } from "@/lib/supabase/clientComponentClient";
import useSession from "@/lib/supabase/useSession";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

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

export default function InvestPage() {
  const [checkedTerms, setCheckedTerms] = useState(Array(term_data.length).fill(false));
  const [investAmount, setInvestAmount] = useState(10);

  const { session } = useSession();
  const investor_id = session!.user.id;

  const params = useParams<{ id: string }>();
  const supabase = createSupabaseClient();

  const { data: projectData, isLoading: isLoadingProject } = useQuery(getProjectDataQuery(supabase, Number(params.id)));

  const handleCheckboxChange = (index: number) => {
    const updatedCheckedTerms = [...checkedTerms];
    updatedCheckedTerms[index] = !updatedCheckedTerms[index];
    setCheckedTerms(updatedCheckedTerms);
  };

  const isAcceptTermAndService = () => {
    if (checkedTerms.some((checked) => !checked)) {
      return false;
    }
    return true;
  };

  return (
    <div className="mx-10 md:mx-40 my-10">
      <h1 className="text-2xl md:text-4xl font-bold">Invest on ${projectData?.project_name}</h1>
      <Separator className="my-4" />
      <div></div>
      <div>
        <div className="w-1/2 space-y-2">
          <h2 className="text:base md:text-2xl">Investment Amount</h2>
          <Input
            className="w-52"
            type="number"
            placeholder="min $10"
            min={10}
            onChangeCapture={(e) => setInvestAmount(Number(e.currentTarget.value))}
          />
        </div>
        <Separator className="my-4" />

        <div className=" md:w-2/3 space-y-2">
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
        <Separator className="my-4" />

        <div className="w-full space-y-2">
          <h2 className="text:base md:text-2xl">Payment Information</h2>
          <div>
            <Elements
              stripe={stripePromise}
              options={{
                mode: "payment",
                amount: convertToSubcurrency(investAmount),
                currency: "usd",
              }}>
              <CheckoutPage
                amount={investAmount}
                isAcceptTermAndService={isAcceptTermAndService}
                project_id={Number(params.id)}
                investor_id={investor_id}
              />
            </Elements>
          </div>
        </div>
      </div>
    </div>
  );
}
