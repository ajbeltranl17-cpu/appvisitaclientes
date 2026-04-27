import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EncabezadoGlobal } from '../components/EncabezadoGlobal';

export const MatrizComparativa = () => {
  const { idVisita } = useParams();
  const navigate = useNavigate();

  // En Fase Backend, estos datos llegarán automáticamente filtrados desde la pantalla del Catálogo.
  const [propiedadesAComparar] = useState([
    {
      id: '1',
      titulo: 'Torre Alvento, PH',
      ubicacion: 'Boca del Río, Ver',
      precio: 12450000,
      precioM2: 85000,
      plusvalia: 14.5,
      compatibilidad: 92,
      amenidades: ['pool', 'fitness_center', 'security'],
      img: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800',
      etiqueta: 'MEJOR VALOR'
    },
    {
      id: '2',
      titulo: 'Loft Distrito K',
      ubicacion: 'Riviera Veracruzana',
      precio: 8900000,
      precioM2: 74160,
      plusvalia: 18.2,
      compatibilidad: 85,
      amenidades: ['elevator', 'local_parking'],
      img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800'
    },
    {
      id: '3',
      titulo: 'Residencial Bosques',
      ubicacion: 'Playas del Conchal',
      precio: 18500000,
      precioM2: 61600,
      plusvalia: 11.0,
      compatibilidad: 78,
      amenidades: ['park', 'security', 'laptop_mac'],
      img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800'
    }
  ]);

  const formatearMoneda = (valor: number) => 
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(valor);

  const contactarAsesor = (prop: any) => {
    // Si lo dejamos vacío (""), WhatsApp te preguntará a quién enviarlo para que puedas probar el texto.
    // Si quieres que te llegue a ti, pon tu número así: "522291234567"
    const numeroAsesor = ""; 
    const mensaje = `¡Hola! Estuve analizando la Matriz Comparativa y me interesa agendar una visita para: *${prop.titulo}*.`;
    
    const url = numeroAsesor 
      ? `https://wa.me/${numeroAsesor}?text=${encodeURIComponent(mensaje)}` 
      : `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
      
    window.open(url, '_blank');
  };

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

        {/* CONTENEDOR DE TABLA: Se añadió scroll-pl-[90px] para que respete la columna fija al soltar el dedo */}
        <div className="w-full overflow-x-auto pb-8 snap-x snap-mandatory scroll-pl-[90px] md:scroll-pl-40 scroll-smooth">
          <div className="min-w-max px-2 md:px-6">
            <table className="w-full border-separate" style={{ borderSpacing: '0 0' }}>
              <thead>
                <tr>
                  {/* Columna Izquierda Fija: Se acentuó la sombra para separar visualmente */}
                  <th className="sticky left-0 z-20 bg-gray-50 w-[90px] md:w-40 border-r border-transparent shadow-[6px_0_15px_-4px_rgba(0,0,0,0.08)]"></th>
                  
                  {/* Tarjetas de Propiedades: Se cambió snap-center por snap-start */}
                  {propiedadesAComparar.map(prop => (
                    <th key={prop.id} className="min-w-[270px] md:min-w-[320px] px-3 align-bottom snap-start">
                      <div className="bg-white rounded-t-3xl overflow-hidden border border-gray-100 border-b-0 relative">
                        {prop.etiqueta && (
                           <div className="absolute top-3 left-3 bg-[#C5A059] text-[#00213b] text-[10px] font-black uppercase px-3 py-1 rounded-lg z-10 shadow-md">
                             {prop.etiqueta}
                           </div>
                        )}
                        <div className="h-36 md:h-48 w-full relative">
                          <img src={prop.img} alt={prop.titulo} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#00213b]/90 to-transparent flex flex-col justify-end p-5">
                             <h3 className="text-white font-black text-lg leading-tight shadow-black">{prop.titulo}</h3>
                             <p className="text-gray-300 text-xs flex items-center gap-1 mt-1 font-medium">
                               <span className="material-symbols-outlined text-[14px]">location_on</span>
                               {prop.ubicacion}
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
                  <td className="sticky left-0 z-10 bg-gray-50 w-[90px] md:w-40 py-6 px-2 text-[10px] md:text-xs font-black text-[#00213b] uppercase tracking-widest border-r border-transparent shadow-[6px_0_15px_-4px_rgba(0,0,0,0.08)] align-middle">Compatibilidad</td>
                  {propiedadesAComparar.map(prop => (
                    <td key={`compat-${prop.id}`} className="bg-white border-b border-gray-100 text-center py-6 px-6">
                      <div className="flex items-center gap-3 justify-center">
                         <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden max-w-[120px]">
                            <div className="bg-[#C5A059] h-full rounded-full" style={{width: `${prop.compatibilidad}%`}}></div>
                         </div>
                         <span className="text-xs font-black text-[#00213b]">{prop.compatibilidad}/100</span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* FILA: AMENIDADES */}
                <tr>
                  <td className="sticky left-0 z-10 bg-gray-50 w-[90px] md:w-40 py-6 px-2 text-[10px] md:text-xs font-black text-[#00213b] uppercase tracking-widest border-r border-transparent shadow-[6px_0_15px_-4px_rgba(0,0,0,0.08)] align-middle">Amenidades</td>
                  {propiedadesAComparar.map(prop => (
                    <td key={`amenidades-${prop.id}`} className="bg-white border-b border-gray-100 text-center py-6 px-4">
                      <div className="flex justify-center gap-2">
                         {prop.amenidades.map((icon, i) => (
                           <div key={i} className="w-9 h-9 rounded-xl bg-gray-50 text-[#00213b] flex items-center justify-center border border-gray-100">
                             <span className="material-symbols-outlined text-[18px]">{icon}</span>
                           </div>
                         ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* FILA: BOTÓN AGENDAR VISITA */}
                <tr>
                  <td className="sticky left-0 z-10 bg-gray-50 w-[90px] md:w-40 p-2 border-r border-transparent shadow-[6px_0_15px_-4px_rgba(0,0,0,0.08)]"></td>
                  {propiedadesAComparar.map(prop => (
                    <td key={`btn-${prop.id}`} className="bg-white p-4 rounded-b-3xl border border-t-0 border-gray-100 shadow-sm align-top">
                       <button 
                         onClick={() => contactarAsesor(prop)} 
                         className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-4 rounded-xl font-bold shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 text-sm"
                       >
                          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12.031 0C5.385 0 0 5.386 0 12.033c0 2.128.553 4.205 1.604 6.035L.145 24l6.113-1.605c1.764.966 3.754 1.476 5.77 1.476 6.647 0 12.034-5.386 12.034-12.034C24 5.386 18.678 0 12.031 0zm0 21.894c-1.802 0-3.565-.484-5.112-1.404l-.367-.218-3.805.998.998-3.71-.238-.38A9.873 9.873 0 0 1 2.051 12.033c0-5.513 4.487-10 10-10 5.513 0 10 4.487 10 10s-4.487 10-9.999 10zm5.485-7.493c-.302-.15-1.785-.88-2.062-.98-.278-.1-.481-.15-.683.15-.203.301-.781.98-.957 1.18-.175.201-.35.226-.652.076-1.528-.758-2.613-1.442-3.626-3.15-.176-.297-.018-.458.133-.608.135-.135.302-.352.453-.528.15-.176.202-.301.302-.502.1-.201.05-.377-.025-.527-.075-.15-.683-1.645-.935-2.253-.246-.593-.497-.512-.683-.521-.175-.009-.376-.009-.578-.009-.202 0-.528.075-.805.376-.277.301-1.056 1.031-1.056 2.513 0 1.482 1.082 2.915 1.233 3.116.15.201 2.126 3.245 5.15 4.547 2.08 .894 2.87 .974 3.938.82 1.156-.168 3.565-1.457 4.067-2.865.503-1.408.503-2.614.353-2.865-.151-.252-.553-.402-.855-.553z"/></svg>
                          Agendar Visita
                       </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
};