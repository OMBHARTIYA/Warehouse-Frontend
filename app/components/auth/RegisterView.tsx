"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { useAuth } from "../../context/AuthContext";

type RegisterFormData = { username: string; email: string; password: string; };
type RegisterFormErrors = Partial<Record<keyof RegisterFormData, string>>;
const initialData: RegisterFormData = { username: "", email: "", password: "" };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterView() {
  const router = useRouter();
  const { registerUser } = useAuth();
  const [formData, setFormData] = useState<RegisterFormData>(initialData);
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (data: RegisterFormData) => {
    const nextErrors: RegisterFormErrors = {};
    if (!data.username.trim()) nextErrors.username = "Username is required.";
    if (!data.email.trim()) nextErrors.email = "Email is required.";
    else if (!emailPattern.test(data.email.trim())) nextErrors.email = "Enter a valid email address.";
    if (!data.password) nextErrors.password = "Password is required.";
    else if (data.password.length < 8) nextErrors.password = "Password must be at least 8 characters.";
    return nextErrors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    setIsSubmitting(true);
    try {
      await registerUser(formData);
      router.push("/login");
    } catch (error) {
      const responseData = (error as AxiosError<{ message?: string; error?: string }>).response?.data;
      const backendError = responseData?.message ?? responseData?.error;
      setSubmitError(backendError || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6"><form onSubmit={handleSubmit} className="w-full space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"><h1 className="text-2xl font-semibold text-zinc-900">Register</h1><div className="space-y-1"><label htmlFor="username" className="text-sm font-medium text-zinc-800">Username</label><input id="username" name="username" type="text" required value={formData.username} onChange={(event) => { setFormData((prev) => ({ ...prev, username: event.target.value })); setErrors((prev) => ({ ...prev, username: undefined })); }} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500" />{errors.username && <p className="text-sm text-red-600">{errors.username}</p>}</div><div className="space-y-1"><label htmlFor="email" className="text-sm font-medium text-zinc-800">Email</label><input id="email" name="email" type="email" required value={formData.email} onChange={(event) => { setFormData((prev) => ({ ...prev, email: event.target.value })); setErrors((prev) => ({ ...prev, email: undefined })); }} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500" />{errors.email && <p className="text-sm text-red-600">{errors.email}</p>}</div><div className="space-y-1"><label htmlFor="password" className="text-sm font-medium text-zinc-800">Password</label><input id="password" name="password" type="password" required minLength={8} value={formData.password} onChange={(event) => { setFormData((prev) => ({ ...prev, password: event.target.value })); setErrors((prev) => ({ ...prev, password: undefined })); }} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500" />{errors.password && <p className="text-sm text-red-600">{errors.password}</p>}</div>{submitError && <p className="text-sm text-red-600">{submitError}</p>}<button type="submit" disabled={isSubmitting} className="w-full rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">{isSubmitting ? "Creating account..." : "Register"}</button><p className="text-center text-sm text-zinc-600">Already have an account? <Link href="/login" className="font-medium text-zinc-900 underline underline-offset-2">Login</Link></p></form></main>;
}
