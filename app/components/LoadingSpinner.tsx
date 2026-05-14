export default function LoadingSpinner({ label = "Loading..." }: { label?: string }) {
  return <p className="text-zinc-600">{label}</p>;
}
