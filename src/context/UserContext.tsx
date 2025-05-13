import { createContext, useContext, ReactNode } from 'react';
import { User } from '../types';

// Default user data since login is not required
const defaultUser: User = {
  id: '1',
  name: 'Technician',
  email: 'tech@example.com',
  role: 'Datacenter Technician',
  lastInspectionDate: new Date().toISOString().split('T')[0],
};

type UserContextType = {
  user: User;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  return (
    <UserContext.Provider value={{ user: defaultUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
