# E-Commerce 고객용 웹 서비스(Storefront) 2단계 구현 계획

## 2단계 목표: 장바구니(Cart) & 클라이언트 상태 관리 구축

고객이 쇼핑몰 홈, 상품 목록, 상품 상세 페이지에서 상품을 탐색하고 장바구니에 담으면, 브라우저 로컬 스토리지와 전역 상태로 안전하게 보관되고, 헤더의 장바구니 뱃지와 실시간 동기화되며, 장바구니 페이지(`/cart`)에서 수량 변경, 선택 삭제, 주문 예상 금액을 확인할 수 있도록 구현합니다.

---

## User Review Required
> [!IMPORTANT]
> 1. **비회원/회원 공통 지원**: 장바구니는 사용자가 로그인하지 않아도 쇼핑을 계속할 수 있도록 `LocalStorage`(`ecommerce_cart_v1`)에 자동 영속화됩니다.
> 2. **재고 및 최대 주문 수량 가드**: 상품별 잔여 재고 및 `maxOrderQuantity`를 초과하여 담을 수 없도록 방어 로직이 적용됩니다.
> 3. **배송비 정책**: 1단계 UI와 일관되게 기본 "무료 배송(0원)" 혜택이 적용되며, 추후 조건부 정책으로 확장이 가능합니다.

---

## Proposed Changes

### Component 1: 장바구니 전역 상태 관리 (Cart Context & LocalStorage Persistence)
- [NEW] `src/modules/storefront/presentation/context/cart-context.tsx`:
  - `CartItem` 인터페이스 (상품 정보, 가격, 선택 수량, 재고 제한, 체크박스 선택 여부 `selected`)
  - `useCart()` 커스텀 훅 제공
  - 액션: `addItem(product, qty)`, `removeItem(id)`, `updateQuantity(id, qty)`, `toggleSelect(id)`, `toggleSelectAll(checked)`, `removeSelected()`, `clearCart()`
  - 계산된 값(Computed): `totalItemCount`(헤더 뱃지용), `selectedItemCount`, `totalRegularPrice`, `totalSalePrice`, `totalDiscount`, `shippingFee`, `finalPaymentAmount`
  - SSR Hydration Mismatch 방지 처리 (클라이언트 마운트 후 로컬 스토리지 동기화)

### Component 2: 쇼핑몰 레이아웃 및 기존 컴포넌트 장바구니 연동
- [MODIFY] `src/app/(store)/layout.tsx`:
  - `CartProvider`로 전체 쇼핑몰 뷰를 감싸 전역 상태 제공
- [MODIFY] `src/modules/storefront/presentation/components/store-header.tsx`:
  - `useCart()`의 `totalItemCount`를 연결하여 장바구니 뱃지 실시간 표시
- [MODIFY] `src/modules/storefront/presentation/components/store-product-card.tsx`:
  - "장바구니 담기" 퀵 버튼 클릭 시 실제 `cart.addItem()` 호출 및 담김 피드백 안내
- [MODIFY] `src/modules/storefront/presentation/components/product-detail-view.tsx`:
  - 선택한 수량(`quantity`)만큼 `cart.addItem()` 호출 및 "장바구니로 이동하기" 링크가 포함된 토스트 알림 제공

### Component 3: 장바구니 전용 페이지 (`/cart`)
- [NEW] `src/app/(store)/cart/page.tsx`:
  - 장바구니 페이지 라우트
- [NEW] `src/modules/storefront/presentation/components/cart-view.tsx`:
  - **상단 컨트롤**: 전체 선택 체크박스, 선택 삭제 버튼, 장바구니 품목 수
  - **아이템 리스트**: 체크박스, 상품 썸네일, 카테고리/상품명, 단가, 수량 증감 버튼(`-`/`+`), 품목별 소계 금액, 개별 삭제(`X`) 버튼
  - **주문 요약 패널(Sticky Side Card)**: 총 상품 금액, 총 할인 금액, 배송비, 최종 결제 예정 금액, "주문서 작성하기" CTA 버튼 (3단계 Checkout 연결 준비)
  - **Empty State**: 장바구니가 비었을 때 "장바구니가 비어 있습니다" 친절한 일러스트/아이콘 및 "인기 상품 둘러보기" 버튼

---

## Verification Plan

### Automated Tests
- [NEW] `src/modules/storefront/presentation/context/__tests__/cart-context.test.tsx`:
  - 아이템 추가, 수량 변경, 삭제, 전체 선택/해제, 총 결제 금액 계산 로직 테스트
- [NEW] `src/modules/storefront/presentation/components/__tests__/cart-view.test.tsx`:
  - 장바구니 목록 렌더링, 수량 증감 버튼 클릭, 선택 삭제, 주문 요약 금액 렌더링 테스트
- 전체 테스트 스위트 실행: `npm test`
- Next.js 16 프로덕션 빌드: `npm run build`

### Manual Verification
- `http://localhost:3000` 메인 및 `/shop`에서 상품의 "장바구니 담기" 클릭 시 헤더 장바구니 뱃지 수량 실시간 증가 확인
- `http://localhost:3000/shop/[id]` 상세 페이지에서 수량 2개 선택 후 담기 시 장바구니에 2개 반영 확인
- `http://localhost:3000/cart` 접속 시 담긴 상품 리스트, 체크박스 선택/해제에 따른 최종 결제 금액 실시간 변동 확인
- 브라우저를 새로고침해도 로컬 스토리지에 장바구니 내용이 그대로 보존되는지 확인
