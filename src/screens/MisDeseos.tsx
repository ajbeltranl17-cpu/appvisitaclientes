import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { EncabezadoGlobal } from '../components/EncabezadoGlobal';

export const MisDeseos = () => {
  const { idVisita } = useParams();
  const navigate = useNavigate();

  // ESTADOS ACTUALIZADOS
  const [ubicacion, setUbicacion] = useState('Boca del Río');
  const [presupuesto, setPresupuesto] = useState(3500000);
  const [tipoPropiedad, setTipoPropiedad] = useState('Departamento');
  const [recamaras, setRecamaras] = useState(2);
  const [banos, setBanos] = useState(2);
  const [estacionamientos, setEstacionamientos] = useState(1);
  const [antiguedad, setAntiguedad] = useState('Preventa');
  const [amenidadesSeleccionadas, setAmenidadesSeleccionadas] = useState<string[]>(['Alberca', 'Seguridad 24/7']);
  
  const [guardando, setGuardando] = useState(false);
  const [buscandoWP, setBuscandoWP] = useState(false);

  // Zonas predefinidas
  const zonas = ['Veracruz', 'Boca del Río', 'Riviera Veracruzana', 'Medellín'];
  const tipos = ['Casa', 'Departamento', 'Terreno'];
  const antiguedades = ['Preventa', 'Nueva', 'Usada'];
  const amenidadesDisponibles = ['Alberca', 'Gimnasio', 'Seguridad 24/7', 'Elevador', 'Roof Garden', 'Pet Friendly', 'Área Infantil'];

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
  }, [idVisita]);

  const toggleAmenidad = (amenidad: string) => {
    if (amenidadesSeleccionadas.includes(amenidad)) {
      setAmenidadesSeleccionadas(amenidadesSeleccionadas.filter(a => a !== amenidad));
    } else {
      setAmenidadesSeleccionadas([...amenidadesSeleccionadas, amenidad]);
    }
  };

  const formatearMoneda = (valor: number) => 
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(valor);

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
      console.error("Error al guardar:", error);
    } finally {
      setGuardando(false);
    }
  };

  const manejarCompartirWhatsApp = async () => {
    await guardarEnBaseDeDatos(); 
    
    const numeroAsesor = ""; // Conectaremos el número real del asesor en la siguiente fase
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
    if (!idVisita) return;
    await guardarEnBaseDeDatos(); 
    setBuscandoWP(true); 

    try {
      await fetch('/api/buscar-propiedades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitaId: idVisita,
          presupuestoMax: presupuesto,
          tipoPropiedad: tipoPropiedad,
          ubicacionTexto: ubicacion
        })
      });
      navigate(`/catalogo/${idVisita}`); 
    } catch (error) {
      console.error("Error en búsqueda:", error);
      navigate(`/catalogo/${idVisita}`);
    } finally {
      setBuscandoWP(false);
    }
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

  if (buscandoWP) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center font-sans">
         <div className="w-20 h-20 relative flex items-center justify-center mb-6">
            <div className="absolute inset-0 border-4 border-[#00213b]/20 rounded-full animate-ping"></div>
            <div className="absolute inset-2 border-4 border-[#00213b] border-t-transparent rounded-full animate-spin"></div>
            <span className="material-symbols-outlined text-[#C5A059] text-3xl animate-pulse">real_estate_agent</span>
         </div>
         <h2 className="text-xl font-black text-[#00213b] mb-2 uppercase tracking-wide">Buscando Opciones</h2>
         <p className="text-gray-500 text-sm max-w-[280px]">
           Estamos conectando con nuestro inventario en tiempo real para encontrar {tipoPropiedad.toLowerCase()}s en <strong className="text-[#C5A059]">{ubicacion}</strong>...
         </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <EncabezadoGlobal 
        rutaAnterior={`/swipe/${idVisita}`} textoAnterior="Swipe"
        rutaSiguiente={`/catalogo/${idVisita}`} textoSiguiente="Catálogo"
      />

      <main className="p-4 space-y-6 max-w-md mx-auto w-full pb-48">
        
        <section className="px-2">
          <span className="text-[#C5A059] font-black uppercase text-[10px] tracking-[0.3em]">Perfilamiento Inteligente</span>
          <h1 className="text-3xl font-black text-[#00213b] mt-1">Tus Deseos</h1>
          <p className="text-gray-500 text-sm mt-2">Dinos qué buscas y encontraremos las mejores opciones de nuestro inventario para ti.</p>
        </section>

        <div className="space-y-6 bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
          
          {/* NUEVA SECCIÓN DE ZONA (BOTONES) */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-[#00213b] uppercase tracking-widest block">Zona de Interés</label>
            <div className="grid grid-cols-2 gap-2">
              {zonas.map(z => (
                <button
                  key={z}
                  onClick={() => setUbicacion(z)}
                  className={`py-3 px-2 rounded-xl font-bold text-[10px] sm:text-xs uppercase tracking-tighter transition-all ${
                    ubicacion === z ? 'bg-[#C5A059] text-white shadow-md' : 'bg-gray-50 text-gray-500 border border-gray-200'
                  }`}
                >
                  {z}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
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

          {/* NUEVO RANGO DE PRESUPUESTO (2M a 15M) */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-[#00213b] uppercase tracking-widest">Presupuesto Máximo</label>
              <span className="font-black text-[#C5A059] text-lg">{formatearMoneda(presupuesto)}</span>
            </div>
            <input 
              type="range" min="2000000" max="15000000" step="100000"
              value={presupuesto} onChange={(e) => setPresupuesto(Number(e.target.value))}
              className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#C5A059]"
            />
          </div>
        </div>

        {/* RESTO DEL FORMULARIO IGUAL... */}
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

      <div className="fixed bottom-0 left-0 w-full p-4 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent z-10 space-y-2">
        <div className="max-w-md mx-auto space-y-3">
          <button 
            onClick={manejarSiguientePaso}
            disabled={guardando || buscandoWP}
            className="w-full bg-[#00213b] text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] shadow-xl hover:bg-[#00335c] transition-colors flex justify-center items-center gap-3 active:scale-95 disabled:opacity-70"
          >
            {buscandoWP ? 'Buscando...' : 'Buscar Propiedades'}
            {!buscandoWP && <span className="material-symbols-outlined">search</span>}
          </button>
        </div>
      </div>
    </div>
  );
};