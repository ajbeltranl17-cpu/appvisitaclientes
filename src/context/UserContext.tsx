import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Note: Firebase Auth listener would go here in production
  // For prototype, we simulate a logged in advisor
  useEffect(() => {
    const timer = setTimeout(() => {
      setUser({
        uid: 'advisor_123',
        email: 'asesor@tuconexion.mx',
        displayName: 'Agente Inmobiliario Veracruz'
      });
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <UserContext.Provider value={{ user, loading }}>
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
