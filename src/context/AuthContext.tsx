import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authService } from '../services/api';
import { useNotification } from './NotificationContext';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password_raw: string, rememberMe?: boolean) => Promise<void>;
  register: (name: string, email: string, password_raw: string, mobile?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { showToast } = useNotification();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem('auth_user');
        const token = localStorage.getItem('auth_token');

        if (storedUser && token) {
          // Verify with mock API if needed
          const fetchedUser = await authService.getCurrentUser();
          if (fetchedUser) {
            setUser(fetchedUser);
          } else {
            // Token invalid
            localStorage.removeItem('auth_user');
            localStorage.removeItem('auth_token');
          }
        }
      } catch (error) {
        console.error('Failed to restore authentication session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password_raw: string, rememberMe = false) => {
    setIsLoading(true);
    try {
      const response = await authService.login(email, password_raw);
      
      setUser(response.user);
      
      // Store depending on rememberMe (usually we can store it in localStorage or session depending, but we'll store both for simple persistent simulation)
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('auth_user', JSON.stringify(response.user));
      
      if (rememberMe) {
        localStorage.setItem('remembered_email', email);
      } else {
        localStorage.removeItem('remembered_email');
      }

      showToast(`Welcome back, ${response.user.name}!`, 'success');
    } catch (error: any) {
      showToast(error.message || 'Login failed. Please inspect details.', 'error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password_raw: string, mobile?: string) => {
    setIsLoading(true);
    try {
      const response = await authService.register(name, email, password_raw, mobile);
      
      setUser(response.user);
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('auth_user', JSON.stringify(response.user));
      
      showToast(`Account registered successfully. Welcome, ${response.user.name}!`, 'success');
    } catch (error: any) {
      showToast(error.message || 'Registration failed. Please inspect details.', 'error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    showToast('Logged out successfully.', 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
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
