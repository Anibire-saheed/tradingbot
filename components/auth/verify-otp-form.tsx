"use client";

import { FormEvent, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, AlertCircle, RefreshCw, Mail, KeyRound } from "lucide-react";

import {
  VerifyOtpFormData,
  validateVerifyOtpForm,
} from "@/components/auth/auth-schemas";
import { verifyOtp, resendOtp } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type VerifyErrors = Partial<Record<keyof VerifyOtpFormData, string>>;

export function VerifyOtpForm() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";
  const typeParam = searchParams.get("type") || "signup";
  const serverError = searchParams.get("error");
  const serverMessage = searchParams.get("message");

  const [values, setValues] = useState<VerifyOtpFormData>({
    email: emailParam,
    token: "",
  });
  const [errors, setErrors] = useState<VerifyErrors>({});
  const [isPending, startTransition] = useTransition();
  const [isResending, startResendTransition] = useTransition();

  function updateField(field: keyof VerifyOtpFormData, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateVerifyOtpForm(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const formData = new FormData();
    formData.append("email", values.email.trim());
    formData.append("token", values.token.trim());
    formData.append("type", typeParam);

    startTransition(async () => {
      await verifyOtp(formData);
    });
  }

  function handleResend() {
    if (!values.email.trim()) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter your email to resend the token.",
      }));
      return;
    }

    const formData = new FormData();
    formData.append("email", values.email.trim());

    startResendTransition(async () => {
      await resendOtp(formData);
    });
  }

  return (
    <div className="w-full">
      {serverMessage && (
        <div
          role="status"
          className="mb-5 flex items-start gap-3 rounded-xl bg-emerald-50 border border-emerald-200/60 p-3.5 text-sm text-emerald-800"
        >
          <CheckCircle2 className="size-5 shrink-0 text-emerald-600 mt-0.5" />
          <span>{serverMessage}</span>
        </div>
      )}

      {serverError && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-3 rounded-xl bg-red-50 border border-red-200/60 p-3.5 text-sm text-red-800"
        >
          <AlertCircle className="size-5 shrink-0 text-red-600 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="w-full">
        <div className="space-y-4">
          <div>
            <div className="rounded-xl bg-[#f5f6f8] px-4 py-2.5 focus-within:ring-2 focus-within:ring-[#603b58]/25">
              <div className="flex items-center justify-between">
                <Label htmlFor="email" className="text-xs font-normal text-slate-500">
                  Email Address
                </Label>
                <Mail className="size-3.5 text-slate-400" />
              </div>
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
            <div className="rounded-xl bg-[#f5f6f8] px-4 py-2.5 focus-within:ring-2 focus-within:ring-[#603b58]/25">
              <div className="flex items-center justify-between">
                <Label htmlFor="token" className="text-xs font-normal text-slate-500">
                  Confirmation Token / Code
                </Label>
                <KeyRound className="size-3.5 text-slate-400" />
              </div>
              <Input
                id="token"
                name="token"
                type="text"
                maxLength={10}
                value={values.token}
                onChange={(e) => updateField("token", e.target.value)}
                aria-invalid={Boolean(errors.token)}
                aria-describedby={errors.token ? "token-error" : undefined}
                autoComplete="one-time-code"
                placeholder="e.g. 123456"
                className="h-7 rounded-none border-0 bg-transparent p-0 text-base font-mono tracking-widest text-slate-800 shadow-none focus-visible:ring-0"
              />
            </div>
            {errors.token && (
              <p id="token-error" className="mt-2 text-sm text-red-600">
                {errors.token}
              </p>
            )}
            <p className="mt-1.5 text-xs text-slate-500">
              Check your inbox for the token sent by email.
            </p>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isPending || isResending}
          className="mt-6 h-12 w-full rounded-lg bg-blue-600 text-base font-semibold text-white hover:bg-blue-700 disabled:opacity-60 transition-all shadow-sm"
        >
          {isPending ? "Confirming..." : "Confirm & Log in"}
        </Button>
      </form>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
        <span className="text-slate-500">Didn’t receive the code?</span>
        <button
          type="button"
          onClick={handleResend}
          disabled={isResending || isPending}
          className="inline-flex items-center gap-1.5 font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50"
        >
          <RefreshCw className={`size-3.5 ${isResending ? "animate-spin" : ""}`} />
          {isResending ? "Resending..." : "Resend Token"}
        </button>
      </div>
    </div>
  );
}
