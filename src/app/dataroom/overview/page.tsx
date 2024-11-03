"use client";

import { useMemo } from "react";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { requestAccessToDataRoom } from "@/lib/data/dataroomMutate";
import { getInvestmentByUserId } from "@/lib/data/investmentQuery";
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
import { getAccessRequests } from "@/lib/data/dataroomQuery";
import { createSupabaseClient } from "@/lib/supabase/clientComponentClient";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import useSession from "@/lib/supabase/useSession";
import toast from "react-hot-toast";

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

interface AccessRequest {
  id: number;
  dataroom_id: number;
  user_id: string;
  status: "approve" | "reject" | "pending";
  requested_at: string;
}

export default function ListRequestAccessPage() {
  const client = createSupabaseClient();
  const { session, loading: sessionLoading } = useSession();
  const userId = session?.user?.id;

  const {
    data: investments = [],
    error: investmentsError,
    isLoading: isLoadingInvestments,
  } = useQuery(getInvestmentByUserId(client, userId ?? ""), {
    enabled: !!userId,
  });

  const {
    data: accessRequests = [],
    error: accessRequestsError,
    isLoading: isLoadingAccessRequests,
    refetch: refetchAccessRequests,
  } = useQuery(getAccessRequests(client, { userId: userId ?? "" }), {
    enabled: !!userId,
  });

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

  const handleRequestAccess = async (dataroomId: any) => {
    if (!userId) {
      toast.error("Please login first");
      return;
    }

    try {
      const { error } = await requestAccessToDataRoom(client, dataroomId, userId);
      if (error) {
        toast.error("Error sending request.");
        return;
      }

      toast.success("Request sent successfully!");
      await refetchAccessRequests();
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  if (sessionLoading) {
    return <div className="flex items-center justify-center h-screen">Checking authentication...</div>;
  }

  if (!session) {
    return <div className="flex items-center justify-center h-screen">Please login to view this page</div>;
  }

  if (isLoadingInvestments || isLoadingAccessRequests) {
    return <div className="flex items-center justify-center h-screen">Loading data...</div>;
  }

  if (investmentsError || accessRequestsError) {
    return <div className="flex items-center justify-center h-screen">Error loading data!</div>;
  }

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-2xl font-bold mb-4">List of Access Requests</h1>

      <div className="mb-6 space-y-4">
        <h2 className="text-xl font-semibold">Project Investments</h2>
        <Separator className="my-2" />

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
              {(accessRequests || []).some(
                (request) => request.dataroom_id === projectInvestments[0].dataroom_id && request.status === "pending"
              ) ? (
                <Button disabled>Pending Request</Button>
              ) : (accessRequests || []).some(
                  (request) => request.dataroom_id === projectInvestments[0].dataroom_id && request.status === "approve"
                ) ? (
                <Button onClick={() => window.open(`${projectInvestments[0].dataroom_id}/files`, "_blank")}>
                  Access Dataroom
                </Button>
              ) : (
                <Button onClick={() => handleRequestAccess(projectInvestments[0].dataroom_id)}>
                  Request Dataroom Access
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Access Requests Table - Unchanged */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Access Requests & Status</h2>
        <Table>
          <TableCaption>A list of your access requests.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Request ID</TableHead>
              <TableHead>Dataroom ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Requested At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(accessRequests || []).length > 0 ? (
              accessRequests?.map((request: AccessRequest) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.id}</TableCell>
                  <TableCell>{request.dataroom_id}</TableCell>
                  <TableCell>{request.status}</TableCell>
                  <TableCell>{new Date(request.requested_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No access requests found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
