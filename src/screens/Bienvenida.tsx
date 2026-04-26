import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EncabezadoGlobal } from '../components/EncabezadoGlobal';

export const Bienvenida = () => {
  const navigate = useNavigate();
  const { idVisita } = useParams();

  // En la Fase 3, este nombre vendrá de Firebase. Por ahora lo dejamos listo.
  const nombreCliente = "Cliente"; 

  const beneficios = [
    { icon: 'location_on', text: 'Ubicación exacta y ruta directa en Google Maps.' },
    { icon: 'photo_library', text: 'Galería completa de fotos de la propiedad.' },
    { icon: 'map', text: 'Análisis de la zona (escuelas, bancos, restaurantes).' },
    { icon: 'grid_view', text: 'Matriz comparativa contra otras opciones.' },
    { icon: 'calculate', text: 'Calculadoras financieras (Hipoteca y Plusvalía).' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* 1. Encabezado Corporativo Unificado */}
      <EncabezadoGlobal />

      <main className="flex-1 flex flex-col items-center p-6 relative">
        
        {/* 2. Imagen Hero Elegante (Minimal Luxury Living) */}
        <div className="w-full max-w-sm aspect-[16/10] bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 mb-8 mt-2 relative">
          <img 
            src="https://images.unsplash.com/photo-1600607687937-69528891f522?q=80&w=800&auto=format&fit=crop" 
            alt="Interior Lujoso" 
            className="w-full h-full object-cover"
          />
          {/* Overlay sutil para el logo */}
          <div className="absolute inset-0 bg-black/5 flex items-center justify-center p-8">
            <div className="bg-white/90 p-4 rounded-full shadow-inner border border-white/50">
              <img src="/logo.png" alt="Logo" className="w-16 h-16 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
            </div>
          </div>
        </div>

        {/* 3. Textos de Bienvenida y Gancho */}
        <div className="text-center space-y-3 max-w-sm mb-10">
          <span className="text-[#C5A059] font-bold uppercase text-[11px] tracking-[0.3em]">
            Experiencia Inmersiva
          </span>
          
          <h1 className="text-4xl font-black text-[#00213b] leading-tight">
            ¡Todo listo para tu visita!
          </h1>
          
          <p className="text-gray-500 text-base leading-relaxed px-2">
            Hola, <span className="text-[#00213b] font-bold">{nombreCliente}</span>. <br />
            Para ver la <span className="text-[#C5A059] font-semibold">ubicación exacta en Google Maps</span> y acceder a tu panel de visita personalizado con todos los beneficios, por favor haz clic abajo.
          </p>
        </div>

        {/* 4. Lista de Beneficios Unificada (con estilo elegante) */}
        <div className="w-full max-w-sm bg-white rounded-3xl p-7 shadow-sm border border-gray-100 mb-10">
          <h3 className="font-extrabold text-[#00213b] text-sm uppercase tracking-wider mb-6 pb-2 border-b border-gray-100">
            ¿Qué encontrarás adentro?
          </h3>
          <ul className="space-y-5">
            {beneficios.map((beneficio, index) => (
              <li key={index} className="flex items-start gap-4 text-gray-700">
                <span className="material-symbols-outlined text-[#C5A059] mt-0.5 text-xl flex-shrink-0">
                  {beneficio.icon}
                </span>
                <p className="text-sm leading-snug">{beneficio.text}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* 5. Botón de Acción Principal (El Gancho) */}
        <button 
          onClick={() => navigate(`/dashboard/${idVisita}`)}
          className="w-full max-w-xs bg-[#00213b] text-white py-5 rounded-2xl font-bold text-lg shadow-2xl hover:bg-[#00335c] transition-all active:scale-95 flex items-center justify-center gap-3 mb-6"
        >
          Ver Ubicación Exacta
          <span className="material-symbols-outlined">map</span>
        </button>

        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium mt-auto pb-4">
          Impulsado por Tu Conexión Inmobiliaria
        </p>
      </main>
    </div>
  );
};