import { useEffect, useState } from "react";
import api from "../../../../lib/api";
import type { ProjectDetails } from "../types";

export function useProjectDetails(projectId: string) {
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [isProjectLoading, setIsProjectLoading] = useState(true);
  const [projectError, setProjectError] = useState("");

  useEffect(() => {
    if (!projectId) return;
    let ignore = false;
    const loadProject = async () => {
      setIsProjectLoading(true);
      setProjectError("");
      try {
        const response = await api.get(`/api/projects/${projectId}`);
        const data = response.data?.project ?? response.data;
        if (!ignore) setProject((data ?? null) as ProjectDetails | null);
      } catch {
        if (!ignore) setProjectError("Failed to load project details.");
      } finally {
        if (!ignore) setIsProjectLoading(false);
      }
    };
    void loadProject();
    return () => {
      ignore = true;
    };
  }, [projectId]);

  return { project, isProjectLoading, projectError };
}
