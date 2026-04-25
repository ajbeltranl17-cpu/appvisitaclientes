import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { BrandLogo } from '../components/BrandLogo';
import { Sidebar } from '../components/Sidebar';

// NOTA: Hemos eliminado la importación local de la imagen para evitar el error de Vite.

interface VisitaData {
  nombreCliente: string;
  whatsappCliente: string;
  ubicacionPropiedad: string;
  urlGoogleMaps: string;
  urlPropiedad: string;
  fechaVisita: string;
  horaVisita: string;
  nombreAsesor: string;
  whatsappAsesor: string;
  fotoAsesor?: string;
}

export const Dashboard: React.FC = () => {
  const { idVisita } = useParams<{ idVisita: string }>();
  const [visitaData, setVisitaData] = useState<VisitaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [ogImage, setOgImage] = useState<string | null>(null);
  const [ogTitle, setOgTitle] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const FOTO_DEFAULT_ASESOR = "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80";
  
  // URL temporal de un mapa para evitar que la página se rompa
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
        console.error("Error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchVisita();
  }, [idVisita]);

  useEffect(() => {
    if (visitaData?.urlPropiedad) {
      const fetchOgData = async () => {
        try {
          const response = await fetch(`https://api.microlink.io?url=${encodeURIComponent(visitaData.urlPropiedad)}`);
          const data = await response.json();
          if (data.status === 'success') {
            if (data.data?.image?.url) setOgImage(data.data.image.url);
            if (data.data?.title) setOgTitle(data.data.title);
          }
        } catch (err) { console.error(err); }
      };
      fetchOgData();
    }
  }, [visitaData?.urlPropiedad]);

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
  const whatsappUrlAsesor = `https://wa.me/${cleanWhatsappAsesor}?text=${encodeURIComponent('Hola, tengo una duda sobre mi visita...')}`;
  const firstName = visitaData.nombreCliente ? visitaData.nombreCliente.split(' ')[0] : 'Cliente';

  return (
    <div className="bg-[#f9f9f7] text-[#1a1c1b] font-body antialiased min-h-screen flex flex-col items-center pb-24 md:pb-0 relative overflow-x-hidden">
      <Sidebar isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      
      <header className="fixed top-0 w-full z-50 bg-[#f9f9f7]/80 backdrop-blur-xl shadow-sm flex justify-between items-center px-4 md:px-8 py-4">
        <div className="flex items-center gap-2 md:gap-4">
          <button onClick={() => setIsDrawerOpen(true)} className="p-2 text-[#1A3651] hover:bg-black/5 rounded-full transition-all flex">
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>
          <BrandLogo className="h-8 md:h-10 w-auto hidden sm:block" />
          <div className="text-lg md:text-2xl font-extrabold text-[#1A3651] font-headline tracking-tight uppercase">Tu Conexión Inmobiliaria</div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="w-10 h-10 rounded-full bg-[#e8e8e6] overflow-hidden border-2 border-[#C5A059]/20 shadow-sm">
            <img 
              alt="Asesor" 
              className="w-full h-full object-cover" 
              src={visitaData.fotoAsesor || FOTO_DEFAULT_ASESOR} 
            />
          </div>
        </div>
      </header>

      <main className="w-full max-w-4xl mx-auto px-4 pt-28 flex flex-col gap-8">
        <section className="flex flex-col items-center md:items-start text-center md:text-left gap-4">
          <BrandLogo className="h-16 w-auto" />
          <h1 className="font-headline text-3xl md:text-4xl font-extrabold text-[#00213b] tracking-tight">Hola, {firstName}</h1>
        </section>

        <div className="flex flex-col gap-4">
          <p className="font-headline text-sm font-bold text-[#00213b]">Hora de la cita: <span className="text-[#43474d]">{visitaData.horaVisita} hrs</span></p>
          <section className="bg-white rounded-xl overflow-hidden shadow-sm flex flex-col relative group">
            <div className="relative w-full aspect-video md:aspect-[21/9] overflow-hidden">
              <img alt="Propiedad" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={ogImage || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200"} />
              <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-lg text-xs font-bold text-[#00213b] uppercase shadow-sm">Próxima Visita</div>
            </div>
            <div className="p-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-col">
                <h2 className="font-headline text-lg font-bold text-[#00213b]">{ogTitle || visitaData.ubicacionPropiedad}</h2>
                <a href={visitaData.urlPropiedad} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-bold text-[#775a19] hover:text-[#00213b] transition-colors mt-1">Ver ficha técnica <span className="material-symbols-outlined text-sm">arrow_forward</span></a>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="bg-white rounded-xl p-2 shadow-sm border border-[#e2e3e1]">
              <div className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden bg-[#e2e3e1]">
                <img 
                  src={IMAGEN_MAPA_ZONA} 
                  alt="Mapa de la Zona" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[#1A3651]/10 flex items-center justify-center backdrop-blur-[1px]">
                    <span className="bg-white/80 text-[#1A3651] px-4 py-1.5 rounded-full font-label text-xs uppercase font-bold tracking-widest shadow-md">Zona de Interés</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => window.open(visitaData.urlGoogleMaps, '_blank')} 
              className="w-full bg-[#fed488] text-[#785a1a] hover:bg-[#e9c176] py-4 rounded-lg font-headline font-bold text-sm flex justify-center items-center gap-2 shadow-md transition-colors"
            >
              <span className="material-symbols-outlined">directions_car</span> 
              Abrir GPS / Cómo llegar
            </button>
          </section>
        </div>

        <section className="flex flex-col gap-3">
          <h3 className="font-headline text-sm font-bold text-[#00213b] mb-2 uppercase tracking-widest">Accesos Rápidos</h3>
          
          <Link to={`/iniciar-visita/${idVisita}`} className="flex items-center justify-between p-5 bg-[#f4f4f2] hover:bg-[#e2e3e1] transition-colors rounded-xl group">
            <div className="flex items-center gap-4"><span className="material-symbols-outlined text-[#00213b]">visibility</span><span className="font-headline font-semibold text-[#00213b]">Iniciar Visita</span></div>
            <span className="material-symbols-outlined text-[#43474d] group-hover:translate-x-1 transition-transform">chevron_right</span>
          </Link>

          <Link to={`/analisis/${idVisita}`} className="flex items-center justify-between p-5 bg-[#f4f4f2] hover:bg-[#e2e3e1] transition-colors rounded-xl group">
            <div className="flex items-center gap-4"><span className="material-symbols-outlined text-[#00213b]">map</span><span className="font-headline font-semibold text-[#00213b]">Análisis de la Zona</span></div>
            <span className="material-symbols-outlined text-[#43474d] group-hover:translate-x-1 transition-transform">chevron_right</span>
          </Link>

          <Link to="#" className="flex items-center justify-between p-5 bg-[#f4f4f2] hover:bg-[#e2e3e1] transition-colors rounded-xl group">
            <div className="flex items-center gap-4"><span className="material-symbols-outlined text-[#00213b]">account_balance_wallet</span><span className="font-headline font-semibold text-[#00213b]">Calculadora Hipotecaria</span></div>
            <span className="material-symbols-outlined text-[#43474d] group-hover:translate-x-1 transition-transform">chevron_right</span>
          </Link>

          <Link to="#" className="flex items-center justify-between p-5 bg-[#f4f4f2] hover:bg-[#e2e3e1] transition-colors rounded-xl group">
            <div className="flex items-center gap-4"><span className="material-symbols-outlined text-[#00213b]">trending_up</span><span className="font-headline font-semibold text-[#00213b]">Calculadora de Plusvalía</span></div>
            <span className="material-symbols-outlined text-[#43474d] group-hover:translate-x-1 transition-transform">chevron_right</span>
          </Link>

          <Link to={`/galeria/${idVisita}`} className="flex items-center justify-between p-5 bg-[#f4f4f2] hover:bg-[#e2e3e1] transition-colors rounded-xl group">
            <div className="flex items-center gap-4"><span className="material-symbols-outlined text-[#00213b]">photo_library</span><span className="font-headline font-semibold text-[#00213b]">Galería de mi Visita</span></div>
            <span className="material-symbols-outlined text-[#43474d] group-hover:translate-x-1 transition-transform">chevron_right</span>
          </Link>

          <Link to={`/amueblar/${idVisita}`} className="flex items-center justify-between p-5 bg-[#f4f4f2] hover:bg-[#e2e3e1] transition-colors rounded-xl group">
            <div className="flex items-center gap-4"><span className="material-symbols-outlined text-[#00213b]">auto_awesome</span><span className="font-headline font-semibold text-[#00213b]">Amueblar con IA</span></div>
            <span className="material-symbols-outlined text-[#43474d] group-hover:translate-x-1 transition-transform">chevron_right</span>
          </Link>

          <Link to={`/swipe/${idVisita}`} className="flex items-center justify-between p-5 bg-[#f4f4f2] hover:bg-[#e2e3e1] transition-colors rounded-xl group">
            <div className="flex items-center gap-4"><span className="material-symbols-outlined text-[#00213b]">style</span><span className="font-headline font-semibold text-[#00213b]">Swipe en Pareja</span></div>
            <span className="material-symbols-outlined text-[#43474d] group-hover:translate-x-1 transition-transform">chevron_right</span>
          </Link>

          <Link to={`/deseos/${idVisita}`} className="flex items-center justify-between p-5 bg-[#f4f4f2] hover:bg-[#e2e3e1] transition-colors rounded-xl group">
            <div className="flex items-center gap-4"><span className="material-symbols-outlined text-[#00213b]">favorite</span><span className="font-headline font-semibold text-[#00213b]">Mis Deseos</span></div>
            <span className="material-symbols-outlined text-[#43474d] group-hover:translate-x-1 transition-transform">chevron_right</span>
          </Link>

          <Link to={`/catalogo/${idVisita}`} className="flex items-center justify-between p-5 bg-[#f4f4f2] hover:bg-[#e2e3e1] transition-colors rounded-xl group">
            <div className="flex items-center gap-4"><span className="material-symbols-outlined text-[#00213b]">domain</span><span className="font-headline font-semibold text-[#00213b]">Catálogo de Propiedades</span></div>
            <span className="material-symbols-outlined text-[#43474d] group-hover:translate-x-1 transition-transform">chevron_right</span>
          </Link>

          <Link to={`/matriz/${idVisita}`} className="flex items-center justify-between p-5 bg-white shadow-md rounded-xl group border-l-4 border-[#C5A059] mt-2">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#fed488]/20 flex items-center justify-center text-[#775a19]"><span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>compare_arrows</span></div>
              <span className="font-headline font-bold text-[#00213b]">Matriz Comparativa</span>
            </div>
            <span className="material-symbols-outlined text-[#C5A059] group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>
        </section>
      </main>

      <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-3">
        {isMenuOpen && (
          <div className="mb-2 bg-white rounded-2xl shadow-2xl overflow-hidden min-w-[220px] animate-in slide-in-from-bottom-4 duration-200">
            <div className="flex flex-col">
              <a href={whatsappUrlAsesor} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 hover:bg-[#f4f4f2] border-b border-black/5">
                <span className="material-symbols-outlined text-green-600">chat</span>
                <span className="font-headline font-semibold text-sm text-[#00213b]">Hablar con {visitaData.nombreAsesor || 'mi Asesor'}</span>
              </a>
              <a href="tel:+123456789" className="flex items-center gap-3 p-4 hover:bg-[#f4f4f2]">
                <span className="material-symbols-outlined text-red-500">call</span>
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
    </div>
  );
};