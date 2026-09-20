import { describe, it, expect } from 'vitest';
import { AuthUser } from '../auth-user';

describe('AuthUser Entity (Unit Test)', () => {
  it('AuthUser 엔티티를 생성하고 속성을 정상 반환한다', () => {
    const user = new AuthUser({
      id: 'user-1',
      email: 'admin@commercehub.co.kr',
      name: '김은영',
      role: 'admin',
      avatarUrl: 'https://example.com/avatar.png',
    });

    expect(user.id).toBe('user-1');
    expect(user.email).toBe('admin@commercehub.co.kr');
    expect(user.name).toBe('김은영');
    expect(user.role).toBe('admin');
    expect(user.avatarUrl).toBe('https://example.com/avatar.png');
    expect(user.isAdmin).toBe(true);
  });

  it('일반 고객(customer)인 경우 isAdmin이 false를 반환한다', () => {
    const user = new AuthUser({
      id: 'cust-1',
      email: 'customer@gmail.com',
      name: '홍길동',
      role: 'customer',
    });

    expect(user.isAdmin).toBe(false);
  });

  it('super_admin, manager, staff 역할도 isAdmin이 true를 반환한다', () => {
    const roles: Array<'super_admin' | 'manager' | 'staff'> = ['super_admin', 'manager', 'staff'];
    for (const role of roles) {
      const user = new AuthUser({
        id: 'u-1',
        email: `${role}@test.com`,
        name: role,
        role,
      });
      expect(user.isAdmin).toBe(true);
    }
  });
});

