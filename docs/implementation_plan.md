# E-Commerce 고객용 웹 서비스(Storefront) 4단계 구현 계획

## 4단계 목표: 마이페이지 (주문 내역 및 배송 추적, My Page & Order Tracking)

고객이 자신이 주문한 상품 내역을 확인하고, 주문 진행 상태(결제완료 → 상품준비 → 배송중 → 배송완료)를 실시간 스텝퍼로 추적하며, 배송지 정보 및 영수증을 확인할 수 있는 **마이페이지 및 배송 추적 시스템**을 구축합니다. 또한 회원 로그인 사용자뿐만 아니라 비회원 주문자도 주문번호와 연락처로 간편하게 주문 상태를 조회할 수 있는 **게스트 주문 조회(Guest Order Lookup)** 기능까지 포함합니다.

---

## User Review Required

> [!IMPORTANT]
> 1. **경로 분리 및 일관성**:
>    - 관리자 주문 관리(`/orders`)와 충돌하지 않도록, 고객용 마이페이지는 **`/mypage`** 및 **`/mypage/orders/[id]`**로 구축합니다.
>    - 비회원도 간편하게 접근할 수 있는 간이 주문 조회 라우트 **`/track`** (주문번호 + 연락처 검색)를 지원합니다.
> 2. **실시간 배송 진행 스텝퍼(Delivery Tracking Stepper)**:
>    - `결제완료` → `상품준비` → `배송중` → `배송완료`의 4단계 실시간 상태 스텝퍼를 고객 화면에 미려하게 렌더링하고, 택배사(CJ대한통운, 우체국 등) 및 송장번호 복사 기능을 제공합니다.
> 3. **헤더 바로가기 연동**:
>    - 고객용 쇼핑몰 헤더(`store-header.tsx`)에 `마이페이지` 및 `주문조회` 내비게이션 링크를 추가하여 접근성을 높입니다.

---

## Proposed Changes

### Component 1: Application Layer (Use Cases & Server Actions)
- [NEW] `src/modules/storefront/application/use-cases/get-my-orders.usecase.ts`:
  - 고객의 주문 목록 조회 (상태, 주문일시, 결제금액, 주문명)
- [NEW] `src/modules/storefront/application/use-cases/track-order.usecase.ts`:
  - 주문번호(`ORD-...`) 또는 ID와 연락처를 기반으로 단건 주문 상세 및 배송 추적 정보 조회
- [NEW] `src/modules/storefront/application/actions/tracking.actions.ts`:
  - Next.js Server Action: 비회원 및 회원 주문 추적용 `lookupOrderAction`

---

### Component 2: 마이페이지 메인 (`/mypage`)
- [NEW] `src/app/(store)/mypage/page.tsx`:
  - 마이페이지 라우트
- [NEW] `src/modules/storefront/presentation/components/mypage-view.tsx`:
  - **고객 요약 헤더**: 회원 등급(VIP), 보유 포인트, 총 주문 건수
  - **주문/배송 목록 탭**: 주문 카드 리스트 (상품 썸네일, 주문번호, 결제금액, 배송 상태 배지, [배송조회], [상세보기] 버튼)
  - **빈 주문 내역 안내 (Empty State)** 및 쇼핑하러 가기 CTA

---

### Component 3: 주문 상세 및 배송 추적 (`/mypage/orders/[id]`)
- [NEW] `src/app/(store)/mypage/orders/[id]/page.tsx`:
  - 주문 상세 및 배송 추적 라우트
- [NEW] `src/modules/storefront/presentation/components/my-order-detail-view.tsx`:
  - **실시간 배송 상태 스텝퍼**: `결제완료` → `상품준비` → `배송중(집하)` → `배송완료` 시각적 진행도 표시
  - **운송장 정보 카드**: 택배사명, 송장번호, 원클릭 복사
  - **주문 상품 목록**: 품목별 단가, 수량, 소계 금액
  - **배송지 정보**: 수령인, 연락처, 주소, 배송 메모
  - **결제 정보 요약**: 결제수단(신용카드, 카카오페이, PayPal 등), 결제 승인 일시, 최종 결제 금액

---

### Component 4: 비회원 주문/배송 간편 조회 (`/track`)
- [NEW] `src/app/(store)/track/page.tsx`:
  - 비회원 주문 조회 라우트
- [NEW] `src/modules/storefront/presentation/components/guest-tracking-view.tsx`:
  - 주문번호 및 연락처 입력 폼
  - 조회 성공 시 즉시 배송 상태 스텝퍼 및 주문 정보 표시

---

### Component 5: 쇼핑몰 헤더 연동 (`store-header.tsx`)
- [MODIFY] `src/modules/storefront/presentation/components/store-header.tsx`:
  - 마이페이지(`User` 아이콘) 및 주문조회 퀵 링크 추가

---

## Verification Plan

### Automated Tests
- [NEW] `src/modules/storefront/application/use-cases/__tests__/get-my-orders.usecase.test.ts`:
  - 주문 목록 조회 및 상태 필터링 단위 테스트
- [NEW] `src/modules/storefront/application/use-cases/__tests__/track-order.usecase.test.ts`:
  - 주문번호/연락처 일치 여부 검증 및 배송 추적 데이터 생성 테스트
- [NEW] `src/modules/storefront/presentation/components/__tests__/mypage-view.test.tsx`:
  - 마이페이지 렌더링, 주문 카드 리스트, 배송 상태 배지 검증
- [NEW] `src/modules/storefront/presentation/components/__tests__/my-order-detail-view.test.tsx`:
  - 배송 진행 스텝퍼 및 송장번호 복사 동작 검증
- [NEW] `src/modules/storefront/presentation/components/__tests__/guest-tracking-view.test.tsx`:
  - 주문번호 조회 폼 제출 및 결과 표시 검증
- **전체 테스트 스위트**: `npm test` (기존 273개 테스트 무결성 유지)
- **Next.js 프로덕션 빌드**: `npm run build`

### Manual Verification
1. 쇼핑몰 헤더에서 [마이페이지] 클릭 시 `/mypage` 진입
2. 3단계에서 결제 완료했던 주문건(`ORD-YYYYMMDD-...`)이 마이페이지 주문 목록 상단에 노출되는지 확인
3. [상세보기] 또는 [배송조회] 클릭 시 `/mypage/orders/[id]`로 이동하여 실시간 배송 스텝퍼와 배송지/결제정보가 정확히 표시되는지 확인
4. `/track` 페이지에서 방금 발급된 주문번호와 연락처를 입력하여 비회원 주문조회가 정상 동작하는지 확인
