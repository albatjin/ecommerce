import { describe, it, expect } from 'vitest';
import { isAdminRole, hasPermission, getRoleLabel } from '../rbac.service';

describe('RBAC Service', () => {
  describe('isAdminRole', () => {
    it('관리자 그룹 역할들에 대해 true를 반환한다', () => {
      expect(isAdminRole('super_admin')).toBe(true);
      expect(isAdminRole('admin')).toBe(true);
      expect(isAdminRole('manager')).toBe(true);
      expect(isAdminRole('staff')).toBe(true);
    });

    it('고객, 게스트, null 또는 정의되지 않은 역할에 대해 false를 반환한다', () => {
      expect(isAdminRole('customer')).toBe(false);
      expect(isAdminRole('guest')).toBe(false);
      expect(isAdminRole(null)).toBe(false);
      expect(isAdminRole(undefined)).toBe(false);
      expect(isAdminRole('unknown')).toBe(false);
    });
  });

  describe('hasPermission', () => {
    it('super_admin과 admin은 모든 리소스에 대해 생성/수정/삭제 권한을 갖는다', () => {
      expect(hasPermission('super_admin', 'settings', 'delete')).toBe(true);
      expect(hasPermission('admin', 'products', 'delete')).toBe(true);
      expect(hasPermission('admin', 'orders', 'export')).toBe(true);
    });

    it('staff는 상품 등록 및 주문 수정이 가능하지만 매출 및 설정 접근은 불가하다', () => {
      expect(hasPermission('staff', 'products', 'create')).toBe(true);
      expect(hasPermission('staff', 'orders', 'update')).toBe(true);
      expect(hasPermission('staff', 'sales', 'read')).toBe(false);
      expect(hasPermission('staff', 'settings', 'read')).toBe(false);
    });

    it('customer는 관리자 리소스(products 생성, orders 수정 등)에 접근할 수 없다', () => {
      expect(hasPermission('customer', 'products', 'read')).toBe(true);
      expect(hasPermission('customer', 'products', 'create')).toBe(false);
      expect(hasPermission('customer', 'orders', 'update')).toBe(false);
      expect(hasPermission('customer', 'settings', 'read')).toBe(false);
      expect(hasPermission('customer', 'storefront', 'create')).toBe(true);
    });

    it('게스트는 storefront 상품 열람 및 비회원 장바구니 생성이 가능하다', () => {
      expect(hasPermission(null, 'storefront', 'read')).toBe(true);
      expect(hasPermission(undefined, 'settings', 'read')).toBe(false);
    });
  });

  describe('getRoleLabel', () => {
    it('역할 코드를 한글 직관적인 라벨로 변환한다', () => {
      expect(getRoleLabel('super_admin')).toBe('최고 관리자');
      expect(getRoleLabel('admin')).toBe('관리자');
      expect(getRoleLabel('manager')).toBe('운영 매니저');
      expect(getRoleLabel('staff')).toBe('일반 스태프');
      expect(getRoleLabel('customer')).toBe('일반 회원');
      expect(getRoleLabel(null)).toBe('게스트 / 비회원');
    });
  });
});

