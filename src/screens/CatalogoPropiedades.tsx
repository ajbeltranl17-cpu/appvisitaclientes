import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EncabezadoGlobal } from '../components/EncabezadoGlobal';

export const CatalogoPropiedades = () => {
  const { idVisita } = useParams();
  const navigate = useNavigate();

  // Estado para la barra flotante de comparación (inicia con 1 pre-seleccionado para la demo)
  const [seleccionados, setSeleccionados] = useState<string[]>(['1']);

  const propiedades = [
    {
      id: '1',
      titulo: 'Residencia Costa de Oro',
      precio: 8500000,
      ubicacion: 'Boca del Río',
      habitaciones: 4,
      banos: 3,
      m2: 450,
      estacionamientos: 3,
      img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800',
      match: true
    },
    {
      id: '2',
      titulo: 'Loft Distrito K',
      precio: 8900000,
      ubicacion: 'Riviera Veracruzana',
      habitaciones: 3,
      banos: 2.5,
      m2: 280,
      estacionamientos: 2,
      img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800',
      match: false
    },
    {
      id: '3',
      titulo: 'Torre Alvento, PH',
      precio: 12450000,
      ubicacion: 'Boca del Río',
      habitaciones: 3,
      banos: 3.5,
      m2: 320,
      estacionamientos: 2,
      img: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800',
      match: false
    }
  ];

  const toggleSeleccion = (id: string) => {
    if (seleccionados.includes(id)) {
      setSeleccionados(seleccionados.filter(item => item !== id));
    } else {
      if (seleccionados.length < 3) {
        setSeleccionados([...seleccionados, id]);
      } else {
        alert('Puedes comparar un máximo de 3 propiedades simultáneamente.');
      }
    }
  };

  const formatearMoneda = (valor: number) => 
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(valor);

  // FUNCIÓN DE WHATSAPP PREGRABADO POR PROPIEDAD
  const contactarAsesor = (propiedad: any) => {
    const numeroAsesor = "5212290000000"; // En Fase Backend esto viene del perfil del asesor
    const mensaje = `¡Hola! Estoy navegando por mi catálogo personalizado y me interesó mucho la propiedad: *${propiedad.titulo}* (${formatearMoneda(propiedad.precio)}). ¿Me podrías dar más detalles?`;
    window.open(`https://wa.me/${numeroAsesor}?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-32">
      <EncabezadoGlobal 
        rutaAnterior={`/mis-deseos/${idVisita}`}
        textoAnterior="Mis Deseos"
        rutaSiguiente={`/matriz/${idVisita}`}
        textoSiguiente="Comparar"
      />

      <main className="p-4 max-w-5xl mx-auto w-full space-y-6">
        
        <section className="px-2">
          <h1 className="text-3xl font-black text-[#00213b] mt-1">Sugerencias para ti</h1>
          <p className="text-gray-500 text-sm mt-2">Basado en tus preferencias, hemos filtrado estas residencias. Selecciona hasta 3 para compararlas detalle a detalle.</p>
        </section>

        {/* Grid de Propiedades */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {propiedades.map((prop) => {
            const isSelected = seleccionados.includes(prop.id);
            return (
              <div key={prop.id} className={`bg-white rounded-3xl overflow-hidden shadow-sm border-2 transition-all ${isSelected ? 'border-[#C5A059]' : 'border-transparent'}`}>
                
                {/* Imagen y Etiquetas */}
                <div className="relative h-56 w-full bg-gray-200">
                  <img src={prop.img} alt={prop.titulo} className="w-full h-full object-cover" />
                  
                  {prop.match && (
                    <div className="absolute top-4 left-4 bg-[#C5A059] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md">
                      <span className="material-symbols-outlined text-xs">star</span>
                      Match
                    </div>
                  )}
                  
                  {isSelected && (
                    <div className="absolute top-4 right-4 bg-[#C5A059] text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md">
                      <span className="material-symbols-outlined text-sm">check</span>
                    </div>
                  )}
                </div>

                {/* Info de la Propiedad */}
                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="text-lg font-black text-[#00213b]">{prop.titulo}</h3>
                    <p className="text-xl font-bold text-[#C5A059] mt-1">{formatearMoneda(prop.precio)}</p>
                    <div className="flex items-center gap-1 text-gray-500 mt-2 text-sm font-medium">
                      <span className="material-symbols-outlined text-[16px]">location_on</span>
                      {prop.ubicacion}
                    </div>
                  </div>

                  {/* Íconos de características */}
                  <div className="grid grid-cols-4 gap-2 border-t border-b border-gray-100 py-4">
                    <div className="flex flex-col items-center text-center">
                      <span className="material-symbols-outlined text-[#00213b] mb-1 text-lg">bed</span>
                      <span className="text-[10px] text-gray-500 font-bold">{prop.habitaciones} Hab.</span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <span className="material-symbols-outlined text-[#00213b] mb-1 text-lg">shower</span>
                      <span className="text-[10px] text-gray-500 font-bold">{prop.banos} Baños</span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <span className="material-symbols-outlined text-[#00213b] mb-1 text-lg">square_foot</span>
                      <span className="text-[10px] text-gray-500 font-bold">{prop.m2} m²</span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <span className="material-symbols-outlined text-[#00213b] mb-1 text-lg">directions_car</span>
                      <span className="text-[10px] text-gray-500 font-bold">{prop.estacionamientos} Estac.</span>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="space-y-3 pt-2">
                    <button 
                      onClick={() => toggleSeleccion(prop.id)}
                      className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all ${isSelected ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-gray-50 text-[#00213b] hover:bg-gray-100'}`}
                    >
                      {isSelected ? 'Quitar de la lista' : 'Añadir a Comparativa'}
                    </button>
                    
                    <button 
                      onClick={() => contactarAsesor(prop)}
                      className="w-full py-3.5 rounded-2xl font-bold text-sm bg-[#25D366] text-white flex items-center justify-center gap-2 hover:bg-[#20bd5a] shadow-sm active:scale-95 transition-all"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.031 0C5.385 0 0 5.386 0 12.033c0 2.128.553 4.205 1.604 6.035L.145 24l6.113-1.605c1.764.966 3.754 1.476 5.77 1.476 6.647 0 12.034-5.386 12.034-12.034C24 5.386 18.678 0 12.031 0zm0 21.894c-1.802 0-3.565-.484-5.112-1.404l-.367-.218-3.805.998.998-3.71-.238-.38A9.873 9.873 0 0 1 2.051 12.033c0-5.513 4.487-10 10-10 5.513 0 10 4.487 10 10s-4.487 10-9.999 10zm5.485-7.493c-.302-.15-1.785-.88-2.062-.98-.278-.1-.481-.15-.683.15-.203.301-.781.98-.957 1.18-.175.201-.35.226-.652.076-1.528-.758-2.613-1.442-3.626-3.15-.176-.297-.018-.458.133-.608.135-.135.302-.352.453-.528.15-.176.202-.301.302-.502.1-.201.05-.377-.025-.527-.075-.15-.683-1.645-.935-2.253-.246-.593-.497-.512-.683-.521-.175-.009-.376-.009-.578-.009-.202 0-.528.075-.805.376-.277.301-1.056 1.031-1.056 2.513 0 1.482 1.082 2.915 1.233 3.116.15.201 2.126 3.245 5.15 4.547 2.08 .894 2.87 .974 3.938.82 1.156-.168 3.565-1.457 4.067-2.865.503-1.408.503-2.614.353-2.865-.151-.252-.553-.402-.855-.553z"/></svg>
                      Preguntar por WhatsApp
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Barra Flotante Inferior de Comparativa (Aparece sólo si hay selección) */}
      {seleccionados.length > 0 && (
        <div className="fixed bottom-6 left-0 w-full px-4 z-50 flex justify-center pointer-events-none">
          <div className="bg-[#00213b] text-white rounded-[2rem] p-4 shadow-[0_10px_40px_rgba(0,33,59,0.3)] flex items-center justify-between w-full max-w-sm pointer-events-auto border border-white/10">
            <div className="pl-2">
              <p className="text-[9px] uppercase tracking-[0.2em] font-bold opacity-70">A comparar</p>
              <p className="font-black text-lg leading-tight">{seleccionados.length} de 3 listos</p>
            </div>
            <button 
              onClick={() => navigate(`/matriz/${idVisita}`)}
              className="bg-[#C5A059] text-white px-6 py-3.5 rounded-2xl font-bold flex items-center gap-2 active:scale-95 transition-transform"
            >
              Ver Matriz
              <span className="material-symbols-outlined text-sm">view_week</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};