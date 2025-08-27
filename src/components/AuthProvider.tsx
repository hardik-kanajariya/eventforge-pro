import React, { createContext, useContext, useEffect, useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { User, UserRole } from '../lib/types';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  login: (email: string, password: string) => Promise<boolean>;
  loginAsGuest: (name: string, email: string, phone: string) => Promise<User>;
  logout: () => void;
  isLoading: boolean;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useKV<User | null>("current-user", null);
  const [users, setUsers] = useKV<User[]>("users", []);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const user = users.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const loginAsGuest = async (name: string, email: string, phone: string): Promise<User> => {
    let existingUser = users.find(u => u.email === email);
    
    if (existingUser) {
      setCurrentUser(existingUser);
      return existingUser;
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      email,
      phone,
      membershipType: 'none',
      createdAt: new Date().toISOString(),
      isGuest: true
    };

    setUsers(prevUsers => [...prevUsers, newUser]);
    setCurrentUser(newUser);
    return newUser;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!currentUser) return;
    
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    
    setUsers(prevUsers => 
      prevUsers.map(u => u.id === currentUser.id ? updatedUser : u)
    );
  };

  const role: UserRole = currentUser?.email === 'admin@eventpro.com' ? 'admin' : 
                        currentUser ? 'user' : 'guest';

  return (
    <AuthContext.Provider value={{
      user: currentUser,
      role,
      login,
      loginAsGuest,
      logout,
      isLoading,
      updateProfile
    }}>
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