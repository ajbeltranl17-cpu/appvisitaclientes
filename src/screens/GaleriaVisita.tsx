import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EncabezadoGlobal } from '../components/EncabezadoGlobal';

export const GaleriaVisita = () => {
  const navigate = useNavigate();
  const { idVisita } = useParams();
  const [categoriaActiva, setCategoriaActiva] = useState('Interiores');

  const categorias = ['Interiores', 'Exteriores', 'Amenidades'];

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
      <EncabezadoGlobal 
        rutaAnterior={`/plusvalia/${idVisita}`}
        textoAnterior="Plusvalía"
        rutaSiguiente={`/diseno-ia/${idVisita}`}
        textoSiguiente="Diseño IA"
      />

      <main className="p-4 space-y-6 max-w-md mx-auto w-full pb-8">
        
        <section className="px-2">
          <span className="text-[#C5A059] font-black uppercase text-[10px] tracking-[0.2em]">Recorrido Visual</span>
          <h1 className="text-3xl font-black text-[#00213b] mt-1">Galería Exclusiva</h1>
          <p className="text-gray-500 text-sm mt-2">Explora cada rincón y usa la IA para visualizar el potencial de los espacios vacíos.</p>
        </section>

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

        <div className="grid grid-cols-2 gap-3">
          {fotosFiltradas.map((foto) => (
            <div 
              key={foto.id} 
              className="group relative aspect-square bg-gray-200 rounded-3xl overflow-hidden shadow-sm border border-white hover:shadow-xl transition-all cursor-pointer"
            >
              <img 
                src={foto.url} 
                alt={foto.cat} 
                className="w-full h-full object-cover transition-transform duration-500"
              />
              
              {/* Botón Flotante de Diseño IA (Varita Mágica) - Solo en Interiores */}
              {foto.cat === 'Interiores' && (
                <div className="absolute top-2 right-2 z-10">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); // Evita que se abra la foto en grande si haces clic en el botón
                      navigate(`/diseno-ia/${idVisita}`);
                    }}
                    className="bg-[#C5A059] text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform"
                  >
                    <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                  </button>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-4 pointer-events-none">
                <span className="material-symbols-outlined text-white/80 text-xl">zoom_in</span>
              </div>
            </div>
          ))}
        </div>
{/* NUEVO BOTÓN DE SIGUIENTE PASO: DISEÑA CON IA */}
        <div className="mt-8 pb-8 px-4">
          <button 
            onClick={() => navigate(`/diseno-ia/${idVisita}`)}
            className="w-full bg-[#00213b] text-white py-5 rounded-2xl font-black text-[13px] md:text-base uppercase tracking-widest shadow-[0_10px_20px_rgba(0,33,59,0.2)] flex justify-center items-center gap-3 active:scale-95 transition-all border border-[#00335c]"
          >
            Siguiente: Diseña con IA
            <span className="material-symbols-outlined text-xl">auto_awesome</span>
          </button>
        </div>
      </main>
    </div>
  );
};