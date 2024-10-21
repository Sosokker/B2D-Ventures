"use client";
import { createSupabaseClient } from "@/lib/supabase/clientComponentClient";
import { useState, useEffect, useRef } from "react";
import { SubmitHandler } from "react-hook-form";
import { z } from "zod";
import BusinessForm from "@/components/BusinessForm";
import { businessFormSchema } from "@/types/schemas/application.schema";
import Swal from "sweetalert2";
import { getCurrentUserID } from "@/app/api/userApi";

type businessSchema = z.infer<typeof businessFormSchema>;
const BUCKET_NAME = "project-pitches";
export default function ApplyBusiness() {
  const [applyProject, setApplyProject] = useState(false);
  let supabase = createSupabaseClient();
  const alertShownRef = useRef(false);

  const onSubmit: SubmitHandler<businessSchema> = async (data) => {
    const transformedData = await transformChoice(data);
    await sendApplication(transformedData);
  };
  const sendApplication = async (recvData: any) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const pitchType = typeof recvData["businessPitchDeck"];
    if (pitchType === "object") {
      if (user?.id) {
        const uploadSuccess = await uploadFile(
          recvData["businessPitchDeck"],
          user.id,
          BUCKET_NAME
        );

        if (!uploadSuccess) {
          return;
        }

        console.log("file upload successful");
      } else {
        console.error("user ID is undefined.");
        return;
      }
    }

    const { data, error } = await supabase
      .from("business_application")
      .insert([
        {
          user_id: user?.id,
          business_name: recvData["companyName"],
          business_type_id: recvData["industry"],
          location: recvData["country"],
          is_for_sale: recvData["isForSale"],
          is_generating_revenue: recvData["isGenerating"],
          is_in_us: recvData["isInUS"],
          pitch_deck_url:
            pitchType === "string" ? recvData["businessPitchDeck"] : "",
          money_raised_to_date: recvData["totalRaised"],
          community_size: recvData["communitySize"],
        },
      ])
      .select();
    // console.table(data);
    Swal.fire({
      icon: error == null ? "success" : "error",
      title: error == null ? "success" : "Error: " + error.code,
      text:
        error == null ? "Your application has been submitted" : error.message,
      confirmButtonColor: error == null ? "green" : "red",
    }).then((result) => {
      if (result.isConfirmed && applyProject) {
        window.location.href = "/project/apply";
      } else {
        window.location.href = "/";
      }
    });
  };

  async function uploadFile(file: File, userID: string, bucketName: string) {
    const folderPath = `${userID}/`;
    const filePath = `${folderPath}${file.name}`;
    let errorMessages: string[] = [];

    // check if the folder exists
    const { data: folderData, error: folderError } = await supabase.storage
      .from(bucketName)
      .list(folderPath);

    if (folderError) {
      errorMessages.push(`Error checking for folder: ${folderError.message}`);
    }

    // if the folder exists, clear the folder
    if (folderData && folderData.length > 0) {
      console.log("Folder exists. Clearing contents...");

      for (const fileItem of folderData) {
        const { error: removeError } = await supabase.storage
          .from(bucketName)
          .remove([`${folderPath}${fileItem.name}`]);

        if (removeError) {
          errorMessages.push(
            `Error removing file (${fileItem.name}): ${removeError.message}`
          );
        }
      }
    }

    // upload the new file to the folder (if no folderError)
    if (errorMessages.length === 0) {
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (uploadError) {
        errorMessages.push(`Error uploading file: ${uploadError.message}`);
      }
    }
    if (errorMessages.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Errors occurred",
        html: errorMessages.join("<br>"),
        confirmButtonColor: "red",
      });
      return false;
    }
    return true;
  }
  const hasUserApplied = async (userID: string) => {
    let { data: business, error } = await supabase
      .from("business")
      .select("*")
      .eq("user_id", userID);
    console.table(business);
    if (business) {
      return true;
    }
    return false;
  };
  const transformChoice = (data: any) => {
    // convert any yes and no to true or false
    const transformedData = Object.entries(data).reduce(
      (acc: Record<any, any>, [key, value]) => {
        if (typeof value === "string") {
          const lowerValue = value.toLowerCase();
          if (lowerValue === "yes") {
            acc[key] = true;
          } else if (lowerValue === "no") {
            acc[key] = false;
          } else {
            acc[key] = value; // keep other string values unchanged
          }
        } else {
          acc[key] = value; // keep other types unchanged
        }
        return acc;
      },
      {}
    );
    return transformedData;
  };
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userID = await getCurrentUserID();
        if (userID) {
          const hasApplied = await hasUserApplied(userID);
          if (hasApplied && !alertShownRef.current) {
            alertShownRef.current = true;
            Swal.fire({
              icon: "info",
              title: "You Already Have an Account",
              text: "You have already submitted your business application.",
              confirmButtonText: "OK",
              allowOutsideClick: false,
              allowEscapeKey: false,
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.href = "/";
              }
            });
          }
        } else {
          console.error("User ID is undefined.");
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div>
      <div className="grid grid-flow-row auto-rows-max w-full h-52 md:h-92 bg-gray-100 dark:bg-gray-800 p-5">
        <h1 className="text-2xl md:text-5xl font-medium md:font-bold justify-self-center md:mt-8">
          Apply to raise on B2DVentures
        </h1>
        <div className="mt-5 justify-self-center">
          <p className="text-sm md:text-base text-neutral-500">
            All information submitted in this application is for internal use
            only and is treated with the utmost{" "}
          </p>
          <p className="text-sm md:text-base text-neutral-500">
            confidentiality. Companies may apply to raise with B2DVentures more
            than once.
          </p>
        </div>
      </div>
      {/* form */}
      {/* <form action="" onSubmit={handleSubmit(handleSubmitForms)}> */}
      <BusinessForm
        onSubmit={onSubmit}
        applyProject={applyProject}
        setApplyProject={setApplyProject}
      />
    </div>
  );
}
