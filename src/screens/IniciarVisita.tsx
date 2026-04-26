import React, { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { EncabezadoGlobal } from '../components/EncabezadoGlobal';

export const IniciarVisita = () => {
  const { idVisita } = useParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Lógica para encender la cámara DENTRO de la aplicación
  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' } // Usa la cámara trasera
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.error("Error al acceder a la cámara:", error);
      }
    };
    
    startCamera();

    // Apagar la cámara cuando el usuario cambie de pantalla
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Nuevo Encabezado con Rutas Dinámicas */}
      <EncabezadoGlobal 
        rutaAnterior={`/dashboard/${idVisita}`}
        textoAnterior="Dashboard"
        rutaSiguiente={`/analisis/${idVisita}`}
        textoSiguiente="Análisis"
      />

      <main className="flex-1 p-4 flex flex-col gap-4 max-w-md mx-auto w-full">
        
        {/* Visor de Cámara Integrado */}
        <div className="bg-black rounded-3xl overflow-hidden shadow-lg relative aspect-[3/4] flex items-center justify-center border-4 border-white">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          {/* Cuadricula de enfoque visual (estética) */}
          <div className="absolute inset-0 border border-white/20 m-6 rounded-xl pointer-events-none grid grid-cols-3 grid-rows-3">
            <div className="border-b border-r border-white/20"></div>
            <div className="border-b border-r border-white/20"></div>
            <div className="border-b border-white/20"></div>
            <div className="border-b border-r border-white/20"></div>
            <div className="border-b border-r border-white/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-white/30 text-4xl">add</span>
            </div>
            <div className="border-b border-white/20"></div>
            <div className="border-r border-white/20"></div>
            <div className="border-r border-white/20"></div>
            <div></div>
          </div>
          
          {!stream && (
            <div className="text-white text-center z-10 flex flex-col items-center">
              <span className="material-symbols-outlined text-4xl mb-2 animate-pulse">videocam</span>
              <p className="text-sm font-bold tracking-widest uppercase">Activando lente...</p>
            </div>
          )}
        </div>

        {/* Controles de Captura Limpios */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 mt-2">
          <input 
            type="text" 
            placeholder="Escribe una nota rápida aquí..." 
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm mb-6 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all"
          />
          <div className="flex justify-center gap-8 items-center">
            {/* Botón Galería */}
            <button className="w-12 h-12 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
              <span className="material-symbols-outlined">photo_library</span>
            </button>
            
            {/* Botón Principal Disparador */}
            <button className="w-16 h-16 bg-[#00213b] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform border-4 border-white ring-2 ring-[#00213b]">
              <span className="material-symbols-outlined text-3xl">photo_camera</span>
            </button>
            
            {/* Botón Micrófono */}
            <button className="w-12 h-12 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
              <span className="material-symbols-outlined">mic</span>
            </button>
          </div>
        </div>

      </main>
    </div>
  );
};