import { getUserRole } from "@/lib/data/userQuery";
import { createSupabaseClient } from "@/lib/supabase/serverComponentClient";
import { redirect } from "next/navigation";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { FolderOpenDot } from "lucide-react";
import { getAllBusinessApplicationQuery } from "@/lib/data/applicationQuery";
import { BusinessActionButtons } from "./BusinessActionButtons";

export default async function AdminPage() {
  const client = createSupabaseClient();
  const { data: userData, error: userDataError } = await client.auth.getUser();

  if (userDataError) {
    redirect("/");
  }
  const uid = userData.user!.id;
  const { data: roleData, error: roleDataError } = await getUserRole(client, uid);

  if (roleDataError) {
    redirect("/");
  }

  if (roleData!.role != "admin") {
    redirect("/");
  }

  const { data: businessApplicationData, error: businessApplicationError } =
    await getAllBusinessApplicationQuery(client);

  if (businessApplicationError) {
    console.log(businessApplicationError);
  }

  return (
    <div className="container max-w-screen-xl">
      <div className="flex my-4">
        <Table className="border-2 border-border rounded-md">
          <TableCaption>A list of business applications.</TableCaption>
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
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {businessApplicationData && businessApplicationData.length > 0 ? (
              businessApplicationData.map((application) => (
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
                    <BusinessActionButtons businessApplicationId={application.id} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={11} className="text-center h-24 text-muted-foreground">
                  No business applications found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
