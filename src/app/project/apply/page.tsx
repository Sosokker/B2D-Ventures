"use client";
import { createSupabaseClient } from "@/lib/supabase/clientComponentClient";
import ProjectForm from "@/components/ProjectForm";
import { projectFormSchema } from "@/types/schemas/application.schema";
import { z } from "zod";
import { SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import { uploadFile } from "@/app/api/generalApi";

type projectSchema = z.infer<typeof projectFormSchema>;
let supabase = createSupabaseClient();
const BUCKET_PITCH_APPLICATION_NAME = "project-application";

export default function ApplyProject() {
  const onSubmit: SubmitHandler<projectSchema> = async (data) => {
    alert("มาแน้ววว");
    await sendApplication(data);
    // console.table(data);
    // console.log(typeof data["projectPhotos"], data["projectPhotos"]);
  };
  const saveApplicationData = async (recvData: any, userId: string) => {
    const pitchType = typeof recvData["projectPitchDeck"];
    const { data: projectData, error: projectError } = await supabase
      .from("project_application")
      .insert([
        {
          user_id: userId,
          pitch_deck_url:
            pitchType === "string" ? recvData["projectPitchDeck"] : "",
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

      // console.log("Insert response for tag:", tag, response);

      return response;
    });

    const results = await Promise.all(tagPromises);

    // Collect errors
    const errors = results
      .filter((result) => result.error)
      .map((result) => result.error);

    return { errors };
  };

  const uploadPitchFile = async (
    file: File,
    userId: string,
    projectId: string
  ) => {
    if (!file || !userId) {
      console.error("Pitch file or user ID is undefined.");
      return false;
    }

    return await uploadFile(
      file,
      BUCKET_PITCH_APPLICATION_NAME,
      `${userId}/${projectId}/pitches/${file.name}`
    );
  };

  const uploadLogoAndPhotos = async (
    logoFile: File,
    photos: File[],
    userId: string,
    projectId: string
  ) => {
    const uploadResults: { logo?: any; photos: any[] } = { photos: [] };

    // upload logo
    if (logoFile) {
      const logoResult = await uploadFile(
        logoFile,
        BUCKET_PITCH_APPLICATION_NAME,
        `${userId}/${projectId}/logo/${logoFile.name}`
      );

      if (!logoResult.success) {
        console.error("Error uploading logo:", logoResult.errors);
        return { success: false, logo: logoResult, photos: [] };
      }

      uploadResults.logo = logoResult;
    }

    // upload each photo
    const uploadPhotoPromises = photos.map((image) =>
      uploadFile(
        image,
        BUCKET_PITCH_APPLICATION_NAME,
        `${userId}/${projectId}/photos/${image.name}`
      )
    );

    const photoResults = await Promise.all(uploadPhotoPromises);
    uploadResults.photos = photoResults;

    // check if all uploads were successful
    const allUploadsSuccessful = photoResults.every((result) => result.success);

    return {
      success: allUploadsSuccessful,
      logo: uploadResults.logo,
      photos: uploadResults.photos,
    };
  };

  const displayAlert = (error: any) => {
    Swal.fire({
      icon: error == null ? "success" : "error",
      title: error == null ? "Success" : `Error: ${error.code}`,
      text:
        error == null ? "Your application has been submitted" : error.message,
      confirmButtonColor: error == null ? "green" : "red",
    }).then((result) => {
      if (result.isConfirmed) {
        // window.location.href = "/";
      }
    });
  };

  const sendApplication = async (recvData: any) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.id) {
      console.error("User ID is undefined.");
      return;
    }

    // save application data
    const { projectId, error } = await saveApplicationData(recvData, user.id);

    if (error) {
      displayAlert(error);
      return;
    }
    const tagError = saveTags(recvData["tag"], projectId);
    // if (tagError) {
    //   displayAlert(tagError);
    //   return;
    // }

    //  upload pitch file if it’s a file
    if (typeof recvData["projectPitchDeck"] === "object") {
      const uploadPitchSuccess = await uploadPitchFile(
        recvData["projectPitchDeck"],
        user.id,
        projectId
      );

      if (!uploadPitchSuccess) {
        console.error("Error uploading pitch file.");
      } else {
        console.log("Pitch file uploaded successfully.");
      }
    }

    // upload logo and photos
    const { success, logo, photos } = await uploadLogoAndPhotos(
      recvData["projectLogo"],
      recvData["projectPhotos"],
      user.id,
      projectId
    );
    if (!success) {
      console.error("Error uploading media files.");
    }
    const folderPath = photos[0].data.path;
    const lastSlashIndex = folderPath.lastIndexOf("/");
    const photosPath = folderPath.substring(0, lastSlashIndex);
    const logoURL = getPublicURL(
      logo.data.path,
      BUCKET_PITCH_APPLICATION_NAME
    )?.publicUrl;
    const photosURL = getPublicURL(
      photosPath,
      BUCKET_PITCH_APPLICATION_NAME
    )?.publicUrl;

    updateImageURL(logoURL, "project_logo", projectId);
    // console.log(logoURL, photosUrl);
    displayAlert(error);
  };
  const updateImageURL = async (
    url: string,
    columnName: string,
    projectId: number
  ) => {
    const { data, error } = await supabase
      .from("project_application")
      .update({ [columnName]: url })
      .eq("id", projectId)
      .select();
    console.table(data);
  };
  const getPublicURL = (path: string, bucketName: string) => {
    const { data } = supabase.storage.from(bucketName).getPublicUrl(path);
    // console.table(data);
    return data;
  };
  return (
    <div>
      <div className="grid grid-flow-row auto-rows-max w-full h-52 md:h-92 bg-gray-2s00 dark:bg-gray-800 p-5">
        <h1 className="text-2xl md:text-5xl font-medium md:font-bold justify-self-center md:mt-8">
          Apply to raise on B2DVentures
        </h1>
        <div className="mt-5 justify-self-center">
          <p className="text-sm md:text-base text-neutral-500">
            Begin Your First Fundraising Project. Starting a fundraising project
            is mandatory for all businesses.
          </p>
          <p className="text-sm md:text-base text-neutral-500">
            This step is crucial to begin your journey and unlock the necessary
            tools for raising funds.
          </p>
        </div>
      </div>
      <div className="grid auto-rows-max bg-zinc-100 dark:bg-zinc-900 pt-12 -mb-6">
        <ProjectForm onSubmit={onSubmit} />
      </div>
    </div>
  );
}
