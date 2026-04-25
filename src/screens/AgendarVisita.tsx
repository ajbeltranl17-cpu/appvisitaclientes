import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { BrandLogo } from '../components/BrandLogo';

export const AgendarVisita = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados del formulario (Cliente)
  const [nombreCliente, setNombreCliente] = useState('');
  const [whatsappCliente, setWhatsappCliente] = useState('');
  
  // Estados del formulario (Propiedad)
  const [ubicacionPropiedad, setUbicacionPropiedad] = useState('');
  const [urlPropiedad, setUrlPropiedad] = useState('');
  const [urlGoogleMaps, setUrlGoogleMaps] = useState('');
  const [fechaVisita, setFechaVisita] = useState('');
  const [horaVisita, setHoraVisita] = useState('');

  // Estados del formulario (Asesor)
  const [nombreAsesor, setNombreAsesor] = useState('');
  const [whatsappAsesor, setWhatsappAsesor] = useState('');

  const handleCrearVisita = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Guardar todo el ecosistema de datos en Firebase
      const docRef = await addDoc(collection(db, 'visitas'), {
        nombreCliente,
        whatsappCliente: whatsappCliente.replace(/\D/g, ''), // Solo números
        ubicacionPropiedad,
        urlPropiedad,
        urlGoogleMaps, // Ahora guarda el link simple de compartir
        fechaVisita,
        horaVisita,
        nombreAsesor,
        telefonoAsesor: whatsappAsesor.replace(/\D/g, ''), // Guardado para compatibilidad con otras pantallas
        fotoAsesor: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80" // Foto genérica por defecto
      });

      // Redirigir al panel de control de esta nueva visita
      navigate(`/dashboard/${docRef.id}`);
    } catch (error) {
      console.error("Error al crear visita:", error);
      alert("Hubo un error al crear la visita.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f9f9f7] min-h-screen text-[#1a1c1b] font-body pb-20">
      
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 px-6 py-4 flex justify-between items-center border-b border-[#e2e3e1]">
        <div className="flex items-center gap-3">
          <BrandLogo className="h-8 w-auto" />
          <span className="font-headline font-extrabold text-[#1A3651] uppercase tracking-wider text-sm md:text-base">Nueva Visita</span>
        </div>
        <button 
          onClick={() => navigate('/admin/asesores')}
          className="bg-[#f4f4f2] text-[#43474d] hover:text-[#1A3651] px-4 py-2 rounded-lg flex items-center gap-2 font-semibold text-sm transition-colors border border-[#e2e3e1]"
        >
          <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
          <span className="hidden sm:inline">Admin</span>
        </button>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-10">
        
        {/* Título de la página */}
        <div className="mb-8 text-center md:text-left">
          <span className="text-[#C5A059] font-headline font-bold tracking-widest uppercase text-xs mb-2 block">Acceso Restringido - Agentes</span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-headline text-[#1A3651] mb-2">Agendar Visita</h1>
          <p className="text-[#43474d] text-lg font-light">Gestión de Clientes</p>
          <p className="text-[#73777e] text-sm mt-4 max-w-xl mx-auto md:mx-0">Complete los detalles a continuación para generar un entorno interactivo y enviarlo directamente a su cliente.</p>
        </div>

        <form onSubmit={handleCrearVisita} className="bg-white p-6 md:p-10 rounded-3xl shadow-lg border border-[#e2e3e1] flex flex-col gap-8 relative border-l-4 border-l-[#1A3651]">
          
          {/* SECCIÓN: CLIENTE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#f4f4f2] p-4 rounded-2xl border border-[#e2e3e1]">
              <label className="block text-[10px] font-extrabold text-[#73777e] uppercase tracking-widest mb-3">Nombre del Cliente</label>
              <div className="flex items-center gap-3 text-[#1A3651]">
                <span className="material-symbols-outlined text-[#73777e]">person</span>
                <input 
                  type="text" 
                  value={nombreCliente} 
                  onChange={(e) => setNombreCliente(e.target.value)} 
                  placeholder="Ej. Arquitecto Carlos Mendoza" 
                  className="w-full bg-transparent outline-none font-medium placeholder:text-[#c3c6ce]" 
                  required 
                />
              </div>
            </div>
            
            <div className="bg-[#f4f4f2] p-4 rounded-2xl border border-[#e2e3e1]">
              <label className="block text-[10px] font-extrabold text-[#73777e] uppercase tracking-widest mb-3">WhatsApp del Cliente</label>
              <div className="flex items-center gap-3 text-[#1A3651]">
                <span className="material-symbols-outlined text-[#25D366]">chat</span>
                <input 
                  type="tel" 
                  value={whatsappCliente} 
                  onChange={(e) => setWhatsappCliente(e.target.value)} 
                  placeholder="+52 55 1234 5678" 
                  className="w-full bg-transparent outline-none font-medium placeholder:text-[#c3c6ce]" 
                  required 
                />
              </div>
            </div>
          </div>

          {/* SECCIÓN: PROPIEDAD Y MAPA */}
          <div className="bg-[#f4f4f2] p-4 rounded-2xl border border-[#e2e3e1]">
            <label className="block text-[10px] font-extrabold text-[#73777e] uppercase tracking-widest mb-3">Ubicación de la Propiedad</label>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1A3651] rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                <span className="material-symbols-outlined text-white text-[20px]">location_on</span>
              </div>
              <input 
                type="text" 
                value={ubicacionPropiedad} 
                onChange={(e) => setUbicacionPropiedad(e.target.value)} 
                placeholder="Buscar propiedad o ingresar dirección..." 
                className="w-full bg-transparent outline-none font-medium text-[#1A3651] placeholder:text-[#c3c6ce]" 
                required 
              />
            </div>
          </div>

          <div className="bg-[#f4f4f2] p-4 rounded-2xl border border-[#e2e3e1]">
            <label className="block text-[10px] font-extrabold text-[#73777e] uppercase tracking-widest mb-3">URL de la Propiedad (Catálogo) / Link de Maps</label>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-[#1A3651]">
                <span className="material-symbols-outlined text-[#73777e]">link</span>
                <input 
                  type="url" 
                  value={urlPropiedad} 
                  onChange={(e) => setUrlPropiedad(e.target.value)} 
                  placeholder="Enlace de la ficha técnica..." 
                  className="w-full bg-transparent outline-none font-medium placeholder:text-[#c3c6ce]" 
                  required 
                />
              </div>
              <div className="h-px w-full bg-[#e2e3e1]"></div>
              <div className="flex items-center gap-3 text-[#1A3651]">
                <span className="material-symbols-outlined text-[#73777e]">map</span>
                <input 
                  type="url" 
                  value={urlGoogleMaps} 
                  onChange={(e) => setUrlGoogleMaps(e.target.value)} 
                  placeholder="Pegue el link de 'Compartir' desde Google Maps..." 
                  className="w-full bg-transparent outline-none font-medium placeholder:text-[#c3c6ce]" 
                  required 
                />
              </div>
            </div>
          </div>

          {/* SECCIÓN: FECHA Y HORA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#f4f4f2] p-4 rounded-2xl border border-[#e2e3e1]">
              <label className="block text-[10px] font-extrabold text-[#73777e] uppercase tracking-widest mb-3">Fecha de Visita</label>
              <div className="flex items-center gap-3 text-[#1A3651]">
                <span className="material-symbols-outlined text-[#73777e]">calendar_today</span>
                <input 
                  type="date" 
                  value={fechaVisita} 
                  onChange={(e) => setFechaVisita(e.target.value)} 
                  className="w-full bg-transparent outline-none font-medium" 
                  required 
                />
              </div>
            </div>
            
            <div className="bg-[#f4f4f2] p-4 rounded-2xl border border-[#e2e3e1]">
              <label className="block text-[10px] font-extrabold text-[#73777e] uppercase tracking-widest mb-3">Hora</label>
              <div className="flex items-center gap-3 text-[#1A3651]">
                <span className="material-symbols-outlined text-[#73777e]">schedule</span>
                <input 
                  type="time" 
                  value={horaVisita} 
                  onChange={(e) => setHoraVisita(e.target.value)} 
                  className="w-full bg-transparent outline-none font-medium" 
                  required 
                />
              </div>
            </div>
          </div>

          {/* SECCIÓN: DATOS DEL ASESOR */}
          <div className="mt-4">
            <span className="text-[#C5A059] font-headline font-bold tracking-widest uppercase text-xs mb-4 block">Datos del Asesor</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#f4f4f2] p-4 rounded-2xl border border-[#e2e3e1]">
                <label className="block text-[10px] font-extrabold text-[#73777e] uppercase tracking-widest mb-3">Nombre del Asesor</label>
                <div className="flex items-center gap-3 text-[#1A3651]">
                  <span className="material-symbols-outlined text-[#73777e]">badge</span>
                  <input 
                    type="text" 
                    value={nombreAsesor} 
                    onChange={(e) => setNombreAsesor(e.target.value)} 
                    placeholder="Ej. Juan Pérez" 
                    className="w-full bg-transparent outline-none font-medium placeholder:text-[#c3c6ce]" 
                    required 
                  />
                </div>
              </div>
              
              <div className="bg-[#f4f4f2] p-4 rounded-2xl border border-[#e2e3e1]">
                <label className="block text-[10px] font-extrabold text-[#73777e] uppercase tracking-widest mb-3">WhatsApp del Asesor</label>
                <div className="flex items-center gap-3 text-[#1A3651]">
                  <span className="material-symbols-outlined text-[#25D366]">chat</span>
                  <input 
                    type="tel" 
                    value={whatsappAsesor} 
                    onChange={(e) => setWhatsappAsesor(e.target.value)} 
                    placeholder="Ej. +52 123 456 7890" 
                    className="w-full bg-transparent outline-none font-medium placeholder:text-[#c3c6ce]" 
                    required 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* BOTÓN DE ENVIAR */}
          <div className="flex justify-end mt-4">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full md:w-auto bg-[#C5A059] hover:bg-[#b08d4a] text-white font-headline font-bold px-10 py-4 rounded-xl transition-all shadow-lg active:scale-95 flex justify-center items-center gap-3 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="material-symbols-outlined animate-spin">refresh</span>
              ) : (
                <>
                  <span>Crear Entorno y Continuar</span>
                  <span className="material-symbols-outlined text-[20px]">send</span>
                </>
              )}
            </button>
          </div>

        </form>
      </main>
    </div>
  );
};