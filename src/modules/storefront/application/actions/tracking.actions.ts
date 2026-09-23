'use server';

import { createClient } from '@/shared/lib/supabase/server';
import { SupabaseOrderRepository } from '@/modules/orders/infrastructure/supabase-order.repository';
import { TrackOrderUseCase } from '../use-cases/track-order.usecase';
import { MyOrderDetailDto } from '../dto/my-order.dto';

export interface LookupOrderResponse {
  success: boolean;
  data?: MyOrderDetailDto;
  error?: string;
}

export async function lookupOrderAction(
  orderQuery: string,
  phone?: string
): Promise<LookupOrderResponse> {
  try {
    const supabase = await createClient();
    const repository = new SupabaseOrderRepository(supabase);
    const useCase = new TrackOrderUseCase(repository);

    const result = await useCase.execute({
      orderQuery,
      phone,
    });

    if (!result) {
      return {
        success: false,
        error: '입력하신 정보와 일치하는 주문 내역을 찾을 수 없습니다.',
      };
    }

    return {
      success: true,
      data: result,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || '주문 조회 중 오류가 발생했습니다.',
    };
  }
}

