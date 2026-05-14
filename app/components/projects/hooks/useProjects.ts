import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { User } from "@/types/auth";
import { createProject, deleteProject, getProjects, updateProject } from "../services/projectService";
import type { Project } from "../types";

export default function useProjects(user: User | null) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreateFormVisible, setIsCreateFormVisible] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [createError, setCreateError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | number | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [actionError, setActionError] = useState("");
  const [activeActionProjectId, setActiveActionProjectId] = useState<string | number | null>(null);
  const [activeActionType, setActiveActionType] = useState<"edit" | "delete" | null>(null);

  const fetchProjects = async () => {
    setIsLoading(true);
    setError("");
    try {
      setProjects(await getProjects());
    } catch {
      setError("Failed to load projects.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchProjects();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const handleCreateProject = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreateError("");
    setIsSubmitting(true);
    try {
      await createProject({ name, description });
      toast.success("Project created");
      setName("");
      setDescription("");
      setIsCreateFormVisible(false);
      await fetchProjects();
    } catch {
      setCreateError("Failed to create project.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canManageProject = (project: Project) =>
    Boolean(user) && (user?.role === "admin" || String(user?.id) === String(project.owner_id));

  const startEditProject = (project: Project) => {
    setActionError("");
    setEditingProjectId(project.id);
    setEditName(project.name);
    setEditDescription(project.description ?? "");
  };

  const cancelEditProject = () => {
    setEditingProjectId(null);
    setEditName("");
    setEditDescription("");
    setActionError("");
  };

  const handleEditProject = async (event: FormEvent<HTMLFormElement>, projectId: string | number) => {
    event.preventDefault();
    setActionError("");
    setActiveActionProjectId(projectId);
    setActiveActionType("edit");
    try {
      await updateProject(projectId, { name: editName, description: editDescription });
      toast.success("Project updated");
      cancelEditProject();
      await fetchProjects();
    } catch {
      setActionError("Failed to update project.");
    } finally {
      setActiveActionProjectId(null);
      setActiveActionType(null);
    }
  };

  const handleDeleteProject = async (projectId: string | number) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    setActionError("");
    setActiveActionProjectId(projectId);
    setActiveActionType("delete");
    try {
      await deleteProject(projectId);
      toast.success("Project deleted");
      if (editingProjectId === projectId) cancelEditProject();
      await fetchProjects();
    } catch {
      setActionError("Failed to delete project.");
    } finally {
      setActiveActionProjectId(null);
      setActiveActionType(null);
    }
  };

  const toggleCreate = () => {
    setCreateError("");
    setIsCreateFormVisible((prev) => !prev);
  };

  return {
    projects,
    isLoading,
    error,
    isCreateFormVisible,
    name,
    description,
    createError,
    isSubmitting,
    editingProjectId,
    editName,
    editDescription,
    actionError,
    activeActionProjectId,
    activeActionType,
    setName,
    setDescription,
    setEditName,
    setEditDescription,
    canManageProject,
    startEditProject,
    cancelEditProject,
    handleCreateProject,
    handleEditProject,
    handleDeleteProject,
    toggleCreate,
  };
}
