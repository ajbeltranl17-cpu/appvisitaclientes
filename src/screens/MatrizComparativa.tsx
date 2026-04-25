import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { BrandLogo } from '../components/BrandLogo';

export const MatrizComparativa = () => {
  const { idVisita } = useParams();
  const navigate = useNavigate();

  const [telefonoAsesor, setTelefonoAsesor] = useState('');
  const [nombreCliente, setNombreCliente] = useState('');

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
          
          if (data.nombreCliente) {
            setNombreCliente(data.nombreCliente.split(' ')[0]);
          }
        }
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };
    fetchDatosVisita();
  }, [idVisita]);

  const inventarioOpciones = [
    {
      id: 1,
      nombre: "Torre Alvento, PH",
      ubicacion: "Boca del Río, Ver", 
      precio: "$12,450,000 MXN",
      precioM2: "$85,000 MXN",
      plusvalia: "14.5%",
      compatibilidad: 92,
      amenidades: ["pool", "fitness_center", "security"],
      imagen: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      mejorValor: true
    },
    {
      id: 2,
      nombre: "Loft Distrito K",
      ubicacion: "Riviera Veracruzana", 
      precio: "$8,900,000 MXN",
      precioM2: "$74,160 MXN",
      plusvalia: "18.2%",
      compatibilidad: 85,
      amenidades: ["balcony", "local_parking"],
      imagen: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      mejorValor: false
    },
    {
      id: 3,
      nombre: "Residencial Bosques",
      ubicacion: "Playas del Conchal", 
      precio: "$18,500,000 MXN",
      precioM2: "$61,600 MXN",
      plusvalia: "11.0%",
      compatibilidad: 78,
      amenidades: ["yard", "security", "laptop_mac"],
      imagen: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      mejorValor: false
    }
  ];

  const handleAgendarVisita = (propiedad) => {
    const saludo = nombreCliente ? `Soy ${nombreCliente}. ` : '';
    const texto = encodeURIComponent(
      `¡Hola! ${saludo}Me gustaría Agendar Mi Próxima Visita para conocer esta propiedad que vi en mi Matriz Comparativa:\n\n` +
      `🏡 *${propiedad.nombre}*\n` +
      `📍 ${propiedad.ubicacion}\n` +
      `💰 ${propiedad.precio}\n\n` +
      `¿Qué horarios tienes disponibles?`
    );

    const url = telefonoAsesor 
      ? `https://api.whatsapp.com/send?phone=${telefonoAsesor}&text=${texto}`
      : `https://api.whatsapp.com/send?text=${texto}`;
      
    window.open(url, '_blank');
  };

  return (
    <div className="bg-[#f9f9f7] text-[#1a1c1b] font-body antialiased selection:bg-[#fed488] selection:text-[#785a1a] min-h-screen">
      
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-sm flex justify-between items-center px-4 md:px-6 py-4 border-b border-[#e2e3e1]">
        <div className="flex items-center gap-3 md:gap-4">
            <button 
              onClick={() => navigate(`/catalogo/${idVisita}`)}
              className="text-[#1A3651] hover:text-[#C5A059] transition-colors p-1 md:pr-2"
              title="Regresar al Catálogo"
            >
              <span className="material-symbols-outlined text-2xl md:text-xl">arrow_back</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="hidden sm:block">
                  <BrandLogo />
              </div>
              <span className="text-[#1A3651] font-extrabold tracking-tighter font-headline text-sm md:text-lg uppercase">
                  TU CONEXIÓN INMOBILIARIA
              </span>
            </div>
        </div>

        <div className="flex items-center gap-4">
            {/* Botón Ir al Panel cambiado a color dorado */}
            <button 
                onClick={() => navigate(`/dashboard/${idVisita}`)}
                className="bg-[#C5A059] hover:bg-[#b08d4a] text-white px-4 py-2 rounded-lg font-headline font-bold flex items-center gap-2 transition-all shadow-sm text-sm"
            >
              <span className="hidden sm:inline">Ir al Panel</span>
              <span className="material-symbols-outlined text-lg">dashboard</span>
            </button>
        </div>
      </header>

      <main className="pt-28 pb-32 px-4 md:px-12 max-w-[1400px] mx-auto min-h-screen">
        
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight text-[#1A3651] mb-2">Matriz Comparativa</h1>
            <p className="font-body text-[#43474d] text-base md:text-lg max-w-2xl">
              Análisis detallado de opciones de inversión seleccionadas para su perfil.
            </p>
          </div>
          <button className="bg-gradient-to-br from-[#1A3651] to-[#2e4965] hover:from-[#C5A059] hover:to-[#b08d4a] text-white font-body text-sm font-semibold px-6 py-3 rounded-lg shadow-md transition-all flex items-center gap-2 w-max">
            <span className="material-symbols-outlined text-[20px]">download</span>
            Descargar Reporte PDF
          </button>
        </div>

        <div className="overflow-x-auto pb-8 snap-x snap-mandatory">
          <div className="min-w-[900px] flex gap-6 pb-4 items-start">
            
            {/* Columna de Criterios (Alineación Matemática: pt-226px móvil / pt-246px desktop para igualar foto+padding) */}
            <div className="w-40 md:w-48 flex-shrink-0 flex flex-col pt-[226px] md:pt-[246px] pb-6 gap-6 bg-[#f9f9f7] z-10 sticky left-0 border-r border-[#e2e3e1] pr-2">
              <div className="h-12 flex items-center px-2 font-label font-bold text-xs md:text-sm text-[#43474d] uppercase tracking-wider">Precio</div>
              <div className="h-12 flex items-center px-2 font-label font-bold text-xs md:text-sm text-[#43474d] uppercase tracking-wider">Precio / m²</div>
              <div className="h-12 flex items-center px-2 font-label font-bold text-xs md:text-sm text-[#43474d] uppercase tracking-wider">Plusvalía Esp.</div>
              <div className="h-12 flex items-center px-2 font-label font-bold text-xs md:text-sm text-[#43474d] uppercase tracking-wider">Compatibilidad</div>
              <div className="h-12 flex items-center px-2 font-label font-bold text-xs md:text-sm text-[#43474d] uppercase tracking-wider">Amenidades</div>
            </div>

            {/* Tarjetas de Propiedades */}
            {inventarioOpciones.map((prop) => (
                <div key={prop.id} className="w-[300px] md:w-[320px] flex-shrink-0 flex flex-col bg-white rounded-xl shadow-lg overflow-hidden snap-center relative border-2 border-[#e2e3e1]">
                  
                  {prop.mejorValor && (
                      <div className="absolute top-4 left-4 z-10 bg-[#fed488] text-[#785a1a] font-label text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm">
                        Mejor Valor
                      </div>
                  )}

                  {/* Foto: Altura exacta 200px móvil / 220px desktop */}
                  <div className="h-[200px] md:h-[220px] relative">
                    <img alt={prop.nombre} className="w-full h-full object-cover" src={prop.imagen} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A3651]/90 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="font-headline text-lg md:text-xl font-bold text-white leading-tight">{prop.nombre}</h3>
                      <p className="font-body text-[#aec9ea] text-xs md:text-sm mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">location_on</span> 
                        {prop.ubicacion}
                      </p>
                    </div>
                  </div>

                  {/* Filas de Datos (Igualando h-12 y gap-6 de la columna izquierda) */}
                  <div className="flex flex-col gap-6 p-6 bg-white flex-grow">
                    <div className="h-12 flex items-center font-headline text-xl md:text-2xl font-extrabold text-[#1A3651] tracking-tight">{prop.precio}</div>
                    
                    <div className="h-12 flex items-center font-body text-sm md:text-base text-[#1a1c1b]">{prop.precioM2}</div>
                    
                    <div className="h-12 flex items-center gap-2">
                      <span className="font-headline text-lg font-bold text-[#C5A059]">{prop.plusvalia}</span>
                      <span className="material-symbols-outlined text-[#C5A059] text-[20px]">trending_up</span>
                    </div>
                    
                    <div className="h-12 flex items-center">
                      <div className="bg-[#e8e8e6] h-2 w-full rounded-full overflow-hidden">
                        <div className="bg-[#C5A059] h-full rounded-full" style={{ width: `${prop.compatibilidad}%` }}></div>
                      </div>
                      <span className="ml-3 font-headline font-bold text-sm text-[#1a1c1b]">{prop.compatibilidad}/100</span>
                    </div>
                    
                    <div className="h-12 flex items-center gap-2">
                      {prop.amenidades.map((icon, idx) => (
                          <div key={idx} className="bg-[#f4f4f2] p-2 rounded-lg text-[#1A3651] flex items-center justify-center border border-[#e2e3e1]">
                            <span className="material-symbols-outlined text-[20px]">{icon}</span>
                          </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-white border-t border-[#e2e3e1] mt-auto">
                    <button 
                      onClick={() => handleAgendarVisita(prop)}
                      className="w-full bg-[#25D366] text-white hover:bg-[#128C7E] transition-colors font-body font-semibold text-sm py-3 rounded-lg flex items-center justify-center gap-2 shadow-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                      </svg>
                      Agendar Visita
                    </button>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};