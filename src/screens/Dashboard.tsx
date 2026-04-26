import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EncabezadoGlobal } from '../components/EncabezadoGlobal';

const Dashboard = () => {
  const navigate = useNavigate();

  const menuItems = [
    { id: 'visita', title: 'Generar Visita', icon: 'person_add', color: 'bg-blue-600', route: '/generar-visita' },
    { id: 'catalogo', title: 'Catálogo Propiedades', icon: 'account_balance', color: 'bg-slate-700', route: '/catalogo' },
    { id: 'matriz', title: 'Matriz Comparativa', icon: 'grid_view', color: 'bg-amber-600', route: '/matriz' },
    { id: 'hipoteca', title: 'Calculadora Hipotecaria', icon: 'calculate', color: 'bg-emerald-600', route: '#' },
    { id: 'plusvalia', title: 'Calculadora Plusvalía', icon: 'trending_up', color: 'bg-indigo-600', route: '#' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nuevo Encabezado Global */}
      <EncabezadoGlobal 
        rutaSiguiente="/generar-visita" 
        iconoSiguiente="person_add" 
        textoSiguiente="Nueva Visita" 
      />

      <main className="p-4 space-y-6">
        {/* Bienvenida */}
        <div className="bg-[#00213b] rounded-2xl p-6 text-white shadow-lg">
          <h2 className="text-2xl font-bold">¡Hola, Asesor!</h2>
          <p className="opacity-80 text-sm mt-1">¿Qué vamos a lograr hoy en Veracruz?</p>
        </div>

        {/* Menú de Cuadrícula */}
        <div className="grid grid-cols-2 gap-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => item.route !== '#' && navigate(item.route)}
              className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
            >
              <div className={`${item.color} p-3 rounded-xl text-white mb-3 group-hover:scale-110 transition-transform`}>
                <span className="material-symbols-outlined text-2xl">{item.icon}</span>
              </div>
              <span className="text-xs font-bold text-gray-700 text-center uppercase tracking-tighter">
                {item.title}
              </span>
            </button>
          ))}
        </div>

        {/* Acceso Rápido Mapa (Placeholder) */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-800 uppercase text-xs tracking-widest">Zona de Influencia</h3>
            <span className="text-[#C5A059] text-xs font-bold">VERACRUZ / BOCA</span>
          </div>
          <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden relative">
            <img 
              src="/mapa-veracruz.jpg" 
              alt="Mapa" 
              className="w-full h-full object-cover opacity-50"
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80' }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-white/90 px-3 py-1 rounded-full text-[10px] font-bold text-[#00213b] shadow-sm">
                MAPA INTERACTIVO PRÓXIMAMENTE
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;