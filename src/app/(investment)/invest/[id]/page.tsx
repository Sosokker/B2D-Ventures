"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";

// import convertToSubcurrency from "@/lib/convertToSubcurrency";
// import CheckoutPage from "./checkoutPage";
// import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { getProjectDataQuery } from "@/lib/data/projectQuery";
import { createSupabaseClient } from "@/lib/supabase/clientComponentClient";
import { InvestmentAmountInfo } from "./InvestmentAmountInfo";
import { Button } from "@/components/ui/button";
import { PaymentDialog } from "./PaymentDialog";
import Link from "next/link";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const term_data = [
  {
    term: "Risk Disclosure",
    description:
      "Investments carry risks, including the potential loss of principal. It is important to carefully consider your risk tolerance before proceeding with any investment.",
    link: "/risks",
  },
  {
    term: "Fees",
    description:
      "A management fee of 3% will be taken from the company after the fundraising is completed. This fee is non-refundable.",
    link: null,
  },
  {
    term: "Returns",
    description: "Expected annual returns are between 8% and 12%.",
    link: null,
  },
  {
    term: "Withdrawal Policy",
    description:
      "Withdrawals cannot be made after the fundraising period ends. Once the investment is finalized, it is non-refundable.",
    link: null,
  },
];

export default function InvestPage() {
  const [checkboxStates, setCheckboxStates] = useState([false, false]);
  const [investAmount, setInvestAmount] = useState<number>(10);
  const [investor_id, setInvestorId] = useState<string>("");
  const [showPaymentModal, setPaymentModal] = useState(false);

  const params = useParams<{ id: string }>();
  const supabase = createSupabaseClient();

  useEffect(() => {
    const fetchInvestorData = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
        return;
      }
      if (data.session) {
        setInvestorId(data.session.user.id);
      }
    };

    fetchInvestorData();
  }, [supabase]);

  const {
    data: projectData,
    isLoading: isLoadingProject,
    error: projectError,
  } = useQuery(getProjectDataQuery(supabase, Number(params.id)));

  const handleCheckboxChange = (index: number) => {
    const updatedCheckboxStates = [...checkboxStates];
    updatedCheckboxStates[index] = !updatedCheckboxStates[index];
    setCheckboxStates(updatedCheckboxStates);
  };

  const isAcceptTermAndService = () => {
    return checkboxStates.every((checked) => checked);
  };

  const getInputBorderColor = (min: number) => {
    return investAmount >= min ? "border-green-500" : "border-red-500";
  };

  return (
    <div className="mx-10 md:mx-40 my-10">
      {isLoadingProject ? (
        <p>Loading project details...</p>
      ) : projectError ? (
        <p>Error loading project data. Please try again later.</p>
      ) : projectData ? (
        <div>
          <h1 className="text-2xl md:text-4xl font-bold">Invest in {projectData.project_name}</h1>
          <Separator className="my-4" />
          <div className="flex gap-6">
            <div id="investment" className="w-3/4">
              {/* Investment Amount Section */}
              <div className="w-3/4">
                <h2 className="text:base md:text-2xl font-bold">Investment Amount</h2>
                <h3 className="text-gray-500 text-md">Payments are processed immediately in USD$</h3>
                <Input
                  className={`py-7 mt-4 text-lg border-2 ${getInputBorderColor(10)} rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus-visible:ring-0`}
                  type="number"
                  placeholder="min $10"
                  min={10}
                  onChangeCapture={(e) => setInvestAmount(Number(e.currentTarget.value))}
                />
                <InvestmentAmountInfo amount={investAmount} />
              </div>
              <Separator className="my-4" />

              {/* Terms and Services Section */}
              <div className="md:w-2/3 space-y-2">
                <h2 className="text-2xl">Terms and Services</h2>
                <h3 className="text-gray-500 text-md">Please read and accept Term and Services first</h3>
                <div id="term-condition">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Term</TableHead>
                        <TableHead>Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {term_data.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {item.link != null ? (
                              <Link
                                href={item.link}
                                rel="noopener noreferrer"
                                target="_blank"
                                className="text-blue-500 underline"
                              >
                                {item.term}
                              </Link>
                            ) : (
                              item.term
                            )}
                          </TableCell>
                          <TableCell>{item.description}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <div className="mt-4 space-y-4">
                    {/* First Checkbox with Terms */}
                    <div className="flex items-center space-x-2">
                      <Input
                        type="checkbox"
                        checked={checkboxStates[0]}
                        onChange={() => handleCheckboxChange(0)}
                        className="h-4 w-4"
                      />
                      <p className="text-xs text-gray-500">
                        I understand that this offering involves the use of a third-party custodian, who will act as the
                        legal holder of the assets involved. As an investor, I acknowledge that I will be required to
                        create an account with this custodian and enter into necessary agreements, including those
                        related to the custody of the assets. I am aware that I may need to provide certain information
                        to verify my identity and complete the account creation process. I also understand that the
                        platform facilitating this offering does not manage or hold any custodial accounts for its
                        investors. Additionally, I recognize that the platform, its affiliates, or its representatives
                        will not be held responsible for any damages, losses, costs, or expenses arising from (i) the
                        creation or management of custodial accounts, (ii) unauthorized access or loss of assets within
                        these accounts, or (iii) the custodian&apos;s failure to fulfill its obligations.
                      </p>
                    </div>

                    {/* Second Checkbox for Acceptance */}
                    <div className="flex items-center space-x-2">
                      <Input
                        type="checkbox"
                        checked={checkboxStates[1]}
                        onChange={() => handleCheckboxChange(1)}
                        className="h-4 w-4"
                      />
                      <p className="text-xs text-gray-500">I have read and accept the terms of investment.</p>
                    </div>
                  </div>
                </div>
              </div>
              <Separator className="my-4" />

              <Button disabled={!isAcceptTermAndService()} onClick={() => setPaymentModal(true)}>
                Proceed to Payment
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <p>No project data found.</p>
      )}

      <PaymentDialog
        open={showPaymentModal}
        onOpenChange={setPaymentModal}
        amount={investAmount}
        stripePromise={stripePromise}
        isAcceptTermAndService={isAcceptTermAndService}
        projectId={Number(params.id)}
        investorId={investor_id}
      />
    </div>
  );
}
