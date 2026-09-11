"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  requestPasswordReset,
  resetPassword,
  type PasswordState,
} from "@/app/actions/password";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PasswordForm({ reset = false }: { reset?: boolean }) {
  const [state, action, pending] = useActionState<PasswordState, FormData>(
    reset ? resetPassword : requestPasswordReset,
    {},
  );
  if (state.success)
    return (
      <div role="status" className="space-y-5">
        <p className="rounded-xl bg-blue-50 p-4 text-sm leading-6 text-blue-900">
          {state.success}
        </p>
        <Link
          href={reset ? "/dashboard" : "/login"}
          className="inline-block text-sm font-semibold text-blue-600"
        >
          {reset ? "Go to dashboard" : "Back to sign in"}
        </Link>
      </div>
    );
  return (
    <form action={action} className="space-y-5">
      {reset ? (
        <>
          <div className="space-y-2">
            <Label htmlFor="password">New password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              maxLength={128}
              required
              disabled={pending}
              aria-describedby="password-help"
            />
            <p id="password-help" className="text-xs text-neutral-500">
              Use 8–128 characters with uppercase and lowercase letters, a number,
              and a symbol.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm new password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              minLength={8}
              maxLength={128}
              required
              disabled={pending}
            />
          </div>
        </>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            disabled={pending}
          />
        </div>
      )}
      {state.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}
      <Button
        type="submit"
        disabled={pending}
        className="h-12 w-full bg-blue-600 text-white hover:bg-blue-700"
      >
        {pending
          ? "Please wait…"
          : reset
            ? "Save new password"
            : "Send reset link"}
      </Button>
      <Link
        href={reset ? "/forgot-password" : "/login"}
        className="inline-block text-sm text-blue-600"
      >
        {reset ? "Request a new reset link" : "Back to sign in"}
      </Link>
    </form>
  );
}
