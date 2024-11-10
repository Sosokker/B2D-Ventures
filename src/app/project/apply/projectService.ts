import { createSupabaseClient } from "@/lib/supabase/clientComponentClient";

const supabase = createSupabaseClient();

export const saveApplicationData = async (data: any, userId: string) => {
  const pitchType = typeof data["projectPitchDeck"];
  const { data: projectData, error } = await supabase
    .from("project_application")
    .insert([
      {
        user_id: userId,
        pitch_deck_url: pitchType === "string" ? data["projectPitchDeck"] : "",
        target_investment: data["targetInvest"],
        deadline: data["deadline"],
        project_name: data["projectName"],
        project_type_id: data["projectType"],
        short_description: data["shortDescription"],
        min_investment: data["minInvest"],
      },
    ])
    .select();

  return { projectId: projectData?.[0]?.id, error };
};

export const saveTags = async (tags: string[], projectId: string) => {
  const tagPromises = tags.map(async (tag) => {
    const response = await supabase
      .from("project_application_tag")
      .insert([{ tag_id: tag, item_id: projectId }])
      .select();
    return response;
  });

  const results = await Promise.all(tagPromises);
  const errors = results.filter((result) => result.error).map((result) => result.error);
  return { errors };
};
