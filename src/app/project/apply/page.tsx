"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ApplyProject() {
  const [projectType, setProjectType] = useState<string[]>([]);
  const [projectPitch, setProjectPitch] = useState("text");
  const [applyProject, setApplyProject] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [projectPitchFile, setProjectPitchFile] = useState("");
  return (
    <div>
      {" "}
      <div className="grid auto-rows-max w-3/4 ml-48 bg-zinc-100 dark:bg-zinc-900 mt-10 pt-12 pb-12">
        {/* header */}
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
                Could you provide a brief description of your project <br /> in
                one or two sentences?
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
                Please upload a file or paste a link to your pitch, which should{" "}
                <br />
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
            <Label htmlFor="projectPhotos" className="font-bold text-lg mt-10">
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
  );
}
