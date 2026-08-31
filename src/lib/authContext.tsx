'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, RoleName } from '@crm/types';
import { adminApi } from './api';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const savedUser = localStorage.getItem('crm_admin_user');
    const savedToken = localStorage.getItem('crm_admin_access_token');

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await adminApi.post('/auth/login', { email, password });
      if (res.data.success) {
        const { accessToken, user: authUser } = res.data.data;
        localStorage.setItem('crm_admin_access_token', accessToken);
        localStorage.setItem('crm_admin_user', JSON.stringify(authUser));
        setUser(authUser);
        router.push('/dashboard');
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('crm_admin_access_token');
    localStorage.removeItem('crm_admin_user');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
