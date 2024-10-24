"use client";
import { useState } from "react";
import { createSupabaseClient } from "@/lib/supabase/clientComponentClient";
import ProjectForm from "@/components/ProjectForm";
import { projectFormSchema } from "@/types/schemas/application.schema";
import { z } from "zod";
import { SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";

type projectSchema = z.infer<typeof projectFormSchema>;
let supabase = createSupabaseClient();
const BUCKET_PITCH_NAME = "project-pitches";
const BUCKET_LOGO_NAME = "project-logo";
const BUCKET_PHOTOS_NAME = "project-additional-photos";

export default function ApplyProject() {
  const onSubmit: SubmitHandler<projectSchema> = async (data) => {
    alert("มาแน้ววว");
    
    console.table(data);
    console.log(typeof data["projectPhotos"], data["projectPhotos"]);
  };
  const sendApplication = async (recvData: any) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const pitchType = typeof recvData["projectPitchDeck"];

    const { data, error } = await supabase
      .from("project_application")
      .insert([
        {
          user_id: user?.id,
          pitch_deck_url:
            pitchType === "string" ? recvData["businessPitchDeck"] : "",
          target_investment: recvData["targetInvest"],
          deadline: recvData["deadline"],
          project_name: recvData["projectName"],
          
        },
      ])
      .select();
          if (pitchType === "object") {
            if (user?.id) {
              // const uploadSuccess = await uploadFile(
              //   recvData["businessPitchDeck"],
              //   user.id,
              //   BUCKET_PITCH_NAME
              // );

              // if (!uploadSuccess) {
              //   return;
              // }

              console.log("file upload successful");
            } else {
              console.error("user ID is undefined.");
              return;
            }
          }
    // console.table(data);
    Swal.fire({
      icon: error == null ? "success" : "error",
      title: error == null ? "success" : "Error: " + error.code,
      text:
        error == null ? "Your application has been submitted" : error.message,
      confirmButtonColor: error == null ? "green" : "red",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/";
      }
    });
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
