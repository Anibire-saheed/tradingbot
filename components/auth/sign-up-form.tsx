"use client";

import { FormEvent, useState, useTransition } from "react";
import { toast } from "@/components/ui/sonner";
import { Eye, EyeOff } from "lucide-react";

import {
  SignUpFormData,
  validateSignUpForm,
} from "@/components/auth/auth-schemas";
import { signUp } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialValues: SignUpFormData = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

type SignUpErrors = Partial<Record<keyof SignUpFormData, string>>;

export function SignUpForm() {
  const [values, setValues] = useState<SignUpFormData>(initialValues);
  const [errors, setErrors] = useState<SignUpErrors>({});
  const [visiblePasswords, setVisiblePasswords] = useState({
    password: false,
    confirmPassword: false,
  });
  const [isPending, startTransition] = useTransition();

  function updateField(field: keyof SignUpFormData, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateSignUpForm(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast.error("Please check the highlighted fields.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      await signUp(formData);
    });
  }

  const fields = [
    {
      key: "name",
      label: "Full name",
      autoComplete: "name",
      placeholder: "Your full name",
    },
    {
      key: "email",
      label: "Email",
      autoComplete: "email",
      placeholder: "you@example.com",
    },
    {
      key: "password",
      label: "Password",
      autoComplete: "new-password",
      placeholder: "Create a password",
    },
    {
      key: "confirmPassword",
      label: "Confirm password",
      autoComplete: "new-password",
      placeholder: "Confirm your password",
    },
  ] as const;

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full">
      <div className="space-y-3">
        {fields.map(({ key, label, autoComplete, placeholder }) => {
          const passwordKey =
            key === "password" || key === "confirmPassword" ? key : null;
          const visible = passwordKey ? visiblePasswords[passwordKey] : false;
          return (
            <div key={key}>
              <div
                className={`relative rounded-xl bg-[#f5f6f8] px-4 py-2.5 focus-within:ring-2 focus-within:ring-[#603b58]/25 ${passwordKey ? "pr-14" : ""}`}
              >
                <Label
                  htmlFor={key}
                  className="text-xs font-normal text-slate-500"
                >
                  {label}
                </Label>
                <Input
                  id={key}
                  name={key}
                  type={
                    passwordKey
                      ? visible
                        ? "text"
                        : "password"
                      : key === "email"
                        ? "email"
                        : "text"
                  }
                  value={values[key]}
                  onChange={(e) => updateField(key, e.target.value)}
                  aria-invalid={Boolean(errors[key])}
                  aria-describedby={errors[key] ? `${key}-error` : undefined}
                  autoComplete={autoComplete}
                  placeholder={placeholder}
                  className="h-7 rounded-none border-0 bg-transparent p-0 text-base shadow-none focus-visible:ring-0"
                />
                {passwordKey && (
                  <button
                    type="button"
                    onClick={() =>
                      setVisiblePasswords((current) => ({
                        ...current,
                        [passwordKey]: !current[passwordKey],
                      }))
                    }
                    aria-label={`${visible ? "Hide" : "Show"} ${label.toLowerCase()}`}
                    aria-pressed={visible}
                    className="absolute right-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-lg text-slate-400 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-[#603b58]"
                  >
                    {visible ? (
                      <EyeOff aria-hidden="true" className="size-5" />
                    ) : (
                      <Eye aria-hidden="true" className="size-5" />
                    )}
                  </button>
                )}
              </div>
              {errors[key] && (
                <p id={`${key}-error`} className="mt-2 text-sm text-red-600">
                  {errors[key]}
                </p>
              )}
            </div>
          );
        })}
      </div>
      <Button
        type="submit"
        disabled={isPending}
        className="mt-5 h-12 w-full rounded-lg bg-blue-600 text-base font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {isPending ? "Creating account…" : "Sign Up"}
      </Button>
    </form>
  );
}
