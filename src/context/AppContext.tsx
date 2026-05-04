import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { db, auth } from '../firebase';

export type ScreenName = 
  | 'LOGIN'
  | 'PANEL_ASESOR'
  | 'BIENVENIDA' 
  | 'DASHBOARD' 
  | 'BITACORA' 
  | 'GALERIA' 
  | 'AI_STAGING' 
  | 'CATALOGO' 
  | 'CALCULADORA' 
  | 'MIS_DESEOS';

interface Advisor {
  name: string;
  phone: string;
  role: string;
  avatar: string;
}

interface AppContextType {
  currentScreen: ScreenName;
  navigate: (screen: ScreenName) => void;
  advisor: Advisor;
  user: User | null;
  isLoadingAuth: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('PANEL_ASESOR');
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsLoadingAuth(false);
      
      // Redireccionar a PANEL_ASESOR si hay sesión y nos quedamos en LOGIN
      if (firebaseUser && currentScreen === 'LOGIN') {
        setCurrentScreen('PANEL_ASESOR');
      }
      // Nota: Desactivada temporalmente la redirección estricta a LOGIN 
      // si no hay usuario (!firebaseUser) para facilitar pruebas visuales
    });

    return () => unsubscribe();
  }, [currentScreen]);

  const advisor: Advisor = {
    name: 'Marina V. Beltrán',
    phone: '+52 229 123 4567',
    role: 'Asesor Senior Veracruz',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'
  };

  const navigate = (screen: ScreenName) => {
    window.scrollTo(0, 0);
    setCurrentScreen(screen);
  };

  return (
    <AppContext.Provider value={{ currentScreen, navigate, advisor, user, isLoadingAuth }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
