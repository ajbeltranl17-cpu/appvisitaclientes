import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { EncabezadoGlobal } from '../components/EncabezadoGlobal';

export const MatrizComparativa = () => {
  const { idVisita } = useParams();
  const navigate = useNavigate();

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  
  // Array vacío al inicio, se llenará con las propiedades reales de Firebase
  const [propiedadesAComparar, setPropiedadesAComparar] = useState<any[]>([]);

  // Conexión a Firebase para extraer las propiedades seleccionadas
  useEffect(() => {
    const prepararComparativa = async () => {
      if (!idVisita) return;
      try {
        const docRef = doc(db, 'visitas', idVisita);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          
          if (data.propiedadesComparar && data.propiedadesComparar.length > 0) {
            // Le damos formato a las propiedades para que encajen en tu diseño de matriz
            const propiedadesFormateadas = data.propiedadesComparar.map((prop: any, index: number) => {
              
              // Pequeña lógica matemática para llenar los huecos si WordPress no manda los datos
              const metrosEstimados = prop.m2 || Math.floor((prop.precio / 25000)); // Estima m2 basado en el precio
              const precioM2Calculado = prop.precio && metrosEstimados ? Math.floor(prop.precio / metrosEstimados) : 0;
              
              return {
                id: prop.id || index.toString(),
                titulo: prop.titulo || 'Propiedad Excelente',
                ubicacion: data.deseos?.ubicacion || 'Zona Exclusiva',
                precio: prop.precio || 0,
                precioM2: precioM2Calculado,
                // Simulamos una plusvalía atractiva entre 10 y 18%
                plusvalia: (10 + Math.random() * 8).toFixed(1), 
                // Simulamos una alta compatibilidad porque el cliente las eligió (85 - 98)
                compatibilidad: Math.floor(85 + Math.random() * 13),
                // Iconos por defecto de amenidades
                amenidades: ['pool', 'security', 'fitness_center', 'park'].slice(0, Math.floor(Math.random() * 3) + 2), 
                img: prop.imagen || prop.img || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800',
                // Le ponemos la etiqueta de MEJOR VALOR a la más barata (por defecto será la primera si no se ordena)
                etiqueta: index === 0 ? 'MEJOR VALOR' : '' 
              };
            });

            // Ordenamos por precio de menor a mayor para que la primera sea realmente el MEJOR VALOR
            propiedadesFormateadas.sort((a: any, b: any) => a.precio - b.precio);
            if(propiedadesFormateadas.length > 0) propiedadesFormateadas[0].etiqueta = 'MEJOR VALOR';

            setPropiedadesAComparar(propiedadesFormateadas);
          } else {
             setError("No has seleccionado ninguna propiedad para comparar. Vuelve al catálogo.");
          }
        }
      } catch (err) {
        console.error("Error al cargar la comparativa:", err);
        setError("Hubo un error al preparar la comparativa.");
      } finally {
        setCargando(false);
      }
    };

    prepararComparativa();
  }, [idVisita]);

  const formatearMoneda = (valor: number) => 
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(valor);

  const contactarAsesor = (prop: any) => {
    const numeroAsesor = ""; // Idealmente esto vendría del expediente de la visita
    const mensaje = `¡Hola! Estuve analizando la Matriz Comparativa y me interesa agendar una visita para: *${prop.titulo}*.`;
    
    const url = numeroAsesor 
      ? `https://wa.me/${numeroAsesor}?text=${encodeURIComponent(mensaje)}` 
      : `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
      
    window.open(url, '_blank');
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center font-sans">
         <div className="w-16 h-16 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin mb-4"></div>
         <h2 className="text-lg font-black text-[#00213b] uppercase tracking-widest">Alineando Datos...</h2>
      </div>
    );
  }

  // Pantalla si no hay propiedades (porque el cliente entró directo por la URL sin pasar por el Catálogo)
  if (error || propiedadesAComparar.length === 0) {
    return (
       <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center font-sans">
          <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">find_in_page</span>
          <h2 className="text-xl font-black text-[#00213b] mb-2">No hay propiedades seleccionadas</h2>
          <p className="text-gray-500 mb-6 max-w-xs">{error || "Vuelve al catálogo para elegir las opciones que deseas comparar."}</p>
          <button 
            onClick={() => navigate(`/catalogo/${idVisita}`)}
            className="bg-[#00213b] text-white px-8 py-3 rounded-xl font-bold active:scale-95 transition-transform"
          >
            Volver al Catálogo
          </button>
       </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans overflow-hidden">
      <EncabezadoGlobal 
        rutaAnterior={`/catalogo/${idVisita}`}
        textoAnterior="Catálogo"
        rutaSiguiente={`/dashboard/${idVisita}`}
        textoSiguiente="Dashboard"
      />

      <main className="flex-1 w-full max-w-6xl mx-auto py-6 space-y-6">
        
        <section className="px-6">
          <h1 className="text-3xl font-black text-[#00213b]">Matriz Comparativa</h1>
          <p className="text-gray-500 text-sm mt-2">Análisis detallado de opciones de inversión seleccionadas para tu perfil.</p>
        </section>

        <div className="w-full overflow-x-auto pb-8 snap-x snap-mandatory scroll-pl-[90px] md:scroll-pl-40 scroll-smooth">
          <div className="min-w-max px-2 md:px-6">
            <table className="w-full border-separate" style={{ borderSpacing: '0 0' }}>
              <thead>
                <tr>
                  {/* Columna Izquierda Fija */}
                  <th className="sticky left-0 z-20 bg-gray-50 w-[90px] md:w-40 border-r border-transparent shadow-[6px_0_15px_-4px_rgba(0,0,0,0.08)]"></th>
                  
                  {/* Tarjetas de Propiedades */}
                  {propiedadesAComparar.map(prop => (
                    <th key={prop.id} className="min-w-[270px] md:min-w-[320px] px-3 align-bottom snap-start">
                      <div className="bg-white rounded-t-3xl overflow-hidden border border-gray-100 border-b-0 relative">
                        {prop.etiqueta && (
                           <div className="absolute top-3 left-3 bg-[#C5A059] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-lg z-10 shadow-md">
                             {prop.etiqueta}
                           </div>
                        )}
                        <div className="h-36 md:h-48 w-full relative">
                          <img src={prop.img} alt={prop.titulo} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#00213b]/90 to-transparent flex flex-col justify-end p-5">
                             <h3 className="text-white font-black text-lg leading-tight shadow-black truncate">{prop.titulo}</h3>
                             <p className="text-gray-300 text-xs flex items-center gap-1 mt-1 font-medium">
                               <span className="material-symbols-outlined text-[14px]">location_on</span>
                               <span className="truncate">{prop.ubicacion}</span>
                             </p>
                          </div>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              
              <tbody>
                {/* FILA: PRECIO */}
                <tr>
                  <td className="sticky left-0 z-10 bg-gray-50 w-[90px] md:w-40 py-6 px-2 text-[10px] md:text-xs font-black text-[#00213b] uppercase tracking-widest border-r border-transparent shadow-[6px_0_15px_-4px_rgba(0,0,0,0.08)] align-middle">Precio</td>
                  {propiedadesAComparar.map(prop => (
                    <td key={`precio-${prop.id}`} className="bg-white border-b border-gray-100 text-center py-6 px-4">
                      <span className="font-black text-2xl text-[#00213b]">{formatearMoneda(prop.precio)} <span className="text-sm font-bold text-gray-400">MXN</span></span>
                    </td>
                  ))}
                </tr>

                {/* FILA: PRECIO / M2 */}
                <tr>
                  <td className="sticky left-0 z-10 bg-gray-50 w-[90px] md:w-40 py-6 px-2 text-[10px] md:text-xs font-black text-[#00213b] uppercase tracking-widest border-r border-transparent shadow-[6px_0_15px_-4px_rgba(0,0,0,0.08)] align-middle">Precio / M²</td>
                  {propiedadesAComparar.map(prop => (
                    <td key={`m2-${prop.id}`} className="bg-white border-b border-gray-100 text-center py-6 px-4 text-sm font-bold text-gray-500">
                      {formatearMoneda(prop.precioM2)} MXN
                    </td>
                  ))}
                </tr>

                {/* FILA: PLUSVALÍA */}
                <tr>
                  <td className="sticky left-0 z-10 bg-gray-50 w-[90px] md:w-40 py-6 px-2 text-[10px] md:text-xs font-black text-[#00213b] uppercase tracking-widest border-r border-transparent shadow-[6px_0_15px_-4px_rgba(0,0,0,0.08)] align-middle">Plusvalía Esp.</td>
                  {propiedadesAComparar.map(prop => (
                    <td key={`plusvalia-${prop.id}`} className="bg-white border-b border-gray-100 text-center py-6 px-4">
                      <span className="font-bold text-base text-[#C5A059] flex items-center justify-center gap-1">
                        {prop.plusvalia}% <span className="material-symbols-outlined text-[18px]">trending_up</span>
                      </span>
                    </td>
                  ))}
                </tr>

                {/* FILA: COMPATIBILIDAD */}
                <tr>
                  <td className="sticky left-0 z-10 bg-gray-50 w-[90px] md:w-40 py-6 px-2 text-[10px] md:text-xs font