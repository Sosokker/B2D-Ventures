import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

export async function deleteFileFromDataRoom(
  supabase: SupabaseClient<Database>,
  dataroomId: number,
  fileName: string,
  dataroomMaterialId: number
) {
  const filePath = `${dataroomId}/${fileName}`;

  if (!filePath) {
    throw new Error("Invalid filepath: Unable to extract file path for deletion.");
  }

  const { error: storageError } = await supabase.storage.from("dataroom-material").remove([filePath]);

  if (storageError) {
    throw new Error(`Error deleting file from storage: ${storageError.message}`);
  }

  const { error: dbError } = await supabase.from("dataroom_material").delete().eq("id", dataroomMaterialId);

  if (dbError) {
    throw new Error(`Error deleting file from database: ${dbError.message}`);
  }

  return { success: true };
}
