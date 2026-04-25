import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { BrandLogo } from '../components/BrandLogo';
import { Sidebar } from '../components/Sidebar';

export const CalculadoraPlusvalia: React.FC = () => {
  const { idVisita } = useParams<{ idVisita: string }>();
  const navigate = useNavigate();

  const [visitaData, setVisitaData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // States
  const [precio, setPrecio] = useState(2500000);
  const [etapa, setEtapa] = useState('Preventa (0-6 meses)');
  const [antiguedad, setAntiguedad] = useState('A estrenar');

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

  // Derived Values
  const zonaUbicacion = visitaData?.analisisIA?.nombreZona || "Zona en Análisis";

  const getTasaFinal = () => {
    let tasa = 4.2; // Tasa Base Anual
    if (etapa === 'Preventa (0-6 meses)') tasa += 2.0;
    else if (etapa === 'Preventa (6-12 meses)') tasa += 1.2;

    if (antiguedad === 'A estrenar') tasa += 0.5;

    return tasa;
  };

  const tasaFinal = getTasaFinal();
  const valor10Anios = precio * Math.pow(1 + (tasaFinal / 100), 10);
  const valor20Anios = precio * Math.pow(1 + (tasaFinal / 100), 20);

  const inflacion = 5.0;
  const rentabilidadNeta = tasaFinal - inflacion;

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
          <h2 className="font-headline font-bold text-xl text-[#1a3651]">No pudimos cargar la calculadora</h2>
          <p className="text-[#43474d] text-sm mt-2">Verifica el enlace o intenta de nuevo más tarde.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f9f9f7] text-[#1a1c1b] font-body pb-24 md:pb-0 pt-20 min-h-screen">
      <Sidebar isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-center px-4 py-4 md:px-6 w-full">
          <div className="flex items-center gap-2 md:gap-4">
            <button onClick={() => setIsDrawerOpen(true)} className="p-2 text-[#1a3651] hover:bg-black/5 rounded-full active:scale-95 transition-all flex">
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>
            <div className="flex items-center gap-3">
              <BrandLogo className="w-8 h-8 object-cover rounded-md hidden sm:block" />
              <span className="text-[#1A3651] font-extrabold tracking-tighter italic font-headline text-lg uppercase sm:capitalize">Tu Conexión Inmobiliaria</span>
            </div>
          </div>
          <button 
            onClick={() => navigate(`/galeria/${idVisita}`)}
            className="flex items-center justify-center gap-2 bg-[#C5A059] text-[#1A3651] px-4 py-2 rounded-xl font-headline font-semibold text-[10px] md:text-sm tracking-wide hover:scale-105 active:scale-95 transition-all"
          >
            <span className="hidden sm:inline">Galería de la Visita</span>
            <span className="sm:hidden">Galería</span>
            <span className="material-symbols-outlined text-[16px] md:text-[20px]">photo_library</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-[#1a3651] tracking-tight mb-2">Calculadora de Plusvalía</h1>
          <p className="text-[#43474d] text-lg max-w-2xl">
            Proyecta el crecimiento de tu inversión inmobiliaria con base en datos del mercado actual y características del desarrollo.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Inputs Panel (Left) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-[0_8px_32px_rgba(26,28,27,0.05)] border border-[#e2e3e1]/50">
              <h2 className="font-headline text-xl font-bold text-[#1a3651] mb-6">Parámetros del Inmueble</h2>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                
                {/* Input: Etapa de construcción */}
                <div>
                  <label className="block text-sm font-semibold text-[#1a1c1b] mb-2" htmlFor="etapa">Etapa de construcción</label>
                  <div className="relative bg-[#f4f4f2] rounded-lg border-b border-[#c3c6ce]/15">
                    <select 
                      id="etapa" 
                      name="etapa" 
                      value={etapa}
                      onChange={(e) => setEtapa(e.target.value)}
                      className="block w-full bg-transparent border-0 py-3 pl-4 pr-10 text-[#1a1c1b] focus:ring-0 sm:text-sm rounded-lg appearance-none"
                    >
                      <option>Preventa (0-6 meses)</option>
                      <option>Preventa (6-12 meses)</option>
                      <option>Preventa (+12 meses)</option>
                      <option>Nueva / Lista para entrega</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#43474d]">
                      <span className="material-symbols-outlined text-xl">expand_more</span>
                    </div>
                  </div>
                </div>

                {/* Input: Antigüedad */}
                <div>
                  <label className="block text-sm font-semibold text-[#1a1c1b] mb-2" htmlFor="antiguedad">Antigüedad del inmueble</label>
                  <div className="relative bg-[#f4f4f2] rounded-lg border-b border-[#c3c6ce]/15">
                    <select 
                      id="antiguedad" 
                      name="antiguedad" 
                      value={antiguedad}
                      onChange={(e) => setAntiguedad(e.target.value)}
                      className="block w-full bg-transparent border-0 py-3 pl-4 pr-10 text-[#1a1c1b] focus:ring-0 sm:text-sm rounded-lg appearance-none"
                    >
                      <option>A estrenar</option>
                      <option>1 a 5 años</option>
                      <option>6 a 10 años</option>
                      <option>Más de 10 años</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#43474d]">
                      <span className="material-symbols-outlined text-xl">expand_more</span>
                    </div>
                  </div>
                </div>

                {/* Input: Ubicación */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-semibold text-[#1a1c1b]" htmlFor="ubicacion">Zona de Ubicación</label>
                    <div className="flex items-center gap-1 text-green-600">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      <span className="text-xs font-semibold">Sincronizado</span>
                    </div>
                  </div>
                  <div className="relative bg-[#f4f4f2] rounded-lg border-b border-[#c3c6ce]/15 !border-green-200">
                    <input 
                      type="text" 
                      id="ubicacion" 
                      name="ubicacion" 
                      value={zonaUbicacion}
                      readOnly
                      className="block w-full bg-transparent border-0 py-3 pl-4 pr-10 text-[#1a1c1b] placeholder:text-[#43474d] focus:ring-0 sm:text-sm rounded-lg" 
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                      <span className="material-symbols-outlined text-[#c5a059]">location_on</span>
                    </div>
                  </div>
                </div>

                {/* Input: Precio Actual */}
                <div>
                  <label className="block text-sm font-semibold text-[#1a1c1b] mb-2" htmlFor="precio">Precio Actual Estimado</label>
                  <div className="relative bg-[#f4f4f2] rounded-lg border-b border-[#c3c6ce]/15">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <span className="text-[#43474d] sm:text-sm">$</span>
                    </div>
                    <input 
                      type="number" 
                      id="precio" 
                      name="precio" 
                      value={precio}
                      onChange={(e) => setPrecio(Number(e.target.value) || 0)}
                      className="block w-full bg-transparent border-0 py-3 pl-8 pr-12 text-[#1a1c1b] placeholder:text-[#43474d] focus:ring-0 sm:text-sm rounded-lg" 
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                      <span className="text-[#43474d] sm:text-sm" id="price-currency">MXN</span>
                    </div>
                  </div>
                </div>

                {/* Information Legend */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg flex gap-2 items-start">
                  <span className="material-symbols-outlined text-blue-500 text-sm mt-0.5">info</span>
                  <p className="text-xs text-blue-800 leading-tight">Datos de zona sincronizados automáticamente con tu visita actual para mayor precisión.</p>
                </div>
              </form>
            </div>
          </div>

          {/* Visualization Panel (Right) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Highlight Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-[0_8px_32px_rgba(26,28,27,0.05)] border border-[#e2e3e1]/50 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute -right-4 -top-4 opacity-10">
                  <span className="material-symbols-outlined text-8xl text-[#c5a059]">trending_up</span>
                </div>
                <span className="text-sm font-semibold text-[#43474d] uppercase tracking-wider mb-2">Valor Esperado (10 Años)</span>
                <div className="flex items-end gap-2">
                  <h3 className="font-headline text-3xl font-extrabold text-[#1a3651]">
                    {valor10Anios.toLocaleString('es-MX', {style: 'currency', currency: 'MXN', maximumFractionDigits: 0})}
                  </h3>
                  <span className="text-sm text-[#c5a059] font-semibold mb-1">+{((Math.pow(1 + (tasaFinal / 100), 10) - 1) * 100).toFixed(0)}%</span>
                </div>
              </div>

              <div className="bg-[#f4f4f2] p-6 rounded-xl flex flex-col justify-between">
                <span className="text-sm font-semibold text-[#43474d] uppercase tracking-wider mb-2">Tasa Anual Estimada</span>
                <div className="flex items-end gap-2">
                  <h3 className="font-headline text-3xl font-extrabold text-[#c5a059]">{tasaFinal.toFixed(1)}%</h3>
                  <span className="text-sm text-[#43474d] mb-1">Promedio en zona</span>
                </div>
              </div>
            </div>

            {/* Chart Container */}
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-[0_8px_32px_rgba(26,28,27,0.05)] border border-[#e2e3e1]/50 flex-grow flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-headline text-xl font-bold text-[#1a3651]">Proyección a 20 Años</h2>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#c3c6ce]"></div>
                    <span className="text-xs text-[#43474d] font-medium">Precio Actual</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#c5a059]"></div>
                    <span className="text-xs text-[#43474d] font-medium">Valor Esperado</span>
                  </div>
                </div>
              </div>

              {/* Faux Chart Representation */}
              <div className="relative w-full flex-grow min-h-[300px] border-l border-b border-[#e2e3e1] pt-4 pr-2">
                {/* Y Axis Labels */}
                <div className="absolute left-[-55px] top-0 bottom-0 flex flex-col justify-between text-[10px] sm:text-xs text-[#43474d] h-full py-4 text-right pr-2 w-[55px]">
                  <span>{valor20Anios.toLocaleString('es-MX', { notation: "compact" })}</span>
                  <span></span>
                  <span></span>
                  <span>{precio.toLocaleString('es-MX', { notation: "compact" })}</span>
                </div>

                {/* Chart Lines (Simulated with SVG) */}
                <div className="absolute inset-0 pl-2 pb-6 w-full h-full">
                  <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <line stroke="rgba(226, 227, 225, 0.5)" strokeDasharray="2,2" strokeWidth="0.5" x1="0" x2="100" y1="25" y2="25"></line>
                    <line stroke="rgba(226, 227, 225, 0.5)" strokeDasharray="2,2" strokeWidth="0.5" x1="0" x2="100" y1="50" y2="50"></line>
                    <line stroke="rgba(226, 227, 225, 0.5)" strokeDasharray="2,2" strokeWidth="0.5" x1="0" x2="100" y1="75" y2="75"></line>

                    <path d="M 0,80 L 100,80" fill="none" stroke="#c3c6ce" strokeDasharray="4,4" strokeWidth="1.5"></path>
                    <path d="M 0,80 Q 50,60 100,20" fill="none" stroke="#c5a059" strokeLinecap="round" strokeWidth="3"></path>
                    <path d="M 0,80 Q 50,60 100,20 L 100,100 L 0,100 Z" fill="url(#gradient)" opacity="0.1"></path>

                    <defs>
                      <linearGradient id="gradient" x1="0%" x2="0%" y1="0%" y2="100%">
                        <stop offset="0%" stopColor="#c5a059"></stop>
                        <stop offset="100%" stopColor="transparent"></stop>
                      </linearGradient>
                    </defs>

                    <circle cx="0" cy="80" fill="#1a3651" r="1.5"></circle>
                    <circle cx="25" cy="68" fill="#c5a059" r="1.5"></circle>
                    <circle cx="50" cy="52" fill="#c5a059" r="1.5"></circle>
                    <circle cx="75" cy="35" fill="#c5a059" r="1.5"></circle>
                    <circle cx="100" cy="20" fill="#c5a059" r="2"></circle>
                  </svg>
                </div>

                {/* X Axis Labels */}
                <div className="absolute bottom-[-24px] left-0 right-0 flex justify-between text-xs text-[#43474d] px-2">
                  <span>Hoy</span>
                  <span>Año 5</span>
                  <span>Año 10</span>
                  <span>Año 15</span>
                  <span>Año 20</span>
                </div>
              </div>
            </div>

            {/* Análisis de Rentabilidad Section */}
            <div className={`bg-white p-6 rounded-xl shadow-[0_8px_32px_rgba(26,28,27,0.05)] border ${rentabilidadNeta >= 0 ? "border-[#c5a059]/30" : "border-[#ba1a1a]/30"}`}>
              <div className="flex items-center gap-2 mb-6">
                <span className={`material-symbols-outlined ${rentabilidadNeta >= 0 ? "text-[#c5a059]" : "text-[#ba1a1a]"}`}>account_balance_wallet</span>
                <h2 className="font-headline text-xl font-bold text-[#1a3651]">Rentabilidad Real de tu Inversión</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                
                {/* Comparison Visual */}
                <div className="md:col-span-5 space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-sm font-semibold text-[#43474d]">Plusvalía Anual Estimada</span>
                      <span className="text-sm font-bold text-[#1a3651]">{tasaFinal.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-[#f4f4f2] rounded-full h-3 overflow-hidden">
                      <div className="bg-[#1a3651] h-full rounded-full" style={{ width: `${Math.min(100, (tasaFinal / 10) * 100)}%` }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-sm font-semibold text-[#43474d]">Inflación Promedio</span>
                      <span className="text-sm font-bold text-[#73777e]">{inflacion.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-[#f4f4f2] rounded-full h-3 overflow-hidden">
                      <div className="bg-[#c3c6ce] h-full rounded-full" style={{ width: `${Math.min(100, (inflacion / 10) * 100)}%` }}></div>
                    </div>
                  </div>
                </div>

                {/* Strategy & Gain Info */}
                <div className="md:col-span-7 flex flex-col justify-center border-l-0 md:border-l border-[#e2e3e1] md:pl-8">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${rentabilidadNeta >= 0 ? "bg-[#c5a059]/10" : "bg-[#ba1a1a]/10"}`}>
                      <span className={`font-extrabold text-2xl font-headline ${rentabilidadNeta >= 0 ? "text-[#c5a059]" : "text-[#ba1a1a]"}`}>
                        {rentabilidadNeta > 0 ? "+" : ""}{rentabilidadNeta.toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-[#1a1c1b] leading-tight">
                      Rentabilidad neta ajustada por inflación.
                    </p>
                  </div>
                  
                  {rentabilidadNeta >= 0 ? (
                    <p className="text-sm text-[#43474d] leading-relaxed">
                      La plusvalía proyectada supera la inflación estimada. Tu inversión no solo protege tu dinero, sino que <span className="font-bold text-[#1a3651]">genera riqueza real</span> año tras año.
                    </p>
                  ) : (
                    <p className="text-sm text-[#43474d] leading-relaxed">
                      Aunque la plusvalía es competitiva, en este escenario la inflación estimads supera ligeramente el crecimiento del valor. Tu inversión actúa como un <span className="font-bold text-[#1a3651]">refugio de valor</span>.
                    </p>
                  )}

                  <div className={`mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${rentabilidadNeta >= 0 ? "text-green-600" : "text-[#1a3651]"}`}>
                    <span className="material-symbols-outlined text-sm">{rentabilidadNeta >= 0 ? "trending_up" : "shield"}</span>
                    {rentabilidadNeta >= 0 ? "Crecimiento Patrimonial Activo" : "Protección Patrimonial Activa"}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};
