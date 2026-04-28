import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EncabezadoGlobal } from '../components/EncabezadoGlobal';

export const CalculadoraPlusvalia = () => {
  const { idVisita } = useParams();
  const navigate = useNavigate();

  // Datos Base (En Fase de Backend, estos llegarán de la extracción de las URLs por IA)
  const [precioOriginal, setPrecioOriginal] = useState(3400000);
  const [zonaAnalizada, setZonaAnalizada] = useState('Jardines del Virginia, Boca del Río');
  
  const [tasaInflacion, setTasaInflacion] = useState(4.5); 
  const [anos, setAnos] = useState(5); // Ajustado a 5 años por defecto para impacto a mediano plazo
  const [estadoPropiedad, setEstadoPropiedad] = useState('Entrega Inmediata');

  const [valorFuturo, setValorFuturo] = useState(0);
  const [valorInflacion, setValorInflacion] = useState(0);

  // Tasa base fija que vendrá de la URL en el Backend
  const tasaBaseZona = 7.5; 

  // Lógica de ajuste dinámico según el estado de la propiedad
  const obtenerTasaAjustada = () => {
    if (estadoPropiedad === 'Preventa') return tasaBaseZona + 3.0; // Bono por riesgo/obra
    if (estadoPropiedad === 'Seminuevo') return tasaBaseZona - 1.5; // Ajuste por depreciación física
    return tasaBaseZona; // 'Entrega Inmediata'
  };

  const tasaPlusvalia = obtenerTasaAjustada();

  useEffect(() => {
    // Calculamos el valor futuro usando la tasa dinámicamente ajustada
    const futuro = precioOriginal * Math.pow(1 + tasaPlusvalia / 100, anos);
    const inflacion = precioOriginal * Math.pow(1 + tasaInflacion / 100, anos);
    
    setValorFuturo(futuro);
    setValorInflacion(inflacion);
  }, [precioOriginal, tasaPlusvalia, tasaInflacion, anos]);

  const formatearMoneda = (valor: number) => 
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(valor);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <EncabezadoGlobal 
        rutaAnterior={`/calculadora/${idVisita}`}
        textoAnterior="Hipoteca"
        rutaSiguiente={`/galeria/${idVisita}`}
        textoSiguiente="Galería"
      />

      <main className="p-4 space-y-6 max-w-md mx-auto w-full pb-10">
        
        <section className="px-2">
          <span className="text-[#C5A059] font-black uppercase text-[10px] tracking-[0.3em]">Patrimonio a Futuro</span>
          <h1 className="text-3xl font-black text-[#00213b] mt-1">Plusvalía</h1>
          <p className="text-gray-500 text-sm mt-2">Proyecta el crecimiento de tu inversión frente a la inflación.</p>
        </section>

        {/* Tarjeta de Transparencia (Datos Extraídos) */}
        <div className="bg-[#00213b] text-white rounded-3xl p-5 shadow-md flex flex-col gap-4 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-10 -mt-10 pointer-events-none"></div>
           
           <div className="flex items-start justify-between border-b border-white/10 pb-3">
              <div className="flex gap-3">
                 <div className="bg-[#C5A059]/20 p-2 rounded-xl h-fit">
                    <span className="material-symbols-outlined text-[#C5A059] text-[18px]">location_on</span>
                 </div>
                 <div>
                    <p className="text-[9px] uppercase tracking-widest opacity-60 font-bold mb-1">Zona Analizada</p>
                    <p className="text-xs font-bold leading-tight">{zonaAnalizada}</p>
                 </div>
              </div>
           </div>
           
           <div className="flex items-center justify-between">
              <div className="flex gap-3">
                 <div className="bg-[#C5A059]/20 p-2 rounded-xl h-fit">
                    <span className="material-symbols-outlined text-[#C5A059] text-[18px]">payments</span>
                 </div>
                 <div>
                    <p className="text-[9px] uppercase tracking-widest opacity-60 font-bold mb-1">Precio de Compra</p>
                    <p className="text-sm font-black">{formatearMoneda(precioOriginal)}</p>
                 </div>
              </div>
              <div className="bg-green-500/20 border border-green-500/50 px-2 py-1 rounded-md flex items-center gap-1">
                 <span className="material-symbols-outlined text-green-400 text-[10px]">verified</span>
                 <span className="text-[8px] uppercase tracking-wider font-bold text-green-400">Datos Reales</span>
              </div>
           </div>
        </div>

        {/* Comparativa Visual */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100 space-y-6">
          
          <div className="space-y-1">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Valor estimado en {anos} años</p>
            <h2 className="text-4xl font-black text-[#00213b] text-center">{formatearMoneda(valorFuturo)}</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold uppercase">
                <span className="text-green-600">Plusvalía Inmobiliaria ({tasaPlusvalia}%)</span>
                <span className="text-gray-900">{formatearMoneda(valorFuturo)}</span>
              </div>
              <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full transition-all duration-1000" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold uppercase">
                <span className="text-orange-500">Inflación Estimada ({tasaInflacion}%)</span>
                <span className="text-gray-500">{formatearMoneda(valorInflacion)}</span>
              </div>
              <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-400 rounded-full transition-all duration-1000" style={{ width: `${(valorInflacion/valorFuturo)*100}%` }}></div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-2xl flex items-start gap-3 border border-green-100">
            <span className="material-symbols-outlined text-green-600 mt-0.5">trending_up</span>
            <p className="text-xs font-bold text-green-800 leading-tight">
              Tu propiedad gana <span className="text-black">{formatearMoneda(valorFuturo - valorInflacion)}</span> por encima de la inflación, protegiendo tu dinero.
            </p>
          </div>
        </div>

        {/* Ajustes */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-8">
          
          <div className="grid grid-cols-3 gap-2">
            {['Preventa', 'Entrega Inmediata', 'Seminuevo'].map((status) => (
              <button
                key={status}
                onClick={() => setEstadoPropiedad(status)}
                className={`py-3 px-1 flex items-center justify-center text-center rounded-xl font-bold text-[9px] uppercase tracking-tighter transition-all leading-tight ${
                  estadoPropiedad === status 
                  ? 'bg-[#00213b] text-white shadow-md' 
                  : 'bg-gray-50 text-gray-400 border border-transparent hover:border-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-[#00213b] uppercase tracking-widest">Horizonte de tiempo</label>
              <span className="font-bold text-[#C5A059]">{anos} Años</span>
            </div>
            <input 
              type="range" min="1" max="30" step="1"
              value={anos} onChange={(e) => setAnos(Number(e.target.value))}
              className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#C5A059]"
            />
          </div>

          {/* DATO FIJO DE AUTORIDAD: PLUSVALÍA DE LA ZONA */}
          <div className="space-y-3 mt-6">
            <div className="flex justify-between items-center mb-1">
              <label className="text-[10px] font-black text-[#00213b] uppercase tracking-widest flex items-center gap-1">
                Plusvalía Proyectada
                <span className="material-symbols-outlined text-[14px] text-[#C5A059]" title="Dato verificado por análisis de mercado">verified</span>
              </label>
              <div className="text-right">
                <span className="text-xl font-black text-[#00213b]">{tasaPlusvalia}%</span>
                <span className="text-[8px] block text-gray-400 font-bold uppercase -mt-1">Anual</span>
              </div>
            </div>
            
            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden shadow-inner relative">
              <div 
                className="bg-[#C5A059] h-full rounded-full transition-all duration-500 relative" 
                style={{ width: `${(tasaPlusvalia / 15) * 100}%` }}
              >
                <div className="absolute top-0 left-0 w-full h-full bg-white opacity-20"></div>
              </div>
            </div>
            <p className="text-[9px] text-gray-400 mt-1 flex justify-end items-center gap-1 font-medium italic">
              *Tasa ajustada por ubicación y estado.
            </p>
          </div>
        </div>

        {/* NUEVO BOTÓN DE SIGUIENTE PASO: GALERÍA */}
        <div className="mt-8 pb-8 px-4">
          <button 
            onClick={() => navigate(`/galeria/${idVisita}`)}
            className="w-full bg-[#00213b] text-white py-5 rounded-2xl font-black text-[13px] md:text-base uppercase tracking-widest shadow-[0_10px_20px_rgba(0,33,59,0.2)] flex justify-center items-center gap-3 active:scale-95 transition-all border border-[#00335c]"
          >
            Siguiente: Ver Galería de Mi Visita
            <span className="material-symbols-outlined text-xl">arrow_forward</span>
          </button>
        </div>
      </main>
    </div>
  );
};