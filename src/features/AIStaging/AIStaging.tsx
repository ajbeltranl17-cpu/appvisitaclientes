import React, { useState } from 'react';
import { Sparkles, Layers, RefreshCw } from 'lucide-react';
import { processAIStaging } from '../../services/aiStaging';

export const AIStaging: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentImage, setCurrentImage] = useState('https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800');
  const [style, setStyle] = useState<'modern' | 'luxury'>('modern');

  const handleStaging = async () => {
    setIsProcessing(true);
    try {
      const result = await processAIStaging({
        imageUrl: currentImage,
        style,
        roomType: 'living'
      });
      setCurrentImage(result);
    } catch (error) {
      console.error('Staging failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-[#1A3651] p-6 rounded-xl text-white space-y-6">
      <div className="flex items-center gap-3">
        <Sparkles className="text-[#C5A059]" />
        <div>
          <h3 className="text-xl font-bold">AI Design Staging</h3>
          <p className="text-xs text-[#C5A059] uppercase tracking-widest font-bold">Virtual Renovation</p>
        </div>
      </div>

      <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-[#C5A059]">
        <img 
          src={currentImage} 
          alt="Home Staging" 
          className={`w-full h-full object-cover transition-opacity duration-500 ${isProcessing ? 'opacity-30' : 'opacity-100'}`}
        />
        {isProcessing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <RefreshCw className="animate-spin text-[#C5A059] mb-2" size={32} />
            <p className="text-sm font-bold uppercase tracking-widest">Remodelando Espacio...</p>
          </div>
        )}
        <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2">
          <Layers size={14} className="text-[#C5A059]" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Estilo: {style}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button 
          onClick={() => setStyle('modern')}
          className={`flex-1 py-3 rounded-lg text-sm font-bold border-2 transition-all ${
            style === 'modern' ? 'border-[#C5A059] bg-[#C5A059]/20' : 'border-white/10 hover:border-white/30'
          }`}
        >
          Minimalista
        </button>
        <button 
          onClick={() => setStyle('luxury')}
          className={`flex-1 py-3 rounded-lg text-sm font-bold border-2 transition-all ${
            style === 'luxury' ? 'border-[#C5A059] bg-[#C5A059]/20' : 'border-white/10 hover:border-white/30'
          }`}
        >
          Lujo Clásico
        </button>
      </div>

      <button 
        onClick={handleStaging}
        disabled={isProcessing}
        className="w-full bg-[#C5A059] text-white py-4 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#b08e48] transition-all disabled:opacity-50"
      >
        <Sparkles size={18} />
        Aplicar AI Staging
      </button>
    </div>
  );
};
