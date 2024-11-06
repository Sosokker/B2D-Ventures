import { getAllBusinesses } from "@/lib/data/businessQuery";
import { createSupabaseClient } from "@/lib/supabase/serverComponentClient";
import BusinessTable from "./BusinessTable";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default async function AdminPage() {
  const client = createSupabaseClient();
  const { data, error } = await getAllBusinesses(client);

  if (error) {
    return <div>Error fetching businesses: {error.message}</div>;
  }

  return (
    <div className="container max-w-screen-xl my-4">
      <h1 className="text-2xl font-bold">Business List</h1>
      <Separator className="my-3" />

      {/* Navigation Links */}
      <div className="mb-4">
        <Link href="/admin/business" passHref>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md">Go to Business Application</button>
        </Link>
      </div>

      <BusinessTable businesses={data} />
    </div>
  );
}
