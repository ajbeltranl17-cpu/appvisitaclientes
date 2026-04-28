import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EncabezadoGlobal } from '../components/EncabezadoGlobal';

export const AnalisisZona = () => {
  const navigate = useNavigate();
  const { idVisita } = useParams();

  const puntosInteres = [
    { 
      categoria: 'Educación', 
      icon: 'school', 
      items: ['Universidad Veracruzana (UV)', 'Colegio Americano de Veracruz', 'Escuelas de prestigio a < 5 min'] 
    },
    { 
      categoria: 'Comercio y Ocio', 
      icon: 'local_mall', 
      items: ['Plaza Mocambo', 'Costco Veracruz', 'Distrito Boca (Restaurantes)'] 
    },
    { 
      categoria: 'Salud', 
      icon: 'medical_services', 
      items: ['Hospital Millenium', 'Clínicas especializadas', 'Farmacias 24/7 en la zona'] 
    },
    { 
      categoria: 'Conectividad', 
      icon: 'directions_car', 
      items: ['Acceso rápido a Av. Juan Pablo II', 'Cerca de Blvd. Manuel Ávila Camacho', 'Zona segura y caminable'] 
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <EncabezadoGlobal 
        rutaAnterior={`/dashboard/${idVisita}`}
        textoAnterior="Dashboard"
        rutaSiguiente={`/calculadora/${idVisita}`}
        textoSiguiente="Hipoteca"
      />

      <main className="p-4 space-y-6 max-w-md mx-auto w-full pb-8">
        
        <section className="px-2">
          <span className="text-[#C5A059] font-black uppercase text-[10px] tracking-[0.2em]">Entorno y Estilo de Vida</span>
          <h1 className="text-3xl font-black text-[#00213b] mt-1">Análisis de la Zona</h1>
          <p className="text-gray-500 text-sm mt-2">Explora los servicios y puntos clave que rodean tu próxima inversión en Boca del Río.</p>
        </section>

        <div className="w-full aspect-video bg-white rounded-3xl overflow-hidden shadow-md border border-gray-100 relative">
          <img 
            src="/map.jpg" 
            alt="Mapa detallado de la zona" 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-3 left-3">
            <span className="bg-[#00213b]/90 text-white text-[9px] font-bold px-3 py-1.5 rounded-full backdrop-blur-sm shadow-sm">
              UBICACIÓN ESTRATÉGICA
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {puntosInteres.map((cat, idx) => (
            <div key={idx} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-50 flex gap-4">
              <div className="bg-[#C5A059]/10 text-[#C5A059] w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-2xl">{cat.icon}</span>
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-[#00213b] text-sm uppercase tracking-tight">{cat.categoria}</h3>
                <ul className="space-y-1">
                  {cat.items.map((item, i) => (
                    <li key={i} className="text-gray-500 text-xs flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-[#C5A059] rounded-full flex-shrink-0"></div>
                      <span className="leading-tight">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
{/* NUEVO BOTÓN DE SIGUIENTE PASO: CALCULAR HIPOTECA */}
        <div className="mt-8 pb-8 px-4">
          <button 
            onClick={() => navigate(`/calculadora/${idVisita}`)}
            className="w-full bg-[#00213b] text-white py-5 rounded-2xl font-black text-[13px] md:text-base uppercase tracking-widest shadow-[0_10px_20px_rgba(0,33,59,0.2)] flex justify-center items-center gap-3 active:scale-95 transition-all border border-[#00335c]"
          >
            Siguiente: Calcular Hipoteca
            <span className="material-symbols-outlined text-xl">arrow_forward</span>
          </button>
        </div>
      </main>
    </div>
  );
};