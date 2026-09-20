---
name: tech-stack
description: Technology stack guidelines, dependencies, package conventions, and Supabase integration rules for Next.js e-commerce project
---

# Tech Stack Guidelines & Conventions

본 문서는 본 이커머스 프로젝트에서 사용하는 **핵심 기술 스택(Tech Stack)** 정의와 라이브러리 사용 규약 및 **Supabase + Next.js 16 (App Router)** 연동 규칙을 정의합니다.

---

## 1. 확정 기술 스택 (Core Technology Stack)

| 영역 | 기술 / 라이브러리 | 버전 / 사양 | 비고 |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js (App Router) | `16.x` | Turbopack 기본 활성화 |
| **Core UI** | React / React-DOM | `19.x` | Actions, useActionState, useOptimistic 지원 |
| **Language** | TypeScript | `5.x` | Strict Mode 활성화 |
| **Database & Auth** | Supabase | `@supabase/supabase-js`, `@supabase/ssr` | 최신 SSR 패키지 표준 준수 |
| **Styling** | Tailwind CSS | `v4.x` | `@tailwindcss/postcss` 기반 설정 |
| **Data Validation** | Zod | `^3.x` | DTO, 폼 입력, Server Action 검증 |
| **Icons** | Lucide React | `^0.x` | 표준 UI 아이콘 세트 |
| **Package Manager** | npm | `11.x` / Node 24.x | 일관된 `package-lock.json` 유지 |

---

## 2. Supabase 연동 표준 규칙 (Next.js App Router SSR)

### 1) 패키지 선택 기준
> [!IMPORTANT]
> 구버전 패키지인 `@supabase/auth-helpers-nextjs`는 **절대 사용하지 않습니다.**
> 반드시 최신 공식 표준인 **`@supabase/supabase-js`** 및 **`@supabase/ssr`**을 사용합니다.

### 2) 3-Tier 클라이언트 분리 원칙 (`src/shared/lib/supabase/`)
Next.js App Router의 런타임 환경에 따라 반드시 분리된 클라이언트 팩토리를 사용해야 세션 쿠키가 정상 동기화됩니다.

1. **브라우저 클라이언트 (`client.ts`)**:
   - 클라이언트 컴포넌트(`'use client'`)에서 사용.
   - `createBrowserClient` 사용.
2. **서버 클라이언트 (`server.ts`)**:
   - 서버 컴포넌트(`page.tsx`), Server Actions, Route Handlers에서 사용.
   - `createServerClient`를 사용하며, Next.js 16 규격에 맞게 `const cookieStore = await cookies()` 비동기 처리를 준수합니다.
3. **미들웨어 (`middleware.ts`)**:
   - 세션 토큰 갱신 및 보호된 라우트 접근 제어 담당.

```typescript
// 예시: src/shared/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/shared/types/database.types';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component에서는 쿠키를 직접 쓸 수 없으므로 무시 처리
          }
        },
      },
    }
  );
}
```

### 3) 타입 생성 및 타입 바인딩 (`Database` Types)
- Supabase CLI 또는 대시보드에서 생성된 데이터베이스 타입을 `src/shared/types/database.types.ts`에 보관합니다.
- 모든 Supabase 클라이언트는 `createClient<Database>` 제네릭을 지정하여 테이블, 컬럼, RPC 호출 시 100% 자동완성과 컴파일 타임 타입 검증을 보장합니다.

### 4) 보안 및 RLS (Row Level Security) 원칙
> [!CAUTION]
> Supabase의 모든 테이블은 반드시 **RLS(Row Level Security)**를 활성화해야 합니다.

- **Anon Key**: 브라우저에 노출되는 공개 키(`NEXT_PUBLIC_SUPABASE_ANON_KEY`)는 오직 RLS 정책에 의해 허가된 작업만 수행할 수 있습니다.
- **Service Role Key**: 관리자 전용 우회 키(`SUPABASE_SERVICE_ROLE_KEY`)는 **절대 `NEXT_PUBLIC_` 접두사를 붙이지 않고**, 오직 백엔드 서버 환경(`server-only`)에서만 안전하게 사용해야 합니다.

---

## 3. 환경 변수 컨벤션 (`.env.local`)

```env
# [공개 키 - 브라우저 노출 가능]
NEXT_PUBLIC_SUPABASE_URL=https://<project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...

# [비밀 키 - 서버 환경에서만 접근 가능 / 절대 NEXT_PUBLIC_ 금지]
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
```

---

## 4. 상태 관리 및 데이터 흐름 가이드

1. **서버 데이터 (Server State)**:
   - 복잡한 전역 상태 라이브러리(Redux 등) 대신, **Next.js Server Components**에서 직접 페칭하고, 데이터 변경은 **Server Actions** + `revalidatePath()`를 기본으로 합니다.
2. **URL 기반 상태 (URL State)**:
   - 이커머스에서 필수적인 필터(카테고리, 가격대), 정렬, 페이지네이션, 검색어는 항상 URL 쿼리 파라미터(`searchParams`)를 Single Source of Truth로 관리하여 북마크와 뒤로 가기를 보장합니다.
3. **클라이언트 폼 및 인터랙션 상태 (Client State)**:
   - React 19의 내장 훅(`useActionState`, `useOptimistic`)을 우선 활용합니다.
   - 장바구니(Cart)나 다이얼로그 모달 등 클라이언트 전역 상태가 필요한 경우에만 최소한의 경량 라이브러리(`zustand`)를 도입합니다.

---

## 5. 의존성 추가 규칙

새로운 라이브러리를 추가할 때는 아래 3가지 기준을 검토한 후 설치합니다:
1. **React 19 호환성**: peerDependencies가 React 19를 지원하는지 확인.
2. **번들 크기 및 트리쉐이킹**: 가급적 모듈러한 패키지(예: `lodash` 대신 `es-toolkit` 또는 바닐라 TS)를 선택.
3. **패키지 매니저 준수**: 항상 `npm install <package>` 명령어로 설치하여 `package-lock.json`을 단일하게 유지.

