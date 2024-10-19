import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { DualOptionSelector } from "@/components/dualSelector";
import { MultipleOptionSelector } from "@/components/multipleSelector";
import {
  Form,
  FormControl,
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
import { Textarea } from "./ui/textarea";

type projectSchema = z.infer<typeof projectFormSchema>;

interface ProjectFormProps {
  onSubmit: SubmitHandler<projectSchema>;
}
const ProjectForm = ({
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      console.log("first file", filesArray);
      setSelectedImages((prevImages) => {
        const updatedImages = [...prevImages, ...filesArray];
        console.log("Updated Images Array:", updatedImages);
        return updatedImages;
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prevImages) => {
      const updatedImages = prevImages.filter((_, i) => i !== index);
      console.log("After removal - Updated Images:", updatedImages);
      return updatedImages;
    });
  };

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
              name="shortDescription"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormControl>
                    <div className="mt-10 space-y-5">
                      <FormLabel className="font-bold text-lg">
                        Short description
                      </FormLabel>
                      <div className="flex space-x-5">
                        <Textarea
                          id="shortDescription"
                          className="w-96"
                          {...field}
                        />
                        <span className="text-[12px] text-neutral-500 self-center">
                          Could you provide a brief description of your project{" "}
                          <br /> in one or two sentences?
                        </span>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Pitch Deck */}
            <FormField
              control={form.control}
              name="projectPitchDeck"
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
                              projectPitch === "text" ? "default" : "outline"
                            }
                            onClick={() => setProjectPitch("text")}
                            className="w-32 h-12 text-base"
                          >
                            Paste URL
                          </Button>
                          <Button
                            type="button"
                            variant={
                              projectPitch === "file" ? "default" : "outline"
                            }
                            onClick={() => setProjectPitch("file")}
                            className="w-32 h-12 text-base"
                          >
                            Upload a file
                          </Button>
                        </div>
                        <div className="flex space-x-5">
                          <Input
                            type={projectPitch === "file" ? "file" : "text"}
                            placeholder={
                              projectPitch === "file"
                                ? "Upload your Markdown file"
                                : "https:// "
                            }
                            accept={projectPitch === "file" ? ".md" : undefined}
                            onChange={(e) => {
                              const value = e.target;
                              if (projectPitch === "file") {
                                const file = value.files?.[0];
                                field.onChange(file || "");
                              } else {
                                field.onChange(value.value);
                              }
                            }}
                            className="w-96 mt-5"
                          />

                          <span className="text-[12px] text-neutral-500 self-center">
                            Please upload a file or paste a link to your pitch,
                            which should <br />
                            cover key aspects of your project: what it will do,
                            what investors <br /> can expect to gain, and any
                            highlights that make it stand out.
                          </span>
                        </div>
                        {projectPitchFile && (
                          <div className="flex justify-between items-center border p-2 rounded w-96 text-sm text-foreground">
                            <span>1. {projectPitchFile}</span>
                            <Button
                              className="ml-4"
                              onClick={() => {
                                setProjectPitchFile("");
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

            {/* project logo */}
            <FormField
              control={form.control}
              name="projectLogo"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormControl>
                    <div className="mt-10 space-y-5">
                      <FormLabel className="font-bold text-lg mt-10">
                        Project logo
                      </FormLabel>
                      <Input
                        type="file"
                        id="projectLogo"
                        className="w-96"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          field.onChange(file || "");
                        }}
                      />
                      <span className="text-[12px] text-neutral-500 self-center">
                        Please upload the logo picture that best represents your
                        project.
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* project photos */}
            <FormField
              control={form.control}
              name="projectPhotos"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormControl>
                    <div className="mt-10 space-y-5">
                      <FormLabel className="font-bold text-lg mt-10">
                        Project photos
                      </FormLabel>
                      <div className="flex space-x-5">
                        <Input
                          type="file"
                          id="projectPhotos"
                          multiple
                          accept="image/*"
                          className="w-96"
                          onChange={handleFileChange}
                        />
                        <span className="text-[12px] text-neutral-500 self-center">
                          Please upload the logo picture that best represents
                          your project.
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
                  </FormControl>
                  <FormMessage />
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

export default ProjectForm;
