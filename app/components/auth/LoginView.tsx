"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";

type LoginFormData = { username: string; password: string; };
type LoginFormErrors = Partial<Record<keyof LoginFormData, string>>;
const initialData: LoginFormData = { username: "", password: "" };

export default function LoginView() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>(initialData);
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [toastError, setToastError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (data: LoginFormData) => {
    const nextErrors: LoginFormErrors = {};
    if (!data.username.trim()) nextErrors.username = "Username is required.";
    if (!data.password) nextErrors.password = "Password is required.";
    return nextErrors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setToastError("");
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    setIsSubmitting(true);
    try {
      await login(formData);
      router.push("/");
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const status = axiosError.response?.status;
      const message = axiosError.response?.data?.message;
      if (status === 401) setToastError(message ?? "Invalid username or password.");
      else if (axiosError.code === "ECONNABORTED") {
        setToastError("The server took too long to start. Please try again.");
      }
      else setToastError(message ?? "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6">{toastError && <div role="alert" className="fixed right-4 top-4 rounded-md bg-red-600 px-4 py-3 text-sm font-medium text-white shadow-md">{toastError}</div>}<form onSubmit={handleSubmit} className="w-full space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"><h1 className="text-2xl font-semibold text-zinc-900">Login</h1><div className="space-y-1"><label htmlFor="username" className="text-sm font-medium text-zinc-800">Username</label><input id="username" name="username" type="text" required value={formData.username} onChange={(event) => { setFormData((prev) => ({ ...prev, username: event.target.value })); setErrors((prev) => ({ ...prev, username: undefined })); }} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500" />{errors.username && <p className="text-sm text-red-600">{errors.username}</p>}</div><div className="space-y-1"><label htmlFor="password" className="text-sm font-medium text-zinc-800">Password</label><input id="password" name="password" type="password" required value={formData.password} onChange={(event) => { setFormData((prev) => ({ ...prev, password: event.target.value })); setErrors((prev) => ({ ...prev, password: undefined })); }} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500" />{errors.password && <p className="text-sm text-red-600">{errors.password}</p>}</div><button type="submit" disabled={isSubmitting} className="w-full rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">{isSubmitting ? "Starting server and logging in..." : "Login"}</button>{isSubmitting && <p role="status" className="text-center text-sm text-zinc-600">The server may take up to a minute to start.</p>}<p className="text-sm text-zinc-600">Don&apos;t have an account? <Link href="/register" className="font-medium text-zinc-900 underline">Register</Link></p></form></main>;
}
