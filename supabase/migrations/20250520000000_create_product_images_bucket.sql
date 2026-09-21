-- ==============================================================================
-- Migration: Create 'product-images' Storage Bucket & RLS Policies
-- CommerceHub Next.js 16 / Supabase
-- ==============================================================================

-- 1. Create 'product-images' bucket if not already exists
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880, -- 5MB limit
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- 2. Ensure RLS is enabled on storage.objects
alter table storage.objects enable row level security;

-- 3. Policy: Public read access to product images
drop policy if exists "Public Access to Product Images" on storage.objects;
create policy "Public Access to Product Images"
on storage.objects for select
using (bucket_id = 'product-images');

-- 4. Policy: Allow authenticated users & admins to upload product images
drop policy if exists "Allow Upload to Product Images" on storage.objects;
create policy "Allow Upload to Product Images"
on storage.objects for insert
with check (
  bucket_id = 'product-images'
  and (auth.role() = 'authenticated' or auth.role() = 'anon' or public.is_admin())
);

-- 5. Policy: Allow updates to product images
drop policy if exists "Allow Update to Product Images" on storage.objects;
create policy "Allow Update to Product Images"
on storage.objects for update
using (
  bucket_id = 'product-images'
  and (auth.role() = 'authenticated' or auth.role() = 'anon' or public.is_admin())
);

-- 6. Policy: Allow delete product images
drop policy if exists "Allow Delete to Product Images" on storage.objects;
create policy "Allow Delete to Product Images"
on storage.objects for delete
using (
  bucket_id = 'product-images'
  and (auth.role() = 'authenticated' or auth.role() = 'anon' or public.is_admin())
);

