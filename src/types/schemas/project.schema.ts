import { z } from "zod";

export const projectEditSchema = z.object({
  project_name: z.string().optional(),
  project_status_id: z.number().optional(),
  project_type_id: z.number().optional(),
  project_short_description: z.string().optional(),
  project_description: z.string().optional(),
  deadline: z.string().optional(),
});

export type ProjectEditSchema = z.infer<typeof projectEditSchema>;
