# StickLab

A focused one-page controller repair site for Xbox and PS5 controllers, built
with Next.js, TypeScript, Tailwind CSS, shadcn/ui primitives, Motion, React Hook
Form, Zod, Resend, and Cloudflare Turnstile.

## Local development

```bash
npm install
npm run dev
```

## Repair request emails

The form needs exactly one setting to work:

```bash
RESEND_API_KEY=your_resend_key
```

Requests are emailed to `techoleks@gmail.com` with the subject
"Controller fix request", sent from
`repairs@contact.vancouvercontrollerrepair.com`, and replies go straight back to
the customer. Both addresses live as `DEFAULT_RECIPIENT` and `DEFAULT_SENDER` at
the top of `app/api/repair-request/route.ts`; the sender domain has to stay
verified in Resend.

Cloudflare Turnstile is optional: set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and
`TURNSTILE_SECRET_KEY` to switch spam checks on. Without them the form still
submits and verification is skipped.

## Vercel deployment

Import the repository into Vercel and add `RESEND_API_KEY` (plus the optional
Turnstile keys) in the project settings.
