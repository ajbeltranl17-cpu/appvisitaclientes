import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EncabezadoGlobal } from '../components/EncabezadoGlobal';

export const MisDeseos = () => {
  const { idVisita } = useParams();
  const navigate = useNavigate();

  // Estados del formulario
  const [ubicacion, setUbicacion] = useState('Boca del Río, Veracruz');
  const [presupuesto, setPresupuesto] = useState(3500000);
  const [tipoPropiedad, setTipoPropiedad] = useState('Departamento');
  const [recamaras, setRecamaras] = useState(2);
  const [banos, setBanos] = useState(2);
  const [estacionamientos, setEstacionamientos] = useState(1);
  const [antiguedad, setAntiguedad] = useState('Preventa');
  const [amenidadesSeleccionadas, setAmenidadesSeleccionadas] = useState<string[]>(['Alberca', 'Seguridad 24/7']);

  const tipos = ['Casa', 'Departamento', 'Terreno'];
  const antiguedades = ['Preventa', 'Nueva', 'Usada'];
  const amenidadesDisponibles = ['Alberca', 'Gimnasio', 'Seguridad 24/7', 'Elevador', 'Roof Garden', 'Pet Friendly', 'Área Infantil'];

  const toggleAmenidad = (amenidad: string) => {
    if (amenidadesSeleccionadas.includes(amenidad)) {
      setAmenidadesSeleccionadas(amenidadesSeleccionadas.filter(a => a !== amenidad));
    } else {
      setAmenidadesSeleccionadas([...amenidadesSeleccionadas, amenidad]);
    }
  };

  const formatearMoneda = (valor: number) => 
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(valor);

  // Componente reutilizable para los contadores (+/-)
  const Contador = ({ label, icon, valor, setValor }: { label: string, icon: string, valor: number, setValor: (v: number) => void }) => (
    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-2xl border border-gray-100">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-gray-400 text-lg">{icon}</span>
        <span className="text-xs font-bold text-[#00213b] uppercase tracking-wider">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={() => valor > 1 && setValor(valor - 1)} className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-[#C5A059] active:scale-95">
          <span className="material-symbols-outlined text-sm">remove</span>
        </button>
        <span className="font-black text-[#00213b] w-4 text-center">{valor}</span>
        <button onClick={() => setValor(valor + 1)} className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-[#C5A059] active:scale-95">
          <span className="material-symbols-outlined text-sm">add</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <EncabezadoGlobal 
        rutaAnterior={`/swipe/${idVisita}`}
        textoAnterior="Swipe"
        rutaSiguiente={`/catalogo/${idVisita}`}
        textoSiguiente="Catálogo"
      />

      <main className="p-4 space-y-6 max-w-md mx-auto w-full pb-28">
        
        <section className="px-2">
          <span className="text-[#C5A059] font-black uppercase text-[10px] tracking-[0.3em]">Perfilamiento Inteligente</span>
          <h1 className="text-3xl font-black text-[#00213b] mt-1">Tus Deseos</h1>
          <p className="text-gray-500 text-sm mt-2">Dinos qué buscas y encontraremos las mejores opciones de nuestro inventario para ti.</p>
        </section>

        <div className="space-y-5 bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
          
          {/* Ubicación */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#00213b] uppercase tracking-widest">Zona de Interés</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#C5A059]">location_on</span>
              <input 
                type="text" 
                value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 text-sm font-bold text-[#00213b] rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50"
              />
            </div>
          </div>

          {/* Tipo de Propiedad */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#00213b] uppercase tracking-widest block">Tipo de Propiedad</label>
            <div className="grid grid-cols-3 gap-2">
              {tipos.map(t => (
                <button
                  key={t}
                  onClick={() => setTipoPropiedad(t)}
                  className={`py-3 rounded-xl font-bold text-[10px] uppercase tracking-tighter transition-all ${
                    tipoPropiedad === t ? 'bg-[#00213b] text-white shadow-md' : 'bg-gray-50 text-gray-400 border border-transparent'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Presupuesto */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-[#00213b] uppercase tracking-widest">Presupuesto Máximo</label>
              <span className="font-black text-[#C5A059] text-lg">{formatearMoneda(presupuesto)}</span>
            </div>
            <input 
              type="range" min="1000000" max="10000000" step="100000"
              value={presupuesto} onChange={(e) => setPresupuesto(Number(e.target.value))}
              className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#C5A059]"
            />
          </div>

        </div>

        {/* Distribución y Características */}
        <div className="space-y-5 bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
          <label className="text-[10px] font-black text-[#00213b] uppercase tracking-widest block mb-1">Distribución Ideal</label>
          
          <div className="space-y-3">
            <Contador label="Recámaras" icon="bed" valor={recamaras} setValor={setRecamaras} />
            <Contador label="Baños" icon="shower" valor={banos} setValor={setBanos} />
            <Contador label="Autos" icon="directions_car" valor={estacionamientos} setValor={setEstacionamientos} />
          </div>

          <div className="pt-4 border-t border-gray-100 space-y-3">
            <label className="text-[10px] font-black text-[#00213b] uppercase tracking-widest block">Estado de la Propiedad</label>
            <div className="grid grid-cols-3 gap-2">
              {antiguedades.map(a => (
                <button
                  key={a}
                  onClick={() => setAntiguedad(a)}
                  className={`py-3 rounded-xl font-bold text-[10px] uppercase tracking-tighter transition-all ${
                    antiguedad === a ? 'bg-[#C5A059] text-white shadow-md' : 'bg-gray-50 text-gray-400 border border-transparent'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Amenidades */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
          <label className="text-[10px] font-black text-[#00213b] uppercase tracking-widest block mb-4">Amenidades Imprescindibles</label>
          <div className="flex flex-wrap gap-2">
            {amenidadesDisponibles.map(amenidad => (
              <button
                key={amenidad}
                onClick={() => toggleAmenidad(amenidad)}
                className={`px-4 py-2 rounded-full text-[11px] font-bold transition-all border ${
                  amenidadesSeleccionadas.includes(amenidad) 
                  ? 'bg-[#00213b] text-white border-[#00213b] shadow-md' 
                  : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {amenidadesSeleccionadas.includes(amenidad) && <span className="material-symbols-outlined text-[11px] mr-1 align-middle">check</span>}
                {amenidad}
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Botón Flotante para Filtrar Catálogo */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent z-10">
        <div className="max-w-md mx-auto">
          <button 
            onClick={() => navigate(`/catalogo/${idVisita}`)}
            className="w-full bg-[#00213b] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:bg-[#00335c] transition-colors flex justify-center items-center gap-3 active:scale-95"
          >
            Buscar Propiedades
            <span className="material-symbols-outlined">search</span>
          </button>
        </div>
      </div>

    </div>
  );
};