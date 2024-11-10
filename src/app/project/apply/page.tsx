"use client";

import { saveApplicationData, saveTags } from "./projectService";
import { uploadFiles } from "./fileUploadService";
import { displayAlert } from "./displayAlert";
import ProjectForm from "./ProjectForm";
import { LegacyLoader } from "@/components/loading/LegacyLoader";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useUserRole } from "@/hooks/useUserRole";

export default function ApplyProject() {
  const router = useRouter();
  const { data, session, isLoading, error } = useUserRole();
  const role: string = data?.role;

  if (isLoading || !session) {
    return <LegacyLoader />;
  }

  const userId = session!.user.id;

  if (error) {
    throw error;
  }

  if (role != "business") {
    router.push("/business/apply");
    toast.error("Please apply to raise on B2DVentures first!");
    return;
  }

  const sendApplication = async (data: any) => {
    try {
      const { projectId, error } = await saveApplicationData(data, userId);
      if (error) {
        displayAlert(error);
        return;
      }

      await saveTags(data["tag"], projectId);
      await uploadFiles(data["projectPhotos"], `${userId}/${projectId}/photos/`);
      displayAlert(null);
      router.push("/");
    } catch (error) {
      displayAlert(error);
    }
  };

  return (
    <div>
      <div className="grid grid-flow-row auto-rows-max w-full h-52 md:h-92 bg-gray-200 dark:bg-gray-800 p-5">
        <h1 className="text-2xl md:text-5xl font-medium md:font-bold justify-self-center md:mt-8">
          Apply to raise on B2DVentures
        </h1>
        <div className="mt-5 justify-self-center">
          <p className="text-sm md:text-base text-neutral-500">
            Begin Your First Fundraising Project. Starting a fundraising project is mandatory for all businesses.
          </p>
          <p className="text-sm md:text-base text-neutral-500">
            This step is crucial to begin your journey and unlock the necessary tools for raising funds.
          </p>
        </div>
      </div>
      <div className="grid auto-rows-max bg-zinc-100 dark:bg-zinc-900 pt-12 -mb-6">
        <ProjectForm onSubmit={sendApplication} />
      </div>
    </div>
  );
}
