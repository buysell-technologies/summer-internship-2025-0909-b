import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { jwtDecode } from 'jwt-decode';

interface JWTPayload {
  sub: string;
  name: string;
  store_id: string;
  iat: number;
}

interface AuthContextType {
  token: string | null;
  userId: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(() => {
    return (
      localStorage.getItem('authToken') ||
      import.meta.env.VITE_API_AUTH_TOKEN ||
      null
    );
  });
  const navigate = useNavigate();

  const login = useCallback(
    (newToken: string) => {
      localStorage.setItem('authToken', newToken);
      setToken(newToken);
      navigate({ to: '/' });
    },
    [navigate],
  );

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    setToken(null);
    navigate({ to: '/login' });
  }, [navigate]);

  const userId = useMemo(() => {
    if (!token) return null;
    try {
      const decoded = jwtDecode<JWTPayload>(token);
      return decoded.sub;
    } catch {
      return null;
    }
  }, [token]);

  const value = {
    token,
    userId,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
