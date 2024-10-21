"use client";
import { useState } from "react";
import ProjectForm from "@/components/ProjectForm";
import { projectFormSchema } from "@/types/schemas/application.schema";
import { z } from "zod";
import { SubmitHandler } from "react-hook-form";

type projectSchema = z.infer<typeof projectFormSchema>;
export default function ApplyProject() {
  const [projectType, setProjectType] = useState<string[]>([]);
  const [projectPitch, setProjectPitch] = useState("text");
  const [applyProject, setApplyProject] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [projectPitchFile, setProjectPitchFile] = useState("");

  const onSubmit: SubmitHandler<projectSchema> = async (data) => {
    alert("มาแน้ววว");
    console.table(data);
  };
  return (
    <div>
      <div className="grid auto-rows-max w-3/4 ml-48 bg-zinc-100 dark:bg-zinc-900 mt-10 pt-12 pb-12">
        <ProjectForm onSubmit={onSubmit} />
      </div>
    </div>
  );
}