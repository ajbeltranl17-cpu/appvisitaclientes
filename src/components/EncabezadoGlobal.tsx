import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Props {
  rutaAnterior?: string;
  textoAnterior?: string;
  rutaSiguiente?: string;
  textoSiguiente?: string;
  iconoSiguiente?: string;
}

export const EncabezadoGlobal = ({ 
  rutaAnterior, 
  textoAnterior, 
  rutaSiguiente, 
  textoSiguiente, 
  iconoSiguiente = 'arrow_forward' 
}: Props) => {
  const navigate = useNavigate();
  const { idVisita } = useParams();
  const [menuAbierto, setMenuAbierto] = useState(false);

  // Lista de todas las pantallas para el menú de navegación rápida
  const menuItems = [
    { title: 'Dashboard', icon: 'home', route: `/dashboard/${idVisita}` },
    { title: 'Análisis de la Zona', icon: 'map', route: `/analisis/${idVisita}` },
    { title: 'Galería', icon: 'photo_library', route: `/galeria/${idVisita}` },
    { title: 'Diseño IA', icon: 'auto_awesome', route: `/diseno-ia/${idVisita}` },
    { title: 'Swipe Pareja', icon: 'swipe', route: `/swipe/${idVisita}` },
    { title: 'Catálogo', icon: 'account_balance', route: `/catalogo/${idVisita}` },
    { title: 'Comparativa', icon: 'balance', route: `/matriz/${idVisita}` },
    { title: 'Plusvalía', icon: 'trending_up', route: `/plusvalia/${idVisita}` },
    { title: 'Calculadora', icon: 'payments', route: `/calculadora/${idVisita}` },
  ];

  return (
    <>
      {/* Barra de Navegación Superior */}
      <header className="bg-white/80 backdrop-blur-md px-4 py-4 flex items-center justify-between shadow-sm sticky top-0 z-40">
        
        {/* Botón Izquierdo: Volver o Logo */}
        {rutaAnterior ? (
          <button 
            onClick={() => navigate(rutaAnterior)}
            className="flex items-center gap-1 text-gray-500 active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-xl">arrow_back_ios_new</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">{textoAnterior}</span>
          </button>
        ) : (
          <div className="w-8 h-8 bg-[#00213b] rounded-lg flex items-center justify-center">
             <span className="material-symbols-outlined text-white text-sm">real_estate_agent</span>
          </div>
        )}

        {/* Grupo Derecho: Siguiente y Menú Sándwich */}
        <div className="flex items-center gap-4">
          {rutaSiguiente && (
            <button 
              onClick={() => navigate(rutaSiguiente)}
              className="flex items-center gap-1 bg-[#C5A059] text-white px-3 py-1.5 rounded-full shadow-sm active:scale-95 transition-transform"
            >
              <span className="text-[10px] font-bold uppercase tracking-widest">{textoSiguiente}</span>
              <span className="material-symbols-outlined text-sm">{iconoSiguiente}</span>
            </button>
          )}

          <button 
            onClick={() => setMenuAbierto(true)}
            className="text-[#00213b] p-1 active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-3xl">menu</span>
          </button>
        </div>
      </header>

      {/* OVERLAY DEL MENÚ (Fondo oscuro) */}
      {menuAbierto && (
        <div 
          className="fixed inset-0 bg-[#00213b]/40 backdrop-blur-sm z-50 transition-opacity"
          onClick={() => setMenuAbierto(false)}
        />
      )}

      {/* PANEL LATERAL DEL MENÚ */}
      <div className={`fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${menuAbierto ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Cabecera del Menú */}
        <div className="p-6 bg-[#00213b] text-white flex justify-between items-center rounded-bl-3xl">
          <div>
            <h3 className="font-bold text-lg leading-tight">Navegación</h3>
            <p className="text-[#C5A059] text-[10px] font-black uppercase tracking-widest">Tu Conexión Inmobiliaria</p>
          </div>
          <button 
            onClick={() => setMenuAbierto(false)}
            className="bg-white/20 p-2 rounded-full active:scale-95"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Lista de Enlaces */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                setMenuAbierto(false);
                navigate(item.route);
              }}
              className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-[#00213b]">
                <span className="material-symbols-outlined">{item.icon}</span>
              </div>
              <span className="font-bold text-sm text-gray-700">{item.title}</span>
              <span className="material-symbols-outlined text-gray-300 ml-auto text-sm">chevron_right</span>
            </button>
          ))}
        </div>

      </div>
    </>
  );
};