# E-Commerce 고객용 웹 서비스(Storefront) 3단계 구현 계획

## 3단계 목표: 주문서 작성 및 결제 연동 (Checkout & Order Flow)

고객이 장바구니에 담은 상품을 바탕으로 주문서(`/checkout`)를 작성하고, 배송지 및 결제 수단을 선택하여 결제를 완료하면, 실제 주문 데이터가 생성되어 **관리자 대시보드(`/orders`)의 주문 목록과 매출 통계에 즉시 실시간 반영**되는 전체 커머스 라이프사이클을 완성합니다.

---

## User Review Required
> [!IMPORTANT]
> 1. **결제 모듈(PG)**: 실서비스 카드 승인 및 빠른 테스트를 위해 토스페이먼츠/간편결제 UI 스타일의 결제 시뮬레이션(안심 결제 프로세스)을 기본 제공하며, 실제 승인 완료 플로우를 거쳐 주문 번호가 발행됩니다.
> 2. **관리자 대시보드 실시간 연계**: 결제가 완료되면 Supabase DB `orders` 테이블 및 주문 저장소에 주문이 즉시 등록되어, 관리자가 `/orders` 페이지를 새로고침하거나 확인할 때 신규 주문 건으로 바로 표시됩니다.
> 3. **장바구니 자동 정리**: 주문 완료 시 장바구니에서 결제된 상품만 자동으로 삭제 처리됩니다.

---

## Proposed Changes

### Component 1: 주문 생성 Application & Use Case
- [MODIFY] `src/modules/orders/domain/repositories/order.repository.ts`:
  - `createOrder(order: Order, detail: OrderDetail): Promise<Order>` 메서드 인터페이스 확장
- [MODIFY] `src/modules/orders/infrastructure/supabase-order.repository.ts`:
  - Supabase `orders` 테이블 INSERT 및 `localOrders`, `localOrderDetails`에 실시간 추가 구현
- [NEW] `src/modules/storefront/application/use-cases/create-order.usecase.ts`:
  - 주문번호 생성 (`ORD-YYYYMMDD-XXXXX`)
  - 배송지, 주문자, 결제수단, 품목 요약 가공
  - 주문 저장소 호출 및 생성된 주문 반환

### Component 2: 주문서 작성 뷰 & 배송지 입력 (`/checkout`)
- [NEW] `src/app/(store)/checkout/page.tsx`:
  - 주문서 작성 라우트
- [NEW] `src/modules/storefront/presentation/components/checkout-view.tsx`:
  - **주문 상품 목록 확인**: 썸네일, 수량, 품목별 금액
  - **배송지 정보 입력 폼**: 수령인 이름, 휴대전화 번호, 우편번호 및 주소/상세주소, 배송 요청사항 프리셋 선택
  - **결제 수단 선택**: 신용/체크카드, 카카오페이, 토스페이, 네이버페이, 가상계좌(무통장입금)
  - **최종 결제 금액 요약 및 결제하기 버튼**: 약관 동의 체크 및 주문 생성 실행

### Component 3: 주문 완료 페이지 (`/checkout/success`)
- [NEW] `src/app/(store)/checkout/success/page.tsx`:
  - 주문 완료 안내 라우트
- [NEW] `src/modules/storefront/presentation/components/checkout-success-view.tsx`:
  - 주문 완료 축하 메시지, 발급된 주문번호, 결제 수단 및 총 결제 금액, 배송지 주소 안내
  - "관리자 콘솔에서 주문 확인하기" 및 "쇼핑 계속하기" 바로가기 버튼

### Component 4: 장바구니(`cart-view.tsx`) 연동
- [MODIFY] `src/modules/storefront/presentation/components/cart-view.tsx`:
  - "주문하기" 버튼 클릭 시 `/checkout` 페이지로 부드럽게 네비게이션

---

## Verification Plan

### Automated Tests
- [NEW] `src/modules/storefront/application/use-cases/__tests__/create-order.usecase.test.ts`:
  - 주문번호 포맷팅, 요약문 생성, 총액 계산, 주문 저장 검증
- [NEW] `src/modules/storefront/presentation/components/__tests__/checkout-view.test.tsx`:
  - 필수 배송 정보 유효성 검사, 결제 수단 선택, 주문 제출 시뮬레이션 테스트
- 전체 테스트 스위트: `npm test` (기존 262개 테스트 무결성 확인)
- Next.js 16 프로덕션 빌드: `npm run build`

### Manual Verification
1. `http://localhost:3000/cart`에서 상품 선택 후 "주문하기" 클릭 -> `/checkout` 진입 확인
2. 배송지(수령인, 연락처, 주소) 입력 및 결제 수단(카카오페이/신용카드) 선택 후 "결제하기" 클릭
3. `/checkout/success` 완료 페이지로 이동하여 발급된 주문번호(`ORD-...`) 확인
4. 관리자 대시보드 `http://localhost:3000/orders` 접속 시 방금 생성한 주문이 목록 최상단에 즉시 노출되는지 검증
