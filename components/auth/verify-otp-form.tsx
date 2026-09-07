"use client";

import {
  FormEvent,
  KeyboardEvent,
  ClipboardEvent,
  useState,
  useRef,
  useEffect,
  useTransition,
} from "react";
import { useSearchParams } from "next/navigation";
import { Mail, CheckCircle2, AlertCircle } from "lucide-react";
import { verifyOtp, resendOtp } from "@/app/actions/auth";

export function VerifyOtpForm() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";
  const typeParam = searchParams.get("type") || "signup";
  const serverError = searchParams.get("error");
  const serverMessage = searchParams.get("message");

  const [email, setEmail] = useState(emailParam);
  const [showEmailInput, setShowEmailInput] = useState(!emailParam);
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const [clientError, setClientError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isResending, startResendTransition] = useTransition();

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus the first empty input on mount
  useEffect(() => {
    const firstEmpty = digits.findIndex((d) => !d);
    const targetIndex = firstEmpty === -1 ? 0 : firstEmpty;
    inputRefs.current[targetIndex]?.focus();
  }, []);

  function handleDigitChange(index: number, val: string) {
    // Only accept numeric digit
    const cleaned = val.replace(/\D/g, "");
    if (!cleaned) {
      const next = [...digits];
      next[index] = "";
      setDigits(next);
      return;
    }

    const digit = cleaned[cleaned.length - 1];
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    setClientError(null);

    // Auto-advance to next box
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        const next = [...digits];
        next[index - 1] = "";
        setDigits(next);
      } else {
        const next = [...digits];
        next[index] = "";
        setDigits(next);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const next = [...digits];
    for (let i = 0; i < 6; i++) {
      next[i] = pasted[i] || "";
    }
    setDigits(next);
    setClientError(null);

    // Focus last filled digit or the next empty
    const focusTarget = Math.min(pasted.length, 5);
    inputRefs.current[focusTarget]?.focus();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const token = digits.join("");

    if (!email.trim()) {
      setShowEmailInput(true);
      setClientError("Please enter your email address.");
      return;
    }

    if (token.length < 6) {
      setClientError("Please enter all 6 digits of the code.");
      return;
    }

    setClientError(null);
    const formData = new FormData();
    formData.append("email", email.trim());
    formData.append("token", token);
    formData.append("type", typeParam);

    startTransition(async () => {
      await verifyOtp(formData);
    });
  }

  function handleResend() {
    if (!email.trim()) {
      setShowEmailInput(true);
      setClientError("Please enter your email to request the code again.");
      return;
    }

    setClientError(null);
    const formData = new FormData();
    formData.append("email", email.trim());

    startResendTransition(async () => {
      await resendOtp(formData);
    });
  }

  const isComplete = digits.every((d) => d !== "");

  return (
    <div className="flex flex-col items-center text-center">
      {/* Blue envelope icon badge */}
      <div className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-[#eef3ff] text-[#3557e8]">
        <Mail className="size-6" strokeWidth={1.75} />
      </div>

      {/* Heading */}
      <h1 className="font-serif text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl">
        Verify your email
      </h1>

      {/* Subtitle */}
      <p className="mt-3 text-sm text-[#64748b] sm:text-base">
        Your 6-digit code was sent to you via email
      </p>

      {/* Email Indicator / Edit link */}
      {email && !showEmailInput && (
        <div className="mt-1 flex items-center gap-1.5 text-xs text-[#64748b]">
          <span>Sent to <strong className="font-semibold text-slate-800">{email}</strong></span>
          <button
            type="button"
            onClick={() => setShowEmailInput(true)}
            className="text-[#3557e8] underline hover:text-[#2b4ad6]"
          >
            edit
          </button>
        </div>
      )}

      {/* Optional Email Input if email is empty or user wants to edit */}
      {showEmailInput && (
        <div className="mt-4 w-full max-w-[340px] text-left">
          <label htmlFor="verify-email-input" className="text-xs text-slate-500 font-medium">
            Email address
          </label>
          <input
            id="verify-email-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-800 focus:border-[#3557e8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3557e8]/15"
          />
        </div>
      )}

      {/* Feedback alerts */}
      {serverMessage && (
        <div
          role="status"
          className="mt-4 flex w-full max-w-[380px] items-start gap-2 rounded-xl bg-emerald-50/80 border border-emerald-200/50 p-3 text-xs text-emerald-800 text-left"
        >
          <CheckCircle2 className="size-4 shrink-0 text-emerald-600 mt-0.5" />
          <span>{serverMessage}</span>
        </div>
      )}

      {(serverError || clientError) && (
        <div
          role="alert"
          className="mt-4 flex w-full max-w-[380px] items-start gap-2 rounded-xl bg-red-50/80 border border-red-200/50 p-3 text-xs text-red-800 text-left"
        >
          <AlertCircle className="size-4 shrink-0 text-red-600 mt-0.5" />
          <span>{clientError || serverError}</span>
        </div>
      )}

      {/* Form with 6 input boxes */}
      <form onSubmit={handleSubmit} noValidate className="mt-8 flex flex-col items-center w-full">
        <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
          {digits.map((digit, index) => {
            const isFocused = focusedIndex === index;
            return (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onFocus={() => setFocusedIndex(index)}
                aria-label={`Digit ${index + 1}`}
                className={`size-12 sm:size-14 rounded-2xl border text-center text-xl sm:text-2xl font-medium transition-all outline-none ${
                  isFocused
                    ? "border-[#3557e8] ring-4 ring-[#3557e8]/15 bg-white text-[#111827]"
                    : digit
                    ? "border-slate-300 bg-white text-[#111827]"
                    : "border-[#e2e8f0] bg-[#f8fafc]/60 text-[#111827] hover:border-slate-300"
                }`}
              />
            );
          })}
        </div>

        {/* Verify button */}
        <button
          type="submit"
          disabled={isPending || !isComplete}
          className="mt-8 h-12 w-44 sm:w-48 rounded-2xl bg-[#3557e8] font-semibold text-white shadow-sm hover:bg-[#2b4ad6] disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
        >
          {isPending ? "Verifying…" : "Verify"}
        </button>
      </form>

      {/* Footer text */}
      <div className="mt-8 text-sm text-[#64748b]">
        Didn’t receive the code?{" "}
        <button
          type="button"
          onClick={handleResend}
          disabled={isResending || isPending}
          className="font-semibold text-[#3557e8] hover:underline disabled:opacity-50"
        >
          {isResending ? "Requesting…" : "Request again"}
        </button>
      </div>
    </div>
  );
}
