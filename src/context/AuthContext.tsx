import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { UserInfo } from '../types';
import EventEmitter from 'events';
import config from '../data/config';

interface AuthContextType {
  user: UserInfo | null;
  login: (user: UserInfo) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loginEmitter: EventEmitter;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(() => {
    const savedUser = localStorage.getItem(config.KEY_USER);
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const loginEmitter = useRef(new EventEmitter())

  const login = (userData: UserInfo) => {
    setUser(userData);
    localStorage.setItem(config.KEY_USER, JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(config.KEY_USER);
  };

  // 监听其他标签页的登录状态变化
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === config.KEY_USER) {
        if (e.newValue) {
          setUser(JSON.parse(e.newValue));
        } else {
          setUser(null);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loginEmitter: loginEmitter.current }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};