import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  ChevronLeft, 
  Sparkles, 
  RefreshCw,
  Layers,
  History,
  Download
} from 'lucide-react';

export const AIStaging: React.FC = () => {
  const { navigate } = useAppContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentImage, setCurrentImage] = useState('https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800');
  const [activeStyle, setActiveStyle] = useState('Minimalista');

  const styles = ['Minimalista', 'Nórdico', 'Industrial', 'Lujo'];

  const handleProcess = () => {
    setIsProcessing(true);
    setTimeout(() => {
      // In a real app we'd call the service here
      setIsProcessing(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#1A3651] text-white animate-in zoom-in duration-500 overflow-hidden flex flex-col">
      <header className="p-6 flex justify-between items-center bg-[#1A3651] border-b border-white/5">
        <button onClick={() => navigate('GALERIA')} className="p-3 bg-white/5 rounded-full text-[#C5A059]">
          <ChevronLeft size={24} />
        </button>
        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C5A059]">Creative Bridge IA</p>
          <h2 className="text-lg font-bold">Amueblado Virtual</h2>
        </div>
        <button className="p-3 bg-white/5 rounded-full">
          <History size={24} />
        </button>
      </header>

      <main className="flex-1 p-6 space-y-8 flex flex-col">
        {/* Workspace */}
        <div className="relative flex-1 rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 group">
          <img 
            src={currentImage} 
            alt="Staging Workspace" 
            className={`w-full h-full object-cover transition-opacity duration-700 ${isProcessing ? 'opacity-30' : 'opacity-100'}`}
          />
          
          {isProcessing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
              <RefreshCw className="animate-spin text-[#C5A059]" size={48} />
              <div className="text-center">
                 <p className="text-sm font-black uppercase tracking-widest leading-none">Diseñando Espacio...</p>
                 <p className="text-[10px] text-[#C5A059] font-bold uppercase tracking-tighter">Motor Neuro-Inmobiliario activo</p>
              </div>
            </div>
          )}

          <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
             <Layers className="text-[#C5A059]" size={16} />
             <span className="text-[10px] font-bold uppercase tracking-widest">{activeStyle}</span>
          </div>
        </div>

        {/* Style Selectors */}
        <div className="space-y-4 pb-20">
          <div className="flex justify-between items-end">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059]">Selecciona un Estilo:</p>
            <p className="text-[8px] text-white/30 uppercase font-bold tracking-tighter">Estilos Premium Veracruz</p>
          </div>
          
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {styles.map((style) => (
              <button
                key={style}
                onClick={() => setActiveStyle(style)}
                className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeStyle === style 
                  ? 'bg-[#C5A059] text-[#1A3651] shadow-lg shadow-[#C5A059]/20 scale-105' 
                  : 'bg-white/5 border border-white/10 text-white/40'
                }`}
              >
                {style}
              </button>
            ))}
          </div>

          <button 
            onClick={handleProcess}
            disabled={isProcessing}
            className="w-full bg-white text-[#1A3651] py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-all disabled:opacity-50"
          >
            <Sparkles className="text-[#C5A059]" size={20} /> TRANSFORMAR CON IA
          </button>
        </div>
      </main>

      {/* Footer Tools */}
      <footer className="fixed bottom-0 left-0 right-0 p-6 bg-[#1A3651]/80 backdrop-blur-lg flex justify-around border-t border-white/5">
        <button className="text-white/40 flex flex-col items-center gap-1">
          <Download size={20} />
          <span className="text-[8px] font-bold uppercase">Exportar</span>
        </button>
        <button className="text-[#C5A059] flex flex-col items-center gap-1">
           <RefreshCw size={20} />
           <span className="text-[8px] font-bold uppercase font-black tracking-widest">Nueva IA</span>
        </button>
        <button className="text-white/40 flex flex-col items-center gap-1">
          <Layers size={20} />
          <span className="text-[8px] font-bold uppercase">Capas</span>
        </button>
      </footer>
    </div>
  );
};
