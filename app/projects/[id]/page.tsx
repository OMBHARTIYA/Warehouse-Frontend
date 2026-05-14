"use client";

import { useParams } from "next/navigation";
import ProjectDetailsView from "../../components/project-detail/ProjectDetailsView";

export default function ProjectDetailsPage() {
  const params = useParams<{ id: string }>();
  const projectId = params?.id ?? "";

  return <ProjectDetailsView projectId={projectId} />;
}

