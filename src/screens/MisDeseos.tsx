import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
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
  
  const [guardando, setGuardando] = useState(false);

  // Cargar datos previos si existen (Fase 1: Tubería conectada)
  useEffect(() => {
    const fetchDeseos = async () => {
      if (!idVisita) return;
      try {
        const docRef = doc(db, 'visitas', idVisita);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.deseos) {
            setUbicacion(data.deseos.ubicacion || ubicacion);
            setPresupuesto(data.deseos.presupuesto || presupuesto);
            setTipoPropiedad(data.deseos.tipoPropiedad || tipoPropiedad);
            setRecamaras(data.deseos.recamaras || recamaras);
            setBanos(data.deseos.banos || banos);
            setEstacionamientos(data.deseos.estacionamientos || estacionamientos);
            setAntiguedad(data.deseos.antiguedad || antiguedad);
            setAmenidadesSeleccionadas(data.deseos.amenidades || amenidadesSeleccionadas);
          }
        }
      } catch (error) {
        console.error("Error al cargar los deseos:", error);
      }
    };

    fetchDeseos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idVisita]);

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

  // FUNCIÓN CENTRAL PARA GUARDAR EN FIREBASE
  const guardarEnBaseDeDatos = async () => {
    if (!idVisita) return;
    setGuardando(true);
    try {
      const docRef = doc(db, 'visitas', idVisita);
      await updateDoc(docRef, {
        deseos: {
          ubicacion,
          presupuesto,
          tipoPropiedad,
          recamaras,
          banos,
          estacionamientos,
          antiguedad,
          amenidades: amenidadesSeleccionadas
        }
      });
    } catch (error) {
      console.error("Error al guardar en Firebase:", error);
    } finally {
      setGuardando(false);
    }
  };

  // INTERCEPTORES DE BOTONES
  const manejarCompartirWhatsApp = async () => {
    await guardarEnBaseDeDatos(); // Primero guardamos
    
    const numeroAsesor = ""; 
    const mensaje = `¡Hola! He definido mis deseos para mi próxima propiedad:\n\n` +
      `📍 *Ubicación:* ${ubicacion}\n` +
      `🏠 *Tipo:* ${tipoPropiedad}\n` +
      `💰 *Presupuesto:* ${formatearMoneda(presupuesto)}\n` +
      `🛌 *Recámaras:* ${recamaras}\n` +
      `🚿 *Baños:* ${banos}\n` +
      `🚗 *Estacionamientos:* ${estacionamientos}\n` +
      `✨ *Estado:* ${antiguedad}\n` +
      `✅ *Amenidades:* ${amenidadesSeleccionadas.join(', ')}\n\n` +
      `¿Podrías ayudarme a encontrar opciones que coincidan?`;

    const url = numeroAsesor 
      ? `https://wa.me/${numeroAsesor}?text=${encodeURIComponent(mensaje)}` 
      : `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
      
    window.open(url, '_blank');
  };

  const manejarSiguientePaso = async () => {
    await guardarEnBaseDeDatos(); // Primero guardamos
    navigate(`/catalogo/${idVisita}`); // Luego avanzamos
  };

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

      <main className="p-4 space-y-6 max-w-md mx-auto w-full pb-48">
        
        <section className="px-2">
          <span className="text-[#C5A059] font-black uppercase text-[10px] tracking-[0.3em]">Perfilamiento Inteligente</span>
          <h1 className="text-3xl font-black text-[#00213b] mt-1">Tus Deseos</h1>
          <p className="text-gray-500 text-sm mt-2">Dinos qué buscas y encontraremos las mejores opciones de nuestro inventario para ti.</p>
        </section>

        <div className="space-y-5 bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
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

      {/* BOTONES FLOTANTES (Buscar + WhatsApp) */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent z-10 space-y-2">
        <div className="max-w-md mx-auto space-y-3">
          
          <button 
            onClick={manejarCompartirWhatsApp}
            disabled={guardando}
            className="w-full bg-[#25D366] text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] shadow-lg flex justify-center items-center gap-3 active:scale-95 transition-all disabled:opacity-70"
          >
            {guardando ? 'Guardando...' : 'Compartir Mis Deseos con Mi Asesor'}
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
               <path d="M12.031 0C5.385 0 0 5.386 0 12.033c0 2.128.553 4.205 1.604 6.035L.145 24l6.113-1.605c1.764.966 3.754 1.476 5.77 1.476 6.647 0 12.034-5.386 12.034-12.034C24 5.386 18.678 0 12.031 0zm0 21.894c-1.802 0-3.565-.484-5.112-1.404l-.367-.218-3.805.998.998-3.71-.238-.38A9.873 9.873 0 0 1 2.051 12.033c0-5.513 4.487-10 10-10 5.513 0 10 4.487 10 10s-4.487 10-9.999 10zm5.485-7.493c-.302-.15-1.785-.88-2.062-.98-.278-.1-.481-.15-.683.15-.203.301-.781.98-.957 1.18-.175.201-.35.226-.652.076-1.528-.758-2.613-1.442-3.626-3.15-.176-.297-.018-.458.133-.608.135-.135.302-.352.453-.528.15-.176.202-.301.302-.502.1-.201.05-.377-.025-.527-.075-.15-.683-1.645-.935-2.253-.246-.593-.497-.512-.683-.521-.175-.009-.376-.009-.578-.009-.202 0-.528.075-.805.376-.277.301-1.056 1.031-1.056 2.513 0 1.482 1.082 2.915 1.233 3.116.15.201 2.126 3.245 5.15 4.547 2.08 .894 2.87 .974 3.938.82 1.156-.168 3.565-1.457 4.067-2.865.503-1.408.503-2.614.353-2.865-.151-.252-.553-.402-.855-.553z"/>
            </svg>
          </button>

          <button 
            onClick={manejarSiguientePaso}
            disabled={guardando}
            className="w-full bg-[#00213b] text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] shadow-xl hover:bg-[#00335c] transition-colors flex justify-center items-center gap-3 active:scale-95 disabled:opacity-70"
          >
            {guardando ? 'Guardando...' : 'Buscar Propiedades'}
            <span className="material-symbols-outlined">search</span>
          </button>
        </div>
      </div>

    </div>
  );
};