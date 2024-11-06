import { getBusinessByUserId } from "@/lib/data/businessQuery";
import { createSupabaseClient } from "@/lib/supabase/serverComponentClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const BusinessProfile = async ({ userId }: { userId: string }) => {
  const supabase = createSupabaseClient();
  const { data, error } = await getBusinessByUserId(supabase, userId);
  if (error) {
    return (
      <Card className="text-center">
        <CardHeader>
          <CardTitle>Error Loading Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Can&apos;t load business data</p>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="text-center">
        <CardHeader>
          <CardTitle>No Business Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This business account doesn&apos;t have businesses</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container max-w-screen-xl px-4">
      <Card className="mb-6 shadow-md rounded-lg bg-white">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="text-center sm:text-left">
              <CardTitle className="text-2xl font-semibold">{data.business_name}</CardTitle>
              <CardDescription className="text-md text-gray-600">{data.business_type}</CardDescription>
            </div>
            <div className="mt-4 sm:mt-0">
              <p className="text-lg text-gray-700">
                <strong>Location:</strong> {data.location}
              </p>
              <p className="text-lg text-gray-700">
                <strong>Joined on:</strong> {new Date(data.joined_date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="py-3">
          <div className="grid gap-4">
            <div>
              <p className="text-md font-semibold text-gray-800">Business ID:</p>
              <p className="text-md text-gray-600">{data.business_id}</p>
            </div>
            <div>
              <p className="text-md font-semibold text-gray-800">Business Type:</p>
              <p className="text-md text-gray-600">{data.business_type}</p>
            </div>
            <div>
              <p className="text-md font-semibold text-gray-800">User ID:</p>
              <p className="text-md text-gray-600">{data.user_id}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
