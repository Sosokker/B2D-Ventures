"use client";
import { createSupabaseClient } from "@/lib/supabase/clientComponentClient";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import BusinessForm from "@/components/BusinessForm";
import { businessFormSchema } from "@/types/schemas/application.schema";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type businessSchema = z.infer<typeof businessFormSchema>;
export default function ApplyBusiness() {
  const [industry, setIndustry] = useState<{ id: number; name: string }[]>([]);
  const [projectType, setProjectType] = useState<string[]>([]);
  const [projectPitch, setProjectPitch] = useState("text");
  const [applyProject, setApplyProject] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [projectPitchFile, setProjectPitchFile] = useState("");
  const MAX_FILE_SIZE = 5000000;
  const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

  const onSubmit: SubmitHandler<businessSchema> = async (data) => {
    const transformedData = await transformChoice(data);
    console.log(transformedData);
    await sendRegistration(transformedData);
  };
  const sendRegistration = async (recvData: any) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    // console.log(user?.id);

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
        error == null ? "your application has been submitted" : error.message,
      confirmButtonColor: error == null ? "green" : "red",
    });
  };

  const createPitchDeckSchema = (inputType: string) => {
    if (inputType === "text") {
      return z
        .string()
        .url("Pitch deck must be a valid URL.")
        .refine((url: string) => url.endsWith(".md"), {
          message: "Pitch deck URL must link to a markdown file (.md).",
        });
    } else if (inputType === "file") {
      return z
        .custom<File>(
          (val: any) => {
            return val instanceof File;
          },
          {
            message: "Input must be a file.",
          }
        )
        .refine((file: File) => file.size < MAX_FILE_SIZE, {
          message: "File can't be bigger than 5MB.",
        })
        .refine((file: File) => file.name.endsWith(".md"), {
          message: "File must be a markdown file (.md).",
        });
    } else {
      return z.any(); // avoid undefined
    }
  };
  const imageSchema = z
    .custom<File>(
      (val: any) =>
        val && typeof val === "object" && "size" in val && "type" in val,
      {
        message: "Input must be a file.",
      }
    )
    .refine((file: File) => file.size < MAX_FILE_SIZE, {
      message: "File can't be bigger than 5MB.",
    })
    .refine((file: File) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "File format must be either jpg, jpeg, or png.",
    });

  const projectFormSchema = z.object({
    projectName: z.string().min(5, {
      message: "Project name must be at least 5 characters.",
    }),
    projectType: z.string({
      required_error: "Please select one of the option",
    }),
    shortDescription: z
      .string({
        required_error: "Please provide a brief description for your project",
      })
      .min(10, {
        message: "Short description must be at least 10 characters.",
      }),
    projectPitchDeck: createPitchDeckSchema(projectPitch),
    projectLogo: imageSchema,

    projectPhotos: z.custom(
      (value: string | Iterable<any> | ArrayLike<any>) => {
        console.log("Tozod", value);
        if (value instanceof FileList || Array.isArray(value)) {
          if (value.length === 1) {
            return false;
          }
          return Array.from(value).every((item) => item instanceof File);
        }
        return false;
      },
      {
        message:
          "Must be a FileList or an array of File objects with at least one file.",
      }
    ),
    minInvest: z
      .number({
        required_error: "Minimum invesment must be a number.",
        invalid_type_error: "Minimum invesment must be a valid number.",
      })
      .positive()
      .max(9999999999, "Minimum invesment must be a realistic amount."),
    targetInvest: z
      .number({
        required_error: "Target invesment must be a number.",
        invalid_type_error: "Target invesment must be a valid number.",
      })
      .positive()
      .max(9999999999, "Target invesment must be a realistic amount."),
    deadline: z
      .string()
      .min(1, "Deadline is required.")
      .refine((value: string) => !isNaN(Date.parse(value)), {
        message: "Invalid date-time format.",
      })
      .transform((value: string | number | Date) => new Date(value))
      .refine((date: Date) => date > new Date(), {
        message: "Deadline must be in the future.",
      }),
  });
  // const businessFormSchema = z.object({
  //   companyName: z.string().min(5, {
  //     message: "Company name must be at least 5 characters.",
  //   }),
  //   industry: z.string({
  //     required_error: "Please select one of the option",
  //   }),
  //   isInUS: z
  //     .string({
  //       required_error: "Please select either 'Yes' or 'No'.",
  //     })
  //     .transform((val: string) => val.toLowerCase())
  //     .refine((val: string) => val === "yes" || val === "no", {
  //       message: "Please select either 'Yes' or 'No'.",
  //     }),
  //   isForSale: z
  //     .string({
  //       required_error: "Please select either 'Yes' or 'No'.",
  //     })
  //     .transform((val: string) => val.toLowerCase())
  //     .refine((val: string) => val === "yes" || val === "no", {
  //       message: "Please select either 'Yes' or 'No'.",
  //     }),
  //   isGenerating: z
  //     .string({
  //       required_error: "Please select either 'Yes' or 'No'.",
  //     })
  //     .transform((val: string) => val.toLowerCase())
  //     .refine((val: string) => val === "yes" || val === "no", {
  //       message: "Please select either 'Yes' or 'No'.",
  //     }),
  //   totalRaised: z
  //     .number({
  //       required_error: "Total raised must be a number.",
  //       invalid_type_error: "Total raised must be a valid number.",
  //     })
  //     .positive()
  //     .max(9999999999, "Total raised must be a realistic amount."),
  //   communitySize: z.string({
  //     required_error: "Please select one of the option",
  //   }),
  //   businessPitchDeck: createPitchDeckSchema(businessPitch),
  // });
  let supabase = createSupabaseClient();
  // const {
  //   register,
  //   handleSubmit,
  //   setValue: setValueBusiness,
  //   formState: { errors: errorsBusiness },
  // } = useForm({
  //   resolver: zodResolver(businessFormSchema),
  // });
  const {
    register: registerSecondForm,
    handleSubmit: handleSecondSubmit,
    formState: { errors: errorsProject },
    setValue: setValueProject,
  } = useForm({
    resolver: zodResolver(projectFormSchema),
  });

  const communitySize = [
    "N/A",
    "0-5K",
    "5-10K",
    "10-20K",
    "20-50K",
    "50-100K",
    "100K+",
  ];

  // useEffect(() => {
  //   register("industry");
  //   register("isInUS");
  //   register("isForSale");
  //   register("isGenerating");
  // }, [register]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      console.log("first file", filesArray);
      setSelectedImages((prevImages) => {
        const updatedImages = [...prevImages, ...filesArray];
        console.log("Updated Images Array:", updatedImages);
        // ensure we're setting an array of File objects
        setValueProject("projectPhotos", updatedImages);
        return updatedImages;
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prevImages) => {
      const updatedImages = prevImages.filter((_, i) => i !== index);
      console.log("After removal - Updated Images:", updatedImages);
      // ensure we're setting an array of File objects
      setValueProject("projectPhotos", updatedImages);
      return updatedImages;
    });
  };

  const ensureArrayValue = (value: any): File[] => {
    if (Array.isArray(value)) return value;
    if (value instanceof File) return [value];
    return [];
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
  // const handleBusinessPitchChange = (type: string) => {
  //   setBusinessPitch(type);
  //   // clear out old data
  //   setValueBusiness("pitchDeck", "");
  // };

  // const handleBusinessFieldChange = (fieldName: string, value: any) => {
  //   switch (fieldName) {
  //     case "isInUS":
  //       setIsInUS(value);
  //       break;
  //     case "isForSale":
  //       setIsForSale(value);
  //       break;
  //     case "isGenerating":
  //       setIsGenerating(value);
  //       break;
  //   }
  //   setValueBusiness(fieldName, value);
  // };
  const handleProjectFieldChange = (fieldName: string, value: any) => {
    switch (fieldName) {
    }
    setValueProject(fieldName, value);
  };

  const fetchIndustry = async () => {
    let { data: BusinessType, error } = await supabase
      .from("business_type")
      .select("id, value");

    if (error) {
      console.error(error);
    } else {
      if (BusinessType) {
        // console.table();
        setIndustry(
          BusinessType.map((item) => ({
            id: item.id,
            name: item.value,
          }))
        );
      }
    }
  };

  const onSubmitSingleForm = (data: any) => {
    // const pitchDeckSchema = createPitchDeckSchema(businessPitch);
    // pitchDeckSchema.parse(data.businessPitchDeck);
    console.log("Valid form input:", data);
    alert(JSON.stringify(data));
  };

  const onSubmitBothForms = (firstFormData: any, secondFormData: any) => {
    const formattedSecondFormData = {
      ...secondFormData,
      projectPhotos: ensureArrayValue(secondFormData.projectPhotos),
    };
    alert(JSON.stringify(firstFormData));
    alert(JSON.stringify(formattedSecondFormData));
    console.log("Both forms submitted:", {
      firstFormData,
      formattedSecondFormData,
    });
  };

  const handleSubmitForms = (firstFormData: any) => {
    const transformedData = transformChoice(firstFormData);
    if (applyProject) {
      handleSecondSubmit((secondFormData: any) => {
        onSubmitBothForms(transformedData, secondFormData);
      })();
    } else {
      onSubmitSingleForm(transformedData);
    }
  };
  const fetchProjectType = async () => {
    let { data: ProjectType, error } = await supabase
      .from("project_type")
      .select("value");

    if (error) {
      console.error(error);
    } else {
      if (ProjectType) {
        console.table(ProjectType);
        setProjectType(ProjectType.map((item) => item.value));
      }
    }
  };
  useEffect(() => {
    fetchIndustry();
    fetchProjectType();
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
        industry={industry}
        onSubmit={onSubmit}
        applyProject={applyProject}
        setApplyProject={setApplyProject}
      />
      <div>
        {" "}
        <div className="grid auto-rows-max w-3/4 ml-48 bg-zinc-100 dark:bg-zinc-900 mt-10 pt-12 pb-12">
          {/* header */}
          <div className="ml-[15%]">
            <h1 className="text-3xl font-bold mt-10">
              Begin Your First Fundraising Project
            </h1>
            <p className="mt-3 text-sm text-neutral-500">
              Starting a fundraising project is mandatory for all businesses.
              This step is crucial <br />
              to begin your journey and unlock the necessary tools for raising
              funds.
            </p>
            {/* project's name */}
            <div className="mt-10 space-y-5">
              <Label htmlFor="projectName" className="font-bold text-lg">
                Project name
              </Label>
              <div className="flex space-x-5">
                <Input
                  type="text"
                  id="projectName"
                  className="w-96"
                  {...registerSecondForm("projectName")}
                />
              </div>
            </div>
            {errorsProject.projectName && (
              <p className="text-red-500 text-sm">
                {errorsProject.projectName.message as string}
              </p>
            )}
            {/* project type */}
            {/* <MultipleOptionSelector
              header={<>Project type</>}
              fieldName="projectType"
              choices={projectType}
              // handleFunction={handleProjectFieldChange}
              description={<>Please specify the primary purpose of the funds</>}
              placeholder="Select a Project type"
              selectLabel="Project type"
            /> */}
            {errorsProject.projectType && (
              <p className="text-red-500 text-sm">
                {errorsProject.projectType.message as string}
              </p>
            )}
            {/* short description */}
            <div className="mt-10 space-y-5">
              <Label htmlFor="shortDescription" className="font-bold text-lg">
                Short description
              </Label>
              <div className="flex space-x-5">
                <Textarea
                  id="shortDescription"
                  className="w-96"
                  {...registerSecondForm("shortDescription")}
                />
                <span className="text-[12px] text-neutral-500 self-center">
                  Could you provide a brief description of your project <br />{" "}
                  in one or two sentences?
                </span>
              </div>
            </div>
            {errorsProject.shortDescription && (
              <p className="text-red-500 text-sm">
                {errorsProject.shortDescription.message as string}
              </p>
            )}
            {/* Pitch deck */}
            <div className="mt-10 space-y-5">
              <Label htmlFor="projectPitchDeck" className="font-bold text-lg">
                Pitch deck
              </Label>
              <div className="flex space-x-2 w-96">
                <Button
                  type="button"
                  variant={projectPitch === "text" ? "default" : "outline"}
                  onClick={() => setProjectPitch("text")}
                  className="w-32 h-12 text-base"
                >
                  Paste URL
                </Button>
                <Button
                  type="button"
                  variant={projectPitch === "file" ? "default" : "outline"}
                  onClick={() => setProjectPitch("file")}
                  className="w-32 h-12 text-base"
                >
                  Upload a file
                </Button>
              </div>
              <div className="flex space-x-5">
                <Input
                  type={projectPitch}
                  id="projectPitchDeck"
                  className="w-96"
                  placeholder={
                    projectPitch === "file"
                      ? "Upload your Markdown file"
                      : "https:// "
                  }
                  accept={projectPitch === "file" ? ".md" : undefined}
                  {...(projectPitch === "text"
                    ? registerSecondForm("projectPitchDeck", {
                        required: true,
                      })
                    : {
                        onChange: (e) => {
                          const file = e.target.files?.[0];
                          setValueProject("projectPitchDeck", file);
                          setProjectPitchFile(file?.name || "");
                        },
                      })}
                />
                <span className="text-[12px] text-neutral-500 self-center">
                  Please upload a file or paste a link to your pitch, which
                  should <br />
                  cover key aspects of your project: what it will do, what
                  investors <br /> can expect to gain, and any highlights that
                  make it stand out.
                </span>
              </div>
              {projectPitchFile && (
                <div className="flex justify-between items-center border p-2 rounded w-96 text-sm text-foreground">
                  <span>1. {projectPitchFile}</span>
                  <Button
                    className="ml-4"
                    onClick={() => {
                      setValueProject("projectPitchDeck", "");
                      setProjectPitchFile("");
                    }}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>
            {errorsProject.projectPitchDeck && (
              <p className="text-red-500 text-sm">
                {errorsProject.projectPitchDeck.message as string}
              </p>
            )}
            {/* project logo */}
            <div className="mt-10 space-y-5">
              <Label htmlFor="projectLogo" className="font-bold text-lg mt-10">
                Project logo
              </Label>
              <div className="flex space-x-5">
                <Input
                  type="file"
                  id="projectLogo"
                  className="w-96"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    registerSecondForm("projectLogo").onChange({
                      target: { name: "projectLogo", value: file },
                    });
                  }}
                />
                <span className="text-[12px] text-neutral-500 self-center">
                  Please upload the logo picture that best represents your
                  project.
                </span>
              </div>
            </div>
            {errorsProject.projectLogo && (
              <p className="text-red-500 text-sm">
                {errorsProject.projectLogo.message as string}
              </p>
            )}
            <div className="mt-10 space-y-5">
              <Label
                htmlFor="projectPhotos"
                className="font-bold text-lg mt-10"
              >
                Project photos
              </Label>
              <div className="flex space-x-5">
                <Input
                  type="file"
                  id="projectPhotos"
                  multiple
                  accept="image/*"
                  className="w-96"
                  {...registerSecondForm("projectPhotos", {
                    required: true,
                    onChange: handleFileChange,
                  })}
                />
                <span className="text-[12px] text-neutral-500 self-center">
                  Feel free to upload any additional images that provide <br />
                  further insight into your project.
                </span>
              </div>
              <div className="mt-5 space-y-2 w-96">
                {selectedImages.map((image, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center border p-2 rounded"
                  >
                    <span>{image.name}</span>
                    <Button
                      variant="outline"
                      onClick={() => handleRemoveImage(index)}
                      className="ml-4"
                      type="reset"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            {errorsProject.projectPhotos && (
              <p className="text-red-500 text-sm">
                {errorsProject.projectPhotos.message as string}
              </p>
            )}
            {/*  Minimum Investment */}
            <div className="space-y-5 mt-10">
              <Label htmlFor="minInvest" className="font-bold text-lg">
                Minimum investment
              </Label>
              <div className="flex space-x-5">
                <Input
                  type="number"
                  id="minInvest"
                  className="w-96"
                  placeholder="$   500"
                  {...registerSecondForm("minInvest", {
                    valueAsNumber: true,
                  })}
                />
                <span className="text-[12px] text-neutral-500 self-center">
                  This helps set clear expectations for investors
                </span>
              </div>
            </div>
            {errorsProject.minInvest && (
              <p className="text-red-500 text-sm">
                {errorsProject.minInvest.message as string}
              </p>
            )}
            {/* Target Investment */}
            <div className="space-y-5 mt-10">
              <Label htmlFor="targetInvest" className="font-bold text-lg">
                Target investment
              </Label>
              <div className="flex space-x-5">
                <Input
                  type="number"
                  id="targetInvest"
                  className="w-96"
                  placeholder="$   1,000,000"
                  {...registerSecondForm("targetInvest", {
                    valueAsNumber: true,
                  })}
                />
                <span className="text-[12px] text-neutral-500 self-center">
                  We encourage you to set a specific target investment <br />{" "}
                  amount that reflects your funding goals.
                </span>
              </div>
            </div>
            {errorsProject.targetInvest && (
              <p className="text-red-500 text-sm">
                {errorsProject.targetInvest.message as string}
              </p>
            )}
            {/* Deadline */}
            <div className="space-y-5 mt-10">
              <Label htmlFor="deadline" className="font-bold text-lg">
                Deadline
              </Label>
              <div className="flex space-x-5">
                <Input
                  type="datetime-local"
                  id="deadline"
                  className="w-96"
                  {...registerSecondForm("deadline")}
                />
                <span className="text-[12px] text-neutral-500 self-center">
                  What is the deadline for your fundraising project? Setting{" "}
                  <br /> a clear timeline can help motivate potential investors.
                </span>
              </div>
            </div>
            {errorsProject.deadline && (
              <p className="text-red-500 text-sm">
                {errorsProject.deadline.message as string}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
