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
    console.table(data);
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
      const { data, error } = await supabase
        .from("project_application_tag")
        .insert([{ tag_id: tag, project_id: projectId }])
        .select();

      return { data, error };
    });

    const results = await Promise.all(tagPromises);
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
      "BUCKET_PITCH_APPLICATION_NAME",
      `${userId}/${projectId}/pitches/${file.name}`
    );
  };

  const uploadLogoAndPhotos = async (
    logoFile: File,
    photos: File[],
    userId: string,
    projectId: string
  ) => {
    if (logoFile) {
      const uploadLogoSuccess = await uploadFile(
        logoFile,
        "BUCKET_PITCH_APPLICATION_NAME",
        `${userId}/${projectId}/logo/${logoFile.name}`
      );

      if (!uploadLogoSuccess) {
        console.error("Error uploading logo.");
        return false;
      }
    }

    const uploadPhotoPromises = photos.map((image) =>
      uploadFile(
        image,
        "BUCKET_PITCH_APPLICATION_NAME",
        `${userId}/${projectId}/photos/${image.name}`
      )
    );

    const photoResults = await Promise.all(uploadPhotoPromises);
    return photoResults.every(Boolean); // Checks if all photos uploaded successfully
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
        window.location.href = "/";
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
    const uploadMediaSuccess = await uploadLogoAndPhotos(
      recvData["projectLogo"],
      recvData["projectPhotos"],
      user.id,
      projectId
    );

    if (!uploadMediaSuccess) {
      console.error("Error uploading media files.");
    }
    displayAlert(error);
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
