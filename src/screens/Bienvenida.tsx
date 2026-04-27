import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EncabezadoGlobal } from '../components/EncabezadoGlobal';

export const Bienvenida = () => {
  const { idVisita } = useParams();
  const navigate = useNavigate();

  // En la Fase 3, este nombre vendrá de Firebase.
  const nombreCliente = "Cliente";

  const beneficios = [
    { icon: 'location_on', text: 'Ubicación exacta y ruta directa en Google Maps.' },
    { icon: 'photo_library', text: 'Galería completa de fotos de la propiedad.' },
    { icon: 'map', text: 'Análisis de la zona (escuelas, bancos, restaurantes).' },
    { icon: 'grid_view', text: 'Matriz comparativa contra otras opciones.' },
    { icon: 'calculate', text: 'Calculadoras financieras (Hipoteca y Plusvalía).' },
  ];

  // En la fase final, esta variable tomará la imagen principal de la URL que ingresaste.
  const imagenPropiedadExtraida = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Encabezado Corporativo */}
      <EncabezadoGlobal />

      <main className="flex-1 flex flex-col items-center p-6 relative pb-24">

        {/* Tarjeta con Imagen Hero */}
        <div className="w-full max-w-sm aspect-[16/10] bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 mb-8">
          <img 
            src={imagenPropiedadExtraida} 
            alt="Tu próxima propiedad" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Textos de Bienvenida */}
        <div className="text-center space-y-3 max-w-sm mb-8">
          <span className="text-[#C5A059] font-bold uppercase text-[11px] tracking-[0.3em]">
            Experiencia Inmersiva
          </span>
          <h1 className="text-4xl font-black text-[#00213b] leading-tight">
            ¡Todo listo para tu visita!
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed mt-4">
            Hola, <span className="font-bold text-[#00213b]">{nombreCliente}</span>.<br/>
            Para ver la <span className="text-[#C5A059] font-bold">ubicación exacta en Google Maps</span> y acceder a tu panel de visita personalizado con todos los beneficios, por favor haz clic abajo.
          </p>
        </div>

        {/* Lista de Beneficios */}
        <div className="w-full max-w-sm bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 mb-8">
          <h3 className="text-xs font-black text-[#00213b] uppercase tracking-widest mb-4 text-center border-b border-gray-100 pb-3">
            ¿Qué incluye tu panel?
          </h3>
          <ul className="space-y-4">
            {beneficios.map((item, idx) => (
              <li key={idx} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 text-[#C5A059]">
                  <span className="material-symbols-outlined text-xl">{item.icon}</span>
                </div>
                <span className="text-sm text-gray-600 font-medium leading-tight">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </main>

      {/* Botón Fijo Abajo (ACTUALIZADO) */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent">
        <div className="max-w-sm mx-auto">
          <button 
            onClick={() => navigate(`/dashboard/${idVisita}`)}
            className="w-full bg-[#00213b] text-white py-4 rounded-2xl font-bold text-lg shadow-xl hover:bg-[#00335c] transition-colors flex justify-center items-center gap-3 active:scale-95"
          >
            Ver Ubicación Exacta
            <span className="material-symbols-outlined">location_on</span>
          </button>
        </div>
      </div>
    </div>
  );
};