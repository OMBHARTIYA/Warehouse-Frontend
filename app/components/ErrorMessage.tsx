export default function ErrorMessage({ message }: { message: string }) {
  if (!message) return null;

  return <p className="text-sm font-medium text-red-600 dark:text-rose-300">{message}</p>;
}
