"use client";
import { createSupabaseClient } from "@/lib/supabase/clientComponentClient";
import { useState, useEffect, useRef } from "react";
import { SubmitHandler } from "react-hook-form";
import { z } from "zod";
import BusinessForm from "@/components/BusinessForm";
import { businessFormSchema } from "@/types/schemas/application.schema";
import Swal from "sweetalert2";
import { getCurrentUserID } from "@/app/api/userApi";
import { uploadFile } from "@/app/api/generalApi";
import { Loader } from "@/components/loading/loader";

type businessSchema = z.infer<typeof businessFormSchema>;
const BUCKET_PITCH_NAME = "business-application";
let supabase = createSupabaseClient();

export default function ApplyBusiness() {
  const alertShownRef = useRef(false);
  const [success, setSucess] = useState(false);

  const onSubmit: SubmitHandler<businessSchema> = async (data) => {
    const transformedData = await transformChoice(data);
    await sendApplication(transformedData);
  };
  const sendApplication = async (recvData: any) => {
    setSucess(false);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const pitchType = typeof recvData["businessPitchDeck"];
    if (pitchType === "object") {
      if (user?.id) {
        const uploadSuccess = await uploadFile(
          recvData["businessPitchDeck"],
          BUCKET_PITCH_NAME,
          // file structure: userId/fileName
          `${user?.id}/pitch-file/pitch.md`
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

    const { error } = await supabase
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
          pitch_deck_url: pitchType === "string" ? recvData["businessPitchDeck"] : "",
          money_raised_to_date: recvData["totalRaised"],
          community_size: recvData["communitySize"],
        },
      ])
      .select();
    setSucess(true);
    // console.table(data);
    Swal.fire({
      icon: error == null ? "success" : "error",
      title: error == null ? "success" : "Error: " + error.code,
      text: error == null ? "Your application has been submitted" : error.message,
      confirmButtonColor: error == null ? "green" : "red",
    }).then(() => {
      window.location.href = "/";
    });
  };

  const hasUserApplied = async (userID: string) => {
    let { data: business, error } = await supabase.from("business").select("*").eq("user_id", userID);
    let { data: businessApplication, error: applicationError } = await supabase
      .from("business_application")
      .select("*")
      .eq("user_id", userID);
    // console.table(business);
    if (error || applicationError) {
      console.error(error);
      console.error(applicationError);
    }
    if ((business && business.length != 0) || (businessApplication && businessApplication.length != 0)) {
      return true;
    }
    return false;
  };
  const transformChoice = (data: any) => {
    // convert any yes and no to true or false
    const transformedData = Object.entries(data).reduce((acc: Record<any, any>, [key, value]) => {
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
    }, {});
    return transformedData;
  };
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setSucess(false);
        const userID = await getCurrentUserID();
        if (userID) {
          const hasApplied = await hasUserApplied(userID);
          setSucess(true);
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
          setSucess(false);
        } else {
          console.error("User ID is undefined.");
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };
    // setSucess(true);
    fetchUserData();
  }, []);

  return (
    <div>
      <Loader isSuccess={success} />
      <div className="grid grid-flow-row auto-rows-max w-full h-52 md:h-92 bg-gray-100 dark:bg-gray-800 p-5">
        <h1 className="text-2xl md:text-5xl font-medium md:font-bold justify-self-center md:mt-8">
          Apply to raise on B2DVentures
        </h1>
        <div className="mt-5 justify-self-center">
          <p className="text-sm md:text-base text-neutral-500">
            All information submitted in this application is for internal use only and is treated with the utmost{" "}
          </p>
          <p className="text-sm md:text-base text-neutral-500">
            confidentiality. Companies may apply to raise with B2DVentures more than once.
          </p>
        </div>
      </div>
      {/* form */}
      {/* <form action="" onSubmit={handleSubmit(handleSubmitForms)}> */}
      <BusinessForm onSubmit={onSubmit} />
    </div>
  );
}
