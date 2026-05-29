'use client';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface UserInfo {
  userName: string;
  userRole: 'Admin' | 'Manager' | 'Associate';
  userId: string;
}

interface UserContextType {
  user: UserInfo | null;
  setUser: (user: UserInfo) => void;
  // For future: fetchUserFromAPI: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const updateUserInfo = (info: UserInfo) => {
    localStorage.setItem('userName', info.userName);
    localStorage.setItem('userRole', info.userRole);
    localStorage.setItem('userId', info.userId);
    setUser(info);
    // Dispatch storage event manually for same-tab updates if needed
    window.dispatchEvent(new Event('storage'));
  };

  useEffect(() => {
    const updateUserFromStorage = () => {
      const token = localStorage.getItem('authToken');
      const userName = localStorage.getItem('userName');
      const userId = localStorage.getItem('userId');
      const rawRole = localStorage.getItem('userRole');

      if (!token || !userName || !userId) {
        setUser(null);
        setLoading(false);
        return;
      }

      let userRole: UserInfo['userRole'] = 'Associate';
      if (rawRole === 'Admin' || rawRole === 'ROLE_ADMIN') {
        userRole = 'Admin';
      } else if (rawRole === 'Manager' || rawRole === 'ROLE_MANAGER') {
        userRole = 'Manager';
      } else {
        userRole = 'Associate';
      }

      setUser({ userName, userRole, userId });
      setLoading(false);
    };
    updateUserFromStorage();
    window.addEventListener('storage', updateUserFromStorage);
    return () => window.removeEventListener('storage', updateUserFromStorage);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser: updateUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};
