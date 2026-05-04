import React, { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { EncabezadoGlobal } from '../components/EncabezadoGlobal';

export const IniciarVisita = () => {
  const { idVisita } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null); 
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [fotos, setFotos] = useState<string[]>([]); 
  const [flash, setFlash] = useState(false); 
  const [verGaleria, setVerGaleria] = useState(false); 

  // Estado para las notas
  const [nota, setNota] = useState('');
  const [guardandoNota, setGuardandoNota] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.error("Error al acceder a la cámara:", error);
      }
    };
    
    if (!verGaleria) {
      startCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verGaleria]);

  // Capturar y subir a Firebase
  const capturarFoto = async () => {
    if (videoRef.current && canvasRef.current && idVisita) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imagenUrl = canvas.toDataURL('image/jpeg', 0.8);
        
        // 1. Mostramos la foto inmediatamente en pantalla
        setFotos(prev => [imagenUrl, ...prev]);
        setFlash(true);
        setTimeout(() => setFlash(false), 150);

        // 2. Subimos a Firebase Storage en segundo plano
        try {
          const nombreFoto = `visita_${idVisita}_${Date.now()}.jpg`;
          const storageRef = ref(storage, `capturas/${nombreFoto}`);
          
          await uploadString(storageRef, imagenUrl, 'data_url');
          const urlReal = await getDownloadURL(storageRef);

          // 3. Guardamos el link en Firestore
          const visitaRef = doc(db, 'visitas', idVisita);
          await updateDoc(visitaRef, {
            fotosCliente: arrayUnion(urlReal)
          });
        } catch (error) {
          console.error("Error guardando la foto en la nube:", error);
        }
      }
    }
  };

  // Función para guardar notas de texto
  const guardarNota = async () => {
    if (!nota.trim() || !idVisita) return;
    setGuardandoNota(true);
    
    try {
      const visitaRef = doc(db, 'visitas', idVisita);
      await updateDoc(visitaRef, {
        notasCliente: arrayUnion(nota)
      });
      setNota(''); // Limpiamos la barra tras guardar
    } catch (error) {
      console.error("Error guardando nota:", error);
    } finally {
      setGuardandoNota(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <EncabezadoGlobal 
        rutaAnterior={`/dashboard/${idVisita}`}
        textoAnterior="Dashboard"
        rutaSiguiente={`/analisis/${idVisita}`}
        textoSiguiente="Análisis"
      />

      <main className="flex-1 p-4 flex flex-col gap-4 max-w-md mx-auto w-full relative">
        
        {!verGaleria ? (
          <>
            <div className="bg-black rounded-3xl overflow-hidden shadow-lg relative aspect-[3/4] flex items-center justify-center border-4 border-white">
              
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              <canvas ref={canvasRef} className="hidden" />

              {flash && <div className="absolute inset-0 bg-white z-20 opacity-80 transition-opacity duration-100"></div>}
              
              <div className="absolute inset-0 border border-white/20 m-6 rounded-xl pointer-events-none grid grid-cols-3 grid-rows-3 z-10">
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

            <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 mt-2">
              
              {/* Barra de Notas con Botón de Guardar */}
              <div className="flex gap-2 mb-6">
                <input 
                  type="text" 
                  value={nota}
                  onChange={(e) => setNota(e.target.value)}
                  placeholder="Escribe una nota de la propiedad..." 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all"
                />
                <button 
                  onClick={guardarNota}
                  disabled={guardandoNota || !nota.trim()}
                  className="bg-[#00213b] text-[#C5A059] px-4 rounded-xl flex items-center justify-center disabled:opacity-50 transition-opacity"
                >
                  <span className="material-symbols-outlined">save</span>
                </button>
              </div>

              <div className="flex justify-center gap-8 items-center">
                
                <button 
                  onClick={() => setVerGaleria(true)}
                  className="w-12 h-12 rounded-full flex items-center justify-center transition-colors relative bg-gray-100 border-2 border-transparent hover:border-[#C5A059]"
                  style={fotos.length > 0 ? { backgroundImage: `url(${fotos[0]})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                >
                  {fotos.length === 0 && <span className="material-symbols-outlined text-gray-600">photo_library</span>}
                  {fotos.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#00213b] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                      {fotos.length}
                    </span>
                  )}
                </button>
                
                <button 
                  onClick={capturarFoto}
                  className="w-16 h-16 bg-[#00213b] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform border-4 border-white ring-2 ring-[#00213b]"
                >
                  <span className="material-symbols-outlined text-3xl">photo_camera</span>
                </button>
                
                <button className="w-12 h-12 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <span className="material-symbols-outlined">videocam</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-3xl p-4 shadow-lg border border-gray-100 min-h-[500px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-[#00213b]">Galería de Visita ({fotos.length})</h3>
              <button 
                onClick={() => setVerGaleria(false)}
                className="text-[#C5A059] font-bold text-sm bg-orange-50 px-3 py-1 rounded-full"
              >
                Volver a Cámara
              </button>
            </div>
            
            {fotos.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <span className="material-symbols-outlined text-4xl mb-2">image_not_supported</span>
                <p>Aún no hay fotos</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {fotos.map((foto, index) => (
                  <div key={index} className="aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-sm">
                    <img src={foto} alt={`Captura ${index}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-8 pb-8 px-4">
          <button 
            onClick={() => navigate(`/analisis/${idVisita}`)}
            className="w-full bg-[#00213b] text-white py-5 rounded-2xl font-black text-[13px] md:text-base uppercase tracking-widest shadow-[0_10px_20px_rgba(0,33,59,0.2)] flex justify-center items-center gap-3 active:scale-95 transition-all border border-[#00335c]"
          >
            Siguiente: Análisis de la Zona
            <span className="material-symbols-outlined text-xl">arrow_forward</span>
          </button>
        </div>
      </main>
    </div>
  );
};