import { getAllBusinesses } from "@/lib/data/businessQuery";
import { createSupabaseClient } from "@/lib/supabase/serverComponentClient";
import BusinessTable from "./BusinessTable";
import { Separator } from "@/components/ui/separator";

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
      <BusinessTable businesses={data} />
    </div>
  );
}
