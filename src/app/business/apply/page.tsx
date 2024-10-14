"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { createSupabaseClient } from "@/lib/supabase/clientComponentClient";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DualOptionSelector } from "@/components/dualSelector";
import { MultipleOptionSelector } from "@/components/multipleSelector";

export default function Apply() {
  const MAX_FILE_SIZE = 5000000;
  const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
  const pitchDeckSchema = z.union([
    z.string().url("Pitch deck must be a valid URL."),
    z.object({}),
  ]);
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
    projectPitchDeck: pitchDeckSchema,
    projectLogo: z
      .instanceof(File)
      .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
        message: "Only .jpg, .jpeg, and .png formats are supported.",
      })
      .refine((file) => file.size <= MAX_FILE_SIZE, {
        message: "Max image size is 5MB.",
      }),

    projectPhotos: z
      .array(
        z.object({
          file: z
            .any()
            .refine(
              (file) => file?.size <= MAX_FILE_SIZE,
              `Max image size is 5MB.`
            )
            .refine(
              (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
              "Only .jpg, .jpeg, and .png formats are supported."
            ),
        })
      )
      .min(1, "You must upload at least one photo.")
      .max(10, "You can upload a maximum of 10 photos."),
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
      .refine((value) => !isNaN(Date.parse(value)), {
        message: "Invalid date-time format.",
      })
      .transform((value) => new Date(value))
      .refine((date) => date > new Date(), {
        message: "Deadline must be in the future.",
      }),
  });
  const businessFormSchema = z.object({
    companyName: z.string().min(5, {
      message: "Company name must be at least 5 characters.",
    }),
    industry: z.string({
      required_error: "Please select one of the option",
    }),
    isInUS: z
      .string({
        required_error: "Please select either 'Yes' or 'No'.",
      })
      .transform((val) => val.toLowerCase())
      .refine((val) => val === "yes" || val === "no", {
        message: "Please select either 'Yes' or 'No'.",
      }),
    isForSale: z
      .string({
        required_error: "Please select either 'Yes' or 'No'.",
      })
      .transform((val) => val.toLowerCase())
      .refine((val) => val === "yes" || val === "no", {
        message: "Please select either 'Yes' or 'No'.",
      }),
    isGenerating: z
      .string({
        required_error: "Please select either 'Yes' or 'No'.",
      })
      .transform((val) => val.toLowerCase())
      .refine((val) => val === "yes" || val === "no", {
        message: "Please select either 'Yes' or 'No'.",
      }),
    totalRaised: z
      .number({
        required_error: "Total raised must be a number.",
        invalid_type_error: "Total raised must be a valid number.",
      })
      .positive()
      .max(9999999999, "Total raised must be a realistic amount."),
    communitySize: z.string({
      required_error: "Please select one of the option",
    }),
    businessPitchDeck: pitchDeckSchema,
  });
  let supabase = createSupabaseClient();

  const [industry, setIndustry] = useState<string[]>([]);
  const [isInUS, setIsInUS] = useState("");
  const [isForSale, setIsForSale] = useState("");
  const [isGenerating, setIsGenerating] = useState("");
  const [businessPitch, setBusinessPitch] = useState("");
  const [projectType, setProjectType] = useState<string[]>([]);
  const [projectPitch, setProjectPitch] = useState("");
  const [applyProject, setApplyProject] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const {
    register,
    handleSubmit,
    setValue,
    setValue: setValueBusiness,
    formState: { errors: errorsBusiness },
  } = useForm({
    resolver: zodResolver(businessFormSchema),
  });
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

  useEffect(() => {
    register("industry");
    register("isInUS");
    register("isForSale");
    register("isGenerating");
  }, [register]);

  const handleRemoveImage = (index: number) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(updatedImages);
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setSelectedImages((prevImages) => [...prevImages, ...filesArray]);
      setValueProject("projectPhotos", filesArray);
    }
  };

  const transformChoice = (data: any) => {
    // console.table(data);
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
  const handleBusinessPitchChange = (type: string) => {
    setBusinessPitch(type);
    // clear out old data
    setValueBusiness("pitchDeck", "");
  };

  const handleBusinessFieldChange = (fieldName: string, value: any) => {
    switch (fieldName) {
      case "isInUS":
        setIsInUS(value);
        break;
      case "isForSale":
        setIsForSale(value);
        break;
      case "isGenerating":
        setIsGenerating(value);
        break;
    }
    setValueBusiness(fieldName, value);
  };
  const handleProjectFieldChange = (fieldName: string, value: any) => {
    switch (fieldName) {
    }
    setValueProject(fieldName, value);
  };

  const fetchIndustry = async () => {
    let { data: BusinessType, error } = await supabase
      .from("BusinessType")
      .select("value");

    if (error) {
      console.error(error);
    } else {
      if (BusinessType) {
        // console.table();
        setIndustry(BusinessType.map((item) => item.value));
      }
    }
  };

  const onSubmitSingleForm = (data: any) => {
    alert(JSON.stringify(data));
  };

  const onSubmitBothForms = (firstFormData: any, secondFormData: any) => {
    alert(JSON.stringify(firstFormData));
    alert(JSON.stringify(secondFormData));
    console.log("Both forms submitted:", { firstFormData, secondFormData });
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
      .from("ProjectType")
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
      <form action="" onSubmit={handleSubmit(handleSubmitForms)}>
        <div className="grid grid-flow-row auto-rows-max w-3/4 ml-1/2 lg:ml-[10%]">
          <h1 className="text-3xl font-bold mt-10 ml-96">About your company</h1>
          <p className="ml-96 mt-5 text-neutral-500">
            <span className="text-red-500 font-bold">**</span>All requested
            information in this section is required.
          </p>

          {/* company name */}
          <div className="ml-96 mt-5 space-y-10">
            <div className="mt-10 space-y-5">
              <Label htmlFor="companyName" className="font-bold text-lg">
                Company name
              </Label>
              <div className="flex space-x-5">
                <Input
                  type="text"
                  id="companyName"
                  className="w-96"
                  {...register("companyName")}
                />
                <span className="text-[12px] text-neutral-500 self-center">
                  This should be the name your company uses on your <br />
                  website and in the market.
                </span>
              </div>
              {errorsBusiness.companyName && (
                <p className="text-red-500 text-sm">
                  {errorsBusiness.companyName && (
                    <p className="text-red-500 text-sm">
                      {errorsBusiness.companyName.message as string}
                    </p>
                  )}
                </p>
              )}
            </div>
            {/* industry */}

            <MultipleOptionSelector
              header={<>Industry</>}
              fieldName="industry"
              choices={industry}
              handleFunction={handleBusinessFieldChange}
              description={
                <>Choose the industry that best aligns with your business.</>
              }
              placeholder="Select an industry"
              selectLabel="Industry"
            />
            {errorsBusiness.industry && (
              <p className="text-red-500 text-sm">
                {errorsBusiness.industry.message as string}
              </p>
            )}
            {/* How much money has your company raised to date? */}
            <div className="space-y-5">
              <Label htmlFor="totalRaised" className="font-bold text-lg">
                How much money has your company <br /> raised to date?
              </Label>
              <div className="flex space-x-5">
                <Input
                  type="number"
                  id="totalRaised"
                  className="w-96"
                  placeholder="$   1,000,000"
                  {...register("totalRaised", {
                    valueAsNumber: true,
                  })}
                />
                <span className="text-[12px] text-neutral-500 self-center">
                  The sum total of past financing, including angel or venture{" "}
                  <br />
                  capital, loans, grants, or token sales.
                </span>
              </div>
              {errorsBusiness.totalRaised && (
                <p className="text-red-500 text-sm">
                  {errorsBusiness.totalRaised.message as string}
                </p>
              )}
            </div>
            {/* Is your company incorporated in the United States? */}
            <DualOptionSelector
              label={
                <>
                  Is your company incorporated in the <br />
                  United States?
                </>
              }
              name="isInUS"
              choice1="Yes"
              choice2="No"
              handleFunction={handleBusinessFieldChange}
              description={
                <>
                  Only companies that are incorporated or formed in the US are{" "}
                  <br />
                  eligible to raise via Reg CF. If your company is incorporated{" "}
                  <br />
                  outside the US, we still encourage you to apply.
                </>
              }
              value={isInUS}
            />
            {errorsBusiness.isInUS && (
              <p className="text-red-500 text-sm">
                {errorsBusiness.isInUS.message as string}
              </p>
            )}

            {/* Is your product available (for sale) in market? */}
            <DualOptionSelector
              label={
                <>
                  Is your product available (for sale) <br />
                  in market?
                </>
              }
              name="isForSale"
              choice1="Yes"
              choice2="No"
              handleFunction={handleBusinessFieldChange}
              description={
                <>
                  Only check this box if customers can access, use, or buy your{" "}
                  <br />
                  product today.
                </>
              }
              value={isForSale}
            />
            {errorsBusiness.isForSale && (
              <p className="text-red-500 text-sm">
                {errorsBusiness.isForSale.message as string}
              </p>
            )}

            {/* Is your company generating revenue?*/}
            <DualOptionSelector
              label={<>Is your company generating revenue?</>}
              name="isGenerating"
              choice1="Yes"
              choice2="No"
              handleFunction={handleBusinessFieldChange}
              description={
                <>
                  Only check this box if your company is making money. <br />
                  Please elaborate on revenue and other traction below.
                </>
              }
              value={isGenerating}
            />
            {errorsBusiness.isGenerating && (
              <p className="text-red-500 text-sm">
                {errorsBusiness.isGenerating.message as string}
              </p>
            )}
            {/* Pitch deck */}
            <div className="space-y-5">
              <Label htmlFor="pitchDeck" className="font-bold text-lg">
                Pitch deck
              </Label>
              <div className="flex space-x-2 w-96">
                <Button
                  type="button"
                  variant={businessPitch === "text" ? "default" : "outline"}
                  onClick={() => handleBusinessPitchChange("text")}
                  className="w-32 h-12 text-base"
                >
                  Paste URL
                </Button>
                <Button
                  type="button"
                  variant={businessPitch === "file" ? "default" : "outline"}
                  onClick={() => handleBusinessPitchChange("file")}
                  className="w-32 h-12 text-base"
                >
                  Upload a file
                </Button>
              </div>
              <div className="flex space-x-5">
                <Input
                  type={businessPitch === "file" ? "file" : "text"}
                  id="pitchDeck"
                  className="w-96"
                  placeholder={
                    businessPitch === "file"
                      ? "Upload your Markdown file"
                      : "https:// "
                  }
                  accept={businessPitch === "file" ? ".md" : undefined}
                  {...register("businessPitchDeck", { required: true })}
                />

                <span className="text-[12px] text-neutral-500 self-center">
                  Your pitch deck and other application info will be used for{" "}
                  <br />
                  internal purposes only. <br />
                  Please make sure this document is publicly accessible. This
                  can <br />
                  be a DocSend, Box, Dropbox, Google Drive or other link.
                  <br />
                  <p className="text-red-500">
                    ** support only markdown(.md) format
                  </p>
                </span>
              </div>
            </div>
            {errorsBusiness.pitchDeck && (
              <p className="text-red-500 text-sm">
                {errorsBusiness.pitchDeck.message as string}
              </p>
            )}
            <MultipleOptionSelector
              header={
                <>
                  What's the rough size of your <br /> community?
                </>
              }
              fieldName="communitySize"
              choices={communitySize}
              handleFunction={handleBusinessFieldChange}
              description={
                <>
                  {" "}
                  Include your email list, social media following (i.e.
                  Instagram, <br /> Discord, Facebook, Twitter, TikTok). We’d
                  like to understand the <br /> rough size of your current
                  audience.
                </>
              }
              placeholder="Select"
              selectLabel="Select"
            />
            {errorsBusiness.communitySize && (
              <p className="text-red-500 text-sm">
                {errorsBusiness.communitySize.message as string}
              </p>
            )}

            <div className="flex space-x-5">
              <Switch
                onCheckedChange={() => setApplyProject(!applyProject)}
              ></Switch>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-[12px] text-neutral-500 self-center cursor-pointer">
                      Would you like to apply for your first fundraising project
                      as well?
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-[11px]">
                      Toggling this option allows you to begin your first
                      project, <br /> which is crucial for unlocking the tools
                      necessary to raise funds.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        {/* apply first project */}
        {applyProject && (
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
              <MultipleOptionSelector
                header={<>Project type</>}
                fieldName="projectType"
                choices={projectType}
                handleFunction={handleProjectFieldChange}
                description={
                  <>Please specify the primary purpose of the funds</>
                }
                placeholder="Select a Project type"
                selectLabel="Project type"
              />
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
                    {...registerSecondForm("projectPitchDeck", {
                      required: true,
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
              </div>
              {errorsProject.projectPitchDeck && (
                <p className="text-red-500 text-sm">
                  {errorsProject.projectPitchDeck.message as string}
                </p>
              )}

              {/* project logo */}
              <div className="mt-10 space-y-5">
                <Label
                  htmlFor="projectLogo"
                  className="font-bold text-lg mt-10"
                >
                  Project logo
                </Label>
                <div className="flex space-x-5">
                  <Input
                    type="file"
                    id="projectLogo"
                    className="w-96"
                    accept="image/*"
                    {...registerSecondForm("projectLogo", { required: true })}
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

              {/* Project pictures */}
              <div className="mt-10 space-y-5">
                <Label
                  htmlFor="projectPicture"
                  className="font-bold text-lg mt-10"
                >
                  Project pictures
                </Label>
                <div className="flex space-x-5">
                  <Input
                    type="file"
                    id="projectPicture"
                    multiple
                    accept="image/*"
                    className="w-96"
                    value={selectedImages.length === 0 ? "" : undefined}
                    {...registerSecondForm("projectPhotos", {
                      required: true,
                      onChange: (e) => handleFileChange(e),
                    })}
                  />
                  <span className="text-[12px] text-neutral-500 self-center">
                    Feel free to upload any additional images that provide{" "}
                    <br />
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

              {/* Minimum Investment */}
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
                    <br /> a clear timeline can help motivate potential
                    investors.
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
        )}
        {/* Submit */}
        <center>
          <Button
            className="mt-12 mb-20  h-10 text-base font-bold py-6 px-5"
            type="submit"
          >
            Submit application
          </Button>
        </center>
      </form>
    </div>
  );
}