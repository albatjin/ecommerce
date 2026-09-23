import { OrderRepository } from '@/modules/orders/domain/repositories/order.repository';
import { MyOrderDetailDto, toMyOrderDetailDto } from '../dto/my-order.dto';

export interface TrackOrderInput {
  orderQuery: string; // 주문번호 (ORD-...) 또는 order ID
  phone?: string;     // 비회원 조회 시 연락처 확인용
}

export class TrackOrderUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(input: TrackOrderInput): Promise<MyOrderDetailDto | null> {
    const query = input.orderQuery.trim();
    if (!query) {
      throw new Error('주문번호를 입력해 주세요.');
    }

    const detail = await this.orderRepository.getOrderDetail(query);
    if (!detail) {
      return null;
    }

    // 비회원 전화번호 검증 요청이 있는 경우
    if (input.phone) {
      const cleanInputPhone = input.phone.replace(/[^0-9]/g, '');
      const cleanRecipientPhone = detail.shipping.phone.replace(/[^0-9]/g, '');
      const cleanCustomerPhone = detail.customer.phone.replace(/[^0-9]/g, '');

      // 전화번호 일치 검사 (끝 4자리 또는 전체 일치)
      const matches =
        cleanRecipientPhone.includes(cleanInputPhone) ||
        cleanCustomerPhone.includes(cleanInputPhone) ||
        cleanInputPhone.slice(-4) === cleanRecipientPhone.slice(-4);

      if (!matches) {
        throw new Error('입력하신 연락처가 주문 정보와 일치하지 않습니다.');
      }
    }

    return toMyOrderDetailDto(detail);
  }
}

