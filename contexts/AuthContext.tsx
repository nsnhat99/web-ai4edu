import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import type { User } from '../types';
import * as api from '../api';

interface AuthContextType {
  currentUser: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  /** true cho tới khi kiểm tra xong cookie session lúc mở trang. */
  isRestoringSession: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRestoringSession, setIsRestoringSession] = useState(true);

  // Phiên nằm trong cookie httpOnly nên sau khi refresh phải hỏi lại server mới biết
  // còn đăng nhập hay không. Thiếu bước này thì admin bị đăng xuất mỗi lần tải lại trang.
  useEffect(() => {
    api.getCurrentUser()
      .then(setCurrentUser)
      .catch(err => console.error('Không kiểm tra được phiên đăng nhập:', err))
      .finally(() => setIsRestoringSession(false));
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const user = await api.login(username, password);
      setCurrentUser(user);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (error) {
      // Xoá cookie thất bại thì vẫn phải rời trạng thái đăng nhập ở client.
      console.error('Logout failed:', error);
    } finally {
      setCurrentUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isLoading, isRestoringSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
