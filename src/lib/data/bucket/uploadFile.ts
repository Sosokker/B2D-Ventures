import { SupabaseClient } from "@supabase/supabase-js";

export async function uploadFileToDataRoom(supabase: SupabaseClient, file: File, dataRoomId: number) {
  const allowedExtensions = ["pdf", "docx", "xlsx", "pptx", "txt"];
  const fileExtension = file.name.split(".").pop()?.toLowerCase();

  if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
    throw new Error("Invalid file format. Only pdf, docx, xlsx, pptx, and txt are allowed.");
  }
  const { data: fileTypeData, error: fileTypeError } = await supabase
    .from("material_file_type")
    .select("id")
    .eq("value", fileExtension)
    .single();

  if (fileTypeError || !fileTypeData) {
    throw new Error("File type not supported or not found in material_file_type table.");
  }

  const fileTypeId = fileTypeData.id;

  const fileName = `${dataRoomId}/${file.name}`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("dataroom-material")
    .upload(fileName, file, {
      upsert: true,
      contentType: file.type,
    });

  if (uploadError) {
    throw uploadError;
  }
  const { data: signedUrlData, error: signedUrlError } = await supabase.storage
    .from("dataroom-material")
    .createSignedUrl(fileName, 2628000);

  if (signedUrlError) {
    throw signedUrlError;
  }

  const { error: insertError } = await supabase.from("dataroom_material").insert([
    {
      dataroom_id: dataRoomId,
      file_url: signedUrlData.signedUrl,
      file_type_id: fileTypeId,
    },
  ]);

  if (insertError) {
    throw insertError;
  }

  return uploadData;
}
