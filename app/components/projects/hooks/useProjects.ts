import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { User } from "@/types/auth";
import { createProject, deleteProject, getProjects, updateProject } from "../services/projectService";
import type { Project, ProjectTaskSummary } from "../types";

function buildWarehouseSummaries(projects: Project[]) {
  return projects.reduce<Record<string, ProjectTaskSummary>>((summaries, project) => {
    const key = String(project.id);
    summaries[key] = {
      total: Number(project.product_count ?? 0),
      completed: Number(project.total_units ?? 0),
      inProgress: 0,
      critical: 0,
    };
    return summaries;
  }, {});
}

export default function useProjects(user: User | null) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectTaskSummaries, setProjectTaskSummaries] = useState<Record<string, ProjectTaskSummary>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreateFormVisible, setIsCreateFormVisible] = useState(false);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [createError, setCreateError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | number | null>(null);
  const [editCode, setEditCode] = useState("");
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [actionError, setActionError] = useState("");
  const [activeActionProjectId, setActiveActionProjectId] = useState<string | number | null>(null);
  const [activeActionType, setActiveActionType] = useState<"edit" | "delete" | null>(null);
  const [lastDeletedProject, setLastDeletedProject] = useState<Project | null>(null);

  const fetchProjects = async () => {
    setIsLoading(true);
    setError("");
    try {
      const nextProjects = await getProjects();
      setProjects(nextProjects);
      setProjectTaskSummaries(buildWarehouseSummaries(nextProjects));
    } catch {
      setError("Failed to load warehouses.");
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
      await createProject({ code, name, description, address });
      toast.success("Warehouse created");
      setCode("");
      setName("");
      setDescription("");
      setAddress("");
      setIsCreateFormVisible(false);
      await fetchProjects();
    } catch {
      setCreateError("Failed to create warehouse.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canManageProject = (project: Project) =>
    Boolean(user) && (user?.role === "admin" || String(user?.id) === String(project.manager_id ?? project.owner_id));

  const startEditProject = (project: Project) => {
    setActionError("");
    setEditingProjectId(project.id);
    setEditCode(project.code ?? "");
    setEditName(project.name);
    setEditDescription(project.description ?? "");
    setEditAddress(project.address ?? "");
  };

  const cancelEditProject = () => {
    setEditingProjectId(null);
    setEditCode("");
    setEditName("");
    setEditDescription("");
    setEditAddress("");
    setActionError("");
  };

  const handleEditProject = async (event: FormEvent<HTMLFormElement>, projectId: string | number) => {
    event.preventDefault();
    setActionError("");
    setActiveActionProjectId(projectId);
    setActiveActionType("edit");
    try {
      await updateProject(projectId, { code: editCode, name: editName, description: editDescription, address: editAddress });
      toast.success("Warehouse updated");
      cancelEditProject();
      await fetchProjects();
    } catch {
      setActionError("Failed to update warehouse.");
    } finally {
      setActiveActionProjectId(null);
      setActiveActionType(null);
    }
  };

  const handleDeleteProject = async (project: Project) => {
    const projectId = project.id;
    setActionError("");
    setActiveActionProjectId(projectId);
    setActiveActionType("delete");
    try {
      await deleteProject(projectId);
      setLastDeletedProject(project);
      toast.success("Warehouse deleted. Undo is available below.");
      if (editingProjectId === projectId) cancelEditProject();
      await fetchProjects();
    } catch {
      setActionError("Failed to delete warehouse.");
    } finally {
      setActiveActionProjectId(null);
      setActiveActionType(null);
    }
  };

  const undoDeleteProject = async () => {
    if (!lastDeletedProject) return;
    await createProject({
      code: lastDeletedProject.code ?? `WH-${Date.now()}`,
      name: lastDeletedProject.name,
      description: lastDeletedProject.description ?? "",
      address: lastDeletedProject.address ?? "Restored warehouse",
    });
    setLastDeletedProject(null);
    toast.success("Warehouse restored");
    await fetchProjects();
  };

  const toggleCreate = () => {
    setCreateError("");
    setIsCreateFormVisible((prev) => !prev);
  };

  return {
    projects,
    projectTaskSummaries,
    isLoading,
    error,
    isCreateFormVisible,
    code,
    name,
    description,
    address,
    createError,
    isSubmitting,
    editingProjectId,
    editCode,
    editName,
    editDescription,
    editAddress,
    actionError,
    activeActionProjectId,
    activeActionType,
    lastDeletedProject,
    setCode,
    setName,
    setDescription,
    setAddress,
    setEditCode,
    setEditName,
    setEditDescription,
    setEditAddress,
    canManageProject,
    startEditProject,
    cancelEditProject,
    handleCreateProject,
    handleEditProject,
    handleDeleteProject,
    undoDeleteProject,
    toggleCreate,
  };
}
