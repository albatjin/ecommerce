import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SupabaseProductStorageService, PRODUCT_IMAGES_BUCKET } from '../supabase-product-storage.service';
import { SupabaseClient } from '@supabase/supabase-js';

describe('SupabaseProductStorageService (Unit Test)', () => {
  let mockSupabase: any;
  let service: SupabaseProductStorageService;

  beforeEach(() => {
    mockSupabase = {
      storage: {
        from: vi.fn().mockReturnValue({
          upload: vi.fn().mockResolvedValue({
            data: { path: 'products/123-test.png' },
            error: null,
          }),
          getPublicUrl: vi.fn().mockReturnValue({
            data: { publicUrl: 'https://test.supabase.co/storage/v1/object/public/product-images/products/123-test.png' },
          }),
          remove: vi.fn().mockResolvedValue({
            data: [{ name: 'products/123-test.png' }],
            error: null,
          }),
        }),
      },
    };

    service = new SupabaseProductStorageService(mockSupabase as unknown as SupabaseClient);
  });

  it('이미지 파일을 업로드하고 생성된 publicUrl과 path를 반환한다', async () => {
    const file = new File(['content'], 'sample-photo.png', { type: 'image/png' });

    const result = await service.uploadImage(file);

    expect(mockSupabase.storage.from).toHaveBeenCalledWith(PRODUCT_IMAGES_BUCKET);
    expect(result.url).toContain('https://test.supabase.co/storage/v1/object/public/product-images/products/');
    expect(result.path).toContain('products/');
    expect(result.path).toContain('sample-photo.png');
  });

  it('업로드 실패 시 에러를 throw한다', async () => {
    mockSupabase.storage.from().upload.mockResolvedValueOnce({
      data: null,
      error: { message: 'Bucket not found or permission denied' },
    });

    const file = new File(['content'], 'sample-photo.png', { type: 'image/png' });

    await expect(service.uploadImage(file)).rejects.toThrow('Bucket not found or permission denied');
  });

  it('경로 또는 URL을 통해 이미지를 삭제할 수 있다', async () => {
    const success = await service.deleteImage(
      'https://test.supabase.co/storage/v1/object/public/product-images/products/123-test.png'
    );

    expect(success).toBe(true);
    expect(mockSupabase.storage.from().remove).toHaveBeenCalledWith(['products/123-test.png']);
  });
});

