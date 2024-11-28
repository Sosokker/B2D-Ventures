import { getProjectByUserId } from "@/lib/data/projectQuery";
import { createSupabaseClient } from "@/lib/supabase/serverComponentClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const ProjectProfileSection = async ({ userId }: { userId: string }) => {
  const supabase = createSupabaseClient();
  const { data, error } = await getProjectByUserId(supabase, userId);

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

  if (!data || data.length === 0) {
    return (
      <Card className="text-center">
        <CardHeader>
          <CardTitle>No Project Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This business doesn&apos;t have any projects</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container max-w-screen-xl px-4">
      <div className="overflow-y-auto max-h-screen flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.map((project) => (
            <Card key={project.id} className="shadow-lg rounded-lg bg-white dark:bg-slate-900 overflow-hidden">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="text-center sm:text-left">
                    <CardTitle className="text-2xl font-semibold">{project.project_name}</CardTitle>
                    <CardDescription className="text-md text-gray-600 dark:text-gray-500">
                      {project.project_short_description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="py-4">
                <Button>
                  <Link href={`/deals/${project.id}`}>Go to deal</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
