/**
 * Length of the emailed sign-in code.
 *
 * This MUST match Supabase → Authentication → Providers → Email →
 * "Email OTP Length". This project is set to 6 (verified against the live
 * project).
 *
 * Server-side validation accepts anything in [OTP_MIN, OTP_MAX] rather than
 * exactly OTP_LENGTH, so changing the dashboard setting degrades to a clear
 * "that code doesn't look right" from Supabase instead of a form that refuses
 * to submit at all.
 */
export const OTP_LENGTH = 6;

export const OTP_MIN = 6;
export const OTP_MAX = 10;

/** Strip everything that isn't a digit and cap the length. */
export const cleanOtp = (value: string) =>
  value.replace(/\D/g, "").slice(0, OTP_MAX);
