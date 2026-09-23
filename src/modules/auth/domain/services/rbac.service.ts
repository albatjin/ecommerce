export type UserRole = 'super_admin' | 'admin' | 'manager' | 'staff' | 'customer' | 'guest';

export type Resource = 'products' | 'orders' | 'customers' | 'sales' | 'settings' | 'storefront';

export type Action = 'read' | 'create' | 'update' | 'delete' | 'export';

/**
 * 역할별 권한 정의 매트릭스
 */
const ROLE_PERMISSIONS: Record<UserRole, Record<Resource, Action[]>> = {
  super_admin: {
    products: ['read', 'create', 'update', 'delete', 'export'],
    orders: ['read', 'create', 'update', 'delete', 'export'],
    customers: ['read', 'create', 'update', 'delete', 'export'],
    sales: ['read', 'create', 'update', 'delete', 'export'],
    settings: ['read', 'create', 'update', 'delete', 'export'],
    storefront: ['read', 'create', 'update', 'delete', 'export'],
  },
  admin: {
    products: ['read', 'create', 'update', 'delete', 'export'],
    orders: ['read', 'create', 'update', 'delete', 'export'],
    customers: ['read', 'create', 'update', 'delete', 'export'],
    sales: ['read', 'create', 'update', 'export'],
    settings: ['read', 'create', 'update', 'delete'],
    storefront: ['read', 'create', 'update'],
  },
  manager: {
    products: ['read', 'create', 'update'],
    orders: ['read', 'create', 'update', 'export'],
    customers: ['read', 'create', 'update'],
    sales: ['read', 'export'],
    settings: ['read'],
    storefront: ['read', 'create', 'update'],
  },
  staff: {
    products: ['read', 'create', 'update'],
    orders: ['read', 'update'],
    customers: ['read'],
    sales: [],
    settings: [],
    storefront: ['read'],
  },
  customer: {
    products: ['read'],
    orders: [],
    customers: [],
    sales: [],
    settings: [],
    storefront: ['read', 'create', 'update'], // 장바구니/주문 생성 등
  },
  guest: {
    products: ['read'],
    orders: [],
    customers: [],
    sales: [],
    settings: [],
    storefront: ['read', 'create'], // 비회원 조회, 장바구니 등
  },
};

/**
 * 관리자 권한 그룹 확인 (super_admin, admin, manager, staff)
 */
export function isAdminRole(role?: string | null): boolean {
  if (!role) return false;
  return ['super_admin', 'admin', 'manager', 'staff'].includes(role);
}

/**
 * 특정 역할이 지정된 리소스에 대해 특정 작업을 수행할 수 있는지 검사
 */
export function hasPermission(role: UserRole | string | undefined | null, resource: Resource, action: Action): boolean {
  if (!role) {
    return ROLE_PERMISSIONS.guest[resource]?.includes(action) ?? false;
  }

  const validRole = role as UserRole;
  const permissions = ROLE_PERMISSIONS[validRole];
  if (!permissions) {
    return false;
  }

  return permissions[resource]?.includes(action) ?? false;
}

/**
 * 역할의 한글 표시명
 */
export function getRoleLabel(role?: string | null): string {
  switch (role) {
    case 'super_admin':
      return '최고 관리자';
    case 'admin':
      return '관리자';
    case 'manager':
      return '운영 매니저';
    case 'staff':
      return '일반 스태프';
    case 'customer':
      return '일반 회원';
    default:
      return '게스트 / 비회원';
  }
}

