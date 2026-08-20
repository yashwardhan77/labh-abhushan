# Codebase Summary: Labh Abhushan Jewellery Showroom

This document is a complete technical reference for the **Labh Abhushan Showroom Web Application**. Keep this updated whenever major changes are made.

---

## 🚀 Live Deployment Info

| Item | Value |
|------|-------|
| **Live Website** | https://labhabhushan.vercel.app |
| **Admin Panel** | https://labhabhushan.vercel.app/admin/login |
| **Admin Email** | `admin@labhabhushan.com` |
| **Admin Password** | `admin12345` |
| **GitHub Repo** | https://github.com/yashwardhan77/labh-abhushan |
| **Vercel Project** | https://vercel.com/yashwardhan77s-projects/labhabhushan |
| **Supabase Project** | https://supabase.com/dashboard/project/qydwoipsvgidiepcpaqx |

> **To deploy new changes:** Just run `git add . ; git commit -m "message" ; git push origin main`
> Vercel will auto-deploy within 1-2 minutes automatically.

---

## 🔑 Important Credentials & Keys

### Git Config (Local Machine)
- **Name:** `yashwardhan77`
- **Email:** `yashwardhan1097@gmail.com`

### Supabase Keys (stored in .env.local AND Vercel Environment Variables)
- NEXT_PUBLIC_SUPABASE_URL = https://qydwoipsvgidiepcpaqx.supabase.co
- NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5ZHdvaXBzdmdpZGllcGNwYXF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxMzQ1ODAsImV4cCI6MjEwMjcxMDU4MH0.YqhE9_D0qx9McPQZdNdTG-miOzQ9kf0YYijJMNQ46es

### Social Media
- **Instagram:** https://www.instagram.com/_labh_abhushan?igsh=ODFvcm5qaGN4dGp3
- **WhatsApp:** +91 8449708851

### Store Details
- **Address:** Teen Nimbadi ki Gali, Siwana, Barmer, Rajasthan 344044
- **Phone:** 8449708851
- **Email:** info@labhabhushan.com
- **Hours:** Mon-Sat: 10:30 AM – 8:30 PM | Sunday: Closed
- **Google Maps:** https://maps.app.goo.gl/vkh1RockkEcbnHuh7

---

## 🌟 System Architecture Overview

The application is built on **Next.js 15 (App Router)** with a **Supabase** backend. It has a **dual-mode** system:
- **Production mode:** Uses real Supabase database + storage
- **Demo/Mock mode:** Uses in-memory data (activates when Supabase env vars are missing)

---

## 🗄️ Database Schema (Supabase Postgres)

Run `schema.sql` in Supabase SQL Editor to create tables.

| Table | Description | Key Fields |
|-------|-------------|------------|
| `categories` | Jewellery categories | `id` (UUID), `name` (unique) |
| `products` | Product inventory | `id`, `category_id` (FK), `product_name`, `weight`, `purity`, `image_url`, `images[]`, `featured`, `status` |
| `metal_rates` | Daily gold/silver rates | `id=1` (single row), `gold_rate`, `silver_rate`, `updated_at` |
| `banners` | Homepage hero banners | `id`, `title`, `image_url`, `active` |
| `enquiries` | Customer enquiry submissions | `id`, `name`, `mobile`, `email`, `message` |

### RLS Policies
- **Public** can SELECT products, categories, banners, metal_rates
- **Public** can INSERT enquiries (contact form)
- **Authenticated (admin)** can do ALL operations on all tables

---

## 🖼️ Image Storage (Supabase Storage)

- **Bucket name:** `jewellery` (PUBLIC bucket, 50MB file limit)
- **Policies:** 2 set (public read + authenticated write)
- **Folders:** `products/` and `banners/`
- **Tip:** Compress images at tinypng.com before uploading. Keep under 3MB.

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `.env.local` | Supabase keys (DO NOT commit to GitHub) |
| `next.config.ts` | Server Actions body size = 10MB (for image uploads) |
| `schema.sql` | Database schema — run in Supabase SQL Editor |
| `scripts/create-admin.js` | Script to create admin user |
| `src/lib/supabase/client.ts` | Browser Supabase client (has placeholder fallback) |
| `src/lib/supabase/server.ts` | Server Supabase client (reads auth cookies) |
| `src/lib/supabase/middleware.ts` | Session refresh middleware |
| `src/lib/supabase/storage.ts` | Image upload: base64 to Supabase storage |
| `src/lib/actions/mockDb.ts` | In-memory mock DB for demo mode |
| `src/lib/actions/products.ts` | CRUD for products |
| `src/lib/actions/categories.ts` | CRUD for categories |
| `src/lib/actions/rates.ts` | Get/update metal rates |
| `src/lib/actions/banners.ts` | CRUD for banners |
| `src/lib/actions/enquiries.ts` | Get/delete enquiries |
| `src/components/footer.tsx` | Footer with WhatsApp, Phone, Instagram links |
| `src/middleware.ts` | Auth guard for /admin/* routes |

---

## ⚙️ Configuration Changes Made

| File | What Changed |
|------|-------------|
| `next.config.ts` | Added serverActions.bodySizeLimit: 10mb |
| `src/lib/supabase/client.ts` | Added placeholder fallback for missing env vars |
| `src/lib/supabase/server.ts` | Added placeholder fallback for missing env vars |
| `src/lib/supabase/middleware.ts` | Added placeholder fallback for missing env vars |
| `src/app/page.tsx` | Updated Google Maps to Siwana showroom |
| `src/app/contact/page.tsx` | Updated Google Maps to Siwana showroom |
| `src/components/footer.tsx` | Added Instagram icon (inline SVG) |

---

## 🛠️ Local Development Commands

```bash
npm install       # Install dependencies
npm run dev       # Start dev server at localhost:3000
npm run build     # Build for production
npm run start     # Run production build locally
```

---

## 🚀 Deploy to Vercel

```bash
git add .
git commit -m "describe your changes"
git push origin main
# Vercel auto-deploys in 1-2 minutes
```

---

## 💡 Things Still To Do

| Task | Priority |
|------|----------|
| Change admin password from default admin12345 | HIGH (Security) |
| Add real product images and data from admin panel | HIGH |
| Upload homepage banner images from admin | HIGH |
| Add more customer reviews (currently 3 hardcoded) | MEDIUM |
| Connect custom domain (e.g. labhabhushan.com) | MEDIUM |
| Add email notification when enquiry is submitted | MEDIUM |
| Add real showroom photos to About page | MEDIUM |
| Enable Vercel Analytics for visitor tracking | LOW |

---

## 📦 Tech Stack

| Technology | Purpose |
|-----------|---------|
| Next.js 15 (Turbopack) | Full-stack React framework |
| React 19 | UI library |
| Supabase | Database + Auth + Storage |
| TypeScript | Type safety |
| Tailwind CSS v4 | Styling |
| Lucide React | Icons |
| xlsx | Enquiry export to Excel |
