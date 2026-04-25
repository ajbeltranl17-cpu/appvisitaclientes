import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../services/firebaseConfig';
import { useAppContext } from '../context/AppContext';
import { BrandLogo } from '../components/BrandLogo';
import { Sidebar } from '../components/Sidebar';

export const CalculadoraHipotecaria: React.FC = () => {
  const { idVisita } = useParams<{ idVisita: string }>();
  const navigate = useNavigate();
  const { navigate: contextNavigate } = useAppContext();
  
  const [visitaData, setVisitaData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Formularios hipoteca
  const [precio, setPrecio] = useState(2500000);
  const [plazo, setPlazo] = useState(15);
  const [enganchePorcentaje, setEnganchePorcentaje] = useState(20);
  const [tasaAnual, setTasaAnual] = useState(9.5);

  useEffect(() => {
    if (!idVisita) return;
    
    const fetchVisita = async () => {
      try {
        const docRef = doc(db, 'visitas', idVisita);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setVisitaData(data);
          if (data.precioPropiedad) {
            setPrecio(Number(data.precioPropiedad));
          }
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching visita:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchVisita();
  }, [idVisita]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      contextNavigate('LOGIN');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const engancheMonto = precio * (enganchePorcentaje / 100);
  const montoPrestamo = precio - engancheMonto;
  const tasaMensual = (tasaAnual / 100) / 12;
  const numeroPagos = plazo * 12;

  const mensualidad = useMemo(() => {
    if (montoPrestamo <= 0 || tasaMensual <= 0 || numeroPagos <= 0) return 0;
    return (montoPrestamo * tasaMensual * Math.pow(1 + tasaMensual, numeroPagos)) / (Math.pow(1 + tasaMensual, numeroPagos) - 1);
  }, [montoPrestamo, tasaMensual, numeroPagos]);

  const totalPagado = mensualidad * numeroPagos;
  const totalIntereses = totalPagado - montoPrestamo;
  
  const porcentajeCapital = totalPagado > 0 ? Math.round((montoPrestamo / totalPagado) * 100) : 0;
  const porcentajeInteres = totalPagado > 0 ? Math.round((totalIntereses / totalPagado) * 100) : 0;

  if (loading) {
    return (
      <div className="bg-[#f9f9f7] min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-[#C5A059]/30 border-t-[#C5A059] animate-spin"></div>
      </div>
    );
  }

  if (error || !visitaData) {
    return (
      <div className="bg-[#f9f9f7] min-h-screen flex items-center justify-center p-6 text-center">
        <div>
          <span className="material-symbols-outlined text-4xl text-[#ba1a1a] mb-4">error</span>
          <h2 className="font-headline font-bold text-xl text-[#00213b]">No pudimos cargar la calculadora</h2>
          <p className="text-[#43474d] text-sm mt-2">Verifica el enlace o intenta de nuevo más tarde.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f9f9f7] text-[#1a1c1b] font-body pb-24 md:pb-0 min-h-screen flex flex-col pt-20">
      <Sidebar isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-[#f9f9f7]/80 backdrop-blur-xl transition-all shadow-none">
        <div className="flex justify-between items-center w-full px-4 py-4 mx-auto">
          <div className="flex items-center gap-1">
             <button onClick={() => setIsDrawerOpen(true)} className="p-2 text-[#1a3651] hover:bg-black/5 rounded-full active:scale-95 transition-all flex">
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>
            <div className="flex items-center gap-3">
              <BrandLogo className="w-8 h-8 md:w-10 md:h-10 rounded-md object-cover" />
              <h1 className="font-headline tracking-tighter font-extrabold text-lg text-[#1A3651] uppercase hidden sm:block">TU CONEXIÓN INMOBILIARIA</h1>
            </div>
          </div>
          
          <button 
            onClick={() => navigate(`/plusvalia/${idVisita}`)}
            className="bg-[#C5A059] text-[#1A3651] px-3 py-1.5 rounded-full font-headline font-bold text-[10px] md:text-xs tracking-wide shadow-sm flex items-center justify-center gap-1 hover:scale-105 active:scale-95 transition-all z-10 whitespace-nowrap"
          >
            <span>Calculadora de Plusvalía</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>
      </header>

      <main className="flex-grow px-4 md:px-8 max-w-4xl mx-auto w-full flex flex-col gap-8 mt-2">
        {/* Main Result Card (Bento Style) */}
        <div className="bg-[#1a3651] rounded-xl p-6 md:p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden shadow-[0_24px_32px_-12px_rgba(26,54,81,0.15)]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00213b] to-[#1a3651] opacity-50 z-0 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left">
            <span className="text-[#849fbf] font-label text-sm uppercase tracking-wider mb-2">Mensualidad Esperada</span>
            <div className="font-headline font-extrabold text-4xl md:text-5xl text-[#e9c176] tracking-tighter">
              {mensualidad.toLocaleString('es-MX', {style: 'currency', currency: 'MXN', maximumFractionDigits: 0})} 
              <span className="text-lg font-body font-normal text-[#849fbf] ml-1">/mes</span>
            </div>
          </div>
          
          <div className="relative z-10 flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl">
            <div 
              className="w-[120px] h-[120px] rounded-full flex items-center justify-center shadow-inner"
              style={{ background: `conic-gradient(#1a3651 0% ${porcentajeCapital}%, #e9c176 ${porcentajeCapital}% 100%)` }}
            >
              <div className="w-[90px] h-[90px] bg-white rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-[#1a3651] text-3xl">real_estate_agent</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 font-label text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#1a3651] border border-[#e2e3e1]"></div>
                <span className="text-white">Capital ({porcentajeCapital}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#e9c176]"></div>
                <span className="text-white">Intereses ({porcentajeInteres}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Inputs Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
          
          {/* Property Price */}
          <div className="bg-white p-6 rounded-xl flex flex-col gap-2 shadow-[0_8px_32px_rgba(26,28,27,0.04)]">
            <label className="font-label text-sm text-[#43474d] uppercase tracking-wide">Precio de la Propiedad</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#43474d] font-headline text-xl">$</span>
              <input 
                className="w-full bg-[#f4f4f2] text-[#1a1c1b] font-headline font-bold text-2xl pl-10 pr-4 py-3 rounded-lg border-b border-[#c3c6ce]/15 focus:outline-none focus:border-[#1a3651] focus:bg-white transition-colors" 
                type="number" 
                value={precio}
                onChange={(e) => setPrecio(Number(e.target.value) || 0)}
              />
            </div>
          </div>
          
          {/* Plazo en Años */}
          <div className="bg-white p-6 rounded-xl flex flex-col gap-4 shadow-[0_8px_32px_rgba(26,28,27,0.04)]">
            <label className="font-label text-sm text-[#43474d] uppercase tracking-wide">Plazo en Años</label>
            <div className="flex gap-2 w-full">
              {[5, 10, 15, 20].map(yr => (
                <button 
                  key={yr}
                  onClick={() => setPlazo(yr)}
                  className={`flex-1 py-3 rounded-lg font-headline font-bold transition-colors ${
                    plazo === yr 
                    ? 'text-[#1a3651] bg-[#e2e3e1] border-b-2 border-[#1a3651]' 
                    : 'text-[#43474d] bg-[#e8e8e6] hover:bg-[#e2e3e1]'
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>
          </div>
          
          {/* Enganche Slider */}
          <div className="bg-white p-6 rounded-xl flex flex-col gap-4 md:col-span-2 shadow-[0_8px_32px_rgba(26,28,27,0.04)]">
            <div className="flex justify-between items-end">
              <label className="font-label text-sm text-[#43474d] uppercase tracking-wide">Enganche</label>
              <div className="font-headline font-bold text-xl text-[#1a3651]">
                {enganchePorcentaje}% <span className="text-sm text-[#43474d] font-normal">({engancheMonto.toLocaleString('es-MX', {style: 'currency', currency: 'MXN', maximumFractionDigits: 0})})</span>
              </div>
            </div>
            <input 
              className="w-full mt-2" 
              max="50" 
              min="5" 
              type="range" 
              value={enganchePorcentaje}
              onChange={(e) => setEnganchePorcentaje(Number(e.target.value))}
            />
            <div className="flex justify-between text-xs font-label text-[#73777e] mt-1">
              <span>5%</span>
              <span>50%</span>
            </div>
          </div>
          
          {/* Tasa de Interés Slider */}
          <div className="bg-white p-6 rounded-xl flex flex-col gap-4 md:col-span-2 shadow-[0_8px_32px_rgba(26,28,27,0.04)]">
            <div className="flex justify-between items-end">
              <label className="font-label text-sm text-[#43474d] uppercase tracking-wide">Tasa de Interés Anual</label>
              <div className="font-headline font-bold text-xl text-[#1a3651]">{tasaAnual}%</div>
            </div>
            <input 
              className="w-full mt-2" 
              max="15" 
              min="5" 
              step="0.1" 
              type="range" 
              value={tasaAnual}
              onChange={(e) => setTasaAnual(Number(e.target.value))}
            />
            <div className="flex justify-between text-xs font-label text-[#73777e] mt-1">
              <span>5%</span>
              <span>15%</span>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
};
