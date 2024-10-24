import { useEffect, useState } from "react";
import { SubmitHandler, useForm, ControllerRenderProps } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
import { createSupabaseClient } from "@/lib/supabase/clientComponentClient";
import { Textarea } from "./ui/textarea";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ChevronsUpDown, Check, X } from "lucide-react";

type projectSchema = z.infer<typeof projectFormSchema>;
type FieldType = ControllerRenderProps<any, "projectPhotos">;

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
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [projectPitchFile, setProjectPitchFile] = useState("");
  const [tag, setTag] = useState<{ id: number; value: string }[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<
    { id: number; value: string }[]
  >([]);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: FieldType
  ) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      console.log("first file", filesArray);
      setSelectedImages((prevImages) => {
        const updatedImages = [...prevImages, ...filesArray];
        console.log("Updated Images Array:", updatedImages);
        field.onChange(updatedImages);
        return updatedImages;
      });
    }
  };

  const handleRemoveImage = (index: number, field: FieldType) => {
    setSelectedImages((prevImages) => {
      const updatedImages = prevImages.filter((_, i) => i !== index);
      console.log("After removal - Updated Images:", updatedImages);
      field.onChange(updatedImages);

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
  const fetchTag = async () => {
    let { data: tag, error } = await supabase.from("tag").select("id, value");

    if (error) {
      console.error(error);
    } else {
      if (tag) {
        setTag(
          tag.map((item) => ({
            id: item.id,
            value: item.value,
          }))
        );
      }
    }
  };
  useEffect(() => {
    fetchProjectType();
    fetchTag();
  }, []);
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit as SubmitHandler<projectSchema>)}
        className="space-y-8"
      >
        <div className="ml-96 space-y-10">
          {/* project name */}
          <FormField
            control={form.control}
            name="projectName"
            render={({ field }: { field: any }) => (
              <FormItem>
                <div className="space-y-5">
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
                      field.onChange(selectedValues.id);
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
                        onChange={(event) => {
                          handleFileChange(event, field);
                        }}
                      />
                      <span className="text-[12px] text-neutral-500 self-center">
                        Please upload the logo picture that best represents your
                        project.
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
                            onClick={() => handleRemoveImage(index, field)}
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

          {/* Minimum investment */}
          <FormField
            control={form.control}
            name="minInvest"
            render={({ field }: { field: any }) => (
              <FormItem>
                <div className="mt-10 space-y-5">
                  <FormLabel className="font-bold text-lg">
                    Minimum investment
                  </FormLabel>
                  <FormControl>
                    <div className="flex space-x-5">
                      <Input
                        type="number"
                        id="minInvest"
                        placeholder="$   500"
                        className="w-96"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value ? parseFloat(value) : null);
                        }}
                        value={field.value}
                      />
                      <span className="text-[12px] text-neutral-500 self-center">
                        This helps set clear expectations for investors
                      </span>
                    </div>
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Target investment */}
          <FormField
            control={form.control}
            name="targetInvest"
            render={({ field }: { field: any }) => (
              <FormItem>
                <div className="mt-10 space-y-5">
                  <FormLabel className="font-bold text-lg">
                    Target investment
                  </FormLabel>
                  <FormControl>
                    <div className="flex space-x-5">
                      <Input
                        type="number"
                        id="targetInvest"
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
                        We encourage you to set a specific target investment{" "}
                        <br /> amount that reflects your funding goals.
                      </span>
                    </div>
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Deadline */}
          <FormField
            control={form.control}
            name="deadline"
            render={({ field }: { field: any }) => (
              <FormItem>
                <div className="mt-10 space-y-5">
                  <FormLabel className="font-bold text-lg">Deadline</FormLabel>
                  <FormControl>
                    <div className="flex space-x-5">
                      <Input
                        type="datetime-local"
                        id="deadline"
                        className="w-96"
                        {...field}
                      />
                      <span className="text-[12px] text-neutral-500 self-center">
                        What is the deadline for your fundraising project?
                        Setting <br /> a clear timeline can help motivate
                        potential investors.
                      </span>
                    </div>
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Tags */}
          <FormField
            control={form.control}
            name="tag"
            render={({ field }: { field: any }) => (
              <FormItem>
                <div className="mt-10 space-y-5">
                  <FormLabel className="font-bold text-lg">Tags</FormLabel>
                  <FormControl>
                    <div className="flex space-x-5">
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-96 justify-between overflow-hidden text-ellipsis whitespace-nowrap"
                          >
                            {selectedTag.length > 0
                              ? selectedTag.map((t) => t.value).join(", ")
                              : "Select tags..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-96 p-0">
                          <Command>
                            <CommandInput placeholder="Search tags..." />
                            <CommandList>
                              <CommandEmpty>No tags found.</CommandEmpty>
                              <CommandGroup>
                                {tag.map((tag) => (
                                  <CommandItem
                                    key={tag.id}
                                    value={tag.value}
                                    onSelect={() => {
                                      setSelectedTag((prev) => {
                                        const exists = prev.find(
                                          (t) => t.id === tag.id
                                        );
                                        const updatedTags = exists
                                          ? prev.filter((t) => t.id !== tag.id)
                                          : [...prev, tag];
                                        field.onChange(
                                          updatedTags.map((t) => t.id)
                                        );
                                        return updatedTags;
                                      });
                                      setOpen(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "h-4",
                                        selectedTag.some((t) => t.id === tag.id)
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {tag.value}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <span className="text-[12px] text-neutral-500 self-center">
                        Add 1 to 5 tags that describe your project. Tags help{" "}
                        <br />
                        investors understand your focus.
                      </span>
                    </div>
                  </FormControl>
                </div>
                <FormMessage />
                {/* display selected tags */}
                <div className="flex flex-wrap space-x-3">
                  {selectedTag.map((tag) => (
                    <div
                      key={tag.id}
                      className="flex items-center space-x-1 p-1 rounded mt-2 outline outline-offset-2 outline-1"
                    >
                      <span>{tag.value}</span>
                      <button
                        onClick={() => {
                          setSelectedTag((prev) => {
                            const updatedTags = prev.filter(
                              (t) => t.id !== tag.id
                            );
                            field.onChange(updatedTags.map((t) => t.id));
                            return updatedTags;
                          });
                        }}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </FormItem>
            )}
          />
        </div>
        <center>
          <Button
            className="mt-12 mb-20 h-10 text-base font-bold py-6 px-5 "
            type="submit"
          >
            Submit application
          </Button>
        </center>
      </form>
    </Form>
  );
};

export default ProjectForm;
