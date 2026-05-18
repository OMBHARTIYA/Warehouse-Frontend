import Image from "next/image";
import { Bell, Mail, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/app/context/AuthContext";
import type { RecentTask } from "./types";

type DashboardHeaderProps = {
  searchQuery: string;
  searchSuggestions: RecentTask[];
  shouldShowSuggestions: boolean;
  onSearchQueryChange: (value: string) => void;
  onSearchFocus: () => void;
  onSearchBlur: () => void;
};

const menuPanelClass = "absolute left-2 right-2 top-[calc(100%+0.5rem)] z-30 mx-auto max-w-[calc(100vw-1rem)] rounded-xl border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:shadow-black/30";
const menuButtonClass = "mt-3 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800";

export default function DashboardHeader({
  searchQuery,
  searchSuggestions,
  shouldShowSuggestions,
  onSearchQueryChange,
  onSearchFocus,
  onSearchBlur,
}: DashboardHeaderProps) {
  const { user } = useAuth();
  const [isMailOpen, setIsMailOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAvatarBroken, setIsAvatarBroken] = useState(false);
  const actionsRef = useRef<HTMLDivElement | null>(null);

  const displayName = user?.username?.trim() || "User";

  const avatarStyle = useMemo(() => {
    const seed = displayName.toLowerCase().split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hue = seed % 360;
    return { backgroundColor: `hsl(${hue} 75% 45%)` };
  }, [displayName]);

  const initials = useMemo(() => {
    return (
      displayName
        .split(" ")
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("")
        .slice(0, 2) || "U"
    );
  }, [displayName]);

  const avatarUrl = useMemo(() => {
    const seed = encodeURIComponent(displayName.toLowerCase());
    return `https://api.dicebear.com/9.x/notionists-neutral/svg?seed=${seed}&radius=50&backgroundColor=fde68a,fca5a5,93c5fd,86efac,c4b5fd,fbcfe8&faceOffsetY=2`;
  }, [displayName]);

  const closeAllMenus = () => {
    setIsMailOpen(false);
    setIsNotificationOpen(false);
    setIsProfileOpen(false);
  };

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!actionsRef.current || (target && actionsRef.current.contains(target))) return;
      closeAllMenus();
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeAllMenus();
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <section className="rounded-3xl border border-[var(--border-soft)] bg-[var(--surface-2)] p-5 shadow-sm transition-colors dark:shadow-black/20 sm:p-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="w-full">
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl lg:text-5xl">Dashboard</h2>
          <p className="mt-2 text-base text-zinc-500 dark:text-zinc-400 sm:text-lg">Plan, prioritize, and accomplish your tasks with ease.</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 border-t border-zinc-200 pt-5 dark:border-zinc-700 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="relative w-full lg:max-w-xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400" size={18} aria-hidden="true" />
          <input
            id="dashboard-task-search"
            name="dashboardTaskSearch"
            type="search"
            aria-label="Search tasks"
            placeholder="Search task"
            value={searchQuery}
            onChange={(event) => onSearchQueryChange(event.target.value)}
            onFocus={onSearchFocus}
            onBlur={onSearchBlur}
            className="h-12 w-full rounded-full border border-[var(--border-soft)] bg-[var(--surface)] pl-11 pr-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-[var(--brand-red-border)] focus:ring-2 focus:ring-[var(--brand-red-soft)] dark:text-zinc-100 dark:placeholder:text-zinc-500"
          />
          {shouldShowSuggestions && (
            <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:shadow-black/30">
              {searchSuggestions.length > 0 ? (
                <ul className="max-h-72 overflow-y-auto py-1">
                  {searchSuggestions.map((task, index) => (
                    <li key={String(task.id ?? index)}>
                      <button
                        type="button"
                        onMouseDown={() => onSearchQueryChange(task.title)}
                        className="flex w-full items-start justify-between gap-3 px-4 py-2 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800"
                      >
                        <span className="truncate text-sm font-medium text-zinc-800 dark:text-zinc-100">{task.title}</span>
                        <span className="truncate text-xs text-zinc-500 dark:text-zinc-400">{task.projectName ?? task.project?.name ?? "Unknown project"}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400">No task suggestions.</p>
              )}
            </div>
          )}
        </div>

        <div ref={actionsRef} className="relative flex w-full flex-wrap items-center justify-start gap-2 sm:w-auto sm:justify-end sm:gap-3">
          <button type="button" aria-label="Messages" onClick={() => { setIsMailOpen((prev) => !prev); setIsNotificationOpen(false); setIsProfileOpen(false); }} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-soft)] bg-[var(--surface)] text-zinc-700 transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--brand-red-soft)] dark:text-zinc-200 dark:hover:bg-zinc-800">
            <Mail size={17} aria-hidden="true" />
          </button>

          <button type="button" aria-label="Notifications" onClick={() => { setIsNotificationOpen((prev) => !prev); setIsMailOpen(false); setIsProfileOpen(false); }} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-soft)] bg-[var(--surface)] text-zinc-700 transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--brand-red-soft)] dark:text-zinc-200 dark:hover:bg-zinc-800">
            <Bell size={17} aria-hidden="true" />
          </button>

          <button type="button" onClick={() => { setIsProfileOpen((prev) => !prev); setIsMailOpen(false); setIsNotificationOpen(false); }} className="inline-flex items-center gap-3 rounded-full border border-[var(--border-soft)] bg-[var(--surface)] px-2 py-1.5 text-left transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--brand-red-soft)] dark:hover:bg-zinc-800">
            <span className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full text-xs font-semibold text-white ring-1 ring-zinc-200 dark:ring-zinc-700" style={avatarStyle}>
              {!isAvatarBroken ? <Image src={avatarUrl} alt={`${displayName} avatar`} fill unoptimized sizes="40px" className="object-cover" onError={() => setIsAvatarBroken(true)} /> : <span>{initials}</span>}
            </span>
            <span className="hidden text-sm font-medium text-zinc-700 dark:text-zinc-200 sm:inline">{displayName}</span>
          </button>

          {isMailOpen && <div className={`${menuPanelClass} sm:left-auto sm:right-[9.5rem] sm:mx-0 sm:w-64 sm:max-w-none`}><p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Inbox</p><p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">No new messages.</p><button type="button" onClick={() => { toast.success("Inbox synced."); closeAllMenus(); }} className={menuButtonClass}>Refresh inbox</button></div>}

          {isNotificationOpen && <div className={`${menuPanelClass} sm:left-auto sm:right-24 sm:mx-0 sm:w-64 sm:max-w-none`}><p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Notifications</p><p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">All caught up.</p><button type="button" onClick={() => { toast("No unread notifications."); closeAllMenus(); }} className={menuButtonClass}>Mark all read</button></div>}

          {isProfileOpen && <div className="absolute left-2 right-2 top-[calc(100%+0.5rem)] z-30 mx-auto max-w-[calc(100vw-1rem)] rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:shadow-black/30 sm:left-auto sm:right-0 sm:mx-0 sm:w-[24rem] sm:max-w-none sm:p-5"><div className="flex items-center gap-4"><span className="relative inline-flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full text-sm font-semibold text-white ring-1 ring-zinc-200 dark:ring-zinc-700" style={avatarStyle}>{!isAvatarBroken ? <Image src={avatarUrl} alt={`${displayName} avatar`} fill unoptimized sizes="56px" className="object-cover" onError={() => setIsAvatarBroken(true)} /> : <span>{initials}</span>}</span><div><p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{displayName}</p><p className="text-sm text-zinc-600 dark:text-zinc-400">{user?.email ?? "No email"}</p></div></div></div>}
        </div>
      </div>
    </section>
  );
}
