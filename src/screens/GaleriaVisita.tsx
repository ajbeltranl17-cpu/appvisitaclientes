import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { EncabezadoGlobal } from '../components/EncabezadoGlobal';

interface VisitaData {
  fotosCliente?: string[];
  fotosOficiales?: string[]; // Dejamos la tubería lista para la Fase 2
}

export const GaleriaVisita = () => {
  const navigate = useNavigate();
  const { idVisita } = useParams();
  
  // Estados
  const [categoriaActiva, setCategoriaActiva] = useState('Mis Capturas');
  const [fotosUsuario, setFotosUsuario] = useState<string[]>([]);
  const [fotosBackend, setFotosBackend] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Conexión a Firebase
  useEffect(() => {
    const fetchFotos = async () => {
      if (!idVisita) return;
      try {
        const docRef = doc(db, 'visitas', idVisita);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data() as VisitaData;
          if (data.fotosCliente) setFotosUsuario(data.fotosCliente);
          if (data.fotosOficiales) setFotosBackend(data.fotosOficiales);
        }
      } catch (error) {
        console.error("Error al cargar la galería:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFotos();
  }, [idVisita]);

  // Construcción dinámica de categorías dependiendo de lo que haya en la base de datos
  const categorias = [];
  if (fotosUsuario.length > 0) categorias.push('Mis Capturas');
  if (fotosBackend.length > 0) categorias.push('Fotos Oficiales');

  // Si por alguna razón no hay fotos de nada, ponemos una por defecto para que no se rompa la interfaz
  if (categorias.length === 0) categorias.push('Mis Capturas');

  // Preparamos las fotos para mostrarlas
  const fotosMostrar = categoriaActiva === 'Mis Capturas' 
    ? fotosUsuario 
    : fotosBackend;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
         <div className="w-12 h-12 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

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
          <p className="text-gray-500 text-sm mt-2">Tus capturas de la visita. Usa la IA en el siguiente paso para visualizar el potencial de los espacios.</p>
        </section>

        {/* Pestañas (Solo aparecen si hay más de una categoría) */}
        {categorias.length > 1 && (
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
        )}

        {/* Grid de Fotos */}
        <div className="grid grid-cols-2 gap-3">
          {fotosMostrar.length === 0 ? (
            <div className="col-span-2 flex flex-col items-center justify-center p-10 bg-white rounded-3xl border border-gray-100 shadow-sm text-center">
              <span className="material-symbols-outlined text-5xl text-gray-300 mb-3">no_photography</span>
              <h3 className="text-[#00213b] font-bold text-lg">Aún no hay fotos</h3>
              <p className="text-gray-400 text-xs mt-1 px-4">Regresa a la cámara en el menú principal para capturar detalles de esta propiedad.</p>
              <button 
                onClick={() => navigate(`/iniciar-visita/${idVisita}`)}
                className="mt-6 text-[#C5A059] font-bold text-xs uppercase tracking-widest bg-orange-50 px-4 py-2 rounded-full"
              >
                Ir a Cámara
              </button>
            </div>
          ) : (
            fotosMostrar.map((url, index) => (
              <div 
                key={index} 
                className="group relative aspect-square bg-gray-200 rounded-3xl overflow-hidden shadow-sm border border-white hover:shadow-xl transition-all cursor-pointer"
              >
                <img 
                  src={url} 
                  alt={`Captura ${index + 1}`} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Botón Flotante de Diseño IA (Varita Mágica) */}
                <div className="absolute top-2 right-2 z-10">
                  <button 
                   onClick={(e) => {
  e.stopPropagation();
  navigate(`/diseno-ia/${idVisita}`, { state: { fotoSeleccionada: url } });
}}
                    className="bg-[#C5A059] text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform"
                  >
                    <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                  </button>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-white/90 text-xl">zoom_in</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* BOTÓN DE SIGUIENTE PASO: DISEÑA CON IA */}
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