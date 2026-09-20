---
name: nextjs-framework
description: Best practices, coding standards, and architectural conventions for Next.js App Router (React 19)
---

# Next.js Framework Best Practices & Coding Guidelines

본 문서는 **Next.js 16 (App Router)** 및 **React 19** 기반 환경에서 안정적이고 확장 가능한 코드를 작성하기 위한 프레임워크 전용 규칙입니다.

---

## 1. 핵심 설계 철학 (Core Philosophies)

### 1) Server Components 우선 (Default to Server Components)
> [!IMPORTANT]
> Next.js App Router의 모든 컴포넌트는 기본적으로 **Server Component**로 동작합니다. 꼭 필요한 경우에만 `'use client'` 지시어를 선언하십시오.

- **`'use client'`를 사용하는 유일한 경우**:
  - `useState`, `useReducer`, `useEffect`, `useContext` 등 React 훅이 필요한 경우
  - `onClick`, `onChange`, `onSubmit` 등 브라우저 이벤트 리스너가 필요한 경우
  - 브라우저 전용 API(`window`, `document`, `localStorage`, `navigator` 등)를 호출하는 경우
  - 클라이언트 전용 라이브러리(차트, 드래그 앤 드롭 등)를 사용하는 경우
- **Client Boundary 최적화**:
  - 페이지 전체(`page.tsx`)를 `'use client'`로 만들지 마십시오.
  - 클라이언트 인터랙션이 필요한 말단(Leaf) 컴포넌트로 `'use client'` 범위를 좁히고, 데이터 페칭 및 정적 레이아웃은 Server Component로 유지하십시오.

### 2) 간결하고 가독성 높은 코드 (Readable & Concise Code)
- **Early Return 패턴**: 깊은 `if-else` 중첩을 피하고 조기 반환(`early return`)을 통해 코드의 흐름을 평탄하게 유지합니다.
- **명시적인 네이밍 컨벤션**:
  - React 컴포넌트: `PascalCase` (예: `ProductCard.tsx`, `OrderSummary.tsx`)
  - 훅: `use` 접두사 + `camelCase` (예: `useCart.ts`, `useProductFilter.ts`)
  - 유틸/서버 함수: 동사 기반 `camelCase` (예: `formatCurrency.ts`, `calculateTax.ts`)
  - 환경변수 및 상수: `UPPER_SNAKE_CASE` (예: `DEFAULT_PAGE_SIZE`)
- **타입 안전성**: `any` 사용을 지양하고, 외부 입력 데이터는 Zod 스키마 또는 명확한 TypeScript 인터페이스를 통해 타입을 보장합니다.

### 3) 파일 분할 및 단일 책임 원칙 (SRP)
- **파일 크기 기준**: 단일 파일의 코드 길이는 가급적 **150~200줄 이내**로 유지합니다.
- **분리 기준**:
  - 하나의 컴포넌트에 하위 서브 UI가 많아지면 별도의 컴포넌트 파일로 분리합니다.
  - 컴포넌트 내부에 복잡한 상태 계산 로직이 2개 이상 존재하면 커스텀 훅(`use*.ts`)으로 추출합니다.
  - 서버 액션이나 데이터 변환 로직은 `actions.ts`, `mapper.ts` 등으로 분리합니다.

---

## 2. 추천 추가 규칙 (Recommended Best Practices)

### 4) Server Actions 및 데이터 변환 안전성
> [!WARNING]
> Server Action은 외부에 공개된 POST API 엔드포인트와 동일하게 취급되어야 합니다. 누구나 호출할 수 있다는 전제로 보안 검증을 수행하십시오.

