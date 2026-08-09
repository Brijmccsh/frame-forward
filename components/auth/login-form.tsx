"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { OtpInput } from "./otp-input";
import { requestLoginCode, verifyLoginCode } from "@/lib/auth/actions";

const RESEND_SECONDS = 30;

export function LoginForm({ next }: { next?: string }) {
  const { success } = useToast();
  const [step, setStep] = React.useState<"email" | "code">("email");
  const [email, setEmail] = React.useState("");
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [pending, startTransition] = React.useTransition();
  const [cooldown, setCooldown] = React.useState(0);
  const verifiedFor = React.useRef<string | null>(null);

  // Resend countdown.
  React.useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const sendCode = (options?: { resend?: boolean }) => {
    setError(null);
    startTransition(async () => {
      const result = await requestLoginCode(email);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setStep("code");
      setCooldown(RESEND_SECONDS);
      verifiedFor.current = null;
      if (options?.resend) {
        setCode("");
        success("New code sent", `Check ${email.trim().toLowerCase()} again.`);
      }
    });
  };

  const submitCode = (value: string) => {
    if (value.length !== 6 || pending) return;
    // Guard against the auto-submit firing twice for the same code.
    if (verifiedFor.current === value) return;
    verifiedFor.current = value;

    setError(null);
    startTransition(async () => {
      const result = await verifyLoginCode(email, value, next);
      // A successful verify redirects server-side, so anything returned here
      // is a failure.
      if (result && !result.ok) {
        setError(result.error);
        setCode("");
      }
    });
  };

  return (
    <Card className="p-7 shadow-lg sm:p-8">
      {step === "email" ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            sendCode();
          }}
          noValidate
        >
          <h1 className="font-head text-2xl font-bold text-text sm:text-3xl">
            Welcome in 👋
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Enter your email and we&apos;ll send you a 6-digit code. No password
            needed — new here or not, this is the way in.
          </p>

          <div className="mt-7">
            <Input
              type="email"
              name="email"
              label="Email address"
              placeholder="you@school.edu"
              autoComplete="email"
              required
              autoFocus
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              error={error ?? undefined}
              leading={
                <svg viewBox="0 0 20 20" aria-hidden className="h-4 w-4">
                  <path
                    d="M2.5 6.5A2 2 0 014.5 4.5h11a2 2 0 012 2v7a2 2 0 01-2 2h-11a2 2 0 01-2-2v-7z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M3 6l7 5 7-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            />
          </div>

          <Button
            type="submit"
            size="lg"
            fullWidth
            loading={pending}
            className="mt-6"
          >
            {pending ? "Sending code…" : "Email me a code"}
          </Button>

          <p className="mt-5 text-center text-xs leading-relaxed text-muted">
            Photographers and nonprofits both sign in here. You&apos;ll pick
            which one you are next.
          </p>
        </form>
      ) : (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            submitCode(code);
          }}
          noValidate
        >
          <h1 className="font-head text-2xl font-bold text-text sm:text-3xl">
            Check your email 📬
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            We sent a 6-digit code to{" "}
            <span className="font-semibold text-text">
              {email.trim().toLowerCase()}
            </span>
            . It expires in a few minutes.
          </p>

          <div className="mt-7">
            <OtpInput
              value={code}
              onChange={(next) => {
                setCode(next);
                if (error) setError(null);
              }}
              onComplete={submitCode}
              disabled={pending}
              invalid={Boolean(error)}
              label="6-digit sign-in code"
            />
            <div aria-live="polite" className="min-h-[1.25rem]">
              {error ? (
                <p className="mt-3 text-center text-xs font-medium text-danger">
                  {error}
                </p>
              ) : null}
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            fullWidth
            loading={pending}
            disabled={code.length !== 6}
            className="mt-4"
          >
            {pending ? "Verifying…" : "Verify & continue"}
          </Button>

          <div className="mt-6 flex flex-col items-center gap-2 text-sm">
            <button
              type="button"
              onClick={() => sendCode({ resend: true })}
              disabled={pending || cooldown > 0}
              className="link-underline font-medium text-muted transition-colors hover:text-text disabled:pointer-events-none disabled:opacity-60"
            >
              {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep("email");
                setCode("");
                setError(null);
              }}
              className="link-underline text-xs text-muted transition-colors hover:text-text"
            >
              Use a different email
            </button>
          </div>
        </form>
      )}
    </Card>
  );
}
