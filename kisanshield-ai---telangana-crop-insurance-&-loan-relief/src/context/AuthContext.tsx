import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserRole } from '../types';

export type DemoAccountType = 'farmer1' | 'farmer2' | 'bank1' | 'bank2' | 'bank_unverified';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  loginAsDemo: (role: UserRole) => Promise<void>;
  loginAsSpecificDemo: (account: DemoAccountType) => Promise<void>;
  verifyBankCode: (code: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('kisanshield_token');
      if (savedToken) {
        try {
          const resp = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${savedToken}` },
          });
          if (resp.ok) {
            const data = await resp.json();
            setUser(data.user);
            setToken(savedToken);
          } else {
            // Token expired or invalid
            localStorage.removeItem('kisanshield_token');
            localStorage.removeItem('kisanshield_user');
            setUser(null);
            setToken(null);
          }
        } catch {
          // If server is starting up, fall back to cached user
          const savedUser = localStorage.getItem('kisanshield_user');
          if (savedUser) {
            setUser(JSON.parse(savedUser));
            setToken(savedToken);
          }
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      const resp = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.error || 'Login failed');
      }
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('kisanshield_token', data.token);
      localStorage.setItem('kisanshield_user', JSON.stringify(data.user));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (formData: any) => {
    setIsLoading(true);
    try {
      const resp = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('kisanshield_token', data.token);
      localStorage.setItem('kisanshield_user', JSON.stringify(data.user));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('kisanshield_token');
    localStorage.removeItem('kisanshield_user');
  };

  const loginAsDemo = async (role: UserRole) => {
    if (role === 'FARMER') {
      await login('farmer@kisanshield.in', 'farmer123', 'FARMER');
    } else {
      await login('bank@telanganagrameena.in', 'bank123', 'BANK');
    }
  };

  const loginAsSpecificDemo = async (account: DemoAccountType) => {
    switch (account) {
      case 'farmer1':
        await login('farmer@kisanshield.in', 'farmer123', 'FARMER');
        break;
      case 'farmer2':
        await login('ramesh@kisanshield.in', 'farmer456', 'FARMER');
        break;
      case 'bank1':
        await login('bank@telanganagrameena.in', 'bank123', 'BANK');
        break;
      case 'bank2':
        await login('srinivas@apexbank.telangana.gov.in', 'bank456', 'BANK');
        break;
      case 'bank_unverified':
        await login('pending.reviewer@gmail.com', 'pending123', 'BANK');
        break;
    }
  };

  const verifyBankCode = async (verificationCode: string) => {
    if (!token) return;
    const resp = await fetch('/api/bank/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ verificationCode }),
    });
    const data = await resp.json();
    if (!resp.ok) {
      throw new Error(data.error || 'Verification failed');
    }
    setUser(data.user);
    localStorage.setItem('kisanshield_user', JSON.stringify(data.user));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        loginAsDemo,
        loginAsSpecificDemo,
        verifyBankCode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
