import { createContext } from 'react';
import type { User } from 'firebase/auth';

export type AdminRole = 'super_admin' | 'manager' | 'broker' | 'viewer';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  compound?: string;
  createdAt: Date;
}

export interface AuthContextType {
  user: AdminUser | null;
  firebaseUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
