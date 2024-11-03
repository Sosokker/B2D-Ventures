"use client";

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { updateAccessRequestStatus } from "@/lib/data/dataroomMutate";
import { getAccessRequests } from "@/lib/data/dataroomQuery";
import { createSupabaseClient } from "@/lib/supabase/clientComponentClient";

interface AccessRequest {
  id: number;
  dataroom_id: number;
  user_id: string;
  status: "pending" | "approve" | "reject";
  requested_at: string;
}

export default function AccessRequestsManagement({ dataroomId }: { dataroomId: number }) {
  const supabase = createSupabaseClient();

  const { data, error, isLoading } = useQuery(getAccessRequests(supabase, { dataroomId }));
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([]);

  useEffect(() => {
    if (data) {
      setAccessRequests(data);
    }
  }, [data]);

  const handleStatusChange = async (requestId: number, newStatus: "approve" | "reject" | "pending") => {
    await updateAccessRequestStatus(supabase, requestId, newStatus);
    setAccessRequests((prevRequests) =>
      prevRequests.map((request) => (request.id === requestId ? { ...request, status: newStatus } : request))
    );
  };

  if (isLoading) return <p>Loading access requests...</p>;
  if (error) return <p>Error loading access requests: {error.message}</p>;

  return (
    <>
      <h3 className="text-lg font-medium mb-2">Manage Access Requests</h3>
      <Separator className="my-2" />
      <div className="overflow-y-auto max-h-60">
        <Table>
          <TableCaption>A list of access requests for the selected project/dataroom.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accessRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.user_id}</TableCell>
                <TableCell>{request.status}</TableCell>
                <TableCell className="text-right">
                  {request.status === "pending" ? (
                    <>
                      <Button
                        variant="outline"
                        className="bg-green-500 text-white mr-2"
                        onClick={() => handleStatusChange(request.id, "approve")}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        className="bg-red-500 text-white"
                        onClick={() => handleStatusChange(request.id, "reject")}
                      >
                        Reject
                      </Button>
                    </>
                  ) : request.status === "approve" ? (
                    <Button
                      variant="outline"
                      className="bg-red-500 text-white"
                      onClick={() => handleStatusChange(request.id, "pending")}
                    >
                      Revoke Access
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="bg-green-500 text-white"
                      onClick={() => handleStatusChange(request.id, "approve")}
                    >
                      Approve
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
