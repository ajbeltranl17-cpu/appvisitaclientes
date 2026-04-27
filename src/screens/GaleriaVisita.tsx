import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { EncabezadoGlobal } from '../components/EncabezadoGlobal';

export const GaleriaVisita = () => {
  const { idVisita } = useParams();
  const [categoriaActiva, setCategoriaActiva] = useState('Interiores');

  // Categorías de la Galería
  const categorias = ['Interiores', 'Exteriores', 'Amenidades'];

  // Simulación de fotos (En Fase 3 se cargarán desde Firebase/URL de la ficha)
  const fotos = [
    { id: 1, cat: 'Interiores', url: 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?q=80&w=800' },
    { id: 2, cat: 'Interiores', url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800' },
    { id: 3, cat: 'Exteriores', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800' },
    { id: 4, cat: 'Amenidades', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800' },
    { id: 5, cat: 'Interiores', url: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?q=80&w=800' },
    { id: 6, cat: 'Amenidades', url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=800' },
  ];

  const fotosFiltradas = fotos.filter(f => f.cat === categoriaActiva);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Navegación lógica dentro del flujo */}
      <EncabezadoGlobal 
        rutaAnterior={`/analisis/${idVisita}`}
        textoAnterior="Entorno"
        rutaSiguiente={`/amueblar/${idVisita}`}
        textoSiguiente="Diseño IA"
      />

      <main className="p-4 space-y-6 max-w-md mx-auto w-full">
        
        {/* Título de Sección */}
        <section className="px-2">
          <span className="text-[#C5A059] font-black uppercase text-[10px] tracking-[0.2em]">Recorrido Visual</span>
          <h1 className="text-3xl font-black text-[#00213b] mt-1">Galería Exclusiva</h1>
          <p className="text-gray-500 text-sm mt-2">Explora cada rincón de Jardines del Virginia con detalle y alta definición.</p>
        </section>

        {/* Filtros de Categoría (Pestañas Doradas) */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoriaActiva(cat)}
              className={`px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all flex-shrink-0 ${
                categoriaActiva === cat 
                ? 'bg-[#00213b] text-white shadow-lg' 
                : 'bg-white text-gray-400 border border-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Cuadrícula de Fotos (Estilo Pinterest / Moderno) */}
        <div className="grid grid-cols-2 gap-3">
          {fotosFiltradas.map((foto) => (
            <div 
              key={foto.id} 
              className="group relative aspect-square bg-gray-200 rounded-3xl overflow-hidden shadow-sm border border-white hover:shadow-xl transition-all cursor-pointer"
            >
              <img 
                src={foto.url} 
                alt={foto.cat} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="material-symbols-outlined text-white text-xl">zoom_in</span>
              </div>
            </div>
          ))}
        </div>

        {/* Contador y Status */}
        <div className="bg-white p-4 rounded-2xl flex items-center justify-between border border-gray-100">
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Imágenes en alta resolución
              </span>
           </div>
           <span className="text-[#00213b] font-black text-xs">
             {fotosFiltradas.length} fotos
           </span>
        </div>

        <footer className="text-center pt-4">
          <p className="text-[9px] text-gray-300 uppercase tracking-[0.2em]">
            Tu Conexión Inmobiliaria • Veracruz
          </p>
        </footer>

      </main>
    </div>
  );
};