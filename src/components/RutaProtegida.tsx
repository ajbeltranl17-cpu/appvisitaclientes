import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

export const RutaProtegida = ({ children }: { children: React.ReactNode }) => {
  const [usuarioAutenticado, setUsuarioAutenticado] = useState<boolean | null>(null);

  useEffect(() => {
    // El guardia pregunta a Firebase si hay alguien validado
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsuarioAutenticado(true);
      } else {
        setUsuarioAutenticado(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Mientras el guardia verifica, mostramos pantalla de carga
  if (usuarioAutenticado === null) {
    return (
      <div className="min-h-screen bg-[#00213b] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Si no hay usuario, lo mandamos directo al login
  if (usuarioAutenticado === false) {
    return <Navigate to="/admin/login" replace />;
  }

  // Si sí hay usuario, lo dejamos pasar a la pantalla que pidió
  return <>{children}</>;
};