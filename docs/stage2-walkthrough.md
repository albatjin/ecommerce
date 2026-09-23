# E-Commerce 고객용 웹 서비스(Storefront) 2단계 완료 보고서

> **2단계 목표**: 장바구니(Cart) & 클라이언트 상태 관리 구축 (LocalStorage 영속화, 실시간 헤더 뱃지 동기화, 수량 조절 및 선택 삭제, 주문 금액 계산기)

---

## 1. 주요 구현 내용

### 1) 장바구니 전역 상태 관리 (`CartContext` & `useCart`)
- **파일**: `src/modules/storefront/presentation/context/cart-context.tsx`
- **로컬 스토리지 영속화**: `ecommerce_cart_v1` 키를 통해 새로고침 및 재접속 시에도 장바구니 내용 자동 복원 (비회원/회원 공통 지원)
- **SSR Hydration Mismatch 방지**: 클라이언트 마운트 후 로컬 스토리지 동기화 완료 플래그(`isLoaded`)를 통해 SSR 렌더링 불일치 원천 차단
- **안전 가드 로직**:
  - 품절(Sold Out) 상품 추가 차단
  - 잔여 재고(`stockQuantity`) 및 1회 최대 구매 수량(`maxOrderQuantity`) 초과 방지
- **실시간 계산(Computed Values)**:
  - `totalItemCount`: 전체 품목 수량 합계 (헤더 뱃지용)
  - `selectedItemCount`: 체크박스로 선택된 품목 종류 수
  - `totalRegularPrice`: 정가 총합
  - `totalSalePrice`: 할인 판매가 총합
  - `totalDiscount`: 총 할인 금액
  - `shippingFee`: 무료 배송(0원) 정책
  - `finalPaymentAmount`: 최종 결제 예정 금액

---

### 2) 쇼핑몰 전체 장바구니 연동
- **레이아웃 (`src/app/(store)/layout.tsx`)**:
  - `CartProvider`로 전체 쇼핑몰 뷰를 감싸 전역 공유
- **글로벌 헤더 (`src/modules/storefront/presentation/components/store-header.tsx`)**:
  - `useCart`의 `totalItemCount`를 실시간으로 반영하여 장바구니 뱃지 표시 (수량 변동 시 즉시 갱신)
- **상품 카드 (`src/modules/storefront/presentation/components/store-product-card.tsx`)**:
  - 호버 퀵 액션 "장바구니 담기" 클릭 시 즉시 1개 추가 및 녹색 "담김 완료!" 시각 피드백 제공
- **상품 상세 뷰 (`src/modules/storefront/presentation/components/product-detail-view.tsx`)**:
  - 선택한 수량만큼 장바구니에 담기 및 "장바구니 가기" 링크 버튼이 포함된 토스트 알림 연동

---

### 3) 장바구니 전용 페이지 (`/cart`)
- **라우트**: `src/app/(store)/cart/page.tsx`
- **뷰 컴포넌트**: `src/modules/storefront/presentation/components/cart-view.tsx`
  - **Empty State**: 장바구니가 비었을 때 안내 아이콘 및 "인기 상품 둘러보기" 링크 제공
  - **선택 및 관리 컨트롤**: 전체 선택 체크박스, 선택 삭제, 전체 비우기
  - **아이템 리스트**: 체크박스, 썸네일 이미지, 상품명/카테고리, 단가 및 할인율, `[-]` `[+]` 수량 조절기, 품목별 소계 금액, 개별 삭제(`Trash2`) 버튼
  - **주문 예상 금액 패널 (Sticky Card)**: 총 상품금액, 총 할인금액, 무료 배송 안내, 최종 결제 예정 금액, "{N}개 상품 주문하기" CTA 버튼

---

## 2. 검증 결과 (Verification Results)

### 1) 단위 및 통합 테스트 (`vitest`)
```bash
Test Files  73 passed (73)
Tests       262 passed (262)
Duration    13.41s
```
- 장바구니 전용 테스트 2개 파일, 9개 테스트 신규 작성 및 100% 통과:
  - `cart-context.test.tsx` (5개 테스트): 추가, 수량 누적, 품절 방지, 수량 한도 가드, 선택 토스트 및 결제금액 계산
  - `cart-view.test.tsx` (4개 테스트): 빈 장바구니 렌더링, 아이템 목록 렌더링, 수량 증감 인터랙션, 삭제 동작
- 기존 대시보드 및 스토어프론트 71개 파일 253개 테스트도 **회귀(Regression) 없이 100% 정상 통과**

### 2) Next.js 16 프로덕션 빌드 (`npm run build`)
```text
Route (app)
┌ ƒ /                      # 쇼핑몰 메인 홈
├ ○ /_not-found
├ ○ /cart                  # [NEW] 장바구니 페이지
├ ƒ /customers             # 관리자 고객 관리
├ ƒ /dashboard             # 관리자 대시보드
├ ○ /login                 # 로그인
├ ƒ /orders                # 관리자 주문 관리
├ ƒ /products              # 관리자 상품 관리
├ ƒ /sales                 # 관리자 매출 통계
├ ƒ /settings              # 관리자 설정
├ ƒ /shop                  # 쇼핑몰 상품 목록 / 검색 / 필터
└ ƒ /shop/[id]             # 쇼핑몰 상품 상세 페이지
```
프로덕션 빌드 오류 없이 성공 완료 (Exit Code 0).

