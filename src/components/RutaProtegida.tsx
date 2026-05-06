import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

interface RutaProtegidaProps {
  children: React.ReactNode;
  requireAdmin?: boolean; // Le decimos al guardia si esta puerta es exclusiva del jefe
}

export const RutaProtegida = ({ children, requireAdmin = false }: RutaProtegidaProps) => {
  const [usuarioAutenticado, setUsuarioAutenticado] = useState<boolean | null>(null);
  const [esAdmin, setEsAdmin] = useState<boolean>(false);

  useEffect(() => {
    // El guardia pregunta a Firebase si hay alguien validado
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsuarioAutenticado(true);
        // Revisamos el gafete que le pusimos al entrar
        const role = localStorage.getItem('userRole');
        setEsAdmin(role?.toLowerCase() === 'admin');
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

  // Si no hay usuario conectado, lo mandamos directo a la pantalla de Login (Ruta "/")
  if (usuarioAutenticado === false) {
    return <Navigate to="/" replace />;
  }

  // Si la puerta es solo para el Admin y el usuario es un Asesor, lo regresamos a su área de trabajo
  if (requireAdmin && !esAdmin) {
    return <Navigate to="/agendar" replace />;
  }

  // Si todo está en orden, lo dejamos pasar
  return <>{children}</>;
};