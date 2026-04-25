import React, { useState } from 'react';
import { Camera, Image as ImageIcon, Send } from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface LogEntry {
  id: string;
  type: 'photo' | 'note' | 'video';
  content: string;
  timestamp: Date;
}

export const Bitacora: React.FC = () => {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [note, setNote] = useState('');

  const addEntry = (type: LogEntry['type'], content: string) => {
    const newEntry: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content,
      timestamp: new Date()
    };
    setEntries([newEntry, ...entries]);
    setNote('');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col h-[500px]">
      <div className="bg-[#1A3651] p-4 text-white">
        <h3 className="text-lg font-bold">Bitácora de Visita</h3>
        <p className="text-xs opacity-70">Registro multimedia para el cliente</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {entries.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm italic">
            No hay registros en esta visita.
          </div>
        ) : (
          entries.map(entry => (
            <div key={entry.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${
                  entry.type === 'note' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                }`}>
                  {entry.type}
                </span>
                <span className="text-[10px] text-gray-400">
                  {entry.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <p className="text-sm text-gray-700">{entry.content}</p>
            </div>
          ))
        )}
      </div>

      <div className="p-4 bg-white border-t border-gray-100 space-y-3">
        <div className="flex gap-2">
          <input 
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Escribe una observación..."
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
          />
          <button 
            onClick={() => note && addEntry('note', note)}
            className="p-2 bg-[#1A3651] text-white rounded-lg"
          >
            <Send size={20} />
          </button>
        </div>
        
        <div className="flex gap-2 justify-between">
          <Button 
            label="Foto" 
            variant="outline" 
            onClick={() => addEntry('photo', 'Nueva fotografía añadida')} 
          />
          <Button 
            label="Video" 
            variant="outline" 
            onClick={() => addEntry('video', 'Nuevo video de recorrido')} 
          />
        </div>
      </div>
    </div>
  );
};
