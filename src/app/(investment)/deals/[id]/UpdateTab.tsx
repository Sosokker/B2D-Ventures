import { createSupabaseClient } from "@/lib/supabase/serverComponentClient";
import { getProjectLogByProjectId } from "@/lib/data/projectLogQuery";
import { LogEntry, parseProjectLog } from "./logParser";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

export const UpdateTab = async ({ projectId }: { projectId: number }) => {
  const supabase = createSupabaseClient();
  const { data, error } = await getProjectLogByProjectId(supabase, projectId);

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <Card>
          <CardContent>
            <div className="text-center text-gray-500">
              <CardTitle className="mb-3 mt-4">No updates available</CardTitle>
              <CardDescription>There are no updates to display at this time. Please check back later.</CardDescription>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const parsedLogs = parseProjectLog(data as unknown as LogEntry[]);

  if (parsedLogs.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <Card>
          <CardContent>
            <div className="text-center text-gray-500">
              <CardTitle className="mb-3 mt-4">No updates available</CardTitle>
              <CardDescription>There are no updates to display at this time. Please check back later.</CardDescription>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full">
      {parsedLogs.map((log, index) => (
        <div key={index} className="grid grid-cols-3 gap-4 overflow-y-auto">
          <Card>
            <CardHeader>
              <CardTitle>{log.table}</CardTitle>
              <CardDescription>{log.changes.length} Changes</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 overflow-y-auto h-1/2 mx-4">
              {log.changes.map((change, changeIndex) => (
                <div key={changeIndex} className="mb-3">
                  <div className="text-sm font-semibold">{change.field}</div>
                  <div className="text-gray-500">
                    <span className="text-red-500">From:</span> {JSON.stringify(change.from)}
                  </div>
                  <div className="text-gray-500">
                    <span className="text-green-500">To:</span> {JSON.stringify(change.to)}
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <div className="text-xs text-gray-500">Updated at: {new Date(log.changed_at).toLocaleString()}</div>
            </CardFooter>
          </Card>
        </div>
      ))}
    </div>
  );
};
