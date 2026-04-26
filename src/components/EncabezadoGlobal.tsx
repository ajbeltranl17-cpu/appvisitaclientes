import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  rutaAnterior?: string;
  iconoAnterior?: string;
  textoAnterior?: string;
  rutaSiguiente?: string;
  iconoSiguiente?: string;
  textoSiguiente?: string;
}

export const EncabezadoGlobal = ({ 
  rutaAnterior, 
  iconoAnterior, 
  textoAnterior,
  rutaSiguiente,
  iconoSiguiente,
  textoSiguiente
}: Props) => {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* 1. Encabezado Principal (Blanco) */}
      <div className="flex items-center justify-between px-4 py-3 bg-white">
        {/* Menú Sándwich Izquierda */}
        <button className="p-1 text-gray-800">
          <span className="text-3xl material-symbols-outlined">menu</span>
        </button>

        {/* Logo Centro */}
        <div className="flex flex-col items-center justify-center">
          <img 
            src="/logo.png" 
            alt="Tu Conexión Inmobiliaria" 
            className="h-14 object-contain"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>

        {/* Espaciador invisible para centrar */}
        <div className="w-10"></div>
      </div>

      {/* 2. Sub-encabezado Fijo (Navegación Dorada) */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100 bg-gray-50">
        {rutaAnterior ? (
          <button 
            onClick={() => navigate(rutaAnterior)}
            className="flex items-center gap-1 text-[#C5A059] font-bold hover:opacity-80"
          >
            <span className="material-symbols-outlined text-lg">arrow_back_ios</span>
            {iconoAnterior && <span className="material-symbols-outlined text-lg">{iconoAnterior}</span>}
            <span className="text-xs tracking-wider uppercase">{textoAnterior || 'Atrás'}</span>
          </button>
        ) : <div />}

        {rutaSiguiente ? (
          <button 
            onClick={() => navigate(rutaSiguiente)}
            className="flex items-center gap-1 text-[#C5A059] font-bold hover:opacity-80"
          >
            <span className="text-xs tracking-wider uppercase">{textoSiguiente || 'Siguiente'}</span>
            {iconoSiguiente && <span className="material-symbols-outlined text-lg">{iconoSiguiente}</span>}
            <span className="material-symbols-outlined text-lg">arrow_forward_ios</span>
          </button>
        ) : <div />}
      </div>
    </div>
  );
};