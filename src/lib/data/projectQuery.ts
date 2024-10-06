import { SupabaseClient } from "@supabase/supabase-js";


async function getTopProjects(client: SupabaseClient, numberOfRecords: number = 4) {
    try {
      const { data, error } = await client
        .from("Project")
        .select(
          `
            id,
            projectName,
            businessId,
            publishedTime,
            projectShortDescription,
            cardImage,
            ProjectInvestmentDetail (
              minInvestment,
              totalInvestment,
              targetInvestment,
              investmentDeadline
            ),
            ItemTag (
              Tag (
                id,
                value
              )
            ),
            Business (
              location
            )
          `
        )
        .order("publishedTime", { ascending: false })
        .limit(numberOfRecords);

      if (error) {
        console.error("Error fetching top projects:", error.message);
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (err) {
      console.error("Unexpected error:", err);
      return { data: null, error: "An unexpected error occurred." };
    }
  }

  export { getTopProjects };

