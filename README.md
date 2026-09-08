# StickLab

A one-page controller repair site for Xbox and PS5 controllers, built with
Next.js, TypeScript, Tailwind CSS, shadcn/ui primitives, Motion, React Hook
Form, Zod, and Resend.

## Local development

```bash
npm install
npm run dev
```

## Environment variables

```bash
RESEND_API_KEY=your_resend_key      # required, sends the repair requests
NEXT_PUBLIC_SITE_URL=https://...    # optional, your live domain for SEO links
```

## Repair request emails

Requests are emailed to `techoleks@gmail.com` with the subject
"Controller fix request", sent from
`repairs@contact.vancouvercontrollerrepair.com`, and replies go straight back to
the customer. Both addresses live as `DEFAULT_RECIPIENT` and `DEFAULT_SENDER` at
the top of `app/api/repair-request/route.ts`; the sender domain has to stay
verified in Resend.

## Adding your own photos

Drop images in `public/` and reference them from the code:

- Gallery of finished repairs: the `gallery` array in
  `components/landing-page.tsx`
- Customer feedback photos: the `image` field in `lib/testimonials.ts`
- Repair option videos: the two placeholders in the "Choose your fix" section of
  `components/landing-page.tsx`

## Deployment

On Vercel, import the repository and add `RESEND_API_KEY` in the project
settings.

On Netlify, `netlify.toml` already sets the build command to `npm run build` and
the publish directory to `.next`; add `RESEND_API_KEY` under Site configuration
→ Environment variables. Keep the server build — a static export would break
the `/api/repair-request` route the form posts to.
