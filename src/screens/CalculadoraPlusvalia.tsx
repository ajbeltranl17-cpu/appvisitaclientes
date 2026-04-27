import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { EncabezadoGlobal } from '../components/EncabezadoGlobal';

export const CalculadoraPlusvalia = () => {
  const { idVisita } = useParams();

  // Valores base (En el futuro vendrán del análisis de la URL/IA)
  const [precioOriginal, setPrecioOriginal] = useState(3400000);
  const [tasaPlusvalia, setTasaPlusvalia] = useState(7.5); // % anual basado en zona
  const [tasaInflacion, setTasaInflacion] = useState(4.5); // % inflación estimada
  const [anos, setAnos] = useState(10);
  const [estadoPropiedad, setEstadoPropiedad] = useState('Entrega Inmediata');

  const [valorFuturo, setValorFuturo] = useState(0);
  const [valorInflacion, setValorInflacion] = useState(0);

  // Cálculo de interés compuesto
  useEffect(() => {
    // Si es preventa, podríamos añadir un bono de plusvalía inicial del 10-15%
    const bonoPreventa = estadoPropiedad === 'Preventa' ? 1.12 : 1;
    
    const futuro = (precioOriginal * bonoPreventa) * Math.pow(1 + tasaPlusvalia / 100, anos);
    const inflacion = precioOriginal * Math.pow(1 + tasaInflacion / 100, anos);
    
    setValorFuturo(futuro);
    setValorInflacion(inflacion);
  }, [precioOriginal, tasaPlusvalia, tasaInflacion, anos, estadoPropiedad]);

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

        {/* Comparativa Visual */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100 space-y-6">
          
          <div className="space-y-1">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Valor estimado en {anos} años</p>
            <h2 className="text-4xl font-black text-[#00213b] text-center">{formatearMoneda(valorFuturo)}</h2>
          </div>

          <div className="space-y-4">
            {/* Barra de Plusvalía */}
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold uppercase">
                <span className="text-green-600">Plusvalía Inmobiliaria ({tasaPlusvalia}%)</span>
                <span className="text-gray-900">{formatearMoneda(valorFuturo)}</span>
              </div>
              <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>

            {/* Barra de Inflación */}
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold uppercase">
                <span className="text-orange-500">Inflación Estimada ({tasaInflacion}%)</span>
                <span className="text-gray-500">{formatearMoneda(valorInflacion)}</span>
              </div>
              <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-400 rounded-full" style={{ width: `${(valorInflacion/valorFuturo)*100}%` }}></div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-2xl flex items-center gap-3">
            <span className="material-symbols-outlined text-green-600">trending_up</span>
            <p className="text-xs font-bold text-green-800 leading-tight">
              Tu propiedad gana {formatearMoneda(valorFuturo - valorInflacion)} por encima de la inflación.
            </p>
          </div>
        </div>

        {/* Ajustes */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6">
          
          {/* Status Propiedad */}
          <div className="grid grid-cols-2 gap-2">
            {['Preventa', 'Entrega Inmediata'].map((status) => (
              <button
                key={status}
                onClick={() => setEstadoPropiedad(status)}
                className={`py-3 rounded-xl font-bold text-[10px] uppercase tracking-tighter transition-all ${
                  estadoPropiedad === status 
                  ? 'bg-[#00213b] text-white' 
                  : 'bg-gray-50 text-gray-400'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Slider de Años */}
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

          {/* Plusvalía de la Zona (Ajustable) */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-[#00213b] uppercase tracking-widest">Plusvalía Zona (Anual)</label>
              <span className="font-bold text-[#C5A059]">{tasaPlusvalia}%</span>
            </div>
            <input 
              type="range" min="1" max="15" step="0.5"
              value={tasaPlusvalia} onChange={(e) => setTasaPlusvalia(Number(e.target.value))}
              className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#C5A059]"
            />
          </div>
        </div>

      </main>
    </div>
  );
};