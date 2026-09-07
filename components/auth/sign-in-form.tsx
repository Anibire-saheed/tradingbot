"use client";

import { FormEvent, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import {
  SignInFormData,
  validateSignInForm,
} from "@/components/auth/auth-schemas";
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
  const [status, setStatus] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function updateField(field: keyof SignInFormData, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setStatus("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateSignInForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus("");
      return;
    }

    setStatus("Your details are valid. Sign-in is not connected yet.");
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full">
      <div className="space-y-5">
        <div>
          <div className="rounded-xl bg-[#f5f6f8] px-4 py-2.5 focus-within:ring-2 focus-within:ring-[#603b58]/25">
            <Label htmlFor="email" className="text-xs font-normal text-slate-500">Email</Label>
            <Input id="email" name="email" type="email" value={values.email} onChange={(event) => updateField("email", event.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} autoComplete="email" placeholder="you@example.com" className="h-7 rounded-none border-0 bg-transparent p-0 text-base shadow-none focus-visible:ring-0" />
          </div>
          {errors.email && <p id="email-error" className="mt-2 text-sm text-red-600">{errors.email}</p>}
        </div>
        <div>
          <div className="relative rounded-xl bg-[#f5f6f8] px-4 py-2.5 pr-14 focus-within:ring-2 focus-within:ring-[#603b58]/25">
            <Label htmlFor="password" className="text-xs font-normal text-slate-500">Password</Label>
            <Input id="password" name="password" type={showPassword ? "text" : "password"} value={values.password} onChange={(event) => updateField("password", event.target.value)} aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? "password-error" : undefined} autoComplete="current-password" placeholder="Enter your password" className="h-7 rounded-none border-0 bg-transparent p-0 text-base shadow-none focus-visible:ring-0" />
            <button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} className="absolute right-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-lg text-slate-400 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-[#603b58]">{showPassword ? <EyeOff aria-hidden="true" className="size-5" /> : <Eye aria-hidden="true" className="size-5" />}</button>
          </div>
          {errors.password && <p id="password-error" className="mt-2 text-sm text-red-600">{errors.password}</p>}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm">
        <label className="flex items-center gap-2"><input type="checkbox" className="size-4 accent-[#603b58]" />Remember me</label>
        <button type="button" onClick={() => setStatus("For help accessing your account, contact support@omnidev.co. Password reset is not connected yet.")} className="underline underline-offset-4 hover:text-[#603b58]">Forgot Password?</button>
      </div>
      <Button type="submit" className="mt-6 h-12 w-full rounded-lg bg-blue-600 text-base font-semibold text-white hover:bg-blue-700">Login</Button>
      {status && <p role="status" className="mt-4 text-sm leading-6 text-slate-600">{status}</p>}
    </form>
  );
}
