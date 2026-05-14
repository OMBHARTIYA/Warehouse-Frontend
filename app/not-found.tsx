import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6">
      <section className="w-full space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-zinc-900">Page not found</h1>
        <p className="text-sm text-zinc-600">The page you are looking for does not exist.</p>
        <Link
          href="/"
          className="inline-flex rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
        >
          Back to Dashboard
        </Link>
      </section>
    </main>
  );
}
