-- Create storage bucket for QR code images
INSERT INTO storage.buckets (id, name, public)
VALUES ('qr-images', 'qr-images', true);

-- Allow public to read images
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
USING (bucket_id = 'qr-images');

-- Allow anyone to upload images (for simplicity without auth)
CREATE POLICY "Anyone can upload images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'qr-images');

-- Allow anyone to delete their uploaded images
CREATE POLICY "Anyone can delete images"
ON storage.objects FOR DELETE
USING (bucket_id = 'qr-images');