"use client";

import React, { useMemo, useState } from "react";
import useSession from "@/lib/supabase/useSession";
import { MeetEventDialog } from "./MeetEventDialog";
import { Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { getInvestmentByUserId } from "@/lib/data/investmentQuery";
import { LegacyLoader } from "@/components/loading/LegacyLoader";
import { createSupabaseClient } from "@/lib/supabase/clientComponentClient";

interface Investment {
  id: any;
  project_id: any;
  project_name: any;
  project_short_description: any;
  dataroom_id: any;
  deal_amount: any;
  investor_id: any;
  created_time: any;
}

const DatetimePickerHourCycle = () => {
  const supabase = createSupabaseClient();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentProjectName, setCurrentProjectName] = useState<string>("");
  const [currentProjectId, setCurrentProjectId] = useState<number | undefined>(undefined);
  const { session, loading } = useSession();

  const {
    data: investments = [],
    error: investmentsError,
    isLoading: isLoadingInvestments,
  } = useQuery(getInvestmentByUserId(supabase, session?.user.id ?? ""), {
    enabled: !!session?.user.id,
  });

  if (investmentsError) {
    throw "Error load investment data";
  }

  const projectInvestments = useMemo(() => {
    if (!investments) return {};

    return investments.reduce((acc: { [key: string]: Investment[] }, investment: Investment) => {
      const projectId = investment.project_id;
      if (!acc[projectId]) {
        acc[projectId] = [];
      }
      acc[projectId].push(investment);
      return acc;
    }, {});
  }, [investments]);

  if (loading) {
    return <LegacyLoader />;
  }

  if (!session || !session?.user.id) {
    throw "Can't load session!";
  }

  if (isLoadingInvestments) {
    return <LegacyLoader />;
  }

  return (
    <div className="container max-w-screen-xl">
      <span className="flex gap-2 items-center mt-4">
        <Clock />
        <p className="text-2xl font-bold">Schedule Meeting</p>
      </span>
      <Separator className="my-3" />
      <div className="space-y-2">
        {Object.entries(projectInvestments).map(([projectId, projectInvestments]) => (
          <Card key={projectId}>
            <CardHeader>
              <CardTitle className="text-xl">{projectInvestments[0].project_name}</CardTitle>
              <CardDescription>{projectInvestments[0].project_short_description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>Investments for this project</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Investment Id</TableHead>
                    <TableHead>Invested At</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projectInvestments.map((investment) => (
                    <TableRow key={investment.id}>
                      <TableCell className="font-medium">{investment.id}</TableCell>
                      <TableCell>{investment.created_time}</TableCell>
                      <TableCell className="text-right">{investment.deal_amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={2}>Total</TableCell>
                    <TableCell className="text-right">
                      {projectInvestments
                        .reduce((total, investment) => total + (parseFloat(investment.deal_amount) || 0), 0)
                        .toLocaleString("en-US", { style: "currency", currency: "USD" })}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => {
                  setCurrentProjectName(projectInvestments[0].project_name);
                  setCurrentProjectId(projectInvestments[0].project_id);
                  setTimeout(() => setShowModal(true), 0);
                }}
              >
                Schedule Meeting
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <MeetEventDialog
        open={showModal}
        onOpenChange={setShowModal}
        session={session}
        projectName={currentProjectName}
        projectId={currentProjectId}
      />
    </div>
  );
};

export default DatetimePickerHourCycle;
