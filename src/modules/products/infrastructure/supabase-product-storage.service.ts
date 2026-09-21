import { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/shared/lib/supabase/client';

export const PRODUCT_IMAGES_BUCKET = 'product-images';

export interface UploadImageResult {
  url: string;
  path: string;
}

export class SupabaseProductStorageService {
  private client: SupabaseClient;

  constructor(client?: SupabaseClient) {
    this.client = client || createClient();
  }

  /**
   * Upload an image file to the 'product-images' Supabase storage bucket
   */
  async uploadImage(file: File, folder: string = 'products'): Promise<UploadImageResult> {
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const uniquePrefix = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const filePath = `${folder}/${uniquePrefix}-${sanitizedName}`;

    const { data, error } = await this.client.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error || !data) {
      throw new Error(error?.message || '스토리지 이미지 업로드에 실패했습니다.');
    }

    const {
      data: { publicUrl },
    } = this.client.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(filePath);

    return {
      url: publicUrl,
      path: filePath,
    };
  }

  /**
   * Delete an image from the 'product-images' bucket using file path or public URL
   */
  async deleteImage(pathOrUrl: string): Promise<boolean> {
    try {
      let path = pathOrUrl;
      const marker = `/${PRODUCT_IMAGES_BUCKET}/`;
      if (pathOrUrl.includes(marker)) {
        path = pathOrUrl.split(marker)[1];
      }

      const { error } = await this.client.storage
        .from(PRODUCT_IMAGES_BUCKET)
        .remove([path]);

      return !error;
    } catch {
      return false;
    }
  }
}

