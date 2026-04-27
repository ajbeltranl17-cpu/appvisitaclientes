import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { EncabezadoGlobal } from '../components/EncabezadoGlobal';

export const DisenoIA = () => {
  const { idVisita } = useParams();
  const [estiloSeleccionado, setEstiloSeleccionado] = useState('Moderno');
  const [procesando, setProcesando] = useState(false);

  const estilos = [
    { id: 'Moderno', img: 'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?q=80&w=200', desc: 'Líneas limpias y tonos neutros.' },
    { id: 'Industrial', img: 'https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?q=80&w=200', desc: 'Materiales crudos y toques urbanos.' },
    { id: 'Minimalista', img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=200', desc: 'Menos es más, máxima amplitud.' },
    { id: 'Escandinavo', img: 'https://images.unsplash.com/photo-1550226844-2730ad48fc8e?q=80&w=200', desc: 'Cálido, funcional y mucha madera.' }
  ];

  const manejarGeneracion = () => {
    setProcesando(true);
    // Simulamos el tiempo de procesamiento de la IA
    setTimeout(() => setProcesando(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <EncabezadoGlobal 
        rutaAnterior={`/galeria/${idVisita}`}
        textoAnterior="Galería"
        rutaSiguiente={`/swipe/${idVisita}`}
        textoSiguiente="Swipe"
      />

      <main className="p-4 space-y-6 max-w-md mx-auto w-full pb-10">
        
        <section className="px-2 text-center">
          <span className="text-[#C5A059] font-black uppercase text-[10px] tracking-[0.3em]">Potencial Infinito</span>
          <h1 className="text-3xl font-black text-[#00213b] mt-1">Diseño con IA</h1>
          <p className="text-gray-500 text-sm mt-2">Visualiza cómo se vería tu futuro hogar amueblado profesionalmente.</p>
        </section>

        {/* Visor de Comparación (Antes / Después) */}
        <div className="relative aspect-[4/3] bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
          {/* Imagen de fondo (El "Antes" o el "Resultado") */}
          <img 
            src="https://images.unsplash.com/photo-1560448204-603b3fc33ddc?q=80&w=800" 
            alt="Espacio" 
            className={`w-full h-full object-cover transition-all duration-1000 ${procesando ? 'blur-xl scale-110 opacity-50' : 'blur-0 scale-100 opacity-100'}`}
          />
          
          {/* Overlay de Carga IA */}
          {procesando && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#00213b]/20 backdrop-blur-md">
              <div className="w-16 h-16 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin mb-4"></div>
              <span className="text-white font-black text-xs uppercase tracking-widest animate-pulse">Rediseñando Espacio...</span>
            </div>
          )}

          <div className="absolute bottom-4 right-4">
             <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-2xl shadow-lg">
                <span className="text-[10px] font-black text-[#00213b] uppercase">Vista: {estiloSeleccionado}</span>
             </div>
          </div>
        </div>

        {/* Selector de Estilos */}
        <section className="space-y-4">
          <h3 className="font-bold text-[#00213b] text-xs uppercase tracking-widest px-2">Selecciona un Estilo de Diseño</h3>
          <div className="grid grid-cols-2 gap-3">
            {estilos.map((estilo) => (
              <button
                key={estilo.id}
                onClick={() => setEstiloSeleccionado(estilo.id)}
                className={`p-3 rounded-3xl border-2 transition-all text-left space-y-2 ${
                  estiloSeleccionado === estilo.id 
                  ? 'border-[#C5A059] bg-white shadow-md' 
                  : 'border-transparent bg-gray-100 opacity-60'
                }`}
              >
                <img src={estilo.img} alt={estilo.id} className="w-full h-20 object-cover rounded-2xl" />
                <div>
                  <p className="font-bold text-[#00213b] text-xs">{estilo.id}</p>
                  <p className="text-[9px] text-gray-500 leading-tight">{estilo.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Botón de Acción IA */}
        <button 
          onClick={manejarGeneracion}
          disabled={procesando}
          className="w-full bg-[#00213b] text-white py-5 rounded-2xl font-bold text-lg shadow-xl hover:bg-[#00335c] transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
        >
          <span className="material-symbols-outlined">auto_awesome</span>
          {procesando ? 'Procesando con IA...' : 'Generar Diseño IA'}
        </button>

      </main>
    </div>
  );
};