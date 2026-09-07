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
import { CheckCircle2, AlertCircle } from "lucide-react";
import { verifyOtp, resendOtp } from "@/app/actions/auth";

export function VerifyOtpForm() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";
  const typeParam = searchParams.get("type") || "signup";
  const serverError = searchParams.get("error");
  const serverMessage = searchParams.get("message");

  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const [clientError, setClientError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isResending, startResendTransition] = useTransition();

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-focus the first box on mount
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

    // Automatically focus the next separate box
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
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
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
      setClientError("Account email not found. Please log in or sign up again.");
      return;
    }

    if (token.length < 6) {
      setClientError("Please enter all 6 digits of the code.");
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
      setClientError("Account email not found. Please log in or sign up again.");
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
    <div className="flex flex-col items-center text-center w-full">
      {/* Blue envelope icon badge */}
      <div className="mb-5 flex size-12 items-center justify-center rounded-[18px] bg-blue-50 border border-blue-200/70 text-blue-600 shadow-xs">
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

      {/* Heading */}
      <h1 className="font-serif text-[30px] sm:text-[36px] font-bold tracking-tight text-blue-950">
        Verify your email
      </h1>

      {/* Subtitle */}
      <p className="mt-2 text-sm sm:text-base text-blue-700/85 font-medium">
        Your 6-digit code was sent to you via email
      </p>

      {/* Server & Client Messages */}
      {serverMessage && (
        <div
          role="status"
          className="mt-4 flex w-full max-w-[380px] items-start gap-2 rounded-xl bg-blue-50 border border-blue-200 p-3 text-xs text-blue-900 text-left"
        >
          <CheckCircle2 className="size-4 shrink-0 text-blue-600 mt-0.5" />
          <span>{serverMessage}</span>
        </div>
      )}

      {(serverError || clientError) && (
        <div
          role="alert"
          className="mt-4 flex w-full max-w-[380px] items-start gap-2 rounded-xl bg-red-50/95 border border-red-200 p-3 text-xs text-red-800 text-left"
        >
          <AlertCircle className="size-4 shrink-0 text-red-600 mt-0.5" />
          <span>{clientError || serverError}</span>
        </div>
      )}

      {/* Verification Form */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-8 flex flex-col items-center w-full"
      >
        {/* 6 distinctly separated OTP input boxes in blue theme */}
        <div
          className="flex items-center justify-center gap-2 sm:gap-3.5 w-full"
          onPaste={handlePaste}
        >
          {digits.map((digit, index) => {
            const isFocused = focusedIndex === index;
            return (
              <div
                key={index}
                onClick={() => inputRefs.current[index]?.focus()}
                className={`relative flex items-center justify-center w-[46px] h-[60px] sm:w-[56px] sm:h-[72px] rounded-[18px] sm:rounded-[22px] transition-all cursor-text select-none ${
                  isFocused
                    ? "bg-white border-[2px] border-blue-600 shadow-[0_0_0_4px_rgba(37,99,235,0.18)]"
                    : digit
                    ? "bg-blue-50/30 border-[1.5px] border-blue-400 text-blue-950 shadow-xs"
                    : "bg-blue-50/40 border-[1.5px] border-blue-200/90 text-blue-950 hover:border-blue-300"
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
                  className="w-full h-full bg-transparent text-center text-2xl sm:text-3xl font-bold text-blue-950 outline-none caret-blue-600"
                />
              </div>
            );
          })}
        </div>

        {/* Centered Verify Button in blue */}
        <button
          type="submit"
          disabled={isPending || !isComplete}
          className="mt-8 h-12 w-48 sm:w-52 rounded-2xl bg-blue-600 font-semibold text-white shadow-[0_8px_25px_-4px_rgba(37,99,235,0.45)] hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed transition-all active:scale-[0.98]"
        >
          {isPending ? "Verifying…" : "Verify"}
        </button>
      </form>

      {/* Footer Text in blue */}
      <div className="mt-8 text-sm text-blue-900/80">
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
