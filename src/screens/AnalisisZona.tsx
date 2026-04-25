import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { BrandLogo } from '../components/BrandLogo';

interface VisitaData {
  nombreCliente: string;
  ubicacionPropiedad: string;
  urlGoogleMaps: string;
  nombreAsesor: string;
  whatsappAsesor: string;
  fotoAsesor?: string;
}

export const AnalisisZona = () => {
  const { idVisita } = useParams<{ idVisita: string }>();
  const navigate = useNavigate();
  const [visitaData, setVisitaData] = useState<VisitaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const FOTO_DEFAULT_ASESOR = "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80";
  // Imagen web temporal para evitar el error de Vite (puedes cambiarla después por tu archivo local)
  const IMAGEN_MAPA_ZONA = "https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

  useEffect(() => {
    const fetchVisita = async () => {
      if (!idVisita) {
        setError(true);
        setLoading(false);
        return;
      }
      try {
        const docRef = doc(db, 'visitas', idVisita);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setVisitaData(docSnap.data() as VisitaData);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error al cargar la visita:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchVisita();
  }, [idVisita]);

  if (loading) return (
    <div className="bg-[#f9f9f7] min-h-screen flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-[#1A3651]/20 border-t-[#C5A059] rounded-full animate-spin mb-4"></div>
    </div>
  );

  if (error || !visitaData) return (
    <div className="bg-[#f9f9f7] min-h-screen flex items-center justify-center p-8 text-center">
      <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md">
        <span className="material-symbols-outlined text-6xl text-red-600 mb-4">error</span>
        <h2 className="text-2xl font-bold mb-8">Información no disponible</h2>
        <button onClick={() => navigate('/')} className="w-full bg-[#1A3651] text-white py-4 rounded-xl font-bold">Volver al Inicio</button>
      </div>
    </div>
  );

  const cleanWhatsappAsesor = visitaData.whatsappAsesor?.replace(/\D/g, '') || '';
  const whatsappUrlAsesor = `https://wa.me/${cleanWhatsappAsesor}?text=${encodeURIComponent('Hola, tengo dudas sobre el análisis de la zona de mi visita.')}`;

  return (
    <div className="bg-[#f9f9f7] text-[#1a1c1b] font-body antialiased min-h-screen flex flex-col relative pb-32">
      
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl shadow-sm border-b border-[#e2e3e1]">
        <div className="flex justify-between items-center px-4 md:px-6 py-4 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3 md:gap-4">
            <button 
              onClick={() => navigate(`/dashboard/${idVisita}`)}
              className="text-[#1A3651] hover:text-[#C5A059] transition-colors p-1 md:pr-2"
              title="Regresar al Dashboard"
            >
              <span className="material-symbols-outlined text-2xl md:text-xl">arrow_back</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="hidden sm:block"><BrandLogo /></div>
              <span className="text-sm md:text-lg font-extrabold tracking-tighter font-headline uppercase leading-tight text-[#1A3651]">
                Tu Conexión Inmobiliaria
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#e8e8e6] overflow-hidden border-2 border-[#C5A059]/20 shadow-sm">
              <img alt="Asesor" className="w-full h-full object-cover" src={visitaData.fotoAsesor || FOTO_DEFAULT_ASESOR} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center px-4 pt-28 pb-8 w-full max-w-2xl mx-auto mt-2">
        
        <div className="w-full text-center md:text-left mb-8">
          <span className="text-[#C5A059] font-headline font-bold tracking-widest uppercase text-xs mb-2 block">Entorno y Plusvalía</span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-headline text-[#1A3651] mb-2">Análisis de la Zona</h1>
          <p className="text-[#43474d] text-base">{visitaData.ubicacionPropiedad}</p>
        </div>

        {/* Sección de Ubicación Estática */}
        <section className="w-full flex flex-col gap-4 mb-10">
          <div className="bg-white rounded-xl p-2 shadow-sm border border-[#e2e3e1]">
            <div className="relative w-full h-56 md:h-72 rounded-lg overflow-hidden bg-[#e2e3e1]">
              <img 
                src={IMAGEN_MAPA_ZONA} 
                alt="Mapa de la Zona" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#1A3651]/10 flex items-center justify-center backdrop-blur-[1px]">
                  <span className="bg-white/90 text-[#1A3651] px-5 py-2 rounded-full font-label text-xs uppercase font-bold tracking-widest shadow-lg">Ubicación Estratégica</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => window.open(visitaData.urlGoogleMaps, '_blank')} 
            className="w-full bg-[#fed488] text-[#785a1a] hover:bg-[#e9c176] py-4 rounded-xl font-headline font-bold text-base flex justify-center items-center gap-2 shadow-md transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[22px]">directions_car</span> 
            Abrir GPS / Cómo llegar
          </button>
        </section>

        {/* Tarjetas de Datos de la Zona */}
        <section className="w-full grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#e2e3e1] flex flex-col gap-2">
            <div className="w-10 h-10 bg-[#f4f4f2] rounded-full flex items-center justify-center text-[#1A3651] mb-2">
              <span className="material-symbols-outlined text-[20px]">trending_up</span>
            </div>
            <span className="text-[10px] font-extrabold text-[#73777e] uppercase tracking-widest">Plusvalía</span>
            <span className="font-headline font-extrabold text-xl text-[#1A3651]">Alta (12-15%)</span>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#e2e3e1] flex flex-col gap-2">
            <div className="w-10 h-10 bg-[#f4f4f2] rounded-full flex items-center justify-center text-[#1A3651] mb-2">
              <span className="material-symbols-outlined text-[20px]">local_mall</span>
            </div>
            <span className="text-[10px] font-extrabold text-[#73777e] uppercase tracking-widest">Comercio</span>
            <span className="font-headline font-extrabold text-xl text-[#1A3651]">A 5 min.</span>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#e2e3e1] flex flex-col gap-2">
            <div className="w-10 h-10 bg-[#f4f4f2] rounded-full flex items-center justify-center text-[#1A3651] mb-2">
              <span className="material-symbols-outlined text-[20px]">security</span>
            </div>
            <span className="text-[10px] font-extrabold text-[#73777e] uppercase tracking-widest">Seguridad</span>
            <span className="font-headline font-extrabold text-xl text-[#1A3651]">Controlada</span>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#e2e3e1] flex flex-col gap-2">
            <div className="w-10 h-10 bg-[#f4f4f2] rounded-full flex items-center justify-center text-[#1A3651] mb-2">
              <span className="material-symbols-outlined text-[20px]">school</span>
            </div>
            <span className="text-[10px] font-extrabold text-[#73777e] uppercase tracking-widest">Colegios</span>
            <span className="font-headline font-extrabold text-xl text-[#1A3651]">Zona Escolar</span>
          </div>
        </section>

      </main>

      {/* Menú de Soporte Flotante y Botón WhatsApp */}
      <div className="fixed bottom-24 md:bottom-6 right-6 z-[60] flex flex-col items-end gap-3">
        {isMenuOpen && (
          <div className="mb-2 bg-white rounded-2xl shadow-2xl overflow-hidden min-w-[220px] animate-in slide-in-from-bottom-4 duration-200 border border-[#e2e3e1]">
            <div className="flex flex-col">
              <a href={whatsappUrlAsesor} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 hover:bg-[#f4f4f2] border-b border-[#e2e3e1]">
                <span className="material-symbols-outlined text-[#25D366]">chat</span>
                <span className="font-headline font-semibold text-sm text-[#00213b]">Hablar con {visitaData.nombreAsesor || 'mi Asesor'}</span>
              </a>
              <a href="tel:+123456789" className="flex items-center gap-3 p-4 hover:bg-[#f4f4f2]">
                <span className="material-symbols-outlined text-[#ba1a1a]">call</span>
                <span className="font-headline font-semibold text-sm text-[#00213b]">Llamada de Emergencia</span>
              </a>
            </div>
          </div>
        )}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-all bg-[#25D366] hover:bg-[#128C7E]">
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="white" viewBox="0 0 16 16">
            <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
          </svg>
        </button>
      </div>

      {/* BottomNavBar Móvil */}
      <nav className="fixed bottom-0 w-full rounded-t-[2rem] bg-white/90 backdrop-blur-xl shadow-[0_-10px_40px_rgba(26,54,81,0.08)] md:hidden border-t border-[#e2e3e1]">
        <div className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-8 pt-4">
          <button className="flex flex-col items-center justify-center text-[#C5A059] bg-[#C5A059]/10 rounded-full px-5 py-2 group">
            <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: "'FILL' 1" }}>explore</span>
            <span className="font-body text-[10px] font-semibold uppercase tracking-widest">Zona</span>
          </button>
          <button onClick={() => navigate(`/deseos/${idVisita}`)} className="flex flex-col items-center justify-center text-[#1A3651]/40 hover:text-[#C5A059] transition-colors group">
            <span className="material-symbols-outlined mb-1 group-active:scale-95 duration-200" style={{ fontVariationSettings: "'FILL' 0" }}>favorite</span>
            <span className="font-body text-[10px] font-semibold uppercase tracking-widest">Deseos</span>
          </button>
          <button onClick={() => navigate(`/matriz/${idVisita}`)} className="flex flex-col items-center justify-center text-[#1A3651]/40 hover:text-[#C5A059] transition-colors group">
            <span className="material-symbols-outlined mb-1 group-active:scale-95 duration-200" style={{ fontVariationSettings: "'FILL' 0" }}>compare_arrows</span>
            <span className="font-body text-[10px] font-semibold uppercase tracking-widest">Matriz</span>
          </button>
        </div>
      </nav>
    </div>
  );
};