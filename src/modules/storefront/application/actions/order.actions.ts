'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/shared/lib/supabase/server';
import { SupabaseOrderRepository } from '@/modules/orders/infrastructure/supabase-order.repository';
import {
  CreateOrderUseCase,
  CreateOrderInput,
  CreatedOrderResult,
} from '../use-cases/create-order.usecase';

export interface CreateOrderActionResponse {
  success: boolean;
  data?: CreatedOrderResult;
  error?: string;
}

export async function createOrderAction(
  input: CreateOrderInput
): Promise<CreateOrderActionResponse> {
  try {
    const supabase = await createClient();
    const repository = new SupabaseOrderRepository(supabase);
    const useCase = new CreateOrderUseCase(repository);

    const result = await useCase.execute(input);

    // 관리자 주문 목록 및 대시보드 캐시 갱신
    try {
      revalidatePath('/orders');
      revalidatePath('/dashboard');
      revalidatePath('/orders/detail');
    } catch {
      // revalidatePath 실패 시 무시
    }

    return {
      success: true,
      data: result,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || '주문 처리 중 오류가 발생했습니다.',
    };
  }
}

