"use client";
import { createSupabaseClient } from "@/lib/supabase/clientComponentClient";
import { useState, useEffect, useRef } from "react";
import { SubmitHandler } from "react-hook-form";
import { z } from "zod";
import BusinessForm from "./BusinessForm";
import { businessFormSchema } from "@/types/schemas/application.schema";
import Swal from "sweetalert2";
import { getCurrentUserID } from "@/app/api/userApi";
import { uploadFile } from "@/app/api/generalApi";
import { Loader } from "@/components/loading/loader";
import { hasUserApplied, transformChoice } from "./actions";

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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setSucess(false);
        const userID = await getCurrentUserID();
        if (userID) {
          const hasApplied = await hasUserApplied(supabase, userID);
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
        } else {
          setSucess(true);
          console.error("User ID is undefined.");
        }
      } catch (error) {
        setSucess(true);
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
