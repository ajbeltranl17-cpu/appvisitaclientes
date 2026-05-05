import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { EncabezadoGlobal } from '../components/EncabezadoGlobal';

interface VisitaData {
  fotosCliente?: string[];
}

export const DisenoIA = () => {
  const { idVisita } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // "Antena" para saber si venimos con una foto seleccionada desde la Galería
  
  // Estados
  const [estiloSeleccionado, setEstiloSeleccionado] = useState('Moderno');
  const [procesando, setProcesando] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Arreglo con todas las fotos del cliente
  const [fotosUsuario, setFotosUsuario] = useState<string[]>([]);
  // Imagen que está actualmente en el visor grande
  const [imagenBase, setImagenBase] = useState('https://images.unsplash.com/photo-1560448204-603b3fc33ddc?q=80&w=800');

  // Conexión a Firebase
  useEffect(() => {
    const fetchDatos = async () => {
      if (!idVisita) return;
      try {
        const docRef = doc(db, 'visitas', idVisita);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data() as VisitaData;
          if (data.fotosCliente && data.fotosCliente.length > 0) {
            setFotosUsuario(data.fotosCliente);
            
            // Si la Galería nos mandó una foto específica, usamos esa. Si no, usamos la primera.
            if (location.state && location.state.fotoSeleccionada) {
              setImagenBase(location.state.fotoSeleccionada);
            } else {
              setImagenBase(data.fotosCliente[0]); 
            }
          }
        }
      } catch (error) {
        console.error("Error al cargar la foto para IA:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDatos();
  }, [idVisita, location.state]);

  const estilos = [
    { id: 'Moderno', img: '/style-modern.jpg', desc: 'Líneas limpias y tonos neutros.' },
    { id: 'Industrial', img: '/style-industrial.jpg', desc: 'Materiales crudos y toques urbanos.' },
    { id: 'Minimalista', img: '/style-minimalist.jpg', desc: 'Menos es más, máxima amplitud.' },
    { id: 'Escandinavo', img: '/style-scandi.jpg', desc: 'Cálido, funcional y mucha madera.' }
  ];

  const manejarGeneracion = () => {
    setProcesando(true);
    // Simulamos el tiempo de procesamiento de la IA
    setTimeout(() => setProcesando(false), 3000);
  };

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

        {/* CONTENEDOR PRINCIPAL DEL VISOR Y CARRUSEL */}
        <div className="space-y-3">
          
          {/* Visor de Comparación (Antes / Después) */}
          <div className="relative aspect-[4/3] bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
            <img 
              src={imagenBase} 
              alt="Espacio a rediseñar" 
              className={`w-full h-full object-cover transition-all duration-1000 ${procesando ? 'blur-xl scale-110 opacity-50' : 'blur-0 scale-100 opacity-100'}`}
            />
            
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

          {/* NUEVO: Carrusel de Miniaturas (Solo aparece si hay más de 1 foto) */}
          {fotosUsuario.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar px-1">
              {fotosUsuario.map((url, index) => (
                <button
                  key={index}
                  onClick={() => setImagenBase(url)}
                  className={`w-16 h-16 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                    imagenBase === url 
                    ? 'border-[#C5A059] shadow-md scale-105' 
                    : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt={`Miniatura ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selector de Estilos */}
        <section className="space-y-4">
          <h3 className="font-bold text-[#00213b] text-xs uppercase tracking-widest px-2">Selecciona un Estilo de Diseño</h3>
          <div className="grid grid-cols-2 gap-3">
            {estilos.map((estilo) => (
              <button
                key={estilo.id}
                onClick={() => setEstiloSeleccionado(estilo.id)}
                className={`p-3 rounded-3xl border-2 transition-all text-left space-y-2 flex flex-col h-full ${
                  estiloSeleccionado === estilo.id 
                  ? 'border-[#C5A059] bg-white shadow-md' 
                  : 'border-transparent bg-gray-100 opacity-60'
                }`}
              >
                <div className="w-full h-20 bg-gray-200 rounded-2xl overflow-hidden mb-1 flex-shrink-0">
                  <img 
                    src={estilo.img} 
                    alt={estilo.id} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/150?text=Estilo";
                    }}
                  />
                </div>
                <div className="flex flex-col flex-grow justify-start">
                  <p className="font-bold text-[#00213b] text-xs leading-tight">{estilo.id}</p>
                  <p className="text-[9px] text-gray-500 leading-tight mt-1">{estilo.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Botón de Acción IA */}
        <button
          onClick={manejarGeneracion}
          className="w-full bg-[#C5A059] hover:bg-[#b08d4a] text-[#00213b] py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg flex justify-center items-center gap-2 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined">auto_awesome</span>
          Generar Diseño IA
        </button>

        {/* BOTÓN DE NAVEGACIÓN CONSISTENTE EN AZUL */}
        <div className="mt-10 pb-8 px-4">
          <button 
            onClick={() => navigate(`/swipe/${idVisita}`)}
            className="w-full bg-[#00213b] text-white py-5 rounded-2xl font-black text-[13px] md:text-base uppercase tracking-widest shadow-[0_10px_20px_rgba(0,33,59,0.2)] flex justify-center items-center gap-3 active:scale-95 transition-all border border-[#00335c]"
          >
            Siguiente: Swipe de Propiedades
            <span className="material-symbols-outlined text-xl">style</span>
          </button>
        </div>
      </main>
    </div>
  );
};