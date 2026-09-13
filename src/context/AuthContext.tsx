import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Role } from '../types';
import { api, setApiUserId } from '../lib/api';
import { signInWithPopup, signOut as fbSignOut } from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase.ts';

interface AuthContextType {
  currentUser: UserProfile | null;
  allUsers: UserProfile[];
  isLoading: boolean;
  switchUser: (userId: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
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
  signInWithGoogle: async () => {},
  signOut: async () => {},
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

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      const credential = await signInWithPopup(auth, googleAuthProvider);
      const idToken = await credential.user.getIdToken();
      const syncedUser = await api.loginWithFirebase(idToken);
      setCurrentUser(syncedUser);
      localStorage.setItem('nursingprep_user_id', syncedUser.id);
      await loadData();
    } catch (err: any) {
      // User closed the popup or cancelled the request - this is an intentional user action, not a crash
      if (
        err?.code === 'auth/popup-closed-by-user' ||
        err?.code === 'auth/cancelled-popup-request' ||
        err?.message?.includes('popup-closed-by-user') ||
        err?.message?.includes('cancelled-popup-request')
      ) {
        console.info('Google Sign-In popup closed by user.');
        return;
      }
      if (err?.code === 'auth/popup-blocked') {
        console.warn('Google Sign-In popup was blocked by browser permissions.');
        return;
      }
      console.error('Sign in with Google error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await fbSignOut(auth);
      const firstUser = allUsers[0];
      if (firstUser) {
        await switchUser(firstUser.id);
      }
    } catch (err) {
      console.error('Sign out error:', err);
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
        signInWithGoogle,
        signOut,
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
