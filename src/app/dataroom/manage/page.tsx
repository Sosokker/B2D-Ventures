"use client";

import { useEffect, useState } from "react";
import FileManagement from "./FileManagement";
import AccessRequestsManagement from "./AccessRequestsManagement";
import { createSupabaseClient } from "@/lib/supabase/clientComponentClient";
import { getProjectByUserId } from "@/lib/data/projectQuery";
import { getUserRole } from "@/lib/data/userQuery";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ManageDataroomPage() {
  const supabase = createSupabaseClient();
  const router = useRouter();

  const [userRole, setUserRole] = useState<string | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/");
        return;
      }

      const { data: roleData, error: roleError } = await getUserRole(supabase, user.id);
      if (roleError) {
        toast.error("Error loading user role.");
        router.push("/");
        return;
      }
      setUserRole(roleData.role);

      const { data: projectData, error: projectError } = await getProjectByUserId(supabase, user.id);
      if (projectError) {
        toast.error("Error loading projects.");
        router.push("/");
        return;
      }
      setProjects(projectData);
      setLoading(false);
    };

    fetchUserData();
  }, [supabase, router]);

  useEffect(() => {
    if (userRole && userRole !== "business") {
      router.push("/");
    }
  }, [userRole, router]);

  if (loading) {
    return <p className="flex items-center justify-center h-screen">Loading...</p>;
  }

  return (
    <div className="container max-w-screen-xl p-4">
      <h2 className="text-xl font-semibold mb-4">Manage Data Room / Projects</h2>

      <div className="mb-4">
        <Select
          onValueChange={(value) => {
            const selected = projects.find((project) => project.id.toString() === value);
            setSelectedProject(selected);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a project" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Projects</SelectLabel>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id.toString()}>
                  {project.project_name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {selectedProject && (
          <>
            <div className="border border-border p-4 rounded-md my-3">
              <FileManagement dataroomId={selectedProject.dataroom_id} />
            </div>
            <div className="border border-border p-4 rounded-md">
              <AccessRequestsManagement dataroomId={selectedProject.dataroom_id} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
