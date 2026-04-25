import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { BrandLogo } from '../components/BrandLogo';

export const MisDeseos = () => {
  const { idVisita } = useParams();
  const navigate = useNavigate();

  const [ubicacion, setUbicacion] = useState('');
  const [precioMin, setPrecioMin] = useState('3,000,000');
  const [precioMax, setPrecioMax] = useState('8,500,000');
  const [tipoPropiedad, setTipoPropiedad] = useState('Casa');
  const [antiguedad, setAntiguedad] = useState('Nuevo');
  const [espacios, setEspacios] = useState({ recamaras: 3, banos: 2, estacionamiento: 2 });
  const [amenidades, setAmenidades] = useState(['Alberca', 'Seguridad 24/7', 'Pet Friendly']);
  
  const [telefonoAsesor, setTelefonoAsesor] = useState('');

  useEffect(() => {
    const fetchDatosVisita = async () => {
      if (!idVisita) return;
      try {
        const docRef = doc(db, 'visitas', idVisita);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.telefonoAsesor) setTelefonoAsesor(data.telefonoAsesor);
          else if (data.telefono) setTelefonoAsesor(data.telefono);
        }
      } catch (error) {
        console.error("Error al obtener datos del asesor:", error);
      }
    };
    fetchDatosVisita();
  }, [idVisita]);

  const updateEspacio = (tipo, operacion) => {
    setEspacios(prev => {
      const nuevoValor = operacion === 'sumar' ? prev[tipo] + 1 : prev[tipo] - 1;
      return { ...prev, [tipo]: Math.max(0, nuevoValor) };
    });
  };

  const toggleAmenidad = (amenidad) => {
    setAmenidades(prev => prev.includes(amenidad) ? prev.filter(a => a !== amenidad) : [...prev, amenidad]);
  };

  // NUEVA FUNCIÓN: Guarda en Firebase y luego navega
  const handleGuardarYContinuar = async () => {
    if (!idVisita) return;
    try {
      const docRef = doc(db, 'visitas', idVisita);
      await updateDoc(docRef, {
        preferenciasCliente: {
          ubicacion,
          precioMin,
          precioMax,
          tipoPropiedad,
          antiguedad,
          espacios,
          amenidades
        }
      });
      console.log("Preferencias guardadas exitosamente en Firebase");
      navigate(`/catalogo/${idVisita}`);
    } catch (error) {
      console.error("Error al guardar preferencias:", error);
      // Navegamos de todos modos por si hay un error temporal de red, para no bloquear al usuario
      navigate(`/catalogo/${idVisita}`);
    }
  };

  const handleWhatsAppShare = () => {
    const texto = encodeURIComponent(
        `¡Hola! He actualizado mis preferencias de búsqueda:\n\n🏡 Tipo: ${tipoPropiedad} (${antiguedad})\n📍 Ubicación: ${ubicacion || 'Por definir'}\n💰 Presupuesto: $${precioMin} - $${precioMax}\n🛏️ Espacios: ${espacios.recamaras} Rec, ${espacios.banos} Baños\n✨ Amenidades: ${amenidades.join(', ')}\n\n¿Qué opciones tenemos en el catálogo?`
    );
    const url = telefonoAsesor 
      ? `https://api.whatsapp.com/send?phone=${telefonoAsesor}&text=${texto}`
      : `https://api.whatsapp.com/send?text=${texto}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-[#f9f9f7] text-[#1a1c1b] font-body antialiased min-h-screen flex flex-col">
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl shadow-sm flex justify-between items-center px-4 md:px-6 py-4">
        <div className="flex items-center gap-3 md:gap-4">
            <button onClick={() => navigate(`/swipe/${idVisita}`)} className="text-[#1A3651] hover:text-[#C5A059] transition-colors p-1 md:pr-2">
              <span className="material-symbols-outlined text-2xl md:text-xl">arrow_back</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="hidden sm:block"><BrandLogo /></div>
              <span className="text-[#1A3651] font-extrabold tracking-tighter font-headline text-sm md:text-lg uppercase">TU CONEXIÓN INMOBILIARIA</span>
            </div>
        </div>
        <div className="flex items-center gap-4">
            {/* Cambiado el onClick aquí también */}
            <button onClick={handleGuardarYContinuar} className="bg-[#C5A059] hover:bg-[#b08d4a] text-white px-4 py-2 rounded-lg font-headline font-bold flex items-center gap-2 transition-all shadow-sm text-sm">
              <span className="hidden sm:inline">Ver Catálogo</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto pb-32 px-4 sm:px-6 lg:px-8 pt-28">
        <div className="mb-10 text-center">
          <h2 className="font-headline font-extrabold text-3xl sm:text-4xl text-[#1A3651] tracking-tight mb-2">Mis Deseos</h2>
          <p className="font-body text-[#73777e] text-sm sm:text-base max-w-2xl mx-auto">Defina sus preferencias para encontrar la propiedad perfecta. Nuestro algoritmo de compatibilidad hará el resto.</p>
        </div>

        <div className="space-y-8">
          <section className="bg-white rounded-xl p-6 shadow-sm border border-[#e2e3e1] relative overflow-hidden">
            <h3 className="font-headline font-bold text-xl text-[#1A3651] mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#C5A059]" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span> Ubicación Deseada
            </h3>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-[#73777e]">search</span>
              </div>
              <input type="text" value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} className="block w-full pl-12 pr-4 py-4 bg-[#f4f4f2] border-b border-[#c3c6ce] text-[#1a1c1b] focus:ring-0 focus:border-[#C5A059] transition-colors font-body text-base rounded-t-lg outline-none" placeholder="Ej. Riviera Veracruzana, Boca del Río..." />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {['Riviera Veracruzana', 'Boca del Río', 'Veracruz', 'Medellin'].map(zona => (
                  <span key={zona} onClick={() => setUbicacion(zona)} className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-[#f4f4f2] text-[#43474d] cursor-pointer hover:bg-[#C5A059] hover:text-white transition-colors border border-[#e2e3e1]">{zona}</span>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-xl p-6 shadow-sm border border-[#e2e3e1]">
            <h3 className="font-headline font-bold text-xl text-[#1A3651] mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#C5A059]" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span> Rango de Precio
            </h3>
            <div className="px-2">
              <div className="flex justify-between items-center mb-4 text-sm font-semibold text-[#1A3651]">
                <span>$1,000,000 MXN</span><span>$15,000,000+ MXN</span>
              </div>
              <div className="relative h-2 w-full bg-[#e8e8e6] rounded-full mb-8">
                <div className="absolute h-full bg-[#1A3651] rounded-full" style={{ left: '20%', right: '30%' }}></div>
                <div className="absolute h-6 w-6 rounded-full bg-[#C5A059] shadow-md cursor-pointer border-2 border-white -mt-2 -ml-3" style={{ left: '20%' }}></div>
                <div className="absolute h-6 w-6 rounded-full bg-[#C5A059] shadow-md cursor-pointer border-2 border-white -mt-2 -mr-3" style={{ right: '30%' }}></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#73777e] mb-1 uppercase tracking-wider">Precio Mínimo</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#73777e]">$</span>
                    <input type="text" value={precioMin} onChange={(e) => setPrecioMin(e.target.value)} className="block w-full pl-8 pr-3 py-3 bg-[#f4f4f2] border-b border-[#c3c6ce] text-[#1a1c1b] outline-none focus:border-[#C5A059] font-body rounded-t-lg" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#73777e] mb-1 uppercase tracking-wider">Precio Máximo</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#73777e]">$</span>
                    <input type="text" value={precioMax} onChange={(e) => setPrecioMax(e.target.value)} className="block w-full pl-8 pr-3 py-3 bg-[#f4f4f2] border-b border-[#c3c6ce] text-[#1a1c1b] outline-none focus:border-[#C5A059] font-body rounded-t-lg" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="bg-white rounded-xl p-6 shadow-sm border border-[#e2e3e1]">
              <h3 className="font-headline font-bold text-xl text-[#1A3651] mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#C5A059]" style={{ fontVariationSettings: "'FILL' 1" }}>home</span> Tipo de Propiedad
              </h3>
              <div className="space-y-3">
                {[{ id: 'Casa', desc: 'Residencial, Villa, Townhouse' }, { id: 'Departamento', desc: 'Loft, Penthouse, Estudio' }, { id: 'Terreno', desc: 'Residencial, Comercial, Lote' }].map(tipo => (
                  <label key={tipo.id} className={`relative flex items-start p-4 cursor-pointer rounded-lg hover:bg-[#f4f4f2] transition-colors border ${tipoPropiedad === tipo.id ? 'bg-[#d0e4ff] border-[#aec9ea]' : 'border-transparent'}`}>
                    <div className="flex items-center h-5">
                      <input type="radio" name="property_type" checked={tipoPropiedad === tipo.id} onChange={() => setTipoPropiedad(tipo.id)} className="h-5 w-5 text-[#C5A059] border-[#c3c6ce]" />
                    </div>
                    <div className="ml-3 flex flex-col">
                      <span className="font-body font-semibold text-[#1a1c1b]">{tipo.id}</span>
                      <span className="font-body text-xs text-[#73777e]">{tipo.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-xl p-6 shadow-sm border border-[#e2e3e1] flex flex-col justify-between">
              <div>
                <h3 className="font-headline font-bold text-xl text-[#1A3651] mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#C5A059]" style={{ fontVariationSettings: "'FILL' 1" }}>tune</span> Espacios
                </h3>
                <div className="space-y-6">
                  {[{ id: 'recamaras', label: 'Recámaras' }, { id: 'banos', label: 'Baños' }, { id: 'estacionamiento', label: 'Estacionamiento' }].map((espacio, idx) => (
                    <React.Fragment key={espacio.id}>
                      <div className="flex items-center justify-between">
                        <span className="font-body font-medium text-[#1a1c1b]">{espacio.label}</span>
                        <div className="flex items-center space-x-4">
                          <button onClick={() => updateEspacio(espacio.id, 'restar')} className="h-10 w-10 rounded-full bg-[#f4f4f2] flex items-center justify-center text-[#1A3651] hover:bg-[#e8e8e6] transition-colors"><span className="material-symbols-outlined">remove</span></button>
                          <span className="font-headline font-bold text-xl w-4 text-center">{espacios[espacio.id]}</span>
                          <button onClick={() => updateEspacio(espacio.id, 'sumar')} className="h-10 w-10 rounded-full bg-[#f4f4f2] flex items-center justify-center text-[#1A3651] hover:bg-[#e8e8e6] transition-colors"><span className="material-symbols-outlined">add</span></button>
                        </div>
                      </div>
                      {idx < 2 && <hr className="border-[#e2e3e1]" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </section>
          </div>

          <section className="bg-white rounded-xl p-6 shadow-sm border border-[#e2e3e1]">
            <h3 className="font-headline font-bold text-xl text-[#1A3651] mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#C5A059]" style={{ fontVariationSettings: "'FILL' 1" }}>history</span> Antigüedad
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {['Pre Venta', 'Nuevo', 'Semi Nuevo'].map(estado => (
                <label key={estado} className={`relative flex items-center justify-center p-4 cursor-pointer rounded-lg hover:bg-[#f4f4f2] transition-colors border ${antiguedad === estado ? 'bg-[#d0e4ff] border-[#aec9ea] text-[#1A3651]' : 'border-[#e2e3e1] text-[#43474d]'}`}>
                  <input type="radio" name="antiguedad" className="sr-only" checked={antiguedad === estado} onChange={() => setAntiguedad(estado)} />
                  <span className="font-body font-semibold text-sm">{estado}</span>
                </label>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-xl p-6 shadow-sm border border-[#e2e3e1]">
            <h3 className="font-headline font-bold text-xl text-[#1A3651] mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#C5A059]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> Amenidades Imprescindibles
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Alberca', 'Seguridad 24/7', 'Vista al Mar', 'Jardín Amplio', 'Elevador', 'Gimnasio', 'Pet Friendly', 'Roof Garden'].map(amenidad => (
                <label key={amenidad} className="flex items-center space-x-3 p-3 rounded-lg bg-[#f4f4f2]/50 hover:bg-[#f4f4f2] cursor-pointer transition-colors border border-transparent hover:border-[#e2e3e1]">
                  <input type="checkbox" checked={amenidades.includes(amenidad)} onChange={() => toggleAmenidad(amenidad)} className="h-5 w-5 text-[#C5A059] border-[#c3c6ce] rounded focus:ring-[#C5A059]" />
                  <span className="font-body text-sm font-medium text-[#1a1c1b]">{amenidad}</span>
                </label>
              ))}
            </div>
          </section>

          <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-8 bg-white border border-[#e2e3e1] p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-[#e2e3e1]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                  <path className="text-[#C5A059]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="85, 100" strokeWidth="3"></path>
                </svg>
                <span className="absolute font-headline font-bold text-lg text-[#1A3651]">85%</span>
              </div>
              <div>
                <p className="font-headline font-bold text-[#1A3651] text-lg leading-tight">Score de Compatibilidad</p>
                <p className="font-body text-sm text-[#73777e]">Basado en sus selecciones, tenemos 12 propiedades que coinciden.</p>
              </div>
            </div>

            <div className="flex flex-col w-full md:w-auto gap-4">
              {/* Botón Principal Actualizado */}
              <button onClick={handleGuardarYContinuar} className="w-full bg-[#1A3651] hover:bg-[#2e4965] text-white font-headline font-semibold px-8 py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-lg">
                Guardar Perfil y Ver Catálogo
                <span className="material-symbols-outlined text-xl">domain</span>
              </button>
              
              <button onClick={handleWhatsAppShare} className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-headline font-semibold px-8 py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-3 text-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                </svg>
                COMPARTIR MIS DESEOS CON MI ASESOR
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};