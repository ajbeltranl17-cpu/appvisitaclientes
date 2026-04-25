import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { BrandLogo } from '../components/BrandLogo';

export const SwipePareja = () => {
  const { idVisita } = useParams();
  const navigate = useNavigate();
  const [nombreCliente, setNombreCliente] = useState('');
  const [whatsappShareUrl, setWhatsappShareUrl] = useState('');

  // Conexión a Firebase para obtener el nombre real del cliente
  useEffect(() => {
    const fetchVisita = async () => {
      if (!idVisita) return;
      try {
        const docRef = doc(db, 'visitas', idVisita);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().nombreCliente) {
          const primerNombre = docSnap.data().nombreCliente.split(' ')[0];
          setNombreCliente(primerNombre);
        }
      } catch (error) {
        console.error("Error al obtener nombre del cliente:", error);
      }
    };
    fetchVisita();
  }, [idVisita]);

  // Generar la URL de invitación para compartir por WhatsApp
  useEffect(() => {
    if (!idVisita) return;
    const currentPageUrl = window.location.href; // URL de la página actual
    const prefilledMessage = encodeURIComponent(
      `¡Hola! Te invito a evaluar juntos las propiedades que visité con Tu Conexión Inmobiliaria. Entra aquí para que hagamos Swipe:\n\n${currentPageUrl}`
    );
    setWhatsappShareUrl(`https://wa.me/?text=${prefilledMessage}`);
  }, [idVisita]);

  return (
    <div className="bg-[#f4f4f2] min-h-screen text-[#1a1c1b] flex flex-col relative pb-32">
      
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl shadow-sm border-b border-[#e2e3e1]">
        <div className="flex justify-between items-center px-4 md:px-6 py-4 max-w-7xl mx-auto w-full">
          
          <div className="flex items-center gap-3 md:gap-4">
            <button 
              onClick={() => navigate(`/galeria/${idVisita}`)}
              className="text-[#1A3651] hover:text-[#C5A059] transition-colors p-1 md:pr-2"
              title="Regresar a la Galería"
            >
              <span className="material-symbols-outlined text-2xl md:text-xl">arrow_back</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="hidden sm:block">
                <BrandLogo />
              </div>
              <div className="flex flex-col">
                <span className="text-sm md:text-lg font-extrabold tracking-tighter font-headline uppercase leading-tight text-[#1A3651]">
                  Tu Conexión Inmobiliaria
                </span>
                {nombreCliente && (
                  <span className="text-xs text-[#43474d] font-label font-medium tracking-wide">
                    Visita de {nombreCliente}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Botón Siguiente: MIS DESEOS */}
          <div className="flex gap-4">
            <button 
                onClick={() => navigate(`/deseos/${idVisita}`)}
                className="bg-[#C5A059] hover:bg-[#b08d4a] text-white px-4 py-2 rounded-lg font-headline font-bold flex items-center gap-2 transition-all shadow-sm"
            >
              <span className="hidden sm:inline text-sm">Mis Deseos</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center px-4 pt-24 pb-8 w-full max-w-md mx-auto mt-6">
        
        {/* Connection Status & Invite */}
        <div className="w-full flex flex-col gap-3 mb-4">
          <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-[#e2e3e1]">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#1A3651] flex items-center justify-center text-white text-sm font-bold ring-2 ring-white z-10 shadow-sm">TÚ</div>
                <div className="w-10 h-10 rounded-full bg-[#e8e8e6] flex items-center justify-center text-[#43474d] text-sm font-bold ring-2 ring-white shadow-sm">?</div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#73777e]">Esperando conexión...</span>
              </div>
            </div>
            
            {/* Botón Invitar: AHORA CON LOGO WHATSAPP Y ENLACE DE COMPARTIR */}
            <a 
              className="bg-[#25D366] hover:bg-[#128C7E] text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors shadow-sm active:scale-95" 
              href={whatsappShareUrl} 
              target="_blank"
              rel="noreferrer"
            >
              {/* Logo de WhatsApp SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
              </svg>
              Invitar a mi pareja
            </a>
          </div>
        </div>

        {/* Instrucción de UX */}
        <div className="flex items-center justify-center gap-2 mb-2 bg-[#e8e8e6] px-4 py-1.5 rounded-full text-[#43474d] opacity-80">
            <span className="material-symbols-outlined text-[16px]">touch_app</span>
            <span className="font-headline text-[11px] font-bold uppercase tracking-widest">Desliza la foto o usa los botones</span>
        </div>

        {/* Swipe Card */}
        <div className="bg-white rounded-xl w-full flex flex-col relative overflow-hidden shadow-lg border border-[#e2e3e1]">
          
          {/* Match Indicator Overlay */}
          <div className="absolute top-4 left-0 w-full flex justify-center z-20 pointer-events-none">
            <div className="bg-[#C5A059] text-white px-6 py-2 rounded-full flex items-center gap-2 shadow-xl">
              <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
              <span className="text-white font-headline font-extrabold text-sm tracking-widest uppercase">¡MATCH! Propiedad Favorita</span>
            </div>
          </div>

          {/* Image Carousel */}
          <div className="relative w-full aspect-[4/5] bg-[#e8e8e6] overflow-hidden">
            <img 
              alt="Fachada de la propiedad" 
              className="absolute inset-0 w-full h-full object-cover" 
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            />
            
            <div className="absolute bottom-4 w-full flex justify-center gap-2 z-10">
              <div className="w-8 h-1 bg-white rounded-full shadow-sm"></div>
              <div className="w-8 h-1 bg-white/40 rounded-full shadow-sm"></div>
              <div className="w-8 h-1 bg-white/40 rounded-full flex items-center justify-center relative shadow-sm">
                <span className="material-symbols-outlined absolute text-white text-[10px] bg-black/30 rounded-full p-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#1A3651]/90 to-transparent pointer-events-none"></div>
            
            <div className="absolute bottom-10 left-6 right-6">
              <h2 className="text-white font-headline font-extrabold text-2xl tracking-tight leading-none mb-1 shadow-sm">Residencia Costa de Oro</h2>
              <p className="text-[#C5A059] font-headline font-bold text-xl">$8,500,000 MXN</p>
            </div>
          </div>

          {/* Voice Note Section */}
          <div className="p-6 bg-white flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#C5A059]" style={{ fontVariationSettings: "'FILL' 0" }}>mic</span>
              <span className="text-sm font-label text-[#43474d] uppercase tracking-widest font-semibold">Notas de voz de tu pareja</span>
            </div>
            <div className="bg-[#f4f4f2] p-4 rounded-xl rounded-tl-none border-l-2 border-[#C5A059] relative">
              <p className="text-[#1a1c1b] font-body text-sm leading-relaxed italic">"Me encantó la luz natural de la sala y el tamaño de la terraza."</p>
              <button className="absolute -right-3 -bottom-3 w-10 h-10 bg-[#C5A059] text-white rounded-full flex items-center justify-center shadow-md hover:bg-[#b08d4a] transition-colors active:scale-95">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Thumb-Zone Controls - AHORA CON FLECHAS INVERTIDAS */}
      <div className="fixed bottom-[90px] md:bottom-24 w-full max-w-md left-1/2 -translate-x-1/2 flex justify-between items-end px-8 z-40 pointer-events-none">
        
        {/* Descartar Group - Flecha a la Derecha (->) */}
        <div className="flex flex-col items-center gap-2 pointer-events-auto">
          <button className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center text-[#ba1a1a] hover:bg-[#ffdad6] hover:scale-105 active:scale-95 transition-all duration-200 border border-[#e2e3e1]">
            <span className="material-symbols-outlined text-4xl font-bold">close</span>
          </button>
          <div className="flex items-center gap-1 text-[#ba1a1a] bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow-sm border border-[#e2e3e1]">
            {/* Texto y Flecha Derecha */}
            <span className="font-headline text-[10px] font-extrabold uppercase tracking-widest">Descartar</span>
            <span className="material-symbols-outlined text-[14px] font-bold">east</span>
          </div>
        </div>

        {/* Me Gusta Group - Flecha a la Izquierda (<-) */}
        <div className="flex flex-col items-center gap-2 pointer-events-auto">
          <button className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1A3651] to-[#00213b] shadow-xl flex items-center justify-center text-[#ef4444] hover:opacity-90 hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-[#C5A059]/20">
            <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
          </button>
          <div className="flex items-center gap-1 text-[#ef4444] bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow-sm border border-[#e2e3e1]">
            {/* Flecha Izquierda y Texto */}
            <span className="material-symbols-outlined text-[14px] font-bold">west</span>
            <span className="font-headline text-[10px] font-extrabold uppercase tracking-widest">Me Gusta</span>
          </div>
        </div>

      </div>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 w-full rounded-t-[2rem] bg-white/90 backdrop-blur-xl shadow-[0_-10px_40px_rgba(26,54,81,0.08)] md:hidden border-t border-[#e2e3e1]">
        <div className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-8 pt-4">
          <button className="flex flex-col items-center justify-center text-[#1A3651]/40 hover:text-[#C5A059] transition-colors group">
            <span className="material-symbols-outlined mb-1 group-active:scale-95 duration-200" style={{ fontVariationSettings: "'FILL' 0" }}>explore</span>
            <span className="font-body text-[10px] font-semibold uppercase tracking-widest">Descubrir</span>
          </button>
          <button className="flex flex-col items-center justify-center text-[#1A3651]/40 hover:text-[#C5A059] transition-colors group">
            <span className="material-symbols-outlined mb-1 group-active:scale-95 duration-200" style={{ fontVariationSettings: "'FILL' 0" }}>loyalty</span>
            <span className="font-body text-[10px] font-semibold uppercase tracking-widest">Favoritos</span>
          </button>
          <button className="flex flex-col items-center justify-center text-[#1A3651]/40 hover:text-[#C5A059] transition-colors group">
            <span className="material-symbols-outlined mb-1 group-active:scale-95 duration-200" style={{ fontVariationSettings: "'FILL' 0" }}>forum</span>
            <span className="font-body text-[10px] font-semibold uppercase tracking-widest">Mensajes</span>
          </button>
          <button className="flex flex-col items-center justify-center text-[#C5A059] bg-[#C5A059]/10 rounded-full px-5 py-2 hover:text-[#b08d4a] transition-colors group">
            <span className="material-symbols-outlined mb-1 group-active:scale-95 duration-200" style={{ fontVariationSettings: "'FILL' 1" }}>account_circle</span>
            <span className="font-body text-[10px] font-semibold uppercase tracking-widest">Perfil</span>
          </button>
        </div>
      </nav>
    </div>
  );
};