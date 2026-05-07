import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore'; 
import { db } from '../firebase';
import { EncabezadoGlobal } from '../components/EncabezadoGlobal';

export const CatalogoPropiedades = () => {
  const { idVisita } = useParams();
  const navigate = useNavigate();

  const [seleccionados, setSeleccionados] = useState<string[]>([]);
  const [buscando, setBuscando] = useState(true);
  const [deseosCliente, setDeseosCliente] = useState<any>(null);
  const [propiedades, setPropiedades] = useState<any[]>([]);

  useEffect(() => {
    if (!idVisita) return;
    
    const docRef = doc(db, 'visitas', idVisita);
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        if (data.deseos) {
          setDeseosCliente(data.deseos);
        }

        if (data.busquedaCompletada && data.opcionesCatalogo) {
          setPropiedades(data.opcionesCatalogo);
          setBuscando(false);
        }
      }
    });

    return () => unsubscribe();
  }, [idVisita]);

  const toggleSeleccion = (id: string) => {
    if (seleccionados.includes(id)) {
      setSeleccionados(seleccionados.filter(item => item !== id));
    } else {
      if (seleccionados.length < 3) {
        setSeleccionados([...seleccionados, id]);
      } else {
        alert('Puedes comparar un máximo de 3 propiedades simultáneamente.');
      }
    }
  };

  const formatearMoneda = (valor: number) => 
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(valor || 0);

  const contactarAsesor = (propiedad: any) => {
    const numeroAsesor = ""; 
    const mensaje = `¡Hola! Estoy navegando por mi catálogo personalizado y me interesó mucho la propiedad: *${propiedad.titulo}* (${formatearMoneda(propiedad.precio)}). ¿Me podrías dar más detalles?`;
    
    const url = numeroAsesor 
      ? `https://wa.me/${numeroAsesor}?text=${encodeURIComponent(mensaje)}` 
      : `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
      
    window.open(url, '_blank');
  };

  const irAComparar = async () => {
    if (!idVisita) return;
    try {
      const propiedadesElegidas = propiedades.filter(prop => seleccionados.includes(prop.id));
      const docRef = doc(db, 'visitas', idVisita);
      await updateDoc(docRef, { propiedadesComparar: propiedadesElegidas });
      navigate(`/matriz/${idVisita}`);
    } catch (error) {
      console.error("Error al guardar la comparativa:", error);
      navigate(`/matriz/${idVisita}`);
    }
  };

  // 1. PANTALLA DE CARGA
  if (buscando) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center font-sans">
         <div className="w-20 h-20 relative flex items-center justify-center mb-6">
            <div className="absolute inset-0 border-4 border-[#C5A059]/20 rounded-full animate-ping"></div>
            <div className="absolute inset-2 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin"></div>
            <span className="material-symbols-outlined text-[#00213b] text-3xl animate-pulse">travel_explore</span>
         </div>
         <h2 className="text-xl font-black text-[#00213b] mb-2 uppercase tracking-wide">Analizando Inventario</h2>
         <p className="text-gray-500 text-sm max-w-[280px]">
           Buscando propiedades en <strong className="text-[#C5A059]">{deseosCliente?.ubicacion || 'la zona'}</strong> que coincidan con tu presupuesto máximo de <strong className="text-[#C5A059]">{deseosCliente ? formatearMoneda(deseosCliente.presupuestoMax || deseosCliente.presupuesto) : 'tu perfil'}</strong>...
         </p>
      </div>
    );
  }

  // 2. PANTALLA CUANDO EL INVENTARIO ES CERO (NUEVA)
  if (!buscando && propiedades.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <EncabezadoGlobal 
          rutaAnterior={`/mis-deseos/${idVisita}`} textoAnterior="Mis Deseos"
          rutaSiguiente={`/matriz/${idVisita}`} textoSiguiente="Comparar"
        />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto w-full">
           <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-sm">
              <span className="material-symbols-outlined text-gray-400 text-4xl">search_off</span>
           </div>
           
           <h2 className="text-2xl font-black text-[#00213b] mb-3 leading-tight">Aún no publicamos algo exactamente así</h2>
           
           <p className="text-gray-500 text-sm mb-8 leading-relaxed">
             En este momento no encontré algo en nuestro sitio web que coincida perfectamente con lo que buscas, pero <strong>comparte con tu asesor tus deseos</strong>. Constantemente recibimos propiedades en preventa o confidenciales que podrían encajar contigo.
           </p>

           <button 
             onClick={() => {
                const mensaje = `¡Hola! Llené mis preferencias en la plataforma, pero no encontré exactamente lo que busco en el catálogo actual. Me gustaría que me ayudaras a encontrar opciones fuera del sitio web.\n\n` + 
                `📍 *Busco en:* ${deseosCliente?.ubicacion || 'la zona'}\n` +
                `💰 *Rango:* ${formatearMoneda(deseosCliente?.presupuestoMin)} - ${formatearMoneda(deseosCliente?.presupuestoMax)}`;
                
                const numeroAsesor = ""; 
                const url = numeroAsesor ? `https://wa.me/${numeroAsesor}?text=${encodeURIComponent(mensaje)}` : `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
                window.open(url, '_blank');
             }}
             className="w-full bg-[#25D366] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-wide shadow-lg shadow-[#25D366]/30 flex justify-center items-center gap-3 active:scale-95 transition-all"
           >
             <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12.031 0C5.385 0 0 5.386 0 12.033c0 2.128.553 4.205 1.604 6.035L.145 24l6.113-1.605c1.764.966 3.754 1.476 5.77 1.476 6.647 0 12.034-5.386 12.034-12.034C24 5.386 18.678 0 12.031 0zm0 21.894c-1.802 0-3.565-.484-5.112-1.404l-.367-.218-3.805.998.998-3.71-.238-.38A9.873 9.873 0 0 1 2.051 12.033c0-5.513 4.487-10 10-10 5.513 0 10 4.487 10 10s-4.487 10-9.999 10zm5.485-7.493c-.302-.15-1.785-.88-2.062-.98-.278-.1-.481-.15-.683.15-.203.301-.781.98-.957 1.18-.175.201-.35.226-.652.076-1.528-.758-2.613-1.442-3.626-3.15-.176-.297-.018-.458.133-.608.135-.135.302-.352.453-.528.15-.176.202-.301.302-.502.1-.201.05-.377-.025-.527-.075-.15-.683-1.645-.935-2.253-.246-.593-.497-.512-.683-.521-.175-.009-.376-.009-.578-.009-.202 0-.528.075-.805.376-.277.301-1.056 1.031-1.056 2.513 0 1.482 1.082 2.915 1.233 3.116.15.201 2.126 3.245 5.15 4.547 2.08 .894 2.87 .974 3.938.82 1.156-.168 3.565-1.457 4.067-2.865.503-1.408.503-2.614.353-2.865-.151-.252-.553-.402-.855-.553z"/></svg>
             Compartir con mi Asesor
           </button>
        </main>
      </div>
    );
  }

  // 3. PANTALLA PRINCIPAL CON INVENTARIO
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-32">
      <EncabezadoGlobal 
        rutaAnterior={`/mis-deseos/${idVisita}`} textoAnterior="Mis Deseos"
        rutaSiguiente={`/matriz/${idVisita}`} textoSiguiente="Comparar"
      />

      <main className="p-4 max-w-5xl mx-auto w-full space-y-6">
        
        <section className="px-2">
          <span className="text-[#C5A059] font-black uppercase text-[10px] tracking-[0.3em]">Resultados de tuconexioninmobiliaria.com</span>
          <h1 className="text-3xl font-black text-[#00213b] mt-1">Sugerencias para ti</h1>
          <p className="text-gray-500 text-sm mt-2">Basado en tus preferencias, hemos filtrado estas opciones. Selecciona hasta 3 para compararlas detalle a detalle.</p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {propiedades.map((prop) => {
            const isSelected = seleccionados.includes(prop.id);
            return (
              <div key={prop.id} className={`bg-white rounded-3xl overflow-hidden shadow-sm border-2 transition-all ${isSelected ? 'border-[#C5A059]' : 'border-transparent'}`}>
                
                <div className="relative h-56 w-full bg-gray-200">
                  <img src={prop.imagen || prop.img} alt={prop.titulo} className="w-full h-full object-cover" />
                  
                  {deseosCliente?.presupuestoMax && prop.precio <= deseosCliente.presupuestoMax && (
                    <div className="absolute top-4 left-4 bg-[#C5A059] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md">
                      <span className="material-symbols-outlined text-xs">star</span>
                      Match Ideal
                    </div>
                  )}
                  
                  {isSelected && (
                    <div className="absolute top-4 right-4 bg-[#C5A059] text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md">
                      <span className="material-symbols-outlined text-sm">check</span>
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="text-lg font-black text-[#00213b] leading-tight line-clamp-2">{prop.titulo}</h3>
                    <p className="text-xl font-bold text-[#C5A059] mt-1">{formatearMoneda(prop.precio)}</p>
                    <div className="flex items-center gap-1 text-gray-500 mt-2 text-sm font-medium">
                      <span className="material-symbols-outlined text-[16px]">location_on</span>
                      {deseosCliente?.ubicacion || 'Ubicación Premium'}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 border-t border-b border-gray-100 py-4">
                    <div className="flex flex-col items-center text-center">
                      <span className="material-symbols-outlined text-[#00213b] mb-1 text-lg">bed</span>
                      <span className="text-[10px] text-gray-500 font-bold">{prop.habitaciones || 3} Hab.</span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <span className="material-symbols-outlined text-[#00213b] mb-1 text-lg">shower</span>
                      <span className="text-[10px] text-gray-500 font-bold">{prop.banos || 2} Baños</span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <a href={prop.url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center hover:opacity-70 transition-opacity">
                        <span className="material-symbols-outlined text-[#C5A059] mb-1 text-lg">link</span>
                        <span className="text-[10px] text-[#C5A059] font-bold">Ver Web</span>
                      </a>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <button 
                      onClick={() => toggleSeleccion(prop.id)}
                      className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all ${isSelected ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-gray-50 text-[#00213b] hover:bg-gray-100'}`}
                    >
                      {isSelected ? 'Quitar de la lista' : 'Añadir a Comparativa'}
                    </button>
                    
                    <button 
                      onClick={() => contactarAsesor(prop)}
                      className="w-full py-3.5 rounded-2xl font-bold text-sm bg-[#25D366] text-white flex items-center justify-center gap-2 hover:bg-[#20bd5a] shadow-sm active:scale-95 transition-all"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.031 0C5.385 0 0 5.386 0 12.033c0 2.128.553 4.205 1.604 6.035L.145 24l6.113-1.605c1.764.966 3.754 1.476 5.77 1.476 6.647 0 12.034-5.386 12.034-12.034C24 5.386 18.678 0 12.031 0zm0 21.894c-1.802 0-3.565-.484-5.112-1.404l-.367-.218-3.805.998.998-3.71-.238-.38A9.873 9.873 0 0 1 2.051 12.033c0-5.513 4.487-10 10-10 5.513 0 10 4.487 10 10s-4.487 10-9.999 10zm5.485-7.493c-.302-.15-1.785-.88-2.062-.98-.278-.1-.481-.15-.683.15-.203.301-.781.98-.957 1.18-.175.201-.35.226-.652.076-1.528-.758-2.613-1.442-3.626-3.15-.176-.297-.018-.458.133-.608.135-.135.302-.352.453-.528.15-.176.202-.301.302-.502.1-.201.05-.377-.025-.527-.075-.15-.683-1.645-.935-2.253-.246-.593-.497-.512-.683-.521-.175-.009-.376-.009-.578-.009-.202 0-.528.075-.805.376-.277.301-1.056 1.031-1.056 2.513 0 1.482 1.082 2.915 1.233 3.116.15.201 2.126 3.245 5.15 4.547 2.08 .894 2.87 .974 3.938.82 1.156-.168 3.565-1.457 4.067-2.865.503-1.408.503-2.614.353-2.865-.151-.252-.553-.402-.855-.553z"/></svg>
                      Preguntar por WhatsApp
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Barra Flotante Inferior de Comparativa */}
      {seleccionados.length > 0 && (
        <div className="fixed bottom-6 left-0 w-full px-4 z-50 flex justify-center pointer-events-none">
          <div className="bg-[#00213b] text-white rounded-[2rem] p-4 shadow-[0_10px_40px_rgba(0,33,59,0.3)] flex items-center justify-between w-full max-w-sm pointer-events-auto border border-white/10">
            <div className="pl-2">
              <p className="text-[9px] uppercase tracking-[0.2em] font-bold opacity-70">A comparar</p>
              <p className="font-black text-lg leading-tight">{seleccionados.length} de 3 listos</p>
            </div>
            <button 
              onClick={irAComparar}
              className="bg-[#C5A059] text-white px-6 py-3.5 rounded-2xl font-bold flex items-center gap-2 active:scale-95 transition-transform"
            >
              Comparar
              <span className="material-symbols-outlined text-sm">view_week</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};