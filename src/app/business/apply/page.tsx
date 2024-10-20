"use client";
import { createSupabaseClient } from "@/lib/supabase/clientComponentClient";
import { useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { z } from "zod";
import BusinessForm from "@/components/BusinessForm";
import { businessFormSchema } from "@/types/schemas/application.schema";
import Swal from "sweetalert2";
import { getCurrentUserID } from "@/app/api/userApi";

type businessSchema = z.infer<typeof businessFormSchema>;
export default function ApplyBusiness() {
  const [applyProject, setApplyProject] = useState(false);

  const onSubmit: SubmitHandler<businessSchema> = async (data) => {
    const transformedData = await transformChoice(data);
    console.log(transformedData);
    await sendRegistration(transformedData);
  };
  const sendRegistration = async (recvData: any) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    
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
          pitch_deck_url: recvData["businessPitchDeck"],
          money_raised_to_date: recvData["totalRaised"],
          community_size: recvData["communitySize"],
        },
      ])
      .select();
    console.table(data);
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

  let supabase = createSupabaseClient();
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
