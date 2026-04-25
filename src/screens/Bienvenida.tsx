import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { useAppContext } from '../context/AppContext';
import { BrandLogo } from '../components/BrandLogo';

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
}

export const Bienvenida: React.FC = () => {
  const { idVisita } = useParams<{ idVisita: string }>();
  // Use both: native navigate from react-router-dom for URLs, and fallback to context if needed
  const navigate = useNavigate(); 
  const { navigate: contextNavigate } = useAppContext();
  
  const [visitaData, setVisitaData] = useState<VisitaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
          console.error("No se encontró el documento de la visita.");
          setError(true);
        }
      } catch (err) {
        console.error("Error al obtener la visita:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchVisita();
  }, [idVisita]);

  if (loading) {
    return (
      <div className="bg-[#f9f9f7] min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-[#1A3651]/20 border-t-[#C5A059] rounded-full animate-spin mb-4"></div>
          <p className="text-[#1A3651] font-semibold tracking-wide animate-pulse uppercase text-sm">
            Cargando su experiencia...
          </p>
        </div>
      </div>
    );
  }

  if (error || !visitaData) {
    return (
      <div className="bg-[#f9f9f7] min-h-screen flex items-center justify-center p-8">
        <div className="text-center max-w-md bg-white p-10 rounded-2xl shadow-[0_12px_48px_rgba(26,54,81,0.08)]">
          <span className="material-symbols-outlined text-[64px] text-[#ba1a1a] mb-4">link_off</span>
          <h2 className="font-headline text-2xl font-extrabold text-[#1A3651] mb-2 tracking-tight">
            Enlace expirado o no válido
          </h2>
          <p className="font-body text-[#43474d] text-base leading-relaxed mb-8">
            Lo sentimos, no pudimos encontrar los detalles de su visita. Es posible que el enlace haya expirado o sea incorrecto.
          </p>
          <button 
            onClick={() => contextNavigate('LOGIN')}
            className="w-full bg-[#1A3651] text-white font-headline font-bold py-4 rounded-xl shadow-lg flex justify-center items-center gap-2"
          >
            <span>Volver al Inicio</span>
          </button>
        </div>
      </div>
    );
  }

  const handleIrAlDashboard = () => {
    // Si la app termina de transicionar completamente a react-router, usamos navigate
    navigate(`/dashboard/${idVisita}`);
    // Mantenemos el estado local del context por compatibilidad temporal
    contextNavigate('DASHBOARD'); 
  };

  return (
    <div className="bg-[#f9f9f7] antialiased text-[#1a1c1b] font-body selection:bg-[#fed488] selection:text-[#785a1a] min-h-screen relative overflow-x-hidden">
      {/* Header / Branding */}
      <header className="w-full flex flex-col items-center justify-center pt-12 pb-8 z-20 relative bg-[#f9f9f7]">
        <div className="w-24 h-24 overflow-hidden flex items-center justify-center mb-2">
          <BrandLogo className="w-full h-full object-cover" />
        </div>
        <h1 className="font-headline text-[#bb9663] text-xs font-extrabold tracking-[0.25em] uppercase text-center px-4">
          Tu Conexión Inmobiliaria
        </h1>
      </header>

      <main className="w-full pb-40">
        {/* Hero Section & Greeting */}
        <section className="relative w-full">
          <div className="w-full h-[409px] bg-[#e2e3e1] relative overflow-hidden">
            <img 
              alt="Casa minimalista" 
              className="w-full h-full object-cover object-center opacity-90" 
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#f9f9f7]/20 to-[#f9f9f7]"></div>
          </div>
          <div className="relative z-10 px-6 -mt-24">
            <div className="bg-white rounded-xl p-8 shadow-[0_12px_48px_rgba(26,54,81,0.08)] backdrop-blur-sm">
              <h2 className="font-headline text-4xl font-extrabold text-[#1a3651] tracking-tight leading-[1.1] mb-4">
                ¡Hola,<br/>{visitaData.nombreCliente.split(' ')[0]}!
              </h2>
              <p className="font-body text-[#43474d] text-base leading-relaxed">
                Bienvenido a tu experiencia inmobiliaria personalizada. Estamos listos para tu visita. Aquí tienes todo lo necesario para tomar la mejor decisión de inversión.
              </p>
            </div>
          </div>
        </section>

        {/* Appointment Card (Blue Confirmation Box) */}
        <section className="px-6 mt-12">
          <div className="bg-[#1a3651] rounded-xl p-7 relative overflow-hidden shadow-[0_16px_32px_rgba(26,54,81,0.15)] border-l-4 border-[#e9c176]">
            {/* Decorative background icon */}
            <span className="material-symbols-outlined absolute -right-4 -bottom-6 text-8xl text-[#00213b]/40 select-none pointer-events-none">
              event_available
            </span>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-[#e9c176] text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
                <h3 className="font-headline text-[#e9c176] font-bold text-sm tracking-widest uppercase">
                  Cita Confirmada
                </h3>
              </div>
              <p className="font-body text-white/90 text-[15px] leading-relaxed mb-6">
                Encuentra aquí la ubicación exacta y detalles exclusivos de la propiedad que visitaremos el {visitaData.fechaVisita} a las {visitaData.horaVisita}.
              </p>
              
              <div className="grid grid-cols-2 gap-4 pt-5 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                    <span className="material-symbols-outlined text-white/70 text-xl">person</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] uppercase tracking-[0.1em] text-[#e9c176]/80 font-bold mb-0.5">Asesor</span>
                    <span className="text-sm font-bold text-white tracking-tight">{visitaData.nombreAsesor}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                    <span className="material-symbols-outlined text-white/70 text-xl">chat</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] uppercase tracking-[0.1em] text-[#e9c176]/80 font-bold mb-0.5">WhatsApp</span>
                    <span className="text-sm font-bold text-white tracking-tight">{visitaData.whatsappAsesor}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Value Proposition / Reasons */}
        <section className="px-6 mt-16">
          <h4 className="font-headline text-[#1a3651] text-xl font-bold mb-8 tracking-tight">Tu ventaja exclusiva</h4>
          
          <div className="flex flex-col gap-10">
            {/* Reason 1 */}
            <div className="flex gap-5 items-start">
              <div className="w-10 h-10 rounded-lg bg-[#f4f4f2] flex shrink-0 items-center justify-center text-[#1a3651] mt-1">
                <span className="material-symbols-outlined text-xl">photo_camera</span>
              </div>
              <div>
                <h5 className="font-headline font-bold text-[#1a1c1b] text-lg mb-1">Control Total</h5>
                <p className="font-body text-[#43474d] text-sm leading-relaxed">
                  Toma fotos, videos y notas de voz que se guardan solas en tu bitácora privada.
                </p>
              </div>
            </div>
            
            {/* Reason 2 */}
            <div className="flex gap-5 items-start">
              <div className="w-10 h-10 rounded-lg bg-[#f4f4f2] flex shrink-0 items-center justify-center text-[#1a3651] mt-1">
                <span className="material-symbols-outlined text-xl">monitoring</span>
              </div>
              <div>
                <h5 className="font-headline font-bold text-[#1a1c1b] text-lg mb-1">Decisión Inteligente</h5>
                <p className="font-body text-[#43474d] text-sm leading-relaxed">
                  Calcula la plusvalía real a 20 años y compara opciones lado a lado.
                </p>
              </div>
            </div>
            
            {/* Reason 3 */}
            <div className="flex gap-5 items-start">
              <div className="w-10 h-10 rounded-lg bg-[#f4f4f2] flex shrink-0 items-center justify-center text-[#1a3651] mt-1">
                <span className="material-symbols-outlined text-xl">group</span>
              </div>
              <div>
                <h5 className="font-headline font-bold text-[#1a1c1b] text-lg mb-1">Sincronización Familiar</h5>
                <p className="font-body text-[#43474d] text-sm leading-relaxed">
                  Comparte tus impresiones en tiempo real con quien tú quieras.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Gold Action Button */}
        <div className="mt-12 px-12">
          <button 
            onClick={handleIrAlDashboard}
            className="w-full bg-[#C5A059] text-[#00213b] font-headline font-extrabold py-6 px-6 rounded-xl shadow-[0_12px_32px_rgba(197,160,89,0.3)] flex justify-center items-center gap-3 group active:scale-[0.98] transition-all duration-200 uppercase tracking-wide decoration-none text-lg relative"
          >
            <span>VER UBICACIÓN Y DIRECCIÓN EXACTA</span>
            <span className="material-symbols-outlined transition-transform group-active:translate-x-1 font-bold">
              arrow_forward
            </span>
          </button>
        </div>

        {/* Secondary Image */}
        <section className="px-6 mt-16 mb-8">
          <div className="w-full h-48 rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(26,54,81,0.06)] bg-[#eeeeec]">
            <img 
              alt="Interior moderno" 
              className="w-full h-full object-cover object-center" 
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200"
            />
          </div>
        </section>
      </main>
    </div>
  );
};
