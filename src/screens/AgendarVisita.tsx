import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { EncabezadoGlobal } from '../components/EncabezadoGlobal';

export const AgendarVisita = () => {
  const navigate = useNavigate();

  const isAdmin = localStorage.getItem('userRole')?.toLowerCase() === 'admin';

  const [clienteNombre, setClienteNombre] = useState('');
  const [clienteWhatsapp, setClienteWhatsapp] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [propiedadUrl, setPropiedadUrl] = useState('');
  const [mapsUrl, setMapsUrl] = useState('');
  const [fechaVisita, setFechaVisita] = useState('');
  const [horaVisita, setHoraVisita] = useState('');
  const [asesorNombre, setAsesorNombre] = useState(localStorage.getItem('userName') || '');
  const [asesorWhatsapp, setAsesorWhatsapp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const iconoWhatsApp = (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#25D366]">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
    </svg>
  );

  const handleCrearVisita = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clienteNombre || !clienteWhatsapp || !propiedadUrl) {
      alert("Por favor completa al menos el nombre, WhatsApp del cliente y la URL de la propiedad.");
      return;
    }

    setIsSubmitting(true);

    try {
      const docRef = await addDoc(collection(db, 'visitas'), {
        clienteNombre,
        clienteWhatsapp,
        ubicacion,
        propiedadUrl,
        mapsUrl,
        fechaVisita,
        horaVisita,
        asesorNombre,
        asesorWhatsapp,
        estado: 'pendiente',
        fechaCreacion: serverTimestamp()
      });

      // El navegador ESPERARÁ a que Vercel termine antes de abrir WhatsApp
      await fetch('/api/procesar-visita', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitaId: docRef.id,
          propiedadUrl: propiedadUrl,
          mapsUrl: mapsUrl,
          ubicacionTexto: ubicacion
        })
      });

      // B. Construimos la URL mágica (Asegurado de que solo esté 1 vez)
      const linkInvitacion = `${window.location.origin}/bienvenida/${docRef.id}`;
      
      const numeroLimpio = clienteWhatsapp.replace(/\D/g, '');
      const mensaje = `¡Hola ${clienteNombre}! Soy ${asesorNombre}. He preparado una experiencia digital exclusiva para nuestra próxima visita. Puedes ver los detalles de la propiedad y confirmar tu asistencia aquí: ${linkInvitacion}`;
      
      window.open(`https://wa.me/${numeroLimpio}?text=${encodeURIComponent(mensaje)}`, '_blank');

      setClienteNombre('');
      setClienteWhatsapp('');
      setPropiedadUrl('');
      setMapsUrl('');
      setUbicacion('');
      setFechaVisita('');
      setHoraVisita('');

    } catch (error) {
      console.error("Error al crear la visita:", error);
      alert("Hubo un error de conexión al generar la invitación. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <EncabezadoGlobal />
      <main className="max-w-3xl mx-auto p-4 sm:p-8">
        
        <div className="mb-8 flex justify-between items-start">
          <div>
            <span className="text-[#C5A059] uppercase font-bold text-xs tracking-widest">
              Acceso Restringido - Agentes
            </span>
            <h1 className="text-3xl font-black text-[#00213b] mt-1 mb-2">Agendar Visita</h1>
            <p className="text-gray-500 text-sm">
              Gestión de Clientes<br/><br/>
              Complete los detalles a continuación para generar un entorno interactivo y enviarlo directamente a su cliente.
            </p>
          </div>
          
          {isAdmin && (
            <button 
              onClick={() => navigate('/admin/asesores')}
              className="bg-[#00213b] text-[#C5A059] px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#00182b] transition-colors shadow-sm"
            >
              Panel Administrador
            </button>
          )}
        </div>

        <form onSubmit={handleCrearVisita} className="bg-white rounded-3xl shadow-sm border border-gray-100 border-l-8 border-l-[#00213b] p-6 sm:p-8">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Nombre del Cliente</label>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-gray-400">person</span>
                <input 
                  type="text" 
                  required
                  value={clienteNombre}
                  onChange={(e) => setClienteNombre(e.target.value)}
                  placeholder="Ej. Arquitecto Carlos Mendoza" 
                  className="bg-transparent w-full text-sm outline-none text-gray-700" 
                />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">WhatsApp del Cliente</label>
              <div className="flex items-center gap-3">
                {iconoWhatsApp}
                <input 
                  type="tel" 
                  required
                  value={clienteWhatsapp}
                  onChange={(e) => setClienteWhatsapp(e.target.value)}
                  placeholder="+52 55 1234 5678" 
                  className="bg-transparent w-full text-sm outline-none text-gray-700" 
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-6">
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Ubicación de la Propiedad</label>
            <div className="flex items-center gap-3">
              <div className="bg-[#00213b] p-2 rounded-full text-white flex-shrink-0">
                <span className="material-symbols-outlined text-sm">location_on</span>
              </div>
              <input 
                type="text" 
                value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)}
                placeholder="Buscar propiedad o ingresar dirección..." 
                className="bg-transparent w-full text-sm outline-none text-gray-700" 
              />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-6 space-y-4">
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">URL de la Propiedad (Catálogo) / Link de Maps</label>
            <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
              <span className="material-symbols-outlined text-gray-400 text-lg">link</span>
              <input 
                type="url" 
                required
                value={propiedadUrl}
                onChange={(e) => setPropiedadUrl(e.target.value)}
                placeholder="Enlace de la ficha técnica..." 
                className="bg-transparent w-full text-sm outline-none text-gray-700" 
              />
            </div>
            <div className="flex items-center gap-3 pt-1">
              <span className="material-symbols-outlined text-gray-400 text-lg">map</span>
              <input 
                type="url" 
                value={mapsUrl}
                onChange={(e) => setMapsUrl(e.target.value)}
                placeholder="Pegue el link de 'Compartir' desde Google Maps..." 
                className="bg-transparent w-full text-sm outline-none text-gray-700" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 border-b border-gray-100 pb-8">
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Fecha de Visita</label>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-gray-400">calendar_today</span>
                <input 
                  type="date" 
                  value={fechaVisita}
                  onChange={(e) => setFechaVisita(e.target.value)}
                  className="bg-transparent w-full text-sm outline-none text-gray-700" 
                />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Hora</label>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-gray-400">schedule</span>
                <input 
                  type="time" 
                  value={horaVisita}
                  onChange={(e) => setHoraVisita(e.target.value)}
                  className="bg-transparent w-full text-sm outline-none text-gray-700" 
                />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-xs font-bold text-[#C5A059] uppercase tracking-wider mb-4">Datos del Asesor</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Nombre del Asesor</label>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-gray-400">badge</span>
                  <input 
                    type="text" 
                    value={asesorNombre}
                    onChange={(e) => setAsesorNombre(e.target.value)}
                    placeholder="Ej. Juan Pérez" 
                    className="bg-transparent w-full text-sm outline-none text-gray-700" 
                  />
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">WhatsApp del Asesor</label>
                <div className="flex items-center gap-3">
                  {iconoWhatsApp}
                  <input 
                    type="tel" 
                    value={asesorWhatsapp}
                    onChange={(e) => setAsesorWhatsapp(e.target.value)}
                    placeholder="Ej. +52 123 456 7890" 
                    className="bg-transparent w-full text-sm outline-none text-gray-700" 
                  />
                </div>
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className={`w-full sm:w-auto float-right bg-[#25D366] text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 group ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#1DA851]'}`}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white group-hover:scale-110 transition-transform">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
            </svg>
            {isSubmitting ? 'Generando...' : 'Enviar Invitación'}
          </button>
          
          <div className="clear-both"></div>
        </form>
      </main>
    </div>
  );
};