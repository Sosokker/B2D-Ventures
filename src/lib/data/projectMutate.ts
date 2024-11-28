import { Database, Tables } from "@/types/database.types";
import { SupabaseClient } from "@supabase/supabase-js";

export type ProjectInvestmentDetailSchema = Tables<"project_investment_detail">;

export interface ProjectEditSchema {
  project_name?: string;
  project_status_id?: number;
  project_type_id?: number;
  project_short_description?: string;
  project_description?: string;
  deadline?: string;
}

export function editProjectById(
  client: SupabaseClient<Database>,
  projectId: number,
  projectData: Partial<ProjectEditSchema>
) {
  return client.from("project").update(projectData).eq("id", projectId);
}

export function editProjectInvestmentDetailById(
  client: SupabaseClient<Database>,
  projectId: number,
  investmentDetailData: Partial<ProjectInvestmentDetailSchema>
) {
  return client.from("project_investment_detail").update(investmentDetailData).eq("project_id", projectId).select();
}
