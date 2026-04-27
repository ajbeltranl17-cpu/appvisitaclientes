import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EncabezadoGlobal } from '../components/EncabezadoGlobal';

export const SwipePareja = () => {
  const { idVisita } = useParams();
  const navigate = useNavigate();
  
  const [indiceActual, setIndiceActual] = useState(0);
  const [matches, setMatches] = useState<string[]>([]);

  // Ahora usamos imágenes locales para garantizar que siempre carguen
  const tarjetas = [
    { id: '1', titulo: 'Cocina con Barra', img: '/swipe-1.jpg', desc: 'Ideal para desayunos rápidos o recibir visitas.' },
    { id: '2', titulo: 'Terraza Privada', img: '/swipe-2.jpg', desc: 'Espacio al aire libre con vista a la ciudad.' },
    { id: '3', titulo: 'Walk-in clóset amplio', img: '/swipe-3.jpg', desc: 'Diseño inteligente para maximizar el espacio.' },
    { id: '4', titulo: 'Alberca y asadores', img: '/swipe-4.jpg', desc: 'Tu fin de semana perfecto sin salir de casa.' },
  ];

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

  // Función para enviar a WhatsApp
  const compartirWhatsApp = () => {
    const texto = `¡Hola! Acabamos de hacer Match en ${matches.length} características para nuestro próximo departamento en Jardines del Virginia.\n\nNuestras prioridades conjuntas son:\n${matches.map(m => `✅ ${m}`).join('\n')}\n\n¡Creo que esta es la opción ideal!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank');
  };

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
        
        <section className="text-center mb-6">
          <span className="text-[#C5A059] font-black uppercase text-[10px] tracking-[0.3em]">Alineación de Intereses</span>
          <h1 className="text-3xl font-black text-[#00213b] mt-1">¿Hacemos Match?</h1>
          <p className="text-gray-500 text-xs mt-2 px-4">Descubre si tú y tu pareja buscan lo mismo en este espacio.</p>
        </section>

        <div className="flex-1 relative flex items-center justify-center min-h-[420px]">
          
          {!mostrarResultados ? (
            // TARJETA DE SWIPE (Estructura reforzada)
            <div className="w-full h-[450px] bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden flex flex-col transform transition-all duration-300">
              
              {/* Contenedor de Imagen a prueba de colapsos */}
              <div className="flex-1 relative bg-gray-200 min-h-[250px]">
                <img 
                  src={tarjetas[indiceActual].img} 
                  alt={tarjetas[indiceActual].titulo} 
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/400x500?text=Cargando+Caracteristica..." }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#00213b]/90 via-black/20 to-transparent"></div>
                
                <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                  <h2 className="text-2xl font-black leading-tight shadow-black">{tarjetas[indiceActual].titulo}</h2>
                  <p className="text-sm opacity-90 mt-2 font-medium">{tarjetas[indiceActual].desc}</p>
                </div>
              </div>

              {/* Botones */}
              <div className="h-28 bg-white flex items-center justify-center gap-8 px-6 flex-shrink-0">
                <button 
                  onClick={() => manejarDecision(false)}
                  className="w-16 h-16 rounded-full bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-red-50 text-red-500 flex items-center justify-center active:scale-90 active:bg-red-50 transition-all"
                >
                  <span className="material-symbols-outlined text-3xl">close</span>
                </button>
                <button 
                  onClick={() => manejarDecision(true)}
                  className="w-16 h-16 rounded-full bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-green-50 text-green-500 flex items-center justify-center active:scale-90 active:bg-green-50 transition-all"
                >
                  <span className="material-symbols-outlined text-3xl">favorite</span>
                </button>
              </div>
            </div>
          ) : (
            
            // PANTALLA DE RESULTADOS
            <div className="w-full bg-white rounded-[2.5rem] shadow-xl p-6 text-center border border-gray-100 animate-fade-in flex flex-col max-h-[500px] overflow-y-auto">
              <div className="w-16 h-16 bg-[#C5A059]/10 rounded-full flex items-center justify-center mx-auto mb-4 flex-shrink-0">
                <span className="material-symbols-outlined text-4xl text-[#C5A059]">celebration</span>
              </div>
              <h2 className="text-2xl font-black text-[#00213b] mb-1">¡Completado!</h2>
              <p className="text-gray-500 text-xs mb-4">Hicieron match en {matches.length} de {tarjetas.length} características clave.</p>
              
              {matches.length > 0 && (
                <div className="text-left bg-gray-50 p-4 rounded-2xl mb-6">
                  <h3 className="font-bold text-[#00213b] text-[10px] uppercase tracking-widest mb-3">Tus Prioridades Confirmadas:</h3>
                  <ul className="space-y-2">
                    {matches.map((match, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                        <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
                        {match}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-3 mt-auto">
                {/* BOTÓN DE WHATSAPP */}
                <button 
                  onClick={compartirWhatsApp}
                  className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-4 rounded-2xl font-bold shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 0C5.385 0 0 5.386 0 12.033c0 2.128.553 4.205 1.604 6.035L.145 24l6.113-1.605c1.764.966 3.754 1.476 5.77 1.476 6.647 0 12.034-5.386 12.034-12.034C24 5.386 18.678 0 12.031 0zm0 21.894c-1.802 0-3.565-.484-5.112-1.404l-.367-.218-3.805.998.998-3.71-.238-.38A9.873 9.873 0 0 1 2.051 12.033c0-5.513 4.487-10 10-10 5.513 0 10 4.487 10 10s-4.487 10-9.999 10zm5.485-7.493c-.302-.15-1.785-.88-2.062-.98-.278-.1-.481-.15-.683.15-.203.301-.781.98-.957 1.18-.175.201-.35.226-.652.076-1.528-.758-2.613-1.442-3.626-3.15-.176-.297-.018-.458.133-.608.135-.135.302-.352.453-.528.15-.176.202-.301.302-.502.1-.201.05-.377-.025-.527-.075-.15-.683-1.645-.935-2.253-.246-.593-.497-.512-.683-.521-.175-.009-.376-.009-.578-.009-.202 0-.528.075-.805.376-.277.301-1.056 1.031-1.056 2.513 0 1.482 1.082 2.915 1.233 3.116.15.201 2.126 3.245 5.15 4.547 2.08 .894 2.87 .974 3.938.82 1.156-.168 3.565-1.457 4.067-2.865.503-1.408.503-2.614.353-2.865-.151-.252-.553-.402-.855-.553z"/>
                  </svg>
                  Compartir Resultados
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

      </main>
    </div>
  );
};