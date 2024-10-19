import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { DualOptionSelector } from "@/components/dualSelector";
import { MultipleOptionSelector } from "@/components/multipleSelector";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { projectFormSchema } from "@/types/schemas/application.schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { createSupabaseClient } from "@/lib/supabase/clientComponentClient";

type projectSchema = z.infer<typeof projectFormSchema>;

interface ProjectFormProps {
  onSubmit: SubmitHandler<projectSchema>;
}
const BusinessForm = ({
  onSubmit,
}: ProjectFormProps & { onSubmit: SubmitHandler<projectSchema> }) => {
  const form = useForm<projectSchema>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {},
  });
  let supabase = createSupabaseClient();
  const [projectType, setProjectType] = useState<
    { id: number; name: string }[]
  >([]);
  const [projectPitch, setProjectPitch] = useState("text");
  const [applyProject, setApplyProject] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [projectPitchFile, setProjectPitchFile] = useState("");

  const fetchProjectType = async () => {
    let { data: ProjectType, error } = await supabase
      .from("project_type")
      .select("id, value");

    if (error) {
      console.error(error);
    } else {
      if (ProjectType) {
        setProjectType(
          ProjectType.map((item) => ({
            id: item.id,
            name: item.value,
          }))
        );
      }
    }
  };
  useEffect(() => {
    fetchProjectType;
  }, []);
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit as SubmitHandler<projectSchema>)}
        className="space-y-8"
      >
        <div className="ml-[15%]">
          <h1 className="text-3xl font-bold mt-10">
            Begin Your First Fundraising Project
          </h1>
          <p className="mt-3 text-sm text-neutral-500">
            Starting a fundraising project is mandatory for all businesses. This
            step is crucial <br />
            to begin your journey and unlock the necessary tools for raising
            funds.
          </p>
          <div className="ml-96 mt-5 space-y-10">
            {/* project name */}
            <FormField
              control={form.control}
              name="projectName"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <div className="mt-10 space-y-5">
                    <FormLabel className="font-bold text-lg">
                      Project name
                    </FormLabel>
                    <FormControl>
                      <div className="flex space-x-5">
                        <Input
                          type="text"
                          id="projectName"
                          className="w-96"
                          {...field}
                        />
                      </div>
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* project type */}
            <FormField
              control={form.control}
              name="projectType"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormControl>
                    <MultipleOptionSelector
                      header={<>Project type</>}
                      fieldName="projectType"
                      choices={projectType}
                      handleFunction={(selectedValues: any) => {
                        field.onChange(selectedValues.name);
                      }}
                      description={
                        <>Please specify the primary purpose of the funds</>
                      }
                      placeholder="Select a Project type"
                      selectLabel="Project type"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* short description */}
            <FormField
              control={form.control}
              name="industry"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormControl>
                    <MultipleOptionSelector
                      header={<>Industry</>}
                      fieldName="industry"
                      choices={industry}
                      handleFunction={(selectedValues: any) => {
                        // console.log("Type of selected value:", selectedValues.id);
                        field.onChange(selectedValues.id);
                      }}
                      description={
                        <>
                          Choose the industry that best aligns with your
                          business.
                        </>
                      }
                      placeholder="Select an industry"
                      selectLabel="Industry"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Raised Money */}
            <FormField
              control={form.control}
              name="totalRaised"
              render={({ field }) => (
                <FormItem>
                  <div className="mt-10 space-y-5">
                    <Label htmlFor="totalRaised" className="font-bold text-lg">
                      How much money has your company <br /> raised to date?
                    </Label>
                    <FormControl>
                      <div className="flex space-x-5">
                        <Input
                          type="number"
                          id="totalRaised"
                          className="w-96"
                          placeholder="$   1,000,000"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value ? parseFloat(value) : null);
                          }}
                          value={field.value}
                        />
                        <span className="text-[12px] text-neutral-500 self-center">
                          The sum total of past financing, including angel or
                          venture <br />
                          capital, loans, grants, or token sales.
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* Incorporated in US */}
            <FormField
              control={form.control}
              name="isInUS"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex space-x-5">
                      <DualOptionSelector
                        name="isInUS"
                        label={
                          <>
                            Is your company incorporated in the United States?
                          </>
                        }
                        choice1="Yes"
                        choice2="No"
                        handleFunction={(selectedValues: string) => {
                          // setIsInUS;
                          field.onChange(selectedValues);
                        }}
                        description={<></>}
                        value={field.value}
                      />
                      <span className="text-[12px] text-neutral-500 self-center">
                        Only companies that are incorporated or formed in the US
                        are eligible to raise via Reg CF.
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Product for Sale */}
            <FormField
              control={form.control}
              name="isForSale"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex space-x-5">
                      <DualOptionSelector
                        name="isForSale"
                        value={field.value}
                        label={
                          <>Is your product available (for sale) in market?</>
                        }
                        choice1="Yes"
                        choice2="No"
                        handleFunction={(selectedValues: string) => {
                          // setIsForSale;
                          field.onChange(selectedValues);
                        }}
                        description={
                          <>
                            Only check this box if customers can access, use, or
                            buy your product today.
                          </>
                        }
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Generating Revenue */}
            <FormField
              control={form.control}
              name="isGenerating"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex space-x-5">
                      <DualOptionSelector
                        name="isGenerating"
                        label={<>Is your company generating revenue?</>}
                        choice1="Yes"
                        choice2="No"
                        value={field.value}
                        handleFunction={(selectedValues: string) => {
                          field.onChange(selectedValues);
                        }}
                        description={
                          <>
                            Only check this box if your company is making money.
                            Please elaborate on revenue below.
                          </>
                        }
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Pitch Deck */}
            <FormField
              control={form.control}
              name="businessPitchDeck"
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-5 mt-10">
                    <Label htmlFor="pitchDeck" className="font-bold text-lg">
                      Pitch deck
                    </Label>
                    <FormControl>
                      <div>
                        <div className="flex space-x-2 w-96">
                          <Button
                            type="button"
                            variant={
                              businessPitch === "text" ? "default" : "outline"
                            }
                            onClick={() => setBusinessPitch("text")}
                            className="w-32 h-12 text-base"
                          >
                            Paste URL
                          </Button>
                          <Button
                            type="button"
                            variant={
                              businessPitch === "file" ? "default" : "outline"
                            }
                            onClick={() => setBusinessPitch("file")}
                            className="w-32 h-12 text-base"
                          >
                            Upload a file
                          </Button>
                        </div>
                        <div className="flex space-x-5">
                          <Input
                            type={businessPitch === "file" ? "file" : "text"}
                            placeholder={
                              businessPitch === "file"
                                ? "Upload your Markdown file"
                                : "https:// "
                            }
                            accept={
                              businessPitch === "file" ? ".md" : undefined
                            }
                            onChange={(e) => {
                              const value = e.target;
                              if (businessPitch === "file") {
                                const file = value.files?.[0];
                                field.onChange(file || "");
                              } else {
                                field.onChange(value.value);
                              }
                            }}
                            className="w-96 mt-5"
                          />

                          <span className="text-[12px] text-neutral-500 self-center">
                            Your pitch deck and other application info will be
                            used for <br />
                            internal purposes only. <br />
                            Please make sure this document is publicly
                            accessible. This can <br />
                            be a DocSend, Box, Dropbox, Google Drive or other
                            link.
                            <br />
                            <p className="text-red-500">
                              ** support only markdown(.md) format
                            </p>
                          </span>
                        </div>
                        {businessPitchFile && (
                          <div className="flex justify-between items-center border p-2 rounded w-96 text-sm text-foreground">
                            <span>1. {businessPitchFile}</span>
                            <Button
                              className="ml-4"
                              onClick={() => {
                                setBusinessPitchFile("");
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* Community Size */}
            <FormField
              control={form.control}
              name="communitySize"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <MultipleOptionSelector
                      header={<>What's the rough size of your community?</>}
                      fieldName="communitySize"
                      choices={communitySize}
                      handleFunction={(selectedValues: any) => {
                        field.onChange(selectedValues.name);
                      }}
                      description={
                        <>
                          Include your email list, social media following (e.g.,
                          Instagram, Discord, Twitter).
                        </>
                      }
                      placeholder="Select"
                      selectLabel="Select"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <center>
              <Button
                className="mt-12 mb-20  h-10 text-base font-bold py-6 px-5"
                type="submit"
              >
                Submit application
              </Button>
            </center>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default BusinessForm;
