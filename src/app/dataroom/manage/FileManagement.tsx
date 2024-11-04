"use client";

import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { uploadFileToDataRoom } from "@/lib/data/bucket/uploadFile";
import { getFilesByDataroomId } from "@/lib/data/dataroomQuery";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { createSupabaseClient } from "@/lib/supabase/clientComponentClient";
import Link from "next/link";
import { deleteFileFromDataRoom } from "@/lib/data/bucket/deleteFile";
import toast from "react-hot-toast";

interface FileManagementInterface {
  dataroomId: number;
}

interface Files {
  id: number;
  dataroom_id: number;
  file_url: string;
  file_type: {
    id: number;
    value: string;
  };
  uploaded_at: string;
}

export default function FileManagement({ dataroomId }: FileManagementInterface) {
  const supabase = createSupabaseClient();
  const [fileToDelete, setFileToDelete] = useState<Files | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { data: files, isLoading, error, refetch } = useQuery(getFilesByDataroomId(supabase, dataroomId));

  function getFileNameFromUrl(fileUrl: string): string {
    const fullFileName = fileUrl.split("/").pop() || "";
    return decodeURIComponent(fullFileName.split("?")[0]);
  }

  const handleDeleteClick = (file: any) => {
    setFileToDelete(file);
  };

  const handleDeleteConfirm = async () => {
    if (!fileToDelete) return;

    try {
      await deleteFileFromDataRoom(
        supabase,
        fileToDelete.dataroom_id,
        getFileNameFromUrl(fileToDelete.file_url),
        fileToDelete.id
      );
      setFileToDelete(null);
      refetch();
      toast.success("Delete successfully!");
    } catch (error) {
      toast.error("Error occur while deleting file!");
      setDeleteError("Error occur while deleting file!");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUploadFile = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadError(null);

    try {
      await uploadFileToDataRoom(supabase, selectedFile, dataroomId);
      refetch();
      toast.success("Upload successfully!");
    } catch (error) {
      toast.error("Error occur while uploading!");
      setUploadError("Error occur while uploading!");
    } finally {
      setUploading(false);
      setSelectedFile(null);
    }
  };

  if (isLoading) return <p>Loading files...</p>;
  if (error) return <p>Error loading files: {error.message}</p>;

  return (
    <>
      <h3 className="text-lg font-medium mb-2">Manage Files</h3>
      <Separator className="my-2" />
      <Input type="file" className="mb-2" onChange={handleFileChange} />
      <Button className="mb-4" onClick={handleUploadFile} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload File"}
      </Button>
      {uploadError && <div className="text-red-500">{uploadError}</div>}
      {deleteError && <div className="text-red-500">{deleteError}</div>}

      <div className="overflow-y-auto max-h-60 mb-4">
        <Table>
          <TableCaption>A list of files in the selected data room.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>File Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files?.map((file) => (
              <TableRow key={file.id}>
                <TableCell className="font-medium">
                  <Link href={file.file_url} rel="noopener noreferrer" target="_blank">
                    <p className="text-blue-600 dark:text-blue-400 hover:text-blue-800">
                      {getFileNameFromUrl(file.file_url)}
                    </p>
                  </Link>
                </TableCell>
                <TableCell>Uploaded</TableCell>
                <TableCell className="text-right">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" className="text-red-500" onClick={() => handleDeleteClick(file)}>
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the file &quot;
                          {getFileNameFromUrl(file.file_url)}
                          &quot;.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setFileToDelete(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2}>Total Files</TableCell>
              <TableCell className="text-right">{files?.length}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </>
  );
}
