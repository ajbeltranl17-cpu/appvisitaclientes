import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore'; // Cambiamos getDoc por onSnapshot
import { db } from '../firebase';

interface VisitaData {
  clienteNombre: string;
  asesorNombre: string;
  propiedadUrl: string;
  propiedadImagen?: string; 
}

export const Bienvenida = () => {
  const { idVisita } = useParams();
  const navigate = useNavigate();

  const [visita, setVisita] = useState<VisitaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // El Espía: Escucha a Firebase en TIEMPO REAL
  useEffect(() => {
    if (!idVisita) {
      setError('Enlace no válido');
      setLoading(false);
      return;
    }

    const docRef = doc(db, 'visitas', idVisita);
    
    // onSnapshot se queda "escuchando" cambios en la nube
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setVisita(docSnap.data() as VisitaData);
        setError('');
      } else {
        setError('No encontramos esta invitación. Puede que haya expirado.');
      }
      setLoading(false);
    }, (err) => {
      console.error("Error al buscar la visita:", err);
      setError('Hubo un problema al cargar tu experiencia.');
      setLoading(false);
    });

    // Limpiamos el espía si el usuario sale de la pantalla
    return () => unsubscribe();
  }, [idVisita]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#00213b] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[#C5A059] mt-4 font-bold tracking-widest uppercase text-sm">Preparando tu experiencia...</p>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border-t-8 border-t-[#C5A059]">
        
        <div className="h-48 sm:h-56 w-full relative transition-all duration-700 ease-in-out">
          <img 
            // Si la imagen real llega, la pone. Si no, Unsplash entra al quite.
            src={visita.propiedadImagen || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
            alt="Propiedad" 
            className="w-full h-full object-cover transition-opacity duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#00213b]/90 to-transparent"></div>
          
          <div className="absolute bottom-6 left-6 right-6">
            <span className="bg-[#C5A059] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
              Tu Visita Inmobiliaria
            </span>
            <h1 className="text-3xl font-black text-white mt-2 leading-tight drop-shadow-md">
              Hola, <br/>{visita.clienteNombre}
            </h1>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <p className="text-gray-600 mb-6 text-sm leading-relaxed text-center">
            Tu asesor <strong className="text-[#00213b]">{visita.asesorNombre}</strong> ha preparado este portal exclusivo. Para ver la <strong className="text-[#C5A059]">ubicación exacta en Google Maps</strong> y acceder a tu panel con todos los beneficios, por favor haz clic abajo.
          </p>

          <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 mb-8">
            <h3 className="text-[11px] font-bold text-[#00213b] uppercase tracking-wider mb-4 text-center">¿Qué incluye tu panel?</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <span className="material-symbols-outlined text-[#C5A059]">location_on</span>
                <span className="leading-tight">Ubicación exacta y ruta directa en Google Maps.</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <span className="material-symbols-outlined text-[#C5A059]">photo_library</span>
                <span className="leading-tight">Galería completa de fotos de la propiedad.</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <span className="material-symbols-outlined text-[#C5A059]">map</span>
                <span className="leading-tight">Análisis de la zona (escuelas, bancos, restaurantes).</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <span className="material-symbols-outlined text-[#C5A059]">grid_view</span>
                <span className="leading-tight">Matriz comparativa contra otras opciones.</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <span className="material-symbols-outlined text-[#C5A059]">calculate</span>
                <span className="leading-tight">Calculadoras financieras (Hipoteca y Plusvalía).</span>
              </li>
            </ul>
          </div>

          <button 
            onClick={() => navigate(`/dashboard/${idVisita}`)}
            className="w-full bg-[#00213b] hover:bg-[#00182b] text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-3 group"
          >
            Ver Ubicación Exacta
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
              location_on
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