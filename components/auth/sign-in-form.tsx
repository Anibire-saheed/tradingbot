"use client";

import { FormEvent, useState, useTransition } from "react";
import { toast } from "@/components/ui/sonner";
import { Eye, EyeOff } from "lucide-react";

import {
  SignInFormData,
  validateSignInForm,
} from "@/components/auth/auth-schemas";
import { signIn } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialValues: SignInFormData = {
  email: "",
  password: "",
};

type SignInErrors = Partial<Record<keyof SignInFormData, string>>;

export function SignInForm() {
  const [values, setValues] = useState<SignInFormData>(initialValues);
  const [errors, setErrors] = useState<SignInErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  function updateField(field: keyof SignInFormData, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateSignInForm(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast.error("Please check the highlighted fields.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      await signIn(formData);
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full">
      <div className="space-y-5">
        <div>
          <div className="rounded-xl bg-[#f5f6f8] px-4 py-2.5 focus-within:ring-2 focus-within:ring-[#603b58]/25">
            <Label
              htmlFor="email"
              className="text-xs font-normal text-slate-500"
            >
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={values.email}
              onChange={(e) => updateField("email", e.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              autoComplete="email"
              placeholder="you@example.com"
              className="h-7 rounded-none border-0 bg-transparent p-0 text-base shadow-none focus-visible:ring-0"
            />
          </div>
          {errors.email && (
            <p id="email-error" className="mt-2 text-sm text-red-600">
              {errors.email}
            </p>
          )}
        </div>
        <div>
          <div className="relative rounded-xl bg-[#f5f6f8] px-4 py-2.5 pr-14 focus-within:ring-2 focus-within:ring-[#603b58]/25">
            <Label
              htmlFor="password"
              className="text-xs font-normal text-slate-500"
            >
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={values.password}
              onChange={(e) => updateField("password", e.target.value)}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "password-error" : undefined}
              autoComplete="current-password"
              placeholder="Enter your password"
              className="h-7 rounded-none border-0 bg-transparent p-0 text-base shadow-none focus-visible:ring-0"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="absolute right-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-lg text-slate-400 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-[#603b58]"
            >
              {showPassword ? (
                <EyeOff aria-hidden="true" className="size-5" />
              ) : (
                <Eye aria-hidden="true" className="size-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p id="password-error" className="mt-2 text-sm text-red-600">
              {errors.password}
            </p>
          )}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" className="size-4 accent-[#603b58]" />
          Remember me
        </label>
      </div>
      <Button
        type="submit"
        disabled={isPending}
        className="mt-6 h-12 w-full rounded-lg bg-blue-600 text-base font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {isPending ? "Signing in…" : "Sign In"}
      </Button>
    </form>
  );
}
