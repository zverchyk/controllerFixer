# StickLab

A focused one-page controller repair site for Xbox and PS5 controllers, built
with Next.js, TypeScript, Tailwind CSS, shadcn/ui primitives, Motion, React Hook
Form, Zod, Resend, and Cloudflare Turnstile.

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

The Turnstile widget uses Cloudflare's public test site key when
`NEXT_PUBLIC_TURNSTILE_SITE_KEY` is absent. Form delivery still requires the
server-side values shown in `.env.example`.

## Vercel deployment

Import the repository into Vercel and add every variable from `.env.example`.
Use a verified sender/domain in Resend for `REPAIR_FROM_EMAIL` and set
`REPAIR_REQUEST_EMAIL` to the inbox that should receive repair requests.
