import React, { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { collection, addDoc, onSnapshot, serverTimestamp, query, orderBy, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { signOut } from 'firebase/auth';
import { db, storage, auth } from '../services/firebaseConfig';
import { useAppContext } from '../context/AppContext';
import { Sidebar } from '../components/Sidebar';

interface BitacoraEntry {
  id: string;
  tipo: 'foto' | 'nota';
  url?: string;
  texto?: string;
  createdAt: Timestamp | null;
}

export const IniciarVisita: React.FC = () => {
  const { idVisita } = useParams<{ idVisita: string }>();
  const navigate = useNavigate();
  const { navigate: contextNavigate } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [entries, setEntries] = useState<BitacoraEntry[]>([]);
  const [notaText, setNotaText] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Guardado en tu bitácora privada');
  const [isUploading, setIsUploading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (!idVisita) return;
    const q = query(
      collection(db, 'visitas', idVisita, 'bitacora'),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BitacoraEntry[];
      setEntries(data);
    });
    return () => unsubscribe();
  }, [idVisita]);

  const totalFotos = entries.filter(e => e.tipo === 'foto').length;
  const totalNotas = entries.filter(e => e.tipo === 'nota').length;
  const lastPhotoUrl = entries.find(e => e.tipo === 'foto')?.url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLllLlCsVYJdVUrPi9iKxTyQlP7Td8RX5MYqWYUkhlMa3tmKl7grVwbWlal68CG_2jrnU06NVpf290eo8xrB8IxyZvtzBx3HilcpRTWSuue_YIcE18kMDG-3DkLzzjGc5Y75PbY3TLZcGKzCKtgpkmMwG50tmUicCMRpSyChNtPjhgS9LteLfbhdURYjVQvMzIC3kTWhEO_QWEMyDwxmj26pgkb4iyhwQX7tR8PmkJ32L9GYs6-JQDXJWj3Olb2c5GLTaeVCqk_5Y'; // default placeholder

  const triggerToast = (msg?: string) => {
    setToastMessage(msg || 'Guardado en tu bitácora privada');
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleCaptureClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !idVisita) return;
    const file = e.target.files[0];
    
    setIsUploading(true);
    try {
      const storageRef = ref(storage, `visitas/${idVisita}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);
      
      await addDoc(collection(db, 'visitas', idVisita, 'bitacora'), {
        tipo: 'foto',
        url: downloadUrl,
        createdAt: serverTimestamp()
      });
      triggerToast();
    } catch (error) {
      console.error("Error al subir imagen:", error);
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddNota = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notaText.trim() || !idVisita) return;
    
    try {
      await addDoc(collection(db, 'visitas', idVisita, 'bitacora'), {
        tipo: 'nota',
        texto: notaText.trim(),
        createdAt: serverTimestamp()
      });
      setNotaText('');
      triggerToast();
    } catch (error) {
      console.error("Error al guardar nota:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      contextNavigate('LOGIN');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="bg-[#f9f9f7] text-[#1a1c1b] h-screen overflow-hidden flex flex-col font-body">
      <Sidebar isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      {/* TopAppBar */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl text-slate-900 dark:text-white font-headline font-bold tracking-tighter w-full top-0 z-40 flex justify-between items-center px-4 py-4 flex-shrink-0 relative border-b border-[#e2e3e1]/40">
        <button onClick={() => setIsDrawerOpen(true)} className="p-2 text-[#1a3651] dark:text-white hover:bg-black/5 rounded-full active:scale-95 transition-all z-10 flex">
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>
        
        {/* Cápsula de Estado Central */}
        <div className="absolute left-1/2 -translate-x-1/2 bg-[#1a3651]/5 dark:bg-white/10 backdrop-blur-md border border-[#c5a059]/20 px-4 py-1.5 rounded-full flex items-center gap-2 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <span className="material-symbols-outlined text-[#c5a059] text-[18px]">photo_library</span>
          <span className="text-[#c5a059] text-xs font-extrabold tracking-widest uppercase">{totalFotos} fotos, {totalNotas} nota{totalNotas !== 1 ? 's' : ''}</span>
        </div>

        <button 
          onClick={() => navigate(`/analisis/${idVisita}`)}
          className="bg-[#C5A059] text-[#1A3651] px-3 py-1.5 rounded-full font-headline font-bold text-[10px] md:text-xs tracking-wide shadow-sm flex items-center justify-center gap-1 hover:scale-105 active:scale-95 transition-all z-10 whitespace-nowrap"
        >
          <span>Análisis de la Zona</span>
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </button>
      </header>
      
      {/* Main Content Area */}
      <main className="flex-grow flex flex-col overflow-hidden">
        {/* Camera Viewport (2/3 of screen height) */}
        <section className="h-[66.67%] relative bg-[#e8e8e6] mx-4 mt-2 rounded-2xl overflow-hidden shadow-lg">
          <img alt="Camera View" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida/ADBb0ui_jHpvFvvT8rWJlCU-R4LQDQ-A2K9p1fl6HvpveWQe_7a7pisAtIV3rqNfV_pcmQ1eObbUL4Y2K08whzjCGyXSBcjsmAZx3zZRQnfkOBihJ17srOfPVuIdHmrQwJ1kEWOONwEPFCOcNPhbPdryK4MsPgrBNszMJCRg5tdV47OWpIzq3M1kt5dJJA71Urgxdaxwg_8oWDjczG2a6W0qD02xFmiqlfol3vVU9yHHLliVQVu4pv9unRblEQ" />
          
          {/* Feedback Toast */}
          <div className={`absolute top-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-5 py-2 rounded-full flex items-center gap-2 shadow-xl border border-[#1a3651]/10 z-20 transition-opacity duration-300 ${showToast ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <span className="material-symbols-outlined text-[#775a19] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
              {toastMessage === "Disponible en la próxima actualización" ? "info" : "check_circle"}
            </span>
            <span className="font-headline font-bold text-xs tracking-tight text-[#1a1c1b]">{toastMessage}</span>
          </div>
          
          {/* Framing Guides */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-12 h-12 border-t border-l border-white/40 absolute top-6 left-6 rounded-tl-md"></div>
            <div className="w-12 h-12 border-t border-r border-white/40 absolute top-6 right-6 rounded-tr-md"></div>
            <div className="w-12 h-12 border-b border-l border-white/40 absolute bottom-6 left-6 rounded-bl-md"></div>
            <div className="w-12 h-12 border-b border-r border-white/40 absolute bottom-6 right-6 rounded-br-md"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <span className="material-symbols-outlined text-white/20 text-3xl">add</span>
            </div>
          </div>
          
          {/* Filtering Guides */}
        </section>
        
        {/* Control Console (1/3 of screen height) */}
        <section className="h-[33.33%] bg-white dark:bg-slate-900 px-6 py-6 flex flex-col justify-center gap-6">
          {/* Row 1: Inputs */}
          <form onSubmit={handleAddNota} className="w-full">
            <input 
              value={notaText}
              onChange={(e) => setNotaText(e.target.value)}
              className="w-full bg-[#f4f4f2] dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-slate-900 dark:text-white placeholder:text-slate-500 shadow-inner focus:ring-2 focus:ring-[#00213b] outline-none font-body text-base" 
              placeholder="Notas manuales..." 
              type="text" 
            />
          </form>

          {/* Hidden input for camera/gallery */}
          <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            ref={fileInputRef} 
            onChange={handleFileChange}
            className="hidden" 
          />
          
          {/* Row 2: Capture Controls */}
          <div className="flex items-center justify-between w-full max-w-sm mx-auto gap-4">
            {/* Thumbnail */}
            <button aria-label="Ver mi galería de visita" className="w-14 h-14 rounded-xl border-[3px] border-[#C5A059] overflow-hidden shadow-md flex-shrink-0 active:scale-95 transition-transform" onClick={() => navigate(`/dashboard/${idVisita}`)}>
              <img alt="Última foto" className="w-full h-full object-cover" src={lastPhotoUrl} />
            </button>
            
            {/* Main Camera */}
            <button 
              onClick={handleCaptureClick} 
              disabled={isUploading}
              className={`w-20 h-20 rounded-full bg-gradient-to-br from-[#00213b] to-[#1a3651] text-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-transform border-4 border-white dark:border-slate-800 ${isUploading ? 'opacity-80' : ''}`}
            >
              {isUploading ? (
                <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <span className="material-symbols-outlined text-4xl">photo_camera</span>
              )}
            </button>
            
            {/* Video */}
            <button 
              onClick={() => triggerToast("Disponible en la próxima actualización")}
              className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 text-[#1a3651] dark:text-[#d0e4ff] flex items-center justify-center shadow-md relative hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            >
              <span className="material-symbols-outlined text-2xl">videocam</span>
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#ba1a1a] rounded-full border-2 border-slate-100 dark:border-slate-800"></span>
            </button>
            
            {/* Microphone */}
            <button 
              onClick={() => triggerToast("Disponible en la próxima actualización")}
              className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 text-[#775a19] flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            >
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>mic</span>
            </button>

            {/* Gallery Button */}
            <button 
              onClick={() => navigate(`/galeria/${idVisita}`)}
              className="w-14 h-14 rounded-full bg-[#1A3651] text-[#c5a059] flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            >
              <span className="material-symbols-outlined text-2xl">photo_library</span>
            </button>
          </div>
        </section>
      </main>
      
      {/* BottomNavBar (Unchanged Navigation) */}
      <nav className="bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl text-amber-600 font-body text-[10px] font-semibold uppercase tracking-tight w-full z-50 rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)] flex justify-around items-center px-4 pt-3 pb-8 md:hidden flex-shrink-0">
        <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 active:scale-90 transition-transform duration-300">
          <span className="material-symbols-outlined mb-1">calendar_today</span>
          <span>Visitas</span>
        </div>
        <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 active:scale-90 transition-transform duration-300">
          <span className="material-symbols-outlined mb-1">map</span>
          <span>Explorar</span>
        </div>
        <div className="flex flex-col items-center justify-center text-amber-600 bg-amber-50 dark:bg-amber-900/20 rounded-xl px-3 py-1 hover:text-slate-900 dark:hover:text-slate-200 active:scale-90 transition-transform duration-300">
          <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: "'FILL' 1" }}>photo_camera</span>
          <span>Captura</span>
        </div>
        <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 active:scale-90 transition-transform duration-300">
          <span className="material-symbols-outlined mb-1">person</span>
          <span>Perfil</span>
        </div>
      </nav>
    </div>
  );
};
