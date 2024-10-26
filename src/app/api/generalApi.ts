import { createSupabaseClient } from "@/lib/supabase/clientComponentClient";
import Swal from "sweetalert2";

export async function uploadFile(
  file: File,
  bucketName: string,
  filePath: string
) {
  const supabase = createSupabaseClient();
  let errorMessages: string[] = [];

  // check if the folder exists
  const { data: folderData, error: folderError } = await supabase.storage
    .from(bucketName)
    .list(filePath);

  if (folderError) {
    errorMessages.push(`Error checking for folder: ${folderError.message}`);
  }

  // if the folder exists, clear the folder
  if (folderData && folderData.length > 0) {
    for (const fileItem of folderData) {
      const { error: removeError } = await supabase.storage
        .from(bucketName)
        .remove([`${filePath}/${fileItem.name}`]);

      if (removeError) {
        errorMessages.push(
          `Error removing file (${fileItem.name}): ${removeError.message}`
        );
      }
    }
  }

  // upload the new file to the folder (if no folderError)
  if (errorMessages.length === 0) {
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file);

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
    return false;
  }
  return true;
}
