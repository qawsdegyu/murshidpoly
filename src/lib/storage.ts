import { supabase } from './supabase';

/**
 * Handles file uploads to Supabase Storage.
 * Used by FileUpload components throughout the admin dashboard.
 */
export const uploadFile = async (file: File, folder: string) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    // Common bucket name for Murshid project assets
    // Note: Ensure this bucket exists in your Supabase dashboard
    const bucketName = 'murshid-assets';

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: 'public, max-age=31536000, immutable',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Unexpected error during file upload:', error);
    return null;
  }
};

export const uploadFileWithMetadata = async (file: File, folder: string) => {
  try {
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'bin';
    const filePath = `${folder}/${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const bucketName = 'murshid-assets';
    const { error } = await supabase.storage.from(bucketName).upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || undefined,
    });
    if (error) throw error;
    const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
    return { url: data.publicUrl, path: filePath, bucket: bucketName };
  } catch (error) {
    console.error('Metadata upload error:', error);
    return null;
  }
};
