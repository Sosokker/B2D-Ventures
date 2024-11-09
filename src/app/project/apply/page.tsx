"use client";

import { createSupabaseClient } from "@/lib/supabase/clientComponentClient";
import ProjectForm from "./ProjectForm";
import { projectFormSchema } from "@/types/schemas/application.schema";
import { z } from "zod";
import { SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import { uploadFile } from "@/app/api/generalApi";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useUserRole } from "@/hooks/useUserRole";
import { LegacyLoader } from "@/components/loading/LegacyLoader";

type projectSchema = z.infer<typeof projectFormSchema>;
const supabase = createSupabaseClient();
const BUCKET_PITCH_APPLICATION_NAME = "project-application";

export default function ApplyProject() {
  const router = useRouter();
  const { data, session, isLoading, error } = useUserRole();
  const userId = session?.user.id;
  const role: string = data?.role;

  if (isLoading || !session) {
    return <LegacyLoader />;
  }

  if (error) {
    throw error;
  }

  if (role != "business") {
    router.push("/business/apply");
    toast.error("Please apply to raise on B2DVentures first!");
    return;
  }

  const displayAlert = (error: any) => {
    Swal.fire({
      icon: error == null ? "success" : "error",
      title: error == null ? "Success" : `Error: ${error.code}`,
      text: error == null ? "Your application has been submitted" : error.message,
      confirmButtonColor: error == null ? "green" : "red",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        toast.error("Error sending Project Application");
        router.push("/");
      }
    });
  };

  const saveApplicationData = async (recvData: any) => {
    const pitchType = typeof recvData["projectPitchDeck"];
    const { data: projectData, error: projectError } = await supabase
      .from("project_application")
      .insert([
        {
          user_id: userId,
          pitch_deck_url: pitchType === "string" ? recvData["projectPitchDeck"] : "",
          target_investment: recvData["targetInvest"],
          deadline: recvData["deadline"],
          project_name: recvData["projectName"],
          project_type_id: recvData["projectType"],
          short_description: recvData["shortDescription"],
          min_investment: recvData["minInvest"],
        },
      ])
      .select();

    return { projectId: projectData?.[0]?.id, error: projectError };
  };

  const saveTags = async (tags: string[], projectId: string) => {
    const tagPromises = tags.map(async (tag) => {
      const response = await supabase
        .from("project_application_tag")
        .insert([{ tag_id: tag, item_id: projectId }])
        .select();
      return response;
    });

    const results = await Promise.all(tagPromises);
    const errors = results.filter((result) => result.error).map((result) => result.error);

    return { errors };
  };

  const uploadPitchFile = async (file: File, projectId: string) => {
    if (!file || !userId) return false;

    return await uploadFile(file, BUCKET_PITCH_APPLICATION_NAME, `${userId}/${projectId}/pitches/${file.name}`);
  };

  const uploadLogoAndPhotos = async (logoFile: File, photos: File[], projectId: string) => {
    const uploadResults: { logo?: any; photos: any[] } = { photos: [] };

    if (logoFile) {
      const logoResult = await uploadFile(
        logoFile,
        BUCKET_PITCH_APPLICATION_NAME,
        `${userId}/${projectId}/logo/${logoFile.name}`
      );
      if (!logoResult.success) return { success: false, logo: logoResult, photos: [] };
      uploadResults.logo = logoResult;
    }

    const uploadPhotoPromises = photos.map((image) =>
      uploadFile(image, BUCKET_PITCH_APPLICATION_NAME, `${userId}/${projectId}/photos/${image.name}`)
    );

    const photoResults = await Promise.all(uploadPhotoPromises);
    uploadResults.photos = photoResults;
    const allUploadsSuccessful = photoResults.every((result) => result.success);

    return { success: allUploadsSuccessful, logo: uploadResults.logo, photos: uploadResults.photos };
  };

  const updateImageURL = async (url: string | string[], columnName: string, projectId: number) => {
    const { error } = await supabase
      .from("project_application")
      .update({ [columnName]: url })
      .eq("id", projectId);
    if (error) toast.error(error.message);
  };

  const getPrivateURL = async (path: string, bucketName: string) => {
    const { data } = await supabase.storage.from(bucketName).createSignedUrl(path, 31560000);
    return data;
  };

  const sendApplication = async (recvData: any) => {
    const { projectId, error } = await saveApplicationData(recvData);
    if (error) {
      displayAlert(error);
      return;
    }

    await saveTags(recvData["tag"], projectId);

    if (typeof recvData["projectPitchDeck"] === "object") {
      await uploadPitchFile(recvData["projectPitchDeck"], projectId);
    }

    const { success, logo, photos } = await uploadLogoAndPhotos(
      recvData["projectLogo"],
      recvData["projectPhotos"],
      projectId
    );
    if (!success) toast.error("Error uploading media files.");

    const logoURL = await getPrivateURL(logo.data.path, BUCKET_PITCH_APPLICATION_NAME);
    let photoURLsArray: string[] = [];
    const photoURLPromises = photos.map(async (item) => {
      const photoURL = await getPrivateURL(item.data.path, BUCKET_PITCH_APPLICATION_NAME);
      if (photoURL?.signedUrl) photoURLsArray.push(photoURL.signedUrl);
    });
    await Promise.all(photoURLPromises);

    if (logoURL?.signedUrl) await updateImageURL(logoURL.signedUrl, "project_logo", projectId);
    await updateImageURL(photoURLsArray, "project_photos", projectId);

    if (error) {
      displayAlert(error);
      router.push("/project/apply");
    }
  };

  const onSubmit: SubmitHandler<projectSchema> = async (data) => {
    await sendApplication(data);
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
        <ProjectForm onSubmit={onSubmit} />
      </div>
    </div>
  );
}
