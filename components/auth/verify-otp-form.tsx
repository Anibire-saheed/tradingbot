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

  const [email, setEmail] = useState(emailParam);
  const [showEmailInput, setShowEmailInput] = useState(!emailParam);
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

    // Take the last entered character if multiple were typed
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
    <div className="flex flex-col items-center text-center w-full">
      {/* Blue envelope icon badge */}
      <div className="mb-5 flex size-12 items-center justify-center rounded-[18px] bg-[#edf2fe] text-[#3b5bf5]">
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
            stroke="#3B5BF5"
            strokeWidth="1.8"
          />
          <path
            d="M2 3L11 9.5L20 3"
            stroke="#3B5BF5"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Heading */}
      <h1 className="font-serif text-[30px] sm:text-[36px] font-bold tracking-tight text-[#111827]">
        Verify your email
      </h1>

      {/* Subtitle */}
      <p className="mt-2 text-sm sm:text-base text-[#64748b]">
        Your 6-digit code was sent to you via email
      </p>

      {/* Optional Email display / switcher */}
      {email && !showEmailInput && (
        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-[#64748b]">
          <span>
            Sent to <strong className="font-semibold text-slate-800">{email}</strong>
          </span>
          <button
            type="button"
            onClick={() => setShowEmailInput(true)}
            className="text-[#3b5bf5] underline hover:text-[#2b4ad6]"
          >
            edit
          </button>
        </div>
      )}

      {showEmailInput && (
        <div className="mt-4 w-full max-w-[340px] text-left">
          <label
            htmlFor="verify-email-input"
            className="text-xs text-slate-500 font-medium"
          >
            Email address
          </label>
          <input
            id="verify-email-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2 text-sm text-slate-800 focus:border-[#3b5bf5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3b5bf5]/15"
          />
        </div>
      )}

      {/* Server & Client Messages */}
      {serverMessage && (
        <div
          role="status"
          className="mt-4 flex w-full max-w-[380px] items-start gap-2 rounded-xl bg-emerald-50/90 border border-emerald-200/60 p-3 text-xs text-emerald-800 text-left"
        >
          <CheckCircle2 className="size-4 shrink-0 text-emerald-600 mt-0.5" />
          <span>{serverMessage}</span>
        </div>
      )}

      {(serverError || clientError) && (
        <div
          role="alert"
          className="mt-4 flex w-full max-w-[380px] items-start gap-2 rounded-xl bg-red-50/90 border border-red-200/60 p-3 text-xs text-red-800 text-left"
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
        {/* 6 distinctly separated OTP input boxes */}
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
                    ? "bg-white border-[1.8px] border-[#3b5bf5] shadow-[0_0_0_4px_rgba(59,91,245,0.12)]"
                    : digit
                    ? "bg-white border-[1.4px] border-slate-300 shadow-sm"
                    : "bg-[#f8faff] border-[1.2px] border-[#e2e7f4] hover:border-[#cbd5e1]"
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
                  className="w-full h-full bg-transparent text-center text-2xl sm:text-3xl font-semibold text-[#111827] outline-none caret-[#3b5bf5]"
                />
              </div>
            );
          })}
        </div>

        {/* Centered Verify Button */}
        <button
          type="submit"
          disabled={isPending || !isComplete}
          className="mt-8 h-12 w-48 sm:w-52 rounded-2xl bg-[#3b5bf5] font-semibold text-white shadow-[0_6px_20px_-3px_rgba(59,91,245,0.4)] hover:bg-[#2b4ad6] disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed transition-all active:scale-[0.98]"
        >
          {isPending ? "Verifying…" : "Verify"}
        </button>
      </form>

      {/* Footer Text */}
      <div className="mt-8 text-sm text-[#64748b]">
        Didn’t receive the code?{" "}
        <button
          type="button"
          onClick={handleResend}
          disabled={isResending || isPending}
          className="font-semibold text-[#3b5bf5] hover:underline disabled:opacity-50 ml-1"
        >
          {isResending ? "Requesting…" : "Request again"}
        </button>
      </div>
    </div>
  );
}
