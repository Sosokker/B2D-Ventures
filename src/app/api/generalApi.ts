import { createSupabaseClient } from "@/lib/supabase/clientComponentClient";
import Swal from "sweetalert2";

const supabase = createSupabaseClient();

async function checkFolderExists(bucketName: string, filePath: string) {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .list(filePath);

  if (error) {
    console.error(`Error checking for folder: ${error.message}`);
  }
  return { folderData: data, folderError: error };
}

async function clearFolder(
  bucketName: string,
  folderData: any[],
  filePath: string
) {
  const errors: string[] = [];

  for (const fileItem of folderData) {
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([`${filePath}/${fileItem.name}`]);

    if (error) {
      errors.push(`Error removing file (${fileItem.name}): ${error.message}`);
    }
  }

  return errors;
}

export async function getProjectTag(projectId: number) {
  return supabase
    .from("project_tag")
    .select("tag_id")
    .in("item_id", [projectId]);
}
export async function getTagName(tagId: number) {
  return supabase.from("tag").select("value").in("id", [tagId]);
}
export async function getInvestorDeal(userId: string) {
  return supabase
    .from("investment_deal")
    .select("*")
    .in("investor_id", [userId])
    .order("created_time", { ascending: true });
}

async function uploadToFolder(
  bucketName: string,
  filePath: string,
  file: File
) {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, { upsert: true });

  if (error) {
    console.error(`Error uploading file: ${error.message}`);
  }
  return { uploadData: data, uploadError: error };
}

export async function uploadFile(
  file: File,
  bucketName: string,
  filePath: string
) {
  const errorMessages: string[] = [];

  // check if the folder exists
  const { folderData, folderError } = await checkFolderExists(
    bucketName,
    filePath
  );
  if (folderError) {
    errorMessages.push(`Error checking for folder: ${folderError.message}`);
  }

  // clear the folder if it exists
  if (folderData && folderData.length > 0) {
    const clearErrors = await clearFolder(bucketName, folderData, filePath);
    errorMessages.push(...clearErrors);
  }

  // upload the new file if there were no previous errors
  let uploadData = null;
  if (errorMessages.length === 0) {
    const { uploadData: data, uploadError } = await uploadToFolder(
      bucketName,
      filePath,
      file
    );
    uploadData = data;

    if (uploadError) {
      errorMessages.push(`Error uploading file: ${uploadError.message}`);
    }
  }

  if (errorMessages.length > 0) {
    Swal.fire({
      icon: "error",
      title: "Errors occurred",
      html: errorMessages.join("<br>"),
      confirmButtonColor: "red",
    });
    return { success: false, errors: errorMessages, data: null };
  }

  return { success: true, errors: null, data: uploadData };
}
