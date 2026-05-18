export default function LoadingSpinner({ label = "Loading..." }: { label?: string }) {
  return <p className="text-zinc-600 dark:text-zinc-300">{label}</p>;
}
