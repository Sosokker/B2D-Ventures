import { SupabaseClient } from "@supabase/supabase-js";

export const hasUserApplied = async (supabase: SupabaseClient, userID: string) => {
  let { data: business, error } = await supabase.from("business").select("*").eq("user_id", userID);
  let { data: businessApplication, error: applicationError } = await supabase
    .from("business_application")
    .select("*")
    .eq("user_id", userID);
  // console.table(business);
  if (error || applicationError) {
    console.error(error);
    console.error(applicationError);
  }
  if ((business && business.length > 0) || (businessApplication && businessApplication.length > 0)) {
    return true;
  }
  return false;
};
export const transformChoice = (data: any) => {
  // convert any yes and no to true or false
  const transformedData = Object.entries(data).reduce((acc: Record<any, any>, [key, value]) => {
    if (typeof value === "string") {
      const lowerValue = value.toLowerCase();
      if (lowerValue === "yes") {
        acc[key] = true;
      } else if (lowerValue === "no") {
        acc[key] = false;
      } else {
        acc[key] = value; // keep other string values unchanged
      }
    } else {
      acc[key] = value; // keep other types unchanged
    }
    return acc;
  }, {});
  return transformedData;
};

