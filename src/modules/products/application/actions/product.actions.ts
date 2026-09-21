'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/shared/lib/supabase/server';
import { SupabaseProductRepository } from '../../infrastructure/supabase-product.repository';
import { CreateProductUseCase } from '../use-cases/create-product.usecase';
import { CreateProductInputDto } from '../dto/product.dto';

export async function createProductAction(input: CreateProductInputDto) {
  try {
    const supabase = await createClient();
    const repository = new SupabaseProductRepository(supabase);
    const useCase = new CreateProductUseCase(repository);

    const product = await useCase.execute(input);
    revalidatePath('/products');
    return { success: true, data: product };
  } catch (error) {
    const message = error instanceof Error ? error.message : '상품 등록 중 오류가 발생했습니다.';
    return {
      success: false,
      error: message,
    };
  }
}

