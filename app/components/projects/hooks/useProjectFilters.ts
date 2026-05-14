import { useMemo, useState } from "react";
import type { Project, SortBy } from "../types";

export default function useProjectFilters(projects: Project[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("name-asc");

  const visibleProjects = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const filtered = normalizedQuery
      ? projects.filter((project) => project.name.toLowerCase().includes(normalizedQuery))
      : projects;

    return [...filtered].sort((a, b) => {
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      if (sortBy === "name-desc") return b.name.localeCompare(a.name);
      if (sortBy === "date-asc") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [projects, searchQuery, sortBy]);

  return {
    searchQuery,
    sortBy,
    visibleProjects,
    setSearchQuery,
    setSortBy,
  };
}
