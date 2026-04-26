import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EncabezadoGlobal } from '../components/EncabezadoGlobal';

export const Dashboard = () => {
  const navigate = useNavigate();
  // Extraemos el ID de la visita de la URL para mandarlo a las demás pantallas
  const { idVisita } = useParams();

  // VARIABLES RESERVADAS PARA FIREBASE (Fase 3)
  const nombreCliente = "Cliente"; 
  const urlGoogleMaps = "https://maps.google.com"; 

  // Menú completo y en orden con todos los botones solicitados
  const menuItems = [
    { id: 'iniciar', title: 'Iniciar Visita', icon: 'directions_walk', color: 'bg-blue-600', route: `/iniciar-visita/${idVisita}` },
    { id: 'analisis', title: 'Análisis de la Zona', icon: 'map', color: 'bg-teal-600', route: `/analisis/${idVisita}` },
    { id: 'galeria', title: 'Galería de Visita', icon: 'photo_library', color: 'bg-purple-600', route: `/galeria/${idVisita}` },
    { id: 'amueblar', title: 'Amuebla con IA', icon: 'chair', color: 'bg-orange-500', route: `/amueblar/${idVisita}` },
    { id: 'swipe', title: 'Swipe en Pareja', icon: 'swipe', color: 'bg-pink-500', route: `/swipe/${idVisita}` },
    { id: 'catalogo', title: 'Catálogo Propiedades', icon: 'account_balance', color: 'bg-slate-700', route: `/catalogo/${idVisita}` },
    { id: 'matriz', title: 'Matriz Comparativa', icon: 'grid_view', color: 'bg-amber-600', route: `/matriz/${idVisita}` },
    { id: 'hipoteca', title: 'Calculadora Hipotecaria', icon: 'calculate', color: 'bg-emerald-600', route: `/calculadora/${idVisita}` },
    { id: 'plusvalia', title: 'Calculadora Plusvalía', icon: 'trending_up', color: 'bg-indigo-600', route: `/plusvalia/${idVisita}` },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <EncabezadoGlobal 
        rutaSiguiente={`/iniciar-visita/${idVisita}`} 
        iconoSiguiente="directions_walk" 
        textoSiguiente="Iniciar Visita" 
      />

      <main className="p-4 space-y-6">
        
        {/* 1. Bienvenida al Cliente con espacio para Logo */}
        <div className="bg-[#00213b] rounded-2xl p-6 text-white shadow-lg flex items-center gap-4">
          <div className="bg-white p-2 rounded-full flex-shrink-0 shadow-inner">
            <img 
              src="/logo.png" 
              alt="Logo Inmobiliaria" 
              className="w-12 h-12 object-contain"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold">¡Hola, {nombreCliente}!</h2>
            <p className="opacity-80 text-sm mt-1">Bienvenido a tu experiencia inmersiva</p>
          </div>
        </div>

        {/* 2. Mapa Superior con Botón de Google Maps */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-800 uppercase text-xs tracking-widest">Ubicación a Visitar</h3>
          </div>
          <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden relative mb-4 shadow-inner">
            <img 
              src="/mapa-veracruz.jpg" 
              alt="Mapa" 
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80' }}
            />
          </div>
          <a 
            href={urlGoogleMaps} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-[#C5A059] hover:bg-yellow-600 text-white py-3 rounded-xl font-bold transition-colors shadow-md"
          >
            <span className="material-symbols-outlined">location_on</span>
            Abrir en Google Maps
          </a>
        </div>

        {/* 3. Menú de Cuadrícula con Todos los Botones Activos */}
        <div className="grid grid-cols-2 gap-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.route)}
              className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
            >
              <div className={`${item.color} p-3 rounded-xl text-white mb-3 group-hover:scale-110 transition-transform`}>
                <span className="material-symbols-outlined text-2xl">{item.icon}</span>
              </div>
              <span className="text-[11px] font-bold text-gray-700 text-center uppercase tracking-tighter">
                {item.title}
              </span>
            </button>
          ))}
        </div>

      </main>
    </div>
  );
};