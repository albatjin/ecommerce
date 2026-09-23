# E-Commerce 고객용 웹 서비스(Storefront) 5단계 구축 계획

기존 관리자 대시보드(Backoffice) 및 Supabase 인프라(DB, Storage, Auth)를 그대로 활용하여, 일반 고객들이 접속하여 상품을 탐색하고 구매할 수 있는 **고객용 쇼핑몰(Storefront)**을 단계별로 구축합니다.

사용자 요청에 따라 **각 단계가 완료될 때마다 작업을 멈추고 검증 결과를 보고한 뒤 피드백을 받아 다음 단계로 진행**합니다.

---

## 전체 5단계 로드맵 요약

1. **[현재 진행] 1단계: 쇼핑몰 메인 홈 & 상품 탐색 및 상세 페이지**
   - 쇼핑몰 전용 고객 레이아웃(헤더/푸터/GNB/검색바/카트 뱃지)
   - 메인 홈(프로모션 배너, 추천 상품 그리드, 카테고리 바로가기)
   - 상품 목록 페이지(카테고리 필터, 키워드 검색, 정렬, 반응형 카드)
   - 상품 상세 페이지(이미지 갤러리, 가격/할인율, 옵션/수량 선택, 배송 정보)
2. **2단계: 장바구니(Cart) & 클라이언트 상태 관리**
   - 로컬 스토리지 / 상태 기반 장바구니(수량 증감, 선택 삭제, 총 결제 예상 금액)
   - 헤더 장바구니 뱃지 실시간 동기화 및 슬라이드 오버/모달/페이지
3. **3단계: 주문서 작성 및 결제(Checkout & Order Flow)**
   - 배송지/주문자 정보 입력 폼
   - 결제 모듈 연동(PG 모의/실연동) 및 주문 데이터 Supabase DB 저장
   - 관리자 대시보드 주문 목록에 실시간 반영 검증
4. **4단계: 고객 마이페이지(My Page & Order Tracking)**
   - 로그인 고객의 내 주문 내역 및 배송 상태 추적
   - 비회원 주문 조회(주문번호 + 연락처)
5. **5단계: 권한 및 보안 강화(Role-based Access & Middleware)**
   - Supabase Auth 기반 고객(Customer) vs 관리자(Admin) 권한 분리
   - 일반 고객의 `/dashboard` 접근 통제 및 관리자 전용 라우트 보호

---

## 1단계 세부 계획: 쇼핑몰 메인 홈 & 상품 탐색 및 상세

### User Review (승인 완료)
> 루트 경로(`/`)를 기존 관리자 대시보드 리다이렉트(`redirect('/dashboard')`)에서 **고객용 쇼핑몰 메인 홈**으로 전환합니다.
> 관리자 대시보드는 기존과 동일하게 `/dashboard` 주소로 접속 가능하며, 쇼핑몰 헤더 우측 상단에 관리자 페이지 바로가기 버튼을 배치합니다.

---

### Proposed Changes

#### Component 1: 라우팅 및 쇼핑몰 전용 레이아웃 (Storefront Shell)
- [DELETE] `src/app/page.tsx` (루트 리다이렉트 제거)
- [NEW] `src/app/(store)/layout.tsx`: 쇼핑몰 전용 GNB(헤더), 카테고리 네비게이션, 장바구니/관리자 링크, 푸터
- [NEW] `src/modules/storefront/presentation/components/store-header.tsx`: 로고, 실시간 검색창, 장바구니 아이콘(뱃지), 카테고리 링크
- [NEW] `src/modules/storefront/presentation/components/store-footer.tsx`: 고객센터, 쇼핑몰 정보, 이용약관 안내

#### Component 2: 상품 조회 Application & Domain
- 기존 `src/modules/products/domain/entities/product.ts` 및 `supabase-product.repository.ts` 재활용
- [NEW] `src/modules/storefront/application/use-cases/get-store-products.usecase.ts`: 일반 고객에게 공개 가능한 `ACTIVE` 상태 상품만 필터링 및 카테고리/검색/정렬 제공
- [NEW] `src/modules/storefront/application/use-cases/get-store-product-detail.usecase.ts`: 단일 상품 상세 조회

#### Component 3: 메인 쇼핑몰 홈 (`/`)
- [NEW] `src/app/(store)/page.tsx`: 쇼핑몰 홈 페이지
- [NEW] `src/modules/storefront/presentation/components/hero-banner.tsx`: 프로모션 배너 슬라이드
- [NEW] `src/modules/storefront/presentation/components/category-quick-nav.tsx`: 전자제품, 의류, 식품 등 카테고리 퀵 이동
- [NEW] `src/modules/storefront/presentation/components/featured-products-section.tsx`: 베스트 및 신상품 그리드

#### Component 4: 상품 목록 및 검색/필터 페이지 (`/products`)
- [NEW] `src/app/(store)/products/page.tsx`: 상품 탐색 페이지
- [NEW] `src/modules/storefront/presentation/components/store-product-card.tsx`: 고객 친화적 상품 카드 (이미지 줌, 할인가/원가 강조, 품절 표시, 바로담기)
- [NEW] `src/modules/storefront/presentation/components/store-product-filter.tsx`: 카테고리, 가격대, 정렬(최신순/낮은가격순/높은가격순) 필터

#### Component 5: 상품 상세 페이지 (`/products/[id]`)
- [NEW] `src/app/(store)/products/[id]/page.tsx`: 상세 페이지 (Dynamic Route)
- [NEW] `src/modules/storefront/presentation/components/product-detail-view.tsx`:
  - 다중 이미지 갤러리 뷰어
  - 상품 기본 정보, 가격 및 할인율 배지
  - 재고 상태 표시(정상, 품절 임박, 품절)
  - 수량 증감 버튼 (최대 주문수량 제한)
  - "장바구니 담기" & "바로 구매하기" 버튼 (2단계 연계용 알림 토스트)
  - 상세 설명 탭 (상세 정보, 배송/교환 정책)

---

## Verification Plan

### Automated Tests
- Vitest 단위/통합 테스트
- `npm test` 전체 스위트 통과
- `npm run build` Next.js 빌드 통과

### Manual Verification
- `http://localhost:3000/` 접속 시 쇼핑몰 메인 홈 정상 노출 확인
- 카테고리 클릭 시 `/products?category=...` 필터링 및 검색 작동 확인
- 개별 상품 클릭 시 `/products/[id]` 상세 페이지 진입 및 이미지/옵션/수량 인터랙션 확인
- 헤더의 "관리자 콘솔" 버튼 클릭 시 `/dashboard`로 이동 확인

