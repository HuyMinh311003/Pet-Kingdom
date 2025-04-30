import React, { createContext, useState, ReactNode } from 'react';
import { UserRole } from '../types/role';

interface UserRoleContextType {
  userRole: UserRole | null;
  setUserRole: (role: UserRole | null) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const UserRoleContext = createContext<UserRoleContextType>({
  userRole: null,
  setUserRole: () => {}
});

export const UserRoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole | null>(() => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        return user.role as UserRole;
      }
      return null;
    } catch {
      return null;
    }
  });

  return (
    <UserRoleContext.Provider value={{ userRole, setUserRole }}>
      {children}
    </UserRoleContext.Provider>
  );
};
