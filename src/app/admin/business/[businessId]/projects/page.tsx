import { createSupabaseClient } from "@/lib/supabase/serverComponentClient";
import { getAllProjectApplicationByBusinessQuery } from "@/lib/data/applicationQuery";
import Link from "next/link";
import Image from "next/image";
import ProjectActions from "./ProjectAction";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ProjectApplicationData {
  id: number;
  created_at: string;
  deadline: string;
  status: string;
  project_name: string;
  business_id: number;
  business_name: string;
  user_id: number;
  project_type_id: number;
  project_type_value: string;
  short_description: string;
  pitch_deck_url: string | null;
  project_logo: string | null;
  min_investment: number;
  target_investment: number;
  project_photos: string[] | null;
}

interface ProjectApplicationTableProps {
  projects: ProjectApplicationData[];
}

function ProjectApplicationTable({ projects }: ProjectApplicationTableProps) {
  if (!projects || projects.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={11} className="text-center h-24 text-muted-foreground">
          No project applications found
        </TableCell>
      </TableRow>
    );
  }

  return (
    <>
      {projects.map((project) => (
        <TableRow key={project.id}>
          <TableCell>{project.project_name}</TableCell>
          <TableCell>{project.project_type_value}</TableCell>
          <TableCell>
            {project.project_logo && (
              <Image
                src={project.project_logo}
                alt={`${project.project_name} logo`}
                width={40}
                height={40}
                className="rounded-md"
              />
            )}
          </TableCell>
          <TableCell>{project.short_description}</TableCell>
          <TableCell>
            {project.pitch_deck_url && (
              <Link href={project.pitch_deck_url} className="text-blue-500 hover:text-blue-600">
                Pitch Deck
              </Link>
            )}
          </TableCell>
          <TableCell>{project.min_investment}</TableCell>
          <TableCell>{project.target_investment}</TableCell>
          <TableCell>{new Date(project.created_at).toLocaleDateString()}</TableCell>
          <TableCell>{new Date(project.deadline).toLocaleDateString()}</TableCell>
          <TableCell>
            {project.project_photos ? (
              project.project_photos.length > 0 && (
                <div className="flex space-x-2">
                  {project.project_photos.map((photoUrl, index) => (
                    <Image
                      key={index}
                      src={photoUrl}
                      alt={`Project photo ${index + 1}`}
                      width={40}
                      height={40}
                      className="rounded-md"
                    />
                  ))}
                </div>
              )
            ) : (
              <p>No images available</p>
            )}
          </TableCell>
          <TableCell>
            <ProjectActions projectId={project.id} />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

export default async function ProjectAdminPage({ params }: { params: { businessId: string } }) {
  const client = createSupabaseClient();
  const { data: projectApplicationData, error: projectApplicationError } =
    await getAllProjectApplicationByBusinessQuery(client, Number(params.businessId));

  if (projectApplicationError) {
    console.log(projectApplicationError);
    return <div>Error loading project applications</div>;
  }

  return (
    <div className="container max-w-screen-xl my-4">
      <h1 className="text-2xl font-semibold mb-4">
        {projectApplicationData?.[0]?.business_name || "Business Projects"}
      </h1>

      <Table className="border-2 border-border rounded-md">
        <TableCaption>Project Applications for Business</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Project Name</TableHead>
            <TableHead>Project Type</TableHead>
            <TableHead>Logo</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Pitch Deck</TableHead>
            <TableHead>Min Investment</TableHead>
            <TableHead>Target Investment</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead>Photos</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <ProjectApplicationTable projects={projectApplicationData || []} />
        </TableBody>
      </Table>
    </div>
  );
}
