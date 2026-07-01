-- Schema for Anand Jewellers
-- Copy and run this script in the Supabase SQL Editor to set up your tables, seeds, and security policies.

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =========================================================================
-- 1. Create Tables
-- =========================================================================

-- Categories Table
create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Products Table
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  category_id uuid references public.categories(id) on delete cascade not null,
  product_name text not null,
  description text,
  weight numeric(10, 3) not null,
  purity text not null,
  image_url text,
  images text[] default '{}',
  featured boolean default false not null,
  status text default 'Available'::text not null check (status in ('Available', 'Out of Stock')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Metal Rates Table (Single-row configuration)
create table public.metal_rates (
  id integer primary key default 1 check (id = 1),
  gold_rate numeric(10, 2) not null,
  silver_rate numeric(10, 2) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Banners Table
create table public.banners (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  image_url text not null,
  active boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enquiries Table
create table public.enquiries (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  mobile text not null,
  email text,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =========================================================================
-- 2. Seed Initial Metal Rates
-- =========================================================================
insert into public.metal_rates (id, gold_rate, silver_rate)
values (1, 72500.00, 89000.00)
on conflict (id) do nothing;

-- =========================================================================
-- 3. Configure Row Level Security (RLS)
-- =========================================================================

-- Enable RLS on all tables
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.metal_rates enable row level security;
alter table public.banners enable row level security;
alter table public.enquiries enable row level security;

-- Policies for Categories: Public read, Admin write
create policy "Allow public read on categories" on public.categories 
  for select using (true);
create policy "Allow admin write on categories" on public.categories 
  for all to authenticated using (true) with check (true);

-- Policies for Products: Public read, Admin write
create policy "Allow public read on products" on public.products 
  for select using (true);
create policy "Allow admin write on products" on public.products 
  for all to authenticated using (true) with check (true);

-- Policies for Metal Rates: Public read, Admin write
create policy "Allow public read on metal_rates" on public.metal_rates 
  for select using (true);
create policy "Allow admin write on metal_rates" on public.metal_rates 
  for all to authenticated using (true) with check (true);

-- Policies for Banners: Public read, Admin write
create policy "Allow public read on banners" on public.banners 
  for select using (true);
create policy "Allow admin write on banners" on public.banners 
  for all to authenticated using (true) with check (true);

-- Policies for Enquiries: Public write, Admin read/write
create policy "Allow public insert on enquiries" on public.enquiries 
  for insert with check (true);
create policy "Allow admin read/write on enquiries" on public.enquiries 
  for all to authenticated using (true) with check (true);

-- =========================================================================
-- 4. Storage Bucket Setup Instructions
-- =========================================================================
-- You must create a public bucket named 'jewellery' in Supabase Storage.
-- Set the public access policies for the 'jewellery' bucket:
--   1. Allow public select (read) on all files.
--   2. Allow authenticated users (admin) to insert/update/delete files.
