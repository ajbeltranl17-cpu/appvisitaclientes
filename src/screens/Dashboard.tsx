import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EncabezadoGlobal } from '../components/EncabezadoGlobal';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { idVisita } = useParams();

  // Datos de contexto para la propiedad en Veracruz
  const nombreCliente = "Cliente"; 
  const nombrePropiedad = "Jardines del Virginia";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Navegación superior corporativa */}
      <EncabezadoGlobal 
        rutaSiguiente={`/iniciar-visita/${idVisita}`} 
        iconoSiguiente="directions_walk" 
        textoSiguiente="Iniciar Visita" 
      />

      <main className="p-4 space-y-6 max-w-md mx-auto w-full">
        
        {/* Card de Bienvenida Personalizada */}
        <div className="bg-[#00213b] rounded-3xl p-6 text-white shadow-lg flex items-center gap-4">
          <div className="bg-white p-2 rounded-2xl flex-shrink-0">
            <img src="/logo.png" alt="Tu Conexión Inmobiliaria" className="w-10 h-10 object-contain" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white leading-tight">¡Hola, {nombreCliente}!</h2>
            <p className="opacity-70 text-[10px] uppercase tracking-widest font-bold">{nombrePropiedad}</p>
          </div>
        </div>

        {/* Sección de Mapa y Ubicación Estratégica */}
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-3 px-1">
            <h3 className="font-bold text-[#00213b] text-[10px] uppercase tracking-widest">Ubicación y Entorno</h3>
            <span className="text-[#C5A059] text-[9px] font-black uppercase tracking-tighter">Boca del Río, Ver.</span>
          </div>
          
          <div className="aspect-video bg-gray-200 rounded-2xl overflow-hidden mb-4 shadow-inner border border-gray-50">
            <img 
              src="/map.jpg" 
              alt="Mapa de la zona" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/400x225?text=Cargando+Entorno...";
              }}
            />
          </div>

          <a 
            href="https://maps.google.com" 
            target="_blank" 
            rel="noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-[#C5A059] text-white py-4 rounded-2xl font-bold text-sm shadow-md active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-lg">near_me</span>
            VER RUTA EN GOOGLE MAPS
          </a>
        </div>{/* NUEVO BOTÓN DE SIGUIENTE PASO: INICIAR VISITA */}
        <button 
          onClick={() => navigate(`/iniciar-visita/${idVisita}`)}
          className="w-full mt-4 bg-[#00213b] text-white py-5 rounded-2xl font-black text-[13px] md:text-base uppercase tracking-widest shadow-[0_10px_20px_rgba(0,33,59,0.2)] flex justify-center items-center gap-3 active:scale-95 transition-all border border-[#00335c]"
        >
          Siguiente: Iniciar Visita
          <span className="material-symbols-outlined text-xl">arrow_forward</span>
        </button>

        {/* Módulos de Herramientas de Decisión (LISTA COMPLETA) */}
        <div className="grid grid-cols-2 gap-4">
          {[
          
            { title: 'La Zona', icon: 'explore', color: 'bg-teal-600', route: `/analisis/${idVisita}` },
            { title: 'Galería', icon: 'photo_library', color: 'bg-purple-600', route: `/galeria/${idVisita}` },
            { title: 'Diseño IA', icon: 'auto_awesome', color: 'bg-orange-500', route: `/diseno-ia/${idVisita}` },
            { title: 'Swipe Pareja', icon: 'swipe', color: 'bg-pink-500', route: `/swipe/${idVisita}` },
            { title: 'Mis Deseos', icon: 'favorite', color: 'bg-red-500', route: `/mis-deseos/${idVisita}` },
            { title: 'Catálogo', icon: 'account_balance', color: 'bg-slate-700', route: `/catalogo/${idVisita}` },
            { title: 'Comparar', icon: 'balance', color: 'bg-amber-600', route: `/matriz/${idVisita}` },
            { title: 'Plusvalía', icon: 'trending_up', color: 'bg-indigo-600', route: `/plusvalia/${idVisita}` },
            { title: 'Hipoteca', icon: 'payments', color: 'bg-emerald-600', route: `/calculadora/${idVisita}` },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => navigate(item.route)}
              className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center gap-3 active:scale-95 transition-all hover:border-[#C5A059]/30"
            >
              <div className={`${item.color} p-3 rounded-2xl text-white shadow-sm`}>
                <span className="material-symbols-outlined text-2xl">{item.icon}</span>
              </div>
              <span className="text-[9px] font-black text-gray-700 uppercase tracking-tighter">{item.title}</span>
            </button>
          ))}
        </div>

        <footer className="pt-2 text-center">
          <p className="text-[9px] text-gray-400 uppercase tracking-[0.2em] font-medium">
            Exclusivo para tu visita en Veracruz
          </p>
        </footer>
      </main>
    </div>
  );
};