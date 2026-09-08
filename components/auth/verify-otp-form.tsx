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
import { AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { verifyOtp, resendOtp } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

export function VerifyOtpForm() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";
  const typeParam = searchParams.get("type") || "signup";

  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const [clientError, setClientError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isResending, startResendTransition] = useTransition();

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  function handleDigitChange(index: number, val: string) {
    const cleaned = val.replace(/\D/g, "");

    if (!cleaned) {
      const next = [...digits];
      next[index] = "";
      setDigits(next);
      return;
    }

    const char = cleaned[cleaned.length - 1];
    const next = [...digits];
    next[index] = char;
    setDigits(next);
    setClientError(null);

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

  function handlePaste(e: ClipboardEvent<HTMLDivElement>) {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pasted) return;

    const next = [...digits];
    for (let i = 0; i < 6; i++) {
      next[i] = pasted[i] || "";
    }
    setDigits(next);
    setClientError(null);

    const targetIdx = Math.min(pasted.length, 5);
    inputRefs.current[targetIdx]?.focus();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const token = digits.join("");

    if (!emailParam.trim()) {
      setClientError(
        "Account email not found. Please sign in or sign up again.",
      );
      toast.error("Account email not found. Please sign in or sign up again.");
      return;
    }

    if (token.length < 6) {
      setClientError("Please enter all 6 digits of the code.");
      toast.error("Please enter all 6 digits of the code.");
      return;
    }

    setClientError(null);
    const formData = new FormData();
    formData.append("email", emailParam.trim());
    formData.append("token", token);
    formData.append("type", typeParam);

    startTransition(async () => {
      await verifyOtp(formData);
    });
  }

  function handleResend() {
    if (!emailParam.trim()) {
      setClientError(
        "Account email not found. Please sign in or sign up again.",
      );
      toast.error("Account email not found. Please sign in or sign up again.");
      return;
    }

    setClientError(null);
    const formData = new FormData();
    formData.append("email", emailParam.trim());

    startResendTransition(async () => {
      await resendOtp(formData);
    });
  }

  const isComplete = digits.every((d) => d !== "");

  return (
    <div className="w-full">
      {/* Icon badge */}
      <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 mx-auto">
        <svg
          width="22"
          height="18"
          viewBox="0 0 22 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect
            x="1"
            y="1"
            width="20"
            height="16"
            rx="3"
            stroke="#2563eb"
            strokeWidth="1.8"
          />
          <path
            d="M2 3L11 9.5L20 3"
            stroke="#2563eb"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {clientError && (
        <div
          role="alert"
          className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200/80 bg-red-50 p-3 text-xs text-red-800"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-600" />
          <span>{clientError}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="w-full">
        {/* 6 separate rounded rectangular OTP boxes */}
        <div
          className="flex items-center justify-between gap-2 sm:gap-2.5 w-full my-4"
          onPaste={handlePaste}
        >
          {digits.map((digit, index) => {
            const isFocused = focusedIndex === index;
            return (
              <div
                key={index}
                onClick={() => inputRefs.current[index]?.focus()}
                className={`relative flex items-center justify-center flex-1 h-[62px] sm:h-[68px] rounded-xl transition-all cursor-text select-none ${
                  isFocused
                    ? "bg-white border-2 border-blue-600 shadow-[0_0_0_4px_rgba(37,99,235,0.15)]"
                    : digit
                      ? "bg-blue-50/20 border-1.5 border-blue-400 text-blue-950 shadow-xs"
                      : "bg-[#f5f6f8] border border-transparent text-slate-900 hover:border-slate-300"
                }`}
              >
                <input
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  id={`otp-box-${index}`}
                  name={`otp-box-${index}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  autoComplete={index === 0 ? "one-time-code" : "off"}
                  value={digit}
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onFocus={() => setFocusedIndex(index)}
                  onBlur={() => setFocusedIndex(-1)}
                  aria-label={`Digit ${index + 1}`}
                  className="w-full h-full bg-transparent text-center text-2xl sm:text-3xl font-bold text-slate-900 outline-none caret-blue-600"
                />
              </div>
            );
          })}
        </div>

        {/* Verify Button styled exactly like login button */}
        <Button
          type="submit"
          disabled={isPending || !isComplete}
          className="mt-6 h-12 w-full rounded-lg bg-blue-600 text-base font-semibold text-white hover:bg-blue-700 disabled:opacity-60 transition-all shadow-md shadow-blue-600/20"
        >
          {isPending ? "Verifying…" : "Verify"}
        </Button>
      </form>

      {/* Resend footer */}
      <div className="mt-5 text-center text-sm text-slate-500">
        Didn’t receive the code?{" "}
        <button
          type="button"
          onClick={handleResend}
          disabled={isResending || isPending}
          className="font-semibold text-blue-600 hover:text-blue-800 hover:underline disabled:opacity-50 ml-1"
        >
          {isResending ? "Requesting…" : "Request again"}
        </button>
      </div>
    </div>
  );
}
