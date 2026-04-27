import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EncabezadoGlobal } from '../components/EncabezadoGlobal';

export const SwipePareja = () => {
  const { idVisita } = useParams();
  const navigate = useNavigate();
  
  // Estado para controlar qué tarjeta estamos viendo
  const [indiceActual, setIndiceActual] = useState(0);
  const [matches, setMatches] = useState<string[]>([]);

  // Datos de las tarjetas (Características de la propiedad)
  const tarjetas = [
    { id: '1', titulo: 'Cocina con Barra de Granito', img: 'https://images.unsplash.com/photo-1556910103-1c02745a872e?q=80&w=600', desc: 'Ideal para desayunos rápidos o recibir visitas.' },
    { id: '2', titulo: 'Terraza Privada', img: 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?q=80&w=600', desc: 'Espacio al aire libre con vista a la ciudad.' },
    { id: '3', titulo: 'Walk-in clóset amplio', img: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=600', desc: 'Diseño inteligente para maximizar el espacio.' },
    { id: '4', titulo: 'Amenidad: Alberca y asadores', img: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=600', desc: 'Tu fin de semana perfecto sin salir de casa.' },
  ];

  // Funciones de decisión
  const manejarDecision = (gusta: boolean) => {
    if (gusta) {
      setMatches([...matches, tarjetas[indiceActual].titulo]);
    }
    setIndiceActual(indiceActual + 1);
  };

  const reinciar = () => {
    setIndiceActual(0);
    setMatches([]);
  };

  // Pantalla final cuando se acaban las tarjetas
  const mostrarResultados = indiceActual >= tarjetas.length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans overflow-hidden">
      <EncabezadoGlobal 
        rutaAnterior={`/diseno-ia/${idVisita}`}
        textoAnterior="Diseño IA"
        rutaSiguiente={`/catalogo/${idVisita}`}
        textoSiguiente="Catálogo"
      />

      <main className="flex-1 flex flex-col p-4 max-w-md mx-auto w-full relative">
        
        {/* Cabecera */}
        <section className="text-center mb-6">
          <span className="text-[#C5A059] font-black uppercase text-[10px] tracking-[0.3em]">Alineación de Intereses</span>
          <h1 className="text-3xl font-black text-[#00213b] mt-1">¿Hacemos Match?</h1>
          <p className="text-gray-500 text-xs mt-2 px-4">Descubre si tú y tu pareja buscan lo mismo en este espacio.</p>
        </section>

        {/* Zona de Tarjetas */}
        <div className="flex-1 relative flex items-center justify-center min-h-[400px]">
          
          {!mostrarResultados ? (
            <div className="w-full h-full max-h-[480px] bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden flex flex-col transform transition-all duration-300">
              {/* Imagen de la Tarjeta */}
              <div className="flex-1 relative bg-gray-200">
                <img 
                  src={tarjetas[indiceActual].img} 
                  alt={tarjetas[indiceActual].titulo} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                
                {/* Texto sobre la imagen */}
                <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                  <h2 className="text-2xl font-bold leading-tight shadow-black">{tarjetas[indiceActual].titulo}</h2>
                  <p className="text-sm opacity-90 mt-2">{tarjetas[indiceActual].desc}</p>
                </div>
              </div>

              {/* Botones de Acción (Corazón / Tache) */}
              <div className="h-28 bg-white flex items-center justify-center gap-8 px-6">
                <button 
                  onClick={() => manejarDecision(false)}
                  className="w-16 h-16 rounded-full bg-white shadow-lg border-2 border-red-100 text-red-500 flex items-center justify-center active:scale-90 active:bg-red-50 transition-all"
                >
                  <span className="material-symbols-outlined text-3xl">close</span>
                </button>
                <button 
                  onClick={() => manejarDecision(true)}
                  className="w-16 h-16 rounded-full bg-white shadow-lg border-2 border-green-100 text-green-500 flex items-center justify-center active:scale-90 active:bg-green-50 transition-all"
                >
                  <span className="material-symbols-outlined text-3xl">favorite</span>
                </button>
              </div>
            </div>
          ) : (
            
            // Pantalla de Resultados
            <div className="w-full bg-white rounded-[2.5rem] shadow-xl p-8 text-center border border-gray-100 animate-fade-in">
              <div className="w-20 h-20 bg-[#C5A059]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-5xl text-[#C5A059]">celebration</span>
              </div>
              <h2 className="text-2xl font-black text-[#00213b] mb-2">¡Completado!</h2>
              <p className="text-gray-500 text-sm mb-6">Hicieron match en {matches.length} de {tarjetas.length} características de esta propiedad.</p>
              
              {matches.length > 0 && (
                <div className="text-left bg-gray-50 p-4 rounded-2xl mb-6">
                  <h3 className="font-bold text-[#00213b] text-xs uppercase tracking-widest mb-3">Tus Prioridades:</h3>
                  <ul className="space-y-2">
                    {matches.map((match, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
                        {match}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-3">
                <button 
                  onClick={() => navigate(`/catalogo/${idVisita}`)}
                  className="w-full bg-[#00213b] text-white py-4 rounded-2xl font-bold shadow-md active:scale-95 transition-transform"
                >
                  Ver Catálogo de Acabados
                </button>
                <button 
                  onClick={reinciar}
                  className="w-full bg-white text-[#00213b] border border-gray-200 py-4 rounded-2xl font-bold active:bg-gray-50 transition-colors"
                >
                  Volver a jugar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Indicador de progreso (puntos abajo) */}
        {!mostrarResultados && (
          <div className="flex justify-center gap-2 mt-4">
            {tarjetas.map((_, idx) => (
              <div 
                key={idx} 
                className={`w-2 h-2 rounded-full transition-all ${idx === indiceActual ? 'bg-[#C5A059] w-4' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        )}

      </main>
    </div>
  );
};