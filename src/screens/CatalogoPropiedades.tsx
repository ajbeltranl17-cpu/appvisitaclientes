import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { BrandLogo } from '../components/BrandLogo';

export const CatalogoPropiedades = () => {
  const { idVisita } = useParams();
  const navigate = useNavigate();

  const [seleccionadas, setSeleccionadas] = useState<number[]>([1]);
  
  // Estados para los datos dinámicos del Asesor
  const [telefonoAsesor, setTelefonoAsesor] = useState('1234567890');
  const [fotoAsesor, setFotoAsesor] = useState('https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&w=200&q=80');
  const [nombreAsesor, setNombreAsesor] = useState('Rodrigo Martínez');

  useEffect(() => {
    const fetchDatosVisita = async () => {
      if (!idVisita) return;
      try {
        const docRef = doc(db, 'visitas', idVisita);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.telefonoAsesor) setTelefonoAsesor(data.telefonoAsesor);
          else if (data.telefono) setTelefonoAsesor(data.telefono);
          if (data.fotoAsesor) setFotoAsesor(data.fotoAsesor);
          if (data.nombreAsesor) setNombreAsesor(data.nombreAsesor);
        }
      } catch (error) {
        console.error("Error al obtener datos del asesor:", error);
      }
    };
    fetchDatosVisita();
  }, [idVisita]);

  const toggleSeleccion = (id: number) => {
    setSeleccionadas(prev => {
      if (prev.includes(id)) return prev.filter(item => item !== id);
      if (prev.length >= 3) {
        alert("Puedes comparar un máximo de 3 propiedades a la vez para mantener la claridad.");
        return prev;
      }
      return [...prev, id];
    });
  };

  const propiedades = [
    { id: 1, titulo: 'Residencia Costa de Oro', precio: '$8,500,000', ubicacion: 'Boca del Río', hab: 4, banos: 3, m2: 450, estac: 3, img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&w=800&q=80', match: true },
    { id: 2, titulo: 'Loft Distrito K', precio: '$8,900,000', ubicacion: 'Riviera Veracruzana', hab: 3, banos: 2.5, m2: 280, estac: 2, img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&w=800&q=80', match: false },
    { id: 3, titulo: 'Torre Alvento, PH', precio: '$12,450,000', ubicacion: 'Boca del Río', hab: 3, banos: 3.5, m2: 320, estac: 2, img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&w=800&q=80', match: false },
    { id: 4, titulo: 'Villa Las Olas', precio: '$18,500,000', ubicacion: 'Playas del Conchal', hab: 5, banos: 4.5, m2: 600, estac: 4, img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&w=800&q=80', match: false },
    { id: 5, titulo: 'El Dorado Estates', precio: '$15,200,000', ubicacion: 'Riviera Veracruzana', hab: 4, banos: 4, m2: 520, estac: 3, img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&w=800&q=80', match: false },
    { id: 6, titulo: 'Ocean Front Retreat', precio: '$22,100,000', ubicacion: 'Boca del Río', hab: 4, banos: 4, m2: 350, estac: 3, img: 'https://images.unsplash.com/photo-1494526585095-c41746248156?ixlib=rb-4.0.3&w=800&q=80', match: false }
  ];

  return (
    <div className="bg-[#f9f9f7] font-body text-[#1a1c1b] min-h-screen relative pb-32">
      
      {/* TopNavBar */}
      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-40 shadow-sm border-b border-[#e2e3e1]">
        <div className="flex justify-between items-center w-full px-4 md:px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(`/deseos/${idVisita}`)} className="text-[#1A3651] hover:text-[#C5A059] transition-colors p-1 md:pr-2">
              <span className="material-symbols-outlined text-2xl md:text-xl">arrow_back</span>
            </button>
            <div className="hidden sm:block"><BrandLogo /></div>
            <span className="text-sm md:text-xl font-extrabold text-[#1A3651] tracking-tighter headline uppercase">Tu Conexión Inmobiliaria</span>
          </div>
          
          {/* Botón Siguiente: COMPARAR (Consistente con el resto del Happy Path) */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(`/matriz/${idVisita}`)}
              className="bg-[#C5A059] hover:bg-[#b08d4a] text-white px-4 py-2 rounded-lg font-headline font-bold flex items-center gap-2 transition-all shadow-sm text-sm"
            >
              <span className="hidden sm:inline">Comparar</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-[#C5A059] font-headline font-bold tracking-widest uppercase text-xs md:text-sm mb-2 block">Catálogo Exclusivo</span>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tighter font-headline text-[#1A3651] mb-3">Sugerencias para ti</h1>
            <p className="text-[#43474d] text-base md:text-lg leading-relaxed">Basado en tus preferencias, hemos filtrado estas residencias. Selecciona hasta 3 para compararlas detalle a detalle.</p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#e2e3e1] rounded-xl font-semibold text-[#1A3651] hover:bg-[#f4f4f2] transition-colors whitespace-nowrap">
              <span className="material-symbols-outlined text-[20px]">filter_list</span> Filtros Activos
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-24">
          {propiedades.map((prop) => {
            const isSelected = seleccionadas.includes(prop.id);
            return (
              <div key={prop.id} className={`group bg-white rounded-xl overflow-hidden shadow-sm transition-all duration-300 border-2 ${isSelected ? 'border-[#C5A059] shadow-md transform -translate-y-1' : 'border-transparent hover:-translate-y-1 hover:shadow-md'}`}>
                <div className="relative h-60 md:h-72 overflow-hidden">
                  <img alt={prop.titulo} src={prop.img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  {prop.match && (
                    <div className="absolute top-4 left-4 bg-[#C5A059] text-white px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span> Match
                    </div>
                  )}
                  <div onClick={() => toggleSeleccion(prop.id)} className={`absolute top-4 right-4 p-2 rounded-full cursor-pointer transition-all shadow-sm flex items-center justify-center h-10 w-10 ${isSelected ? 'bg-[#C5A059] text-white' : 'bg-white/80 text-[#1A3651] hover:bg-white backdrop-blur-md'}`}>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: isSelected ? "'FILL' 1" : "'FILL' 0" }}>{isSelected ? 'check_circle' : 'add'}</span>
                  </div>
                </div>
                <div className="p-5 md:p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg md:text-xl font-bold font-headline text-[#1A3651] leading-tight line-clamp-1">{prop.titulo}</h3>
                  </div>
                  <span className="text-xl md:text-2xl font-extrabold text-[#C5A059] block mb-2">{prop.precio}</span>
                  <p className="text-[#43474d] flex items-center gap-1 mb-6 text-sm">
                    <span className="material-symbols-outlined text-sm">location_on</span> {prop.ubicacion}
                  </p>
                  <div className="flex justify-between items-center py-4 border-t border-[#e2e3e1]">
                    <div className="flex flex-col items-center"><span className="material-symbols-outlined text-[#1A3651]">bed</span><span className="text-xs font-semibold text-[#73777e] mt-1">{prop.hab} Hab.</span></div>
                    <div className="flex flex-col items-center"><span className="material-symbols-outlined text-[#1A3651]">bathtub</span><span className="text-xs font-semibold text-[#73777e] mt-1">{prop.banos} Baños</span></div>
                    <div className="flex flex-col items-center"><span className="material-symbols-outlined text-[#1A3651]">straighten</span><span className="text-xs font-semibold text-[#73777e] mt-1">{prop.m2} m²</span></div>
                    <div className="flex flex-col items-center"><span className="material-symbols-outlined text-[#1A3651]">directions_car</span><span className="text-xs font-semibold text-[#73777e] mt-1">{prop.estac} Estac.</span></div>
                  </div>
                  <button onClick={() => toggleSeleccion(prop.id)} className={`w-full py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors border ${isSelected ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' : 'bg-[#f4f4f2] text-[#1A3651] border-transparent hover:bg-[#e8e8e6]'}`}>
                    {isSelected ? 'Quitar de la lista' : 'Añadir a Comparativa'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Floating Action Banner (Dinamismo para ir a Matriz) */}
      {seleccionadas.length > 0 && (
        <div className="fixed bottom-24 md:bottom-10 left-1/2 transform -translate-x-1/2 bg-[#1A3651] text-white px-4 md:px-6 py-3 md:py-4 rounded-2xl shadow-2xl flex items-center gap-4 z-50 w-[90%] max-w-md justify-between border border-[#2e4965] animate-fade-in-up">
          <div className="flex flex-col">
            <span className="text-xs text-[#aec9ea] uppercase tracking-wider font-bold">A comparar</span>
            <span className="font-headline font-extrabold text-lg">{seleccionadas.length} de 3 listos</span>
          </div>
          <button onClick={() => navigate(`/matriz/${idVisita}`)} className="bg-[#C5A059] hover:bg-[#b08d4a] text-white px-5 py-2.5 rounded-xl font-headline font-bold transition-all shadow-md flex items-center gap-2 active:scale-95">
            Ver Matriz <span className="material-symbols-outlined text-lg">view_column</span>
          </button>
        </div>
      )}

      <section className="max-w-7xl mx-auto px-4 md:px-6 pb-24">
        <div className="flex justify-end">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-[#e2e3e1] max-w-md border-l-4 border-l-[#C5A059] flex flex-col items-center text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden mb-4 border-2 border-[#C5A059] p-1">
              <img alt="Asesor" src={fotoAsesor} className="w-full h-full object-cover rounded-full" />
            </div>
            <h4 className="text-[#1A3651] font-headline font-bold text-lg md:text-xl mb-2">¿Buscas algo diferente?</h4>
            <p className="text-[#43474d] mb-6 leading-relaxed text-sm md:text-base">Tu asesor <span className="font-bold text-[#1A3651]">{nombreAsesor}</span> puede ayudarte a encontrar la propiedad ideal.</p>
            <a href={`https://wa.me/${telefonoAsesor}`} target="_blank" rel="noreferrer" className="w-full bg-[#25D366] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-3 hover:brightness-95 transition-all shadow-sm">
              {/* SVG de WhatsApp para el asesor */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
              </svg>
              Contactar Agente
            </a>
          </div>
        </div>
      </section>

      <nav className="md:hidden bg-white/95 backdrop-blur-xl fixed bottom-0 w-full z-40 rounded-t-3xl shadow-[0_-10px_40px_rgba(26,54,81,0.08)] border-t border-[#e2e3e1]">
        <div className="flex justify-around items-center px-4 pb-6 pt-3">
          <div className="flex flex-col items-center text-[#1A3651]/40"><span className="material-symbols-outlined">home</span><span className="font-body text-[10px] uppercase tracking-widest mt-1">Inicio</span></div>
          <div className="flex flex-col items-center text-[#C5A059] bg-[#C5A059]/10 rounded-2xl px-4 py-2"><span className="material-symbols-outlined">search</span><span className="font-body font-bold text-[10px] uppercase tracking-widest mt-1">Catálogo</span></div>
          <div className="flex flex-col items-center text-[#1A3651]/40"><span className="material-symbols-outlined">calendar_today</span><span className="font-body text-[10px] uppercase tracking-widest mt-1">Visitas</span></div>
          <div className="flex flex-col items-center text-[#1A3651]/40"><span className="material-symbols-outlined">person</span><span className="font-body text-[10px] uppercase tracking-widest mt-1">Perfil</span></div>
        </div>
      </nav>
    </div>
  );
};