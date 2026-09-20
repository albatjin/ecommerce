export interface AuthUserProps {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'manager' | 'staff' | 'customer';
  avatarUrl?: string | null;
}

export class AuthUser {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly role: 'super_admin' | 'admin' | 'manager' | 'staff' | 'customer';
  readonly avatarUrl?: string | null;

  constructor(props: AuthUserProps) {
    this.id = props.id;
    this.email = props.email;
    this.name = props.name;
    this.role = props.role;
    this.avatarUrl = props.avatarUrl;
  }

  get isAdmin(): boolean {
    return ['super_admin', 'admin', 'manager', 'staff'].includes(this.role);
  }
}

