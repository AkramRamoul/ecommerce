# MultiCart E-commerce Platform

This is a [Next.js](https://nextjs.org) multi-tenant e-commerce platform built with Payload CMS, Stripe integration, and a modern React/TypeScript stack.

## Features

- Multi-tenant architecture (each store is a "tenant")
- Product management with categories, tags, and media uploads
- Secure authentication and user management
- Stripe integration for payments and payouts
- Product reviews and ratings
- Purchase history (Library)
- Responsive UI with custom components

## Getting Started

First, install dependencies:

```bash
npm install
# or
yarn install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## Environment Variables

Create a `.env` file in the root directory and set the following variables:

```
NEXT_PUBLIC_APP_URL=http://localhost:3000
STRIPE_SECRET_KEY=your_stripe_secret_key
PAYLOAD_SECRET=your_payload_secret
DATABASE_URI=your_mongodb_uri
```

## Project Structure

- `src/collections/` — Payload CMS collections (Users, Products, Tenants, etc.)
- `src/modules/` — Feature modules (auth, checkout, library, products, etc.)
- `src/components/` — Shared UI components
- `src/app/` — Next.js app directory (routes, layouts, pages)
- `src/trpc/` — tRPC API setup (routers, client, server)
- `src/lib/` — Utility functions and libraries

## Deployment

Deploy easily on [Vercel](https://vercel.com/) or your preferred platform. See [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

**Note:** This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) for font optimization and [Payload CMS](https://payloadcms.com/) for backend management.
