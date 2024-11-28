"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectEditSchema, ProjectEditSchema } from "@/types/schemas/project.schema";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { MdxEditor } from "@/components/MarkdownEditor";
import { editProjectById } from "@/lib/data/projectMutate";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase/clientComponentClient";
import { useState } from "react";

export default function EditProjectForm({
  projectData,
  projectId,
}: {
  projectData: ProjectEditSchema;
  projectId: number;
}) {
  const router = useRouter();
  const client = createSupabaseClient();

  const projectForm = useForm<ProjectEditSchema>({
    resolver: zodResolver(projectEditSchema),
    defaultValues: {
      project_name: projectData.project_name || "",
      project_short_description: projectData.project_short_description || "",
      project_description: projectData.project_description || "",
      deadline: projectData.deadline ? projectData.deadline : undefined,
    },
  });

  const [deadline, setDeadline] = useState(projectData.deadline);
  const [descriptionContent, setDescriptionContent] = useState(projectData.project_description || "");

  const onSubmit: SubmitHandler<ProjectEditSchema> = async (updates) => {
    try {
      const updatedData = {
        ...updates,
        deadline: deadline ? new Date(deadline).toISOString() : undefined,
        project_description: descriptionContent,
      };

      const result = await editProjectById(client, projectId, updatedData);

      if (result) {
        toast.success("Project updated successfully!");
        router.push(`/deals/${projectId}`);
      } else {
        toast.error("No fields to update!");
      }
    } catch (error) {
      toast.error("Error updating project!");
      console.error("Error updating project:", error);
    }
  };

  return (
    <Form {...projectForm}>
      <form onSubmit={projectForm.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={projectForm.control}
          name="project_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="Project Name" {...field} value={field.value || ""} />
              </FormControl>
              <FormDescription>Provide the name of the project.</FormDescription>
              <FormMessage>
                {projectForm.formState.errors.project_name && (
                  <span>{projectForm.formState.errors.project_name.message}</span>
                )}
              </FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={projectForm.control}
          name="project_short_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Brief project overview" {...field} value={field.value || ""} />
              </FormControl>
              <FormDescription>A short summary of the project.</FormDescription>
              <FormMessage>
                {projectForm.formState.errors.project_short_description && (
                  <span>{projectForm.formState.errors.project_short_description.message}</span>
                )}
              </FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={projectForm.control}
          name="project_description"
          render={() => (
            <FormItem>
              <FormLabel>Full Description</FormLabel>
              <FormControl>
                <MdxEditor content={descriptionContent} setContentInParent={setDescriptionContent} />
              </FormControl>
              <FormDescription>Provide a detailed description of the project in Markdown format.</FormDescription>
              <FormMessage>
                {projectForm.formState.errors.project_description && (
                  <span>{projectForm.formState.errors.project_description.message}</span>
                )}
              </FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={projectForm.control}
          name="deadline"
          render={() => (
            <FormItem className="w-1/4">
              <FormLabel>Deadline</FormLabel>
              <FormControl>
                <DateTimePicker
                  hourCycle={24}
                  value={deadline ? new Date(deadline) : undefined}
                  onChange={(date) => setDeadline(date?.toISOString())}
                />
              </FormControl>
              <FormDescription>Specify the project deadline in a 24-hour format.</FormDescription>
              <FormMessage>
                {projectForm.formState.errors.deadline && <span>{projectForm.formState.errors.deadline.message}</span>}
              </FormMessage>
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
