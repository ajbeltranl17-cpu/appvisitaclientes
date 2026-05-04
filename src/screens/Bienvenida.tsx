import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

// Definimos qué datos esperamos recibir de Firebase
interface VisitaData {
  clienteNombre: string;
  asesorNombre: string;
  propiedadUrl: string;
}

export const Bienvenida = () => {
  // 1. Extraemos el ID de la URL usando el nombre exacto de tu App.tsx
  const { idVisita } = useParams();
  const navigate = useNavigate();

  // 2. Memoria de la pantalla
  const [visita, setVisita] = useState<VisitaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 3. El buscador: Va a Firebase en cuanto la pantalla carga
  useEffect(() => {
    const fetchVisita = async () => {
      // Usamos idVisita
      if (!idVisita) {
        setError('Enlace no válido');
        setLoading(false);
        return;
      }

      try {
        // Buscamos el documento con idVisita
        const docRef = doc(db, 'visitas', idVisita);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setVisita(docSnap.data() as VisitaData);
        } else {
          setError('No encontramos esta invitación. Puede que haya expirado.');
        }
      } catch (err) {
        console.error("Error al buscar la visita:", err);
        setError('Hubo un problema al cargar tu experiencia.');
      } finally {
        setLoading(false);
      }
    };

    fetchVisita();
  }, [idVisita]); // Actualizado aquí también

  // Pantalla de Carga
  if (loading) {
    return (
      <div className="min-h-screen bg-[#00213b] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[#C5A059] mt-4 font-bold tracking-widest uppercase text-sm">Preparando tu experiencia...</p>
      </div>
    );
  }

  // Pantalla de Error (Si el link está mal)
  if (error || !visita) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <span className="material-symbols-outlined text-6xl text-red-400 mb-4">error_outline</span>
        <h2 className="text-2xl font-black text-[#00213b] mb-2">¡Ups! Algo salió mal</h2>
        <p className="text-gray-500 mb-6">{error}</p>
        <button 
          onClick={() => navigate('/')}
          className="bg-[#00213b] text-white px-6 py-3 rounded-xl font-bold"
        >
          Ir al Inicio
        </button>
      </div>
    );
  }

  // Pantalla de Éxito: ¡La Bienvenida VIP!
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border-t-8 border-t-[#C5A059]">
        
        {/* Imagen de Portada (Simulada por ahora) */}
        <div className="h-64 w-full relative">
          <img 
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
            alt="Propiedad" 
            className="w-full h-full object-cover"
          />
          {/* Overlay oscuro para darle elegancia */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#00213b]/90 to-transparent"></div>
          
          <div className="absolute bottom-6 left-6 right-6">
            <span className="bg-[#C5A059] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
              Experiencia Privada
            </span>
            <h1 className="text-3xl font-black text-white mt-2 leading-tight">
              Bienvenido,<br/>{visita.clienteNombre}
            </h1>
          </div>
        </div>

        {/* Contenido del Mensaje */}
        <div className="p-8 text-center">
          <p className="text-gray-600 mb-8 text-sm leading-relaxed">
            Tu asesor <strong className="text-[#00213b]">{visita.asesorNombre}</strong> ha preparado este portal exclusivo para tu próxima visita. Aquí encontrarás todos los detalles de la propiedad, la ruta interactiva y herramientas de diseño.
          </p>

          {/* Botón para entrar al Dashboard (Usando idVisita) */}
          <button 
            onClick={() => navigate(`/dashboard/${idVisita}`)}
            className="w-full bg-[#00213b] hover:bg-[#00182b] text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-3 group"
          >
            Entrar a mi Portal
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </button>
          
          <div className="mt-6 flex justify-center items-center gap-2 text-xs text-gray-400">
            <span className="material-symbols-outlined text-[14px]">lock</span>
            Conexión Segura - Tu Conexión Inmobiliaria
          </div>
        </div>

      </div>
    </div>
  );
};