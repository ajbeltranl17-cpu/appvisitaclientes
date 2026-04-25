import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { BrandLogo } from '../components/BrandLogo';

export const AmueblarIA = () => {
  const { idVisita } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Imagen original (la que viene de la galería o el respaldo)
  const imgSeleccionada = searchParams.get('img') || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80';
  
  // Imagen amueblada (Simulación visual para el prototipo)
  const imgAmueblada = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80';

  const [estiloDeseado, setEstiloDeseado] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFurnished, setIsFurnished] = useState(false);

  // Simulación del motor de IA
  const handleAmueblar = () => {
    if (!estiloDeseado.trim()) {
        alert("Por favor ingresa un estilo de decoración primero.");
        return;
    }
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setIsFurnished(true);
    }, 2500);
  };

  // Lógica para abrir WhatsApp
  const handleWhatsAppShare = () => {
    const texto = encodeURIComponent(`¡Mira cómo podría quedar esta propiedad amueblada con IA!\n\nEstilo: ${estiloDeseado || 'Personalizado'}\nDescubre más opciones con Tu Conexión Inmobiliaria.`);
    window.open(`https://api.whatsapp.com/send?text=${texto}`, '_blank');
  };

  return (
    <div className="bg-[#f9f9f7] text-[#1a1c1b] h-screen flex flex-col overflow-hidden">
      
      {/* TopAppBar */}
      <header className="bg-white border-b border-[#e2e3e1] shrink-0 z-50">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto relative">
          
          <button 
            onClick={() => navigate(`/galeria/${idVisita}`)}
            className="flex items-center gap-2 text-[#1A3651] hover:text-[#C5A059] transition-colors font-headline font-bold text-sm z-10"
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
            <span className="hidden sm:inline">Regresar a la Galería</span>
          </button>

          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-3">
            <BrandLogo />
            <span className="hidden md:block text-xl font-extrabold tracking-tighter text-[#1A3651] font-headline">
              Tu Conexión Inmobiliaria
            </span>
          </div>

          {/* BOTÓN ACTUALIZADO: Swipe en Pareja (Dorado) */}
          <div className="flex items-center gap-4 z-10">
            <button 
                onClick={() => navigate(`/swipe/${idVisita}`)}
                className="bg-[#C5A059] hover:bg-[#b08d4a] text-white px-5 py-2.5 rounded-lg font-headline font-bold flex items-center gap-2 transition-all shadow-sm"
            >
              <span className="hidden sm:inline text-sm">Swipe en Pareja</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col overflow-hidden">
        
        {/* Image Area */}
        <div className="h-[75%] w-full relative overflow-hidden bg-[#eeeeec]">
          
          {/* Overlay de Carga (Simulación IA) */}
          {isGenerating && (
            <div className="absolute inset-0 bg-[#1A3651]/80 backdrop-blur-md flex flex-col items-center justify-center text-white z-20 transition-all duration-300">
                <span className="material-symbols-outlined text-6xl animate-spin mb-4 text-[#C5A059]">progress_activity</span>
                <h3 className="font-headline font-bold text-2xl tracking-tight mb-2 animate-pulse">Procesando con IA...</h3>
                <p className="text-white/80">Aplicando estilo: {estiloDeseado}</p>
            </div>
          )}

          <img 
            src={isFurnished ? imgAmueblada : imgSeleccionada}
            alt="Espacio seleccionado para amueblar" 
            className={`w-full h-full object-cover transition-opacity duration-1000 ${isGenerating ? 'opacity-50' : 'opacity-100'}`} 
          />
          
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-10">
            <button className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-md flex items-center justify-center text-[#1A3651] hover:bg-white transition-all shadow-sm">
              <span className="material-symbols-outlined">zoom_in</span>
            </button>
            <button 
                onClick={() => setIsFurnished(false)} 
                title="Ver original"
                className={`w-10 h-10 rounded-full bg-white/60 backdrop-blur-md flex items-center justify-center text-[#1A3651] hover:bg-white transition-all shadow-sm ${isFurnished ? 'flex' : 'hidden'}`}
            >
              <span className="material-symbols-outlined">history</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="h-[25%] bg-white border-t border-[#e2e3e1] overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-6 h-full flex flex-col justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-xl font-headline font-bold text-[#1A3651]">Transformación Digital</h2>
                  <p className="text-[#43474d] text-sm font-body">Utiliza nuestra IA para amueblar este espacio instantáneamente.</p>
                </div>
                <div className="space-y-2">
                  <label htmlFor="deco-style" className="block text-xs font-bold uppercase tracking-wider text-[#1A3651]">
                    Estilo de Decoración Deseado
                  </label>
                  <input 
                    id="deco-style" 
                    type="text"
                    value={estiloDeseado}
                    onChange={(e) => setEstiloDeseado(e.target.value)}
                    placeholder="Ej: Cocina integral moderna, recámara minimalista..." 
                    className="w-full bg-[#f4f4f2] border border-[#c3c6ce] rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#C5A059] focus:border-transparent outline-none transition-all text-[#1a1c1b]" 
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-4 md:mt-0">
                <button 
                  onClick={handleAmueblar}
                  disabled={isGenerating}
                  className="w-full rounded-xl bg-gradient-to-r from-[#1A3651] to-[#2e4965] hover:from-[#C5A059] hover:to-[#775a19] text-white py-4 px-6 flex items-center justify-center gap-3 transition-all duration-500 shadow-lg group disabled:opacity-50"
                >
                  <span className={`material-symbols-outlined transition-transform ${isGenerating ? 'animate-spin' : 'group-hover:rotate-12'}`}>
                      {isFurnished ? 'refresh' : 'auto_awesome'}
                  </span>
                  <span className="font-headline font-bold tracking-wide">
                      {isFurnished ? 'Probar otro estilo' : 'Ver amueblado con IA'}
                  </span>
                </button>
                <div className="flex gap-3">
                  <button 
                    onClick={handleWhatsAppShare}
                    className="w-full bg-[#25D366] hover:bg-[#1ebd5b] transition-colors py-3 rounded-lg flex items-center justify-center gap-2 text-white font-bold text-sm shadow-sm"
                  >
                    <span className="material-symbols-outlined text-lg">share</span> 
                    Compartir por WhatsApp
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};