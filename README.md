# StickLab

A focused one-page controller repair site for Xbox and PS5 controllers, built
with Next.js, TypeScript, Tailwind CSS, shadcn/ui primitives, Motion, React Hook
Form, Zod, Resend, and Cloudflare Turnstile.

## Local development

```bash
npm install
<<<<<<< HEAD
cp .env.example .env.local
=======
>>>>>>> cursor/controller-repair-site-6dc6
npm run dev
```

## Repair request emails

The form needs exactly one setting to work:

```bash
RESEND_API_KEY=your_resend_key
```

Requests are emailed to `techoleks@gmail.com` with the subject
<<<<<<< HEAD
"Controller fix request", and replies go straight back to the customer. Set
`REPAIR_REQUEST_EMAIL` to send somewhere else, and `REPAIR_FROM_EMAIL` once you
have a verified Resend domain (the default sender is `onboarding@resend.dev`,
which only delivers to the Resend account owner's address).
=======
"Controller fix request", sent from
`repairs@contact.vancouvercontrollerrepair.com`, and replies go straight back to
the customer. Both addresses live as `DEFAULT_RECIPIENT` and `DEFAULT_SENDER` at
the top of `app/api/repair-request/route.ts`; the sender domain has to stay
verified in Resend.
>>>>>>> cursor/controller-repair-site-6dc6

Cloudflare Turnstile is optional: set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and
`TURNSTILE_SECRET_KEY` to switch spam checks on. Without them the form still
submits and verification is skipped.

## Vercel deployment

<<<<<<< HEAD
Import the repository into Vercel and add `RESEND_API_KEY` (plus any optional
variables from `.env.example`) in the project settings.
=======
Import the repository into Vercel and add `RESEND_API_KEY` (plus the optional
Turnstile keys) in the project settings.
>>>>>>> cursor/controller-repair-site-6dc6
