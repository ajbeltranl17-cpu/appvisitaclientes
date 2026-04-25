import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  Camera, 
  Mic, 
  Video, 
  ChevronLeft, 
  Trash2, 
  Save,
  MessageSquare,
  Sparkles,
  Loader2,
  Upload
} from 'lucide-react';
import { db, storage } from '../services/firebaseConfig';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface LogEntry {
  id: string;
  type: 'photo' | 'note' | 'video';
  content: string;
  timestamp: Date;
}

export const Bitacora: React.FC = () => {
  const { navigate, advisor } = useAppContext();
  const [note, setNote] = useState('');
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sincronizar con Firestore en tiempo real
  useEffect(() => {
    const q = query(collection(db, 'bitacora'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logs = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          type: data.type,
          content: data.content,
          timestamp: data.createdAt ? (data.createdAt as Timestamp).toDate() : new Date()
        } as LogEntry;
      });
      setEntries(logs);
    });
    return () => unsubscribe();
  }, []);

  const addEntry = async (type: LogEntry['type'], content: string) => {
    setIsSaving(true);
    try {
      await addDoc(collection(db, 'bitacora'), {
        type,
        content,
        advisorName: advisor.name,
        createdAt: serverTimestamp(),
      });
      setNote('');
    } catch (error) {
      console.error('Error al guardar en Bitácora:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsSaving(true);
    try {
      const fileRef = ref(storage, `visitas/${Date.now()}_${file.name}`);
      const uploadResult = await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(uploadResult.ref);
      
      await addEntry('photo', downloadURL);
    } catch (error) {
      console.error('Error al subir imagen:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-screen bg-black flex flex-col animate-in slide-in-from-bottom duration-500 overflow-hidden">
      {/* Top Camera Viewport (Simulated) */}
      <div className="flex-1 relative bg-gray-900 overflow-hidden">
        <video 
          className="w-full h-full object-cover opacity-80"
          autoPlay 
          muted 
          loop 
          playsInline
          poster="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800"
        />
        
        {/* Overlay Controls */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-20">
          <button 
            onClick={() => navigate('DASHBOARD')}
            className="p-3 bg-black/40 backdrop-blur-md rounded-full text-white border border-white/20"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="bg-red-600 px-3 py-1 rounded-full flex items-center gap-2 animate-pulse">
            <div className="w-2 h-2 bg-white rounded-full" />
            <span className="text-[10px] text-white font-bold uppercase tracking-widest">LIVE</span>
          </div>
          <button 
            onClick={() => navigate('GALERIA')}
            className="w-12 h-12 bg-[#C5A059] rounded-2xl flex items-center justify-center text-[#1A3651] shadow-lg"
          >
            <Save size={24} />
          </button>
        </div>

        {/* Framing Guides */}
        <div className="absolute inset-20 border border-white/10 pointer-events-none border-dashed" />
      </div>

      {/* Control Console (Bottom Heavy - Ergonomic) */}
      <div className="bg-[#1A3651] rounded-t-[3rem] p-8 space-y-6 z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 overflow-hidden flex-shrink-0 relative flex items-center justify-center">
            {entries.length > 0 ? (
              entries[0].type === 'note' ? (
                <div className="p-2 text-center">
                  <p className="text-[6px] text-[#C5A059] font-bold uppercase truncate">{entries[0].content}</p>
                </div>
              ) : (
                <img src={entries[0].content} alt="Last capture" className="w-full h-full object-cover" />
              )
            ) : (
              <Camera size={20} className="text-white/20" />
            )}
            
            {entries.length > 0 && (
              <div className="absolute top-1 right-1 bg-[#C5A059] text-[#1A3651] text-[8px] font-bold px-1 rounded-sm">
                {entries.length}
              </div>
            )}
          </div>
          <div className="flex-1">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (note.trim()) addEntry('note', note);
              }}
              className="flex items-center gap-2 bg-white/5 rounded-xl px-4 py-3 border border-white/10"
            >
              <MessageSquare size={16} className="text-[#C5A059]" />
              <input 
                type="text" 
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={isSaving ? "Guardando..." : "Añade una observación técnica..."}
                disabled={isSaving}
                className="bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none w-full"
              />
              {isSaving && <Loader2 className="animate-spin text-[#C5A059]" size={16} />}
            </form>
          </div>
        </div>

        {/* Capture Buttons */}
        <div className="flex justify-between items-center gap-4">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept="image/*" 
            className="hidden" 
          />
          <CircleBtn 
            icon={<Mic size={24} />} 
            active={false} 
            color="bg-white/10" 
            onClick={() => addEntry('note', 'Nota de voz capturada')} 
            disabled={isSaving}
          />
          <CircleBtn 
            icon={<Video size={24} />} 
            active={true} 
            color="bg-[#C5A059]" 
            large 
            onClick={() => addEntry('video', 'Recorrido de video guardado')} 
            disabled={isSaving}
          />
          <CircleBtn 
            icon={<Camera size={24} />} 
            active={false} 
            color="bg-white/10" 
            onClick={() => fileInputRef.current?.click()} 
            disabled={isSaving}
          />
        </div>

        <button 
          onClick={() => navigate('AI_STAGING')}
          className="w-full bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#C5A059] py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2"
        >
          <Sparkles size={16} /> AMUEBLAR ESPACIO CON IA
        </button>
      </div>
    </div>
  );
};

const CircleBtn = ({ icon, active, color, large, onClick, disabled }: { icon: any, active: boolean, color: string, large?: boolean, onClick?: () => void, disabled?: boolean }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={` rounded-full flex items-center justify-center text-[#1A3651] transition-all active:scale-90 ${color} ${large ? 'w-20 h-20 shadow-[0_0_30px_rgba(197,160,89,0.3)]' : 'w-14 h-14'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    {React.cloneElement(icon as React.ReactElement, { size: large ? 32 : 24, className: active ? 'text-[#1A3651]' : 'text-white' })}
  </button>
);
