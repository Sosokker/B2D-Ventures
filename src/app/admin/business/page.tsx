import { getUserRole } from "@/lib/data/userQuery";
import { createSupabaseClient } from "@/lib/supabase/serverComponentClient";
import { redirect } from "next/navigation";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { FolderOpenDot } from "lucide-react";
import { getAllBusinessApplicationQuery } from "@/lib/data/applicationQuery";
import { BusinessActionButtons } from "./BusinessActionButtons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface ApplicationData {
  id: any;
  user_id: any;
  username: any;
  business_type_id: any;
  business_type_value: any;
  project_application_id: any;
  business_name: any;
  created_at: any;
  is_in_us: any;
  is_for_sale: any;
  pitch_deck_url: any;
  community_size: any;
  is_generating_revenue: any;
  money_raised_to_date: any;
  location: any;
  status: any;
}

function ApplicationTable({ applications }: { applications: ApplicationData[] }) {
  if (!applications || applications.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={11} className="text-center h-24 text-muted-foreground">
          No business applications found
        </TableCell>
      </TableRow>
    );
  }

  return applications.map((application: ApplicationData) => (
    <TableRow key={application.id}>
      <TableCell>{application.business_name}</TableCell>
      <TableCell>
        <Link href={`/profile/${application.user_id}`} className="text-blue-500 hover:text-blue-600">
          {application.username}
        </Link>
      </TableCell>
      <TableCell>
        {application.pitch_deck_url && (
          <Link href={application.pitch_deck_url} className="text-blue-500 hover:text-blue-600">
            {application.pitch_deck_url}
          </Link>
        )}
      </TableCell>
      <TableCell>
        <Checkbox checked={application.is_in_us} disabled />
      </TableCell>
      <TableCell>
        <Checkbox checked={application.is_for_sale} disabled />
      </TableCell>
      <TableCell>
        <Checkbox checked={application.is_generating_revenue} disabled />
      </TableCell>
      <TableCell>{application.community_size}</TableCell>
      <TableCell>{application.money_raised_to_date}</TableCell>
      <TableCell>{application.location}</TableCell>
      <TableCell>
        {application.project_application_id && (
          <Link href={`/admin/project/${application.project_application_id}`}>
            <FolderOpenDot className="border-[2px] border-black dark:border-white rounded-md hover:bg-gray-400 w-full cursor-pointer" />
          </Link>
        )}
      </TableCell>
      <TableCell>
        {application.status === "pending" && <BusinessActionButtons businessApplicationId={application.id} />}
      </TableCell>
    </TableRow>
  ));
}

export default async function BusinessApplicationAdminPage() {
  const client = createSupabaseClient();
  const { data: userData, error: userDataError } = await client.auth.getUser();

  if (userDataError) {
    redirect("/");
  }

  const uid = userData.user!.id;
  const { data: roleData, error: roleDataError } = await getUserRole(client, uid);

  if (roleDataError || roleData!.role != "admin") {
    redirect("/");
  }

  const { data: businessApplicationData, error: businessApplicationError } =
    await getAllBusinessApplicationQuery(client);

  if (businessApplicationError) {
    console.log(businessApplicationError);
  }

  const pendingApplications = businessApplicationData?.filter((app) => app.status === "pending") || [];
  const approvedApplications = businessApplicationData?.filter((app) => app.status === "approve") || [];
  const rejectedApplications = businessApplicationData?.filter((app) => app.status === "rejected") || [];

  return (
    <div className="container max-w-screen-xl my-4">
      <div className="font-bold text-2xl">Admin Page</div>
      <Separator className="my-4" />
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">Pending ({pendingApplications.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedApplications.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedApplications.length})</TabsTrigger>
        </TabsList>

        {["pending", "approved", "rejected"].map((status) => (
          <TabsContent key={status} value={status}>
            <Table className="border-2 border-border rounded-md">
              <TableCaption>{status.charAt(0).toUpperCase() + status.slice(1)} business applications</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Business Name</TableHead>
                  <TableHead>User Account</TableHead>
                  <TableHead>Pitch Deck URL</TableHead>
                  <TableHead>Is In US?</TableHead>
                  <TableHead>Is For Sale?</TableHead>
                  <TableHead>Generate Revenue</TableHead>
                  <TableHead>Community Size</TableHead>
                  <TableHead>Money raised to date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <ApplicationTable
                  applications={
                    status === "pending"
                      ? pendingApplications
                      : status === "approved"
                        ? approvedApplications
                        : rejectedApplications
                  }
                />
              </TableBody>
            </Table>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
