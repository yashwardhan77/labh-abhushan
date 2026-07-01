# Anand Jewellers Showroom Web Application

A premium, modern, and mobile-responsive website and administration panel built for **Anand Jewellers** using Next.js 15, TypeScript, Tailwind CSS, and Supabase.

---

## 🌟 Features

### Public Website
1. **Homepage**: Luxury hero carousel banner, daily gold & silver rates board (updated in real-time), featured ornaments grid, customer trust guarantees, glowing reviews, and Google Maps showroom locator.
2. **Our Collection (Gallery)**: Paginated catalog of products with name search and filtering by database categories (Gold, Silver, Diamonds).
3. **Product Details**: Multi-image switching display, detailed weight, standard purity specifications, direct WhatsApp enquiries (pre-filled text), and enquiry drawer.
4. **About Us Page**: Narrative detailing the 30-year heritage of trust, core principles, milestones, and certified buyback/cleaning guarantees.
5. **Contact Page**: Complete general enquiry submission form and showroom contact coordinates.

### Admin Dashboard Control Panel
1. **Protected Login**: Secure staff portal using Supabase Authentication.
2. **Dashboard Overview**: Summary statistics (Total Products, Enquiries, Categories) and quick action panels.
3. **Live Rates Updater**: Form to set current showroom daily Gold & Silver market rates.
4. **Category Manager**: CRUD manager for category folders (inline name edits).
5. **Hero Banners Manager**: Add, toggle active states, and remove slider ads.
6. **Products Inventory Manager**: Form to upload products (primary and additional images), Net Weights, Purity, Status, and Featured flags.
7. **Enquiries Inbox**: Dashboard to read messages, link numbers to phone lines, delete logs, and export logs to Excel spreadsheets (`.xlsx`).

---

## 🛠️ Tech Stack & Dependencies

* **Framework**: Next.js 15.5 (App Router, React 19)
* **Language**: TypeScript
* **Styling**: Tailwind CSS v4 (Luxury custom emerald & gold palette, custom glassmorphism)
* **Database & Authentication**: Supabase (PostgreSQL, Supabase Auth, Supabase Storage)
* **Icons**: Lucide React
* **Export Tool**: XLSX

---

## 🚀 Local Setup Instructions

### 1. Clone & Install Dependencies
Navigate to the project folder and run:
```bash
npm install
```

### 2. Configure Supabase Database
1. Create a free project at [Supabase.com](https://supabase.com).
2. Open your project dashboard, navigate to the **SQL Editor**, and copy-paste the contents of [schema.sql](file:///d:/website/schema.sql).
3. Run the script to initialize tables, primary values, and Row Level Security (RLS) policies.

### 3. Create Supabase Storage Bucket
1. Navigate to **Storage** in the Supabase Dashboard.
2. Create a new bucket named **`jewellery`**.
3. Set the bucket privacy toggle to **Public** so product images are accessible.
4. Set policies for the bucket:
   * **Select (Read)**: Allow public read access to everyone.
   * **Insert, Update, Delete**: Allow authenticated users (staff) full write access.

### 4. Set Environment Variables
Create an `.env.local` file in the root folder (based on [env.example](file:///d:/website/.env.example)):
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

### 5. Create Admin Staff Account
Since signups are disabled in RLS policies, you must create the initial staff account through the Supabase Dashboard:
1. Navigate to **Authentication** -> **Users**.
2. Click **Add User** -> **Create User**.
3. Provide staff email and password. This account will be able to log in at `/admin/login`.

### 6. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the showroom.

---

## ⚡ Deployment to Vercel

1. Push your codebase to a private Git repository (GitHub / GitLab).
2. Import the project on the [Vercel Dashboard](https://vercel.com).
3. Add the two environment variables configured in `.env.local` during the build setup.
4. Click **Deploy**. Vercel will automatically compile the server-side actions, bundle the client bundles, and host the platform.

---

## 📁 Project Structure

```text
src/
├── app/
│   ├── layout.tsx                # App root layout with custom theme, fonts & navbar/footer
│   ├── page.tsx                  # Home Page (Hero, Gold Rate, Featured, Trust, Contact/Map)
│   ├── about/
│   │   └── page.tsx              # About Us Page (History, Vision, Trust)
│   ├── products/
│   │   ├── page.tsx              # Product Gallery Page (Search, Filters, Grid, Pagination)
│   │   └── [id]/
│   │       └── page.tsx          # Product Details Page (Carousel, Details, Related, Enquire)
│   ├── contact/
│   │   └── page.tsx              # Contact Page (Form, Map, Phone, Address)
│   ├── admin/
│   │   ├── login/
│   │   │   └── page.tsx          # Admin Login Page
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Admin Dashboard Overview
│   │   ├── products/
│   │   │   └── page.tsx          # Product CRUD Management
│   │   ├── categories/
│   │   │   └── page.tsx          # Category CRUD Management
│   │   ├── rates/
│   │   │   └── page.tsx          # Gold & Silver Rates Management
│   │   ├── banners/
│   │   │   └── page.tsx          # Banners Management
│   │   └── enquiries/
│   │       └── page.tsx          # Enquiry View, Search, Delete & Export
│   └── middleware.ts             # Protect /admin Route Group using Supabase sessions
├── components/
│   ├── navbar.tsx                # Public Responsive Navbar
│   ├── footer.tsx                # Public Footer
│   ├── admin-sidebar.tsx         # Sidebar for admin pages
│   ├── hero-carousel.tsx         # Home hero image banner slider
│   ├── product-details-client.tsx# Product info viewer
│   ├── product-image-gallery.tsx # Multi-image preview selector
│   └── product-enquiry-modal.tsx # Product inquiry modal drawer
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Supabase client-side client
│   │   ├── server.ts             # Supabase server-side client (for server components/actions)
│   │   ├── middleware.ts         # Middleware client helper
│   │   └── storage.ts            # Image upload base64 parser
│   ├── actions/                  # Server Actions for CRUD operations
│   │   ├── products.ts
│   │   ├── categories.ts
│   │   ├── rates.ts
│   │   ├── banners.ts
│   │   └── enquiries.ts
│   └── utils.ts                  # Helper functions
```
