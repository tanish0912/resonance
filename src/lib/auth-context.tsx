"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getUserData, saveUserData, UserData } from './fingerprint';

interface AuthContextType {
  user: UserData | null;
  isLoading: boolean;
  setUser: (name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        const userData = await getUserData();
        if (userData) {
          setUserState(userData);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Only run on client-side
    if (typeof window !== 'undefined') {
      loadUserData();
    }
  }, []);

  const setUser = async (name: string) => {
    await saveUserData(name);
    setUserState({
      name,
      createdAt: Date.now(),
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 