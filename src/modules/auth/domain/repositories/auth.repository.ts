import { AuthUser } from '../entities/auth-user';

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupCredentials {
  email: string;
  password: string;
  name: string;
}

export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<AuthUser>;
  signup(credentials: SignupCredentials): Promise<AuthUser>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<AuthUser | null>;
}

