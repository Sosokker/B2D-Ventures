"use client";

import { useState, useEffect } from "react";
import { FileIcon, defaultStyles } from "react-file-icon";
import { getFilesByDataroomId } from "@/lib/data/dataroomQuery";
import { createSupabaseClient } from "@/lib/supabase/clientComponentClient";
import { format } from "date-fns";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { getAccessRequests } from "@/lib/data/dataroomQuery";
import useSession from "@/lib/supabase/useSession";

export default function ViewDataRoomFilesPage({ params }: { params: { dataroomId: number } }) {
  const dataroomId = params.dataroomId;
  const supabase = createSupabaseClient();
  const router = useRouter();
  const [sortOption, setSortOption] = useState("name");
  const { session, loading: sessionLoading } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    if (!sessionLoading && !session) {
      toast.error("Please login to access this page");
      router.push("/auth/login");
    }
  }, [session, sessionLoading, router]);

  const {
    data: project,
    error: projectError,
    isLoading: isLoadingProject,
  } = useQuery(supabase.from("project").select(`id, project_name, dataroom_id`).eq("dataroom_id", dataroomId), {
    enabled: !!userId,
  });
  const {
    data: accessRequest,
    error: accessRequestError,
    isLoading: accessRequestLoading,
  } = useQuery(getAccessRequests(supabase, { dataroomId: dataroomId, userId: userId }));

  useEffect(() => {
    if (!accessRequestLoading && accessRequest) {
      const hasAccess = accessRequest[0]?.status === "approve";
      if (!hasAccess) {
        toast.error("You don't have permission to access this dataroom");
        router.push("/dataroom/overview");
      }
    }
  }, [accessRequest, accessRequestLoading, router]);

  const {
    data: files,
    error: filesError,
    isLoading: isLoadingFiles,
  } = useQuery(getFilesByDataroomId(supabase, dataroomId));

  if (projectError || filesError || accessRequestError) {
    const errorMessage = projectError
      ? "Unable to load project details"
      : filesError
        ? "Unable to load files"
        : "Unable to verify access permissions";

    toast.error(errorMessage);
    router.push("/dataroom/overview");
    return null;
  }

  if (isLoadingProject || isLoadingFiles || accessRequestLoading) {
    return (
      <div className="container max-w-screen-xl p-4">
        <Skeleton className="h-8 w-64 mb-4" />
        <div className="space-y-3">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  function getFileNameFromUrl(fileUrl: string): string {
    const fullFileName = fileUrl.split("/").pop() || "";
    return decodeURIComponent(fullFileName.split("?")[0]);
  }

  const sortedFiles = [...(files || [])].sort((a, b) => {
    if (sortOption === "name") {
      const nameA = getFileNameFromUrl(a.file_url).toLowerCase();
      const nameB = getFileNameFromUrl(b.file_url).toLowerCase();
      return nameA.localeCompare(nameB);
    } else if (sortOption === "date") {
      return new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime();
    }
    return 0;
  });

  return (
    <div className="container max-w-screen-xl p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Dataroom Files |&nbsp;
        {isLoadingProject ? (
          "Loading..."
        ) : project && project.length > 0 ? (
          <Link href={`/deals/${project[0].id}`} className="text-blue-600">
            {project[0].project_name}
          </Link>
        ) : (
          "Project Not Found"
        )}
      </h2>
      <div
        id="file-section"
        className="border border-border dark:border-gray-700 rounded-md p-4 space-y-4 bg-white dark:bg-gray-900 shadow-sm"
      >
        <div className="flex justify-between items-center mb-2">
          <p className="text-gray-700 dark:text-gray-300">{`Uploaded files (${sortedFiles.length})`}</p>
          <div className="flex items-center space-x-2">
            <label htmlFor="sort" className="text-gray-500 dark:text-gray-400">
              Sort by:
            </label>
            <select
              id="sort"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-md p-1 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800"
            >
              <option value="name">Name</option>
              <option value="date">Date</option>
            </select>
          </div>
        </div>

        {/* Conditional rendering based on loading state */}
        {isLoadingProject || isLoadingFiles ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, index) => (
              <Skeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {sortedFiles.length > 0 ? (
              sortedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex justify-between items-center border border-border dark:border-gray-700 rounded-md p-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  <span className="flex items-center space-x-3">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <FileIcon
                        extension={file.file_type.value}
                        {...defaultStyles[file.file_type.value as keyof typeof defaultStyles]}
                      />
                    </div>
                    <Link href={file.file_url} rel="noopener noreferrer" target="_blank">
                      <p className="text-blue-600 dark:text-blue-400 hover:text-blue-800">
                        {getFileNameFromUrl(file.file_url)}
                      </p>
                    </Link>
                  </span>
                  <span className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
                    <p>{"Unknown size"}</p>
                    <p>{format(new Date(file.uploaded_at), "MMM d, yyyy")}</p>
                    <button className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
                      Select
                    </button>
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No files uploaded yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
