---
name: architecture
description: Clean Architecture guidelines and folder structure conventions for Next.js and Supabase e-commerce project
---

# Clean Architecture & Folder Structure Guidelines

This project follows **Clean Architecture** combined with a **Feature-Driven (Vertical Slice)** approach to ensure high cohesion, low coupling, maintainability, and testability.

---

## 1. Core Principles

1. **Dependency Rule (의존성 규칙)**:
   - 의존성은 항상 바깥쪽 계층에서 안쪽 계층(Domain)으로만 향해야 합니다.
   - `Domain` 계층은 React, Next.js, Supabase 등 외부 프레임워크나 라이브러리에 절대 의존하지 않는 순수 TypeScript 코드로 작성합니다.
   - `Application (Use Cases)` 계층은 `Domain` 계층에만 의존하며, 인프라 세부사항은 인터페이스(Repository Ports)를 통해서만 제어합니다.

2. **Dependency Inversion Principle (DIP / 의존성 역전 원칙)**:
   - 비즈니스 로직(Use Case)은 구체적인 Supabase 구현체에 의존하지 않고, Domain 계층의 `Repository Interface`에 의존합니다.
   - 인프라(Supabase) 계층이 이 인터페이스를 구현(Adapter)합니다.

3. **Thin App Router (얇은 라우팅 계층)**:
   - `src/app`은 라우팅, 서버 컴포넌트 엔트리포인트, 레이아웃, 메타데이터 처리만 담당합니다.
   - 복잡한 비즈니스 로직이나 직접적인 DB 쿼리를 `src/app` 내부에 직접 작성하지 않고, 모듈의 Use Case 또는 Presentation 컴포넌트를 조합하여 사용합니다.

---

## 2. Directory Structure

```
src/
├── app/                                # [Next.js App Router] 라우팅 및 페이지 엔트리포인트
│   ├── (auth)/                         # 인증 관련 라우트 그룹 (login, register 등)
│   ├── (dashboard)/                    # 대시보드 관리자 레이아웃 및 하위 라우트
│   │   ├── page.tsx                    # 대시보드 메인 (/dashboard)
│   │   ├── products/                   # 상품 관리 (/products, /products/new)
│   │   ├── orders/                     # 주문 관리 (/orders, /orders/[id])
│   │   ├── customers/                  # 고객 관리 (/customers, /customers/[id])
│   │   ├── sales/                      # 매출/정산 (/sales)
│   │   └── settings/                   # 설정 (/settings)
│   ├── layout.tsx                      # 글로벌 레이아웃
│   └── globals.css
│
├── modules/                            # [도메인 모듈 (Feature-based Clean Architecture)]
│   ├── [domain_name]/                  # e.g., auth, products, orders, customers, sales, settings
│   │   ├── domain/                     # 1. 도메인 계층 (순수 비즈니스 모델 및 인터페이스)
│   │   │   ├── entities/               # 비즈니스 엔티티 모델 (순수 TS 인터페이스/타입)
│   │   │   └── repositories/           # Repository 인터페이스 (Ports)
│   │   │
│   │   ├── application/                # 2. 애플리케이션 계층 (유스케이스 & 비즈니스 흐름)
│   │   │   ├── use-cases/              # 비즈니스 로직 단위 (GetProductsUseCase 등)
│   │   │   └── dto/                    # 입력/출력 데이터 전송 객체 (DTO)
│   │   │
│   │   ├── infrastructure/             # 3. 인프라 계층 (외부 시스템 및 DB 연동)
│   │   │   ├── supabase-[name].repository.ts # Repository 인터페이스 구현체 (Adapters)
│   │   │   └── mappers/                # DB Row <-> Domain Entity 변환기
│   │   │
│   │   └── presentation/               # 4. 프레젠테이션 계층 (UI 컴포넌트 & 훅)
│   │       ├── components/             # 도메인 특화 React 컴포넌트
│   │       └── hooks/                  # 클라이언트 훅 (필요 시)
│   │
│   ├── auth/                           # 인증 및 세션 관리
│   ├── products/                       # 상품 카탈로그, 재고, 상품 등록
│   ├── orders/                         # 주문 목록, 주문 상세, 상태 변경
│   ├── customers/                      # 고객 관리, 고객 상세 정보
│   ├── sales/                          # 매출 분석, 대시보드 통계
│   └── settings/                       # 상점 및 시스템 설정
│
└── shared/                             # [공통 인프라 및 재사용 모듈]
    ├── components/                     # 도메인 무관 공통 UI (Button, Modal, Input, Table 등)
    ├── lib/                            # 라이브러리 설정 및 인프라 공통 유틸
    │   ├── supabase/
    │   │   ├── client.ts               # 브라우저용 Supabase 클라이언트
    │   │   ├── server.ts               # 서버 컴포넌트 / Server Action용 Supabase 클라이언트
    │   │   └── middleware.ts           # 세션 갱신 미들웨어
    │   └── utils.ts                    # 공통 유틸 함수
    ├── types/                          # 전역 공통 타입 (ApiResponse, Pagination 등)
    └── constants/                      # 전역 공통 상수
```

---

## 3. Layer Implementation Rules

### 1) Domain Layer (`src/modules/*/domain/`)
- **규칙**: 순수 TypeScript 코드만 허용됩니다.
- **금지**: React, Next.js, Supabase, 브라우저 API 등 외부 라이브러리 의존성 금지.
- **포함 내용**:
  - `entities/`: 핵심 도메인 모델 정의 (`Product`, `Order`, `Customer` 등).
  - `repositories/`: 데이터 접근을 추상화한 인터페이스 (`IProductRepository` 등).

### 2) Application Layer (`src/modules/*/application/`)
- **규칙**: 애플리케이션의 유스케이스(비즈니스 행위)를 캡슐화합니다.
- **포함 내용**:
  - `use-cases/`: 단일 책임 원칙(SRP)에 따른 실행 함수 또는 클래스 (`GetProductsUseCase`, `CreateOrderUseCase` 등).
  - `dto/`: Use Case 입력/출력 검증 및 타입 정의.
- **원칙**: 구체적인 DB 연동 대신 `domain/repositories` 인터페이스를 주입받아 사용합니다.

### 3) Infrastructure Layer (`src/modules/*/infrastructure/`)
- **규칙**: 외부 시스템과의 실제 통신(Supabase, 결제 PG사 API, 이메일 등)을 처리합니다.
- **포함 내용**:
  - `repositories/`: Domain의 Repository 인터페이스를 구현한 클래스 (`SupabaseProductRepository` 등).
  - `mappers/`: DB 테이블 스키마와 Domain Entity 간의 변환 로직.
- **원칙**: Supabase 쿼리(`supabase.from(...)`)는 반드시 이 계층에만 존재해야 합니다.

### 4) Presentation Layer (`src/modules/*/presentation/`)
- **규칙**: 화면 표시 및 사용자 인터랙션을 담당합니다.
- **포함 내용**:
  - `components/`: 특정 도메인에 종속된 UI 컴포넌트 (테이블, 폼, 상세 뷰 카드 등).
  - `hooks/`: 클라이언트 사이드 상태 및 이벤트 처리 훅.

---

## 4. Next.js App Router Integration Guide

1. **서버 컴포넌트(Server Component)**:
   - 서버 컴포넌트(`page.tsx`)에서 `createServerClient`를 통해 Supabase 인스턴스를 생성하고, Repository와 Use Case를 조합(Dependency Injection)하여 데이터를 조회합니다.
   - 예시:
     ```tsx
     // src/app/(dashboard)/products/page.tsx
     import { createServerClient } from '@/shared/lib/supabase/server';
     import { SupabaseProductRepository } from '@/modules/products/infrastructure/supabase-product.repository';
     import { GetProductsUseCase } from '@/modules/products/application/use-cases/get-products.usecase';
     import { ProductList } from '@/modules/products/presentation/components/product-list';

     export default async function ProductsPage() {
       const supabase = await createServerClient();
       const repository = new SupabaseProductRepository(supabase);
       const getProducts = new GetProductsUseCase(repository);
       const products = await getProducts.execute();

       return <ProductList products={products} />;
     }
     ```

2. **서버 액션(Server Actions)**:
   - 데이터 변경(CUD) 작업 시 `actions.ts` 내에서 유스케이스를 호출하여 처리합니다.
   - 폼 입력 데이터 검증(Zod 등) -> DTO 변환 -> UseCase 실행 -> Revalidate/Redirect 순으로 처리합니다.

---

## 5. Coding Constraints

- **DB 직접 호출 금지**: UI 컴포넌트 내부에서 `supabase.from()`을 직접 호출하지 마십시오.
- **도메인 독립성 준수**: `domain` 디렉터리 내 파일에서 외부 프레임워크 패키지(예: `@supabase/*`, `next/*`, `react`)를 import하지 마십시오.
- **단일 책임 준수**: 하나의 Use Case 파일은 하나의 명확한 작업(예: `CreateProductUseCase`, `UpdateOrderStatusUseCase`)만 수행하도록 분리합니다.

