import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Role } from '../types';
import { api, setApiUserId } from '../lib/api';
import { signInWithPopup, signOut as fbSignOut } from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase.ts';

interface AuthContextType {
  currentUser: UserProfile | null;
  allUsers: UserProfile[];
  isLoading: boolean;
  isAdminPinVerified: boolean;
  switchUser: (userId: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  loginWithCredentials: (email: string, password: string) => Promise<UserProfile>;
  loginWithAdminPin: (pin: string) => Promise<boolean>;
  logoutAdmin: () => Promise<void>;
  registerUser: (data: { name: string; email: string; password: string; mobile?: string; district?: string; targetExam?: string; role?: Role }) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  hasRole: (roles: Role[]) => boolean;
  refreshUsers: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  allUsers: [],
  isLoading: true,
  isAdminPinVerified: false,
  switchUser: async () => {},
  signInWithGoogle: async () => {},
  signOut: async () => {},
  loginWithCredentials: async () => ({} as UserProfile),
  loginWithAdminPin: async () => false,
  logoutAdmin: async () => {},
  registerUser: async () => {},
  updateProfile: async () => {},
  hasRole: () => false,
  refreshUsers: async () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminPinVerified, setIsAdminPinVerified] = useState<boolean>(() => {
    return (
      localStorage.getItem('nursingprep_admin_pin_verified') === 'true' ||
      sessionStorage.getItem('nursingprep_admin_pin_verified') === 'true'
    );
  });

  const loadData = async () => {
    try {
      setIsLoading(true);
      const users = await api.getUsers();
      setAllUsers(users);

      const isPinActive =
        localStorage.getItem('nursingprep_admin_pin_verified') === 'true' ||
        sessionStorage.getItem('nursingprep_admin_pin_verified') === 'true';

      if (isPinActive) {
        setIsAdminPinVerified(true);
      }

      const savedId = localStorage.getItem('nursingprep_user_id');
      const targetUser = users.find(u => u.id === savedId);
      if (targetUser) {
        setApiUserId(targetUser.id);
        setCurrentUser(targetUser);
      } else if (isPinActive) {
        // Find or fallback to super admin user
        const adminCandidate = users.find(u => u.role === 'super_admin' || u.role === 'admin') || {
          id: 'usr-admin-01',
          email: 'hangemahesh916@gmail.com',
          name: 'Mahesh Hange (Admin)',
          role: 'super_admin' as Role,
          preferredLanguage: 'mr' as const,
          targetExam: 'Exam Operations & Recruitment Admin',
          dailyTarget: 50,
          streakDays: 45,
          points: 1500,
          isPremium: true,
          hasTestSeriesAccess: true,
          createdAt: new Date().toISOString()
        };
        setApiUserId(adminCandidate.id);
        setCurrentUser(adminCandidate);
      } else {
        setCurrentUser(null);
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
    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      localStorage.removeItem('nursingprep_user_id');
      setCurrentUser(null);
    }
  };

  const loginWithCredentials = async (email: string, password: string): Promise<UserProfile> => {
    setIsLoading(true);
    try {
      const user = await api.login(email, password);
      setCurrentUser(user);
      localStorage.setItem('nursingprep_user_id', user.id);
      // Ensure user is present in allUsers
      setAllUsers(prev => {
        const exists = prev.some(u => u.id === user.id);
        return exists ? prev.map(u => u.id === user.id ? user : u) : [...prev, user];
      });
      return user;
    } finally {
      setIsLoading(false);
    }
  };

  const registerUser = async (data: { name: string; email: string; password: string; mobile?: string; district?: string; targetExam?: string; role?: Role }) => {
    const newUser = await api.register(data);
    setCurrentUser(newUser);
    localStorage.setItem('nursingprep_user_id', newUser.id);
    setAllUsers(prev => [...prev, newUser]);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = await api.updateProfile(updates);
    setCurrentUser(updated);
    setAllUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
  };

  const MASTER_ADMIN_PIN = '458498';

  const loginWithAdminPin = async (pin: string): Promise<boolean> => {
    if (pin.trim() !== MASTER_ADMIN_PIN) {
      return false;
    }

    try {
      setIsLoading(true);
      // Find super_admin or admin profile in database or fallback
      let adminCandidate = allUsers.find(u => u.role === 'super_admin' || u.role === 'admin');
      
      if (!adminCandidate) {
        try {
          const freshUsers = await api.getUsers();
          setAllUsers(freshUsers);
          adminCandidate = freshUsers.find(u => u.role === 'super_admin' || u.role === 'admin');
        } catch (e) {
          // ignore
        }
      }

      const adminUser: UserProfile = adminCandidate || {
        id: 'usr-admin-01',
        email: 'hangemahesh916@gmail.com',
        name: 'Mahesh Hange (Admin)',
        role: 'super_admin' as Role,
        preferredLanguage: 'mr' as const,
        targetExam: 'Exam Operations & Recruitment Admin',
        dailyTarget: 50,
        streakDays: 45,
        points: 1500,
        isPremium: true,
        hasTestSeriesAccess: true,
        createdAt: new Date().toISOString()
      };

      setApiUserId(adminUser.id);
      setCurrentUser(adminUser);
      setIsAdminPinVerified(true);
      localStorage.setItem('nursingprep_user_id', adminUser.id);
      localStorage.setItem('nursingprep_admin_pin_verified', 'true');
      sessionStorage.setItem('nursingprep_admin_pin_verified', 'true');

      // Ensure adminUser is in allUsers
      setAllUsers(prev => {
        const exists = prev.some(u => u.id === adminUser.id);
        return exists ? prev.map(u => u.id === adminUser.id ? adminUser : u) : [...prev, adminUser];
      });

      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const logoutAdmin = async () => {
    localStorage.removeItem('nursingprep_admin_pin_verified');
    sessionStorage.removeItem('nursingprep_admin_pin_verified');
    localStorage.removeItem('nursingprep_user_id');
    setIsAdminPinVerified(false);
    setCurrentUser(null);
    try {
      await fbSignOut(auth);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const hasRole = (roles: Role[]): boolean => {
    if (isAdminPinVerified) return true;
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
        isAdminPinVerified,
        switchUser,
        signInWithGoogle,
        signOut,
        loginWithCredentials,
        loginWithAdminPin,
        logoutAdmin,
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
