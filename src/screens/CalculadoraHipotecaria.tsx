import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { EncabezadoGlobal } from '../components/EncabezadoGlobal';

// Definimos la estructura esperada
interface VisitaData {
  precioPropiedad?: number; // Por si en el futuro lo guardas desde el formulario
  urlPropiedad?: string;
}

export const CalculadoraHipotecaria = () => {
  const { idVisita } = useParams();
  const navigate = useNavigate();

  // Estado de carga inicial
  const [loading, setLoading] = useState(true);

  // Estados iniciales basados en el perfil de Jardines del Virginia
  const [precio, setPrecio] = useState(3400000);
  const [enganchePorcentaje, setEnganchePorcentaje] = useState(20);
  const [plazoAnos, setPlazoAnos] = useState(20);
  const [tasaAnual, setTasaAnual] = useState(10.5);

  const [pagoMensual, setPagoMensual] = useState(0);

  // Conexión a Firebase (Fase 1: Tubería)
  useEffect(() => {
    const fetchVisita = async () => {
      if (!idVisita) return;
      try {
        const docRef = doc(db, 'visitas', idVisita);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data() as VisitaData;
          // Si ya existe un precio en la base de datos, lo precargamos.
          // Si no, se queda el de 3.4M por defecto hasta que implementemos la extracción (Fase 2)
          if (data.precioPropiedad) {
            setPrecio(Number(data.precioPropiedad));
          }
        }
      } catch (error) {
        console.error("Error al cargar datos financieros:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVisita();
  }, [idVisita]);

  // Cálculo financiero dinámico
  useEffect(() => {
    const montoCredito = precio * (1 - enganchePorcentaje / 100);
    const tasaMensual = (tasaAnual / 100) / 12;
    const numeroPagos = plazoAnos * 12;

    if (tasaMensual > 0) {
      const cuota = montoCredito * (tasaMensual * Math.pow(1 + tasaMensual, numeroPagos)) / 
        (Math.pow(1 + tasaMensual, numeroPagos) - 1);
      setPagoMensual(cuota);
    }
  }, [precio, enganchePorcentaje, plazoAnos, tasaAnual]);

  const formatearMoneda = (valor: number) => 
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(valor);

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
        rutaAnterior={`/analisis/${idVisita}`}
        textoAnterior="Zona"
        rutaSiguiente={`/plusvalia/${idVisita}`}
        textoSiguiente="Plusvalía"
      />

      <main className="p-4 space-y-6 max-w-md mx-auto w-full pb-10">
        
        <section className="px-2">
          <span className="text-[#C5A059] font-black uppercase text-[10px] tracking-[0.3em]">Viabilidad Financiera</span>
          <h1 className="text-3xl font-black text-[#00213b] mt-1">Tu Inversión</h1>
          <p className="text-gray-500 text-sm mt-2">Personaliza las condiciones de tu crédito para esta propiedad.</p>
        </section>

        {/* Card de Pago Mensual */}
        <div className="bg-[#00213b] rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059]/10 rounded-full -mr-16 -mt-16"></div>
          <p className="text-[10px] uppercase tracking-widest font-bold opacity-60 mb-2">Pago Mensual Estimado</p>
          <h2 className="text-4xl font-black text-[#C5A059]">{formatearMoneda(pagoMensual)}</h2>
          <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
            <div>
              <p className="text-[9px] uppercase opacity-50 font-bold">Crédito</p>
              <p className="font-bold text-sm">{formatearMoneda(precio * (1 - enganchePorcentaje / 100))}</p>
            </div>
            <div>
              <p className="text-[9px] uppercase opacity-50 font-bold">Enganche</p>
              <p className="font-bold text-sm">{formatearMoneda(precio * (enganchePorcentaje / 100))}</p>
            </div>
          </div>
        </div>

        {/* Controles Dinámicos */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-8">
          
          {/* Valor Propiedad */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-[#00213b] uppercase tracking-widest">Valor Propiedad</label>
              <span className="font-bold text-[#00213b]">{formatearMoneda(precio)}</span>
            </div>
            <input 
              type="range" min="1000000" max="10000000" step="100000"
              value={precio} onChange={(e) => setPrecio(Number(e.target.value))}
              className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#C5A059]"
            />
          </div>

          {/* Enganche */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-[#00213b] uppercase tracking-widest">Enganche</label>
              <span className="font-bold text-[#C5A059]">{enganchePorcentaje}%</span>
            </div>
            <input 
              type="range" min="10" max="50" step="5"
              value={enganchePorcentaje} onChange={(e) => setEnganchePorcentaje(Number(e.target.value))}
              className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#C5A059]"
            />
          </div>

          {/* Tasa de Interés */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-[#00213b] uppercase tracking-widest">Tasa de Interés Anual</label>
              <span className="font-bold text-[#C5A059]">{tasaAnual.toFixed(1)}%</span>
            </div>
            <input 
              type="range" min="8.0" max="15.0" step="0.5"
              value={tasaAnual} onChange={(e) => setTasaAnual(Number(e.target.value))}
              className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#C5A059]"
            />
          </div>

          {/* Plazo */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-[#00213b] uppercase tracking-widest block">Plazo del Crédito</label>
            <div className="grid grid-cols-3 gap-2">
              {[10, 15, 20].map((ano) => (
                <button
                  key={ano}
                  onClick={() => setPlazoAnos(ano)}
                  className={`py-3 rounded-2xl font-bold text-xs transition-all ${
                    plazoAnos === ano 
                    ? 'bg-[#00213b] text-white shadow-md' 
                    : 'bg-gray-50 text-gray-400 border border-gray-100'
                  }`}
                >
                  {ano} Años
                </button>
              ))}
            </div>
          </div>

        </div>

        <div className="px-4 flex gap-3 items-start">
          <span className="material-symbols-outlined text-[#C5A059] text-lg">info</span>
          <p className="text-[10px] text-gray-400 leading-relaxed italic">
            *Cálculo informativo sujeto a aprobación de crédito. Basado en una tasa personalizada del {tasaAnual.toFixed(1)}%.
          </p>
        </div>

        {/* BOTÓN DE SIGUIENTE PASO: CALCULAR PLUSVALÍA */}
        <div className="mt-8 pb-8 px-4">
          <button 
            onClick={() => navigate(`/plusvalia/${idVisita}`)}
            className="w-full bg-[#00213b] text-white py-5 rounded-2xl font-black text-[13px] md:text-base uppercase tracking-widest shadow-[0_10px_20px_rgba(0,33,59,0.2)] flex justify-center items-center gap-3 active:scale-95 transition-all border border-[#00335c]"
          >
            Siguiente: Calcular Plusvalía
            <span className="material-symbols-outlined text-xl">arrow_forward</span>
          </button>
        </div>
      </main>
    </div>
  );
};