- 파일 상단에 `'use server'`를 선언하여 서버 전용 함수임을 명시합니다.
- **입력 데이터 검증**: 폼이나 클라이언트에서 전달받은 `formData` 또는 객체는 반드시 서버 측에서 검증(Zod 등)을 거칩니다.
- **인증 및 인가 검증**: 액션 실행 전 세션(`supabase.auth.getUser()`)을 확인하여 사용자의 권한을 체크합니다.
- **서버 전용 코드 격리**: DB 비밀키나 서버 로직이 클라이언트로 번들링되지 않도록 필요 시 `import 'server-only'`를 적극 활용합니다.

```typescript
// 예시: src/modules/products/application/actions/create-product.action.ts
'use server';

import 'server-only';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const CreateProductSchema = z.object({
  name: z.string().min(2),
  price: z.number().positive(),
});

export async function createProductAction(formData: FormData) {
  // 1. 입력 검증
  const validated = CreateProductSchema.parse({
    name: formData.get('name'),
    price: Number(formData.get('price')),
  });

  // 2. 비즈니스 로직 / Use Case 실행
  // ...

  // 3. 캐시 갱신
  revalidatePath('/products');
}
```

### 5) Suspense와 스트리밍 로딩 (Progressive Loading)
- 페이지 전체 로딩을 막기 위해 폭포수(Waterfall) 데이터 조회를 피하고, 병렬 처리(`Promise.all`)를 적용합니다.
- 무거운 데이터 페칭 블록은 `<Suspense fallback={<Skeleton />}>`으로 감싸 점진적으로 렌더링되도록 구현합니다.
- Next.js의 특수 파일 규약을 적극 활용합니다:
  - `loading.tsx`: 라우트 단위 스켈레톤 UI
  - `error.tsx`: 런타임 에러 격리 (`'use client'` 필수 선언 및 `reset` 함수 제공)
  - `not-found.tsx`: 404 리소스 없음 안내 화면

### 6) Next.js 내장 최적화 컴포넌트 활용
- **이미지 최적화 (`next/image`)**:
  - 일반 `<img>` 태그 대신 반드시 `next/image`의 `<Image />`를 사용합니다.
  - LCP(Largest Contentful Paint) 대상 메인 배너/히어로 이미지는 `priority` 속성을 지정합니다.
  - 반응형 이미지에는 `sizes` 속성을 지정하여 과도한 해상도 로딩을 방지합니다.
- **네비게이션 최적화 (`next/link`)**:
  - 클라이언트 라우팅에는 `<a>` 태그 대신 `<Link href="...">`를 사용합니다.
- **폰트 최적화 (`next/font`)**:
  - Google Fonts나 로컬 폰트는 `next/font`를 통해 빌드 시 자동 최적화되도록 설정합니다.

### 7) Next.js 16 캐싱 및 재검증 전략 (Caching & Revalidation)
- Next.js 15+는 기본 `fetch` 캐시가 `no-store`에 준하는 형태로 동작하므로, 캐시가 필요한 데이터는 명시적으로 제어합니다.
- 데이터 변경(Server Action) 완료 후 변경된 경로의 캐시를 즉시 갱신하기 위해 `revalidatePath()` 또는 `revalidateTag()`를 반드시 호출합니다.

---

## 3. 라우팅 및 컴포넌트 작성 체크리스트

| 항목 | 점검 내용 |
| :--- | :--- |
| **Server Component** | 컴포넌트가 불필요하게 `'use client'`를 선언하고 있지 않은가? |
| **Client Boundary** | `'use client'` 선언 파일이 트리 최상단(페이지 전체)을 감싸고 있지 않은가? |
| **파일 길이** | 파일 길이가 200줄을 초과하지 않고 책임이 잘 분리되어 있는가? |
| **Server Action** | 클라이언트 입력값 검증과 인증 체크가 누락되지 않았는가? |
| **에러 및 로딩** | `loading.tsx`와 `error.tsx` 또는 `Suspense` 처리가 적절히 구성되었는가? |
| **Next/Image** | `<img>` 대신 `<Image />`를 사용하고 레이아웃 시프트(CLS)를 방지했는가? |

