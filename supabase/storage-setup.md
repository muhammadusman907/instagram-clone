# Supabase Storage Buckets Setup

After setting up your Supabase database, you need to create storage buckets for images.

## Steps:

1. Go to your Supabase Dashboard → Storage
2. Create the following buckets:

### 1. `avatars` Bucket
   - **Public**: Yes
   - **File size limit**: 5MB
   - **Allowed MIME types**: image/jpeg, image/png, image/gif, image/webp

### 2. `posts` Bucket
   - **Public**: Yes
   - **File size limit**: 10MB
   - **Allowed MIME types**: image/jpeg, image/png, image/gif, image/webp

## Storage Policies

Run the following SQL in your Supabase SQL Editor:

```sql
-- Allow authenticated users to upload avatars
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public to view avatars
CREATE POLICY "Avatars are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Allow users to update/delete own avatar
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to upload posts
CREATE POLICY "Users can upload posts"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'posts' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public to view posts
CREATE POLICY "Posts are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'posts');

-- Allow users to delete own posts
CREATE POLICY "Users can delete own posts"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'posts' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

Note: The folder structure check `(storage.foldername(name))[1]` assumes files are stored as `bucket_name/user_id/filename`. Adjust if using a different structure.

