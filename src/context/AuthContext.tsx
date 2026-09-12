import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Role } from '../types';
import { api, setApiUserId } from '../lib/api';

interface AuthContextType {
  currentUser: UserProfile | null;
  allUsers: UserProfile[];
  isLoading: boolean;
  switchUser: (userId: string) => Promise<void>;
  registerUser: (data: { name: string; email: string; targetExam?: string; role?: Role }) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  hasRole: (roles: Role[]) => boolean;
  refreshUsers: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  allUsers: [],
  isLoading: true,
  switchUser: async () => {},
  registerUser: async () => {},
  updateProfile: async () => {},
  hasRole: () => false,
  refreshUsers: async () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const users = await api.getUsers();
      setAllUsers(users);

      const savedId = localStorage.getItem('nursingprep_user_id');
      const targetUser = users.find(u => u.id === savedId) || users[0];
      if (targetUser) {
        setApiUserId(targetUser.id);
        setCurrentUser(targetUser);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const switchUser = async (userId: string) => {
    try {
      const u = await api.switchUser(userId);
      setCurrentUser(u);
      localStorage.setItem('nursingprep_user_id', u.id);
    } catch (err) {
      console.error('Switch user error', err);
    }
  };

  const registerUser = async (data: { name: string; email: string; targetExam?: string; role?: Role }) => {
    const newUser = await api.register(data);
    setAllUsers(prev => [...prev, newUser]);
    await switchUser(newUser.id);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = await api.updateProfile(updates);
    setCurrentUser(updated);
    setAllUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
  };

  const hasRole = (roles: Role[]): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'super_admin') return true;
    return roles.includes(currentUser.role);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        allUsers,
        isLoading,
        switchUser,
        registerUser,
        updateProfile,
        hasRole,
        refreshUsers: loadData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
