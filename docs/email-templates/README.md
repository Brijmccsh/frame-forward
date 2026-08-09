# Supabase email templates

Frame Forward signs people in with a one-time **code**, never a link.

This project is configured for **6-digit** codes
(Authentication → Providers → Email → "Email OTP Length"). That length is
mirrored in `lib/auth/otp.ts` as `OTP_LENGTH`. If you change one, change the
other.

Whether Supabase emails a code or a link is decided entirely by the template
body in the dashboard — not by the client call. The default templates use
`{{ .ConfirmationURL }}`, which is why a fresh sign-up receives a
"Confirm your email" link that this app cannot complete.

Swap both templates to use `{{ .Token }}`:

**Dashboard → Authentication → Emails**

| Template         | When it fires                                    |
| ---------------- | ------------------------------------------------ |
| `Confirm signup` | Email address has never signed in before          |
| `Magic Link`     | Email address already has a user row              |

`signInWithOtp({ shouldCreateUser: true })` hits the first for new users and
the second for returning ones, so **both** need updating or new users keep
getting links.

Paste `confirm-signup.html` into *Confirm signup* and `magic-link.html` into
*Magic Link*. Subjects that work well:

- Confirm signup: `Your Frame Forward code`
- Magic Link: `Your Frame Forward sign-in code`
