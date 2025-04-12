
-- Criar bucket para armazenamento de fotos de perfil e capa
INSERT INTO storage.buckets (id, name, public)
VALUES ('profiles', 'Perfis', true);

-- Permitir acesso público às imagens
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profiles');

-- Permitir que usuários autenticados façam upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profiles' AND (storage.foldername(name))[1] IN ('avatars', 'covers'));

-- Permitir que usuários editem ou excluam seus próprios arquivos
CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'profiles' AND auth.uid()::text = (storage.foldername(name))[2]);

CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'profiles' AND auth.uid()::text = (storage.foldername(name))[2]);
