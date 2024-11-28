import { uploadFile } from "@/app/api/generalApi";

export const uploadFiles = async (files: File[], path: string) => {
  const results = await Promise.all(files.map((file) => uploadFile(file, "project-application", path + file.name)));
  return results;
};
