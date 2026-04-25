import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { Sidebar } from '../components/Sidebar';
import { BrandLogo } from '../components/BrandLogo';

export const GaleriaVisita = () => {
  const { idVisita } = useParams();
  const navigate = useNavigate();
  const [visitaData, setVisitaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [fotoSeleccionada, setFotoSeleccionada] = useState(null);

  useEffect(() => {
    const fetchVisitaData = async () => {
      if (!idVisita) {
        setLoading(false);
        return;
      }
      try {
        const visitaRef = doc(db, 'visitas', idVisita);
        const visitaSnap = await getDoc(visitaRef);

        if (visitaSnap.exists()) {
          setVisitaData(visitaSnap.data());
        } else {
          console.error("No se encontró la visita");
        }
      } catch (error) {
        console.error("Error al obtener datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVisitaData();
  }, [idVisita]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-[#1A3651] font-headline font-bold text-xl">Cargando galería...</div>
      </div>
    );
  }

  if (!visitaData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="bg-white p-10 rounded-xl shadow-lg text-center max-w-lg">
          <span className="material-symbols-outlined text-outline text-6xl mb-4">error</span>
          <h1 className="text-3xl font-headline font-extrabold text-[#1A3651] mb-2 tracking-tight">Información no disponible</h1>
          <p className="text-[#43474d] text-lg mb-6">No pudimos cargar los detalles de su visita. Verifique el enlace.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-[#1A3651] text-white px-8 py-3 rounded-lg font-headline font-bold flex items-center gap-2 transition-all mx-auto"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  const closeLightbox = () => setFotoSeleccionada(null);

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {fotoSeleccionada && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 transition-opacity duration-300">
          <button className="absolute top-6 right-6 text-white/70 hover:text-white" onClick={closeLightbox}>
            <span className="material-symbols-outlined text-4xl">close</span>
          </button>
          <img src={fotoSeleccionada} alt="Visita" className="max-w-full max-h-[85vh] object-contain rounded-lg" />
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
            <button
              onClick={() => {
                closeLightbox();
                navigate(`/amueblar/${idVisita}?img=${encodeURIComponent(fotoSeleccionada)}`);
              }}
              className="bg-[#C5A059] hover:bg-[#b08d4a] text-white px-8 py-4 rounded-full font-headline font-bold text-base shadow-2xl flex items-center gap-3 transition-all"
            >
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              <span>Amueblar con IA</span>
            </button>
          </div>
        </div>
      )}

      {/* Header Actualizado */}
      <header className="bg-[#1A3651] fixed top-0 w-full z-40 shadow-md">
        <div className="flex justify-between items-center px-6 py-4 max-w-full relative">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center text-white hover:text-[#C5A059] transition-colors"
          >
            <span className="material-symbols-outlined text-3xl">menu</span>
          </button>

          <div className="flex items-center gap-3 absolute left-1/2 transform -translate-x-1/2">
            <BrandLogo />
            <span className="hidden sm:block text-xl font-bold text-white font-headline tracking-tighter">Tu Conexión Inmobiliaria</span>
          </div>

          <button 
            onClick={() => navigate(`/amueblar/${idVisita}`)}
            className="bg-[#C5A059] text-white px-4 py-2 rounded-lg font-headline font-bold flex items-center gap-2 hover:bg-[#b08d4a] transition-colors"
          >
            Amuebla con IA
            <span className="material-symbols-outlined text-lg">auto_awesome</span>
          </button>
        </div>
      </header>

      <main className="pt-28 pb-10 px-4 md:px-8 max-w-7xl mx-auto">
        
        {/* Títulos */}
        <div className="mb-8">
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-[#1A3651] tracking-tight mb-2">Galería de Mi Visita</h1>
          <p className="text-[#43474d] text-lg">Explora cada rincón de esta propiedad exclusiva.</p>
        </div>

        {/* Lógica de Renderizado: Con Fotos vs Sin Fotos */}
        {visitaData.fotos && visitaData.fotos.length > 0 ? (
          <> 
            {/* ESTADO 1: GALERÍA LLENA */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-[250px]">
              {visitaData.fotos.map((fotoUrl, index) => {
                let bentoClasses = "md:col-span-4 md:row-span-1"; 
                if (index === 0) bentoClasses = "md:col-span-8 md:row-span-2";
                
                return (
                  <div
                    key={index}
                    className={`group relative overflow-hidden rounded-xl bg-[#f4f4f2] cursor-zoom-in ${bentoClasses}`}
                    onClick={() => setFotoSeleccionada(fotoUrl)}
                  >
                    <img 
                      src={fotoUrl} 
                      alt={`Foto ${index}`} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center p-4 bg-transparent hover:bg-black/20 transition-colors pointer-events-none">
                      {index === 0 ? (
                          <div className="opacity-0 group-hover:opacity-100 bg-[#1A3651]/90 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-headline font-bold text-sm shadow-xl transition-all">
                              ver amueblado con IA
                          </div>
                      ) : (
                          <div className="opacity-0 group-hover:opacity-100 bg-[#C5A059] text-white p-3 rounded-full shadow-xl transition-all">
                              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                          </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Botón Inferior para Estado Lleno */}
            <div className="mt-8 flex justify-center w-full"> 
                <button
                    onClick={() => navigate(`/iniciar-visita/${idVisita}`)}
                    className="bg-[#C5A059] text-white px-8 py-3 rounded-full font-headline font-bold text-base shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group z-10"
                >
                    <span className="material-symbols-outlined text-xl">arrow_back</span>
                    Tomar Más Fotos
                </button>
            </div>
          </>
        ) : (
          <>
            {/* ESTADO 2: ESTADO VACÍO (SIN FOTOS) - CAJA PUNTEADA LIMPIA */}
            <div className="bg-[#f9f9f7] p-12 rounded-2xl text-center border-2 border-dashed border-[#e2e3e1] flex flex-col items-center gap-6">
              <span className="material-symbols-outlined text-[#73777e] text-7xl">photo_camera</span>
              <h2 className="text-2xl font-headline font-bold text-[#1A3651]">Aún no hay fotos de esta propiedad</h2>
            </div>

            {/* Botón Inferior para Estado Vacío (Fuera de la caja) */}
            <div className="mt-8 flex justify-center w-full"> 
                <button
                    onClick={() => navigate(`/iniciar-visita/${idVisita}`)}
                    className="bg-[#C5A059] text-white px-8 py-3 rounded-full font-headline font-bold text-base shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group z-10"
                >
                    <span className="material-symbols-outlined text-xl">arrow_back</span>
                    Tomar Más Fotos
                </button>
            </div>
          </>
        )}
      </main>
    </>
  );
};