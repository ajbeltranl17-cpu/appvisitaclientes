import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { BrandLogo } from '../components/BrandLogo';

export const PanelAsesor: React.FC = () => {
  const [formData, setFormData] = useState({
    nombreCliente: '',
    whatsappCliente: '',
    ubicacionPropiedad: '',
    urlGoogleMaps: '',
    urlPropiedad: '',
    fechaVisita: '',
    horaVisita: '',
    nombreAsesor: '',
    whatsappAsesor: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successLink, setSuccessLink] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSuccessLink(''); // Reiniciamos el enlace si el usuario edita algo nuevo
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const formatearFecha = (fechaOriginal: string) => {
    if (!fechaOriginal) return '';
    const [anio, mes, dia] = fechaOriginal.split('-');
    return `${dia}/${mes}/${anio.slice(2)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessLink('');
    
    try {
      // 1. Guardar en Firestore con la fecha convertida a dd/mm/yy (según solicitud)
      const payloadRefinado = {
        ...formData,
        fechaVisita: formatearFecha(formData.fechaVisita), // Sustituyendo el formato nativo para guardarlo
        fechaVisitaOriginal: formData.fechaVisita // Mantenemos un resguardo del formato system YYYY-MM-DD
      };
      const docRef = await addDoc(collection(db, 'visitas'), payloadRefinado);
      
      // 2. Generar Enlace Mágico
      const magicLink = `https://tuconexioninmobiliaria.com/bienvenida/${docRef.id}`;
      
      // 3. Crear mensaje considerando la fecha formateada
      const fechaFormateada = formatearFecha(formData.fechaVisita);
      const mensaje = `Hola ${formData.nombreCliente}, soy ${formData.nombreAsesor}. Te comparto el acceso exclusivo a nuestro portal de visitas para la propiedad el día ${fechaFormateada} a las ${formData.horaVisita}. Entra aquí: ${magicLink}`;
      
      const numeroLimpio = formData.whatsappCliente.replace(/\D/g, '');
      const whatsappUrl = `https://wa.me/${numeroLimpio}?text=${encodeURIComponent(mensaje)}`;
      
      // Intentamos abrirlo, si bloqueado exponemos el link en UI
      const newWindow = window.open(whatsappUrl, '_blank');
      setSuccessLink(whatsappUrl);
      
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        console.warn('Pop-up bloqueado por el navegador. Exponiendo botón manual.');
      }
      
    } catch (error) {
      console.error("Error al registrar la visita:", error);
      alert("Hubo un error al guardar la visita. Verifique su conexión y la consola para más detalles.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f9f9f7] antialiased min-h-screen flex selection:bg-[#fed488] selection:text-[#785a1a]">
      {/* Mobile Top Nav */}
      <nav className="md:hidden bg-[#f9f9f7]/80 backdrop-blur-xl fixed top-0 w-full z-50 shadow-sm opacity-90 flex justify-between items-center px-6 h-16 transition-all duration-300">
        <div className="flex items-center gap-2">
          <BrandLogo className="h-10 w-auto rounded-full" />
          <span className="text-sm font-extrabold tracking-widest text-[#1A3651] uppercase">Tu Conexión Inmobiliaria</span>
        </div>
        <div className="flex gap-4">
          <button className="text-[#1A3651] scale-95 duration-200 hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>chat</span>
          </button>
          <button className="text-[#1A3651] scale-95 duration-200 hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>account_circle</span>
          </button>
        </div>
      </nav>

      <main className="flex-1 w-full pt-20 md:pt-0 pb-24 md:pb-0 min-h-screen relative overflow-hidden flex flex-col">
        {/* Background Graphic */}
        <div className="absolute top-0 right-0 w-3/4 h-[500px] bg-gradient-to-bl from-[#e8e8e6]/50 to-transparent -z-10 rounded-bl-[120px]"></div>
        
        <div className="max-w-4xl w-full mx-auto p-6 md:p-12 lg:p-16 flex-1 flex flex-col justify-center">
          <header className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#f4f4f2] rounded-full mb-4">
              <span className="material-symbols-outlined text-[#C5A059] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#43474d]">Acceso Restringido - Agentes</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#1A3651] mb-3 leading-tight tracking-tight">
              Agendar Visita<br/>
              <span className="text-[#43474d] font-light opacity-80 text-3xl">Gestión de Clientes</span>
            </h1>
            <p className="text-sm text-[#43474d] max-w-lg mt-2 leading-relaxed">
              Complete los detalles a continuación para generar una invitación formal y enviarla directamente a su cliente a través de WhatsApp.
            </p>
          </header>

          <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_12px_32px_-8px_rgba(26,28,27,0.06)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#1A3651] to-[#C5A059]"></div>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              
              <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Nombre de Cliente */}
                <div className="bg-[#f4f4f2]/50 p-5 rounded-2xl transition-colors focus-within:bg-[#f4f4f2]">
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-[#1A3651]/70 mb-2">Nombre del Cliente</label>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#73777e]">person</span>
                    <input 
                      name="nombreCliente"
                      value={formData.nombreCliente}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent border-0 border-b border-[#c3c6ce]/20 focus:border-[#C5A059] outline-none focus:ring-0 px-0 py-2 text-[#1a1c1b] font-medium placeholder:text-[#c3c6ce]/60 transition-colors" 
                      placeholder="Ej. Arquitecto Carlos Mendoza" 
                      type="text"
                    />
                  </div>
                </div>

                {/* WhatsApp del Cliente */}
                <div className="bg-[#f4f4f2]/50 p-5 rounded-2xl transition-colors focus-within:bg-[#f4f4f2] relative overflow-hidden">
                  <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[100px] text-[#C5A059]/5 pointer-events-none" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-[#1A3651]/70 mb-2">WhatsApp del Cliente</label>
                  <div className="flex items-center gap-3 relative z-10">
                    <span className="material-symbols-outlined text-[#25D366]">chat</span>
                    <input 
                      name="whatsappCliente"
                      value={formData.whatsappCliente}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent border-0 border-b border-[#c3c6ce]/20 focus:border-[#C5A059] outline-none focus:ring-0 px-0 py-2 text-[#1a1c1b] font-medium placeholder:text-[#c3c6ce]/60 transition-colors" 
                      placeholder="+52 55 1234 5678" 
                      type="tel"
                    />
                  </div>
                </div>
              </div>

              {/* Ubicación Propiedad */}
              <div className="col-span-1 md:col-span-2">
                <div className="bg-white p-6 rounded-[1.5rem] relative group border border-[#e2e3e1]/50">
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-[#1A3651]/70 mb-4">Ubicación de la Propiedad</label>
                  <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                    <div className="w-16 h-16 rounded-full bg-[#1A3651] flex items-center justify-center shrink-0 shadow-lg shadow-[#1A3651]/20">
                      <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                    </div>
                    <div className="flex-1 w-full">
                      <input 
                        name="ubicacionPropiedad"
                        value={formData.ubicacionPropiedad}
                        onChange={handleChange}
                        required
                        className="w-full bg-transparent border-0 border-b-2 border-[#c3c6ce]/20 focus:border-[#1A3651] outline-none focus:ring-0 px-2 py-3 text-lg font-semibold text-[#1A3651] placeholder:text-[#c3c6ce]/60 transition-colors" 
                        placeholder="Buscar propiedad o ingresar dirección..." 
                        type="text"
                      />
                    </div>
                    <button 
                      onClick={() => window.open('https://www.google.com/maps', '_blank')}
                      className="mt-2 md:mt-0 px-4 py-2 bg-[#e2e3e1] text-[#1A3651] text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-[#c3c6ce]/20 transition-colors whitespace-nowrap" 
                      type="button"
                    >
                      Ver Mapa
                    </button>
                  </div>
                </div>
              </div>

              {/* URL de la Propiedad */}
              <div className="col-span-1 md:col-span-2">
                <div className="bg-[#f4f4f2]/50 p-5 rounded-2xl transition-colors focus-within:bg-[#f4f4f2]">
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-[#1A3651]/70 mb-2">URL de la Propiedad (Sitio Web/Listing)</label>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#73777e]">link</span>
                    <input 
                      name="urlPropiedad"
                      value={formData.urlPropiedad}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent border-0 border-b border-[#c3c6ce]/20 focus:border-[#C5A059] outline-none focus:ring-0 px-0 py-2 text-[#1a1c1b] font-medium placeholder:text-[#c3c6ce]/60 transition-colors" 
                      placeholder="Ej. https://tuconexion.com/propiedad/123" 
                      type="url"
                    />
                  </div>
                </div>
              </div>

              {/* Enlace de Google Maps - INSTRUCCIÓN OBLIGATORIA */}
              <div className="col-span-1 md:col-span-2">
                <div className="bg-[#f4f4f2]/50 p-5 rounded-2xl transition-colors focus-within:bg-[#f4f4f2]">
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-[#1A3651]/70 mb-2">Enlace de Google Maps</label>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#73777e]">map</span>
                    <input 
                      name="urlGoogleMaps"
                      value={formData.urlGoogleMaps}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent border-0 border-b border-[#c3c6ce]/20 focus:border-[#C5A059] outline-none focus:ring-0 px-0 py-2 text-[#1a1c1b] font-medium placeholder:text-[#c3c6ce]/60 transition-colors" 
                      placeholder="Ej. https://maps.app.goo.gl/..." 
                      type="url"
                    />
                  </div>
                </div>
              </div>

              {/* Fecha Visita */}
              <div className="bg-[#f4f4f2]/50 p-5 rounded-2xl transition-colors focus-within:bg-[#f4f4f2]">
                <label className="block text-[11px] font-bold uppercase tracking-widest text-[#1A3651]/70 mb-2">Fecha de Visita</label>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#73777e]">calendar_today</span>
                  <input 
                    name="fechaVisita"
                    value={formData.fechaVisita}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent border-0 border-b border-[#c3c6ce]/20 focus:border-[#C5A059] outline-none focus:ring-0 px-0 py-2 text-[#1a1c1b] font-medium text-sm transition-colors cursor-pointer" 
                    type="date"
                  />
                </div>
              </div>

              {/* Hora Visita */}
              <div className="bg-[#f4f4f2]/50 p-5 rounded-2xl transition-colors focus-within:bg-[#f4f4f2]">
                <label className="block text-[11px] font-bold uppercase tracking-widest text-[#1A3651]/70 mb-2">Hora</label>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#73777e]">schedule</span>
                  <input 
                    name="horaVisita"
                    value={formData.horaVisita}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent border-0 border-b border-[#c3c6ce]/20 focus:border-[#C5A059] outline-none focus:ring-0 px-0 py-2 text-[#1a1c1b] font-medium text-sm transition-colors cursor-pointer" 
                    type="time"
                  />
                </div>
              </div>

              {/* Datos del Asesor */}
              <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                <div className="col-span-1 md:col-span-2">
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#1A3651]/70 mb-0">Datos del Asesor</h3>
                </div>
                
                <div className="bg-[#f4f4f2]/50 p-5 rounded-2xl transition-colors focus-within:bg-[#f4f4f2]">
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-[#1A3651]/70 mb-2">Nombre del Asesor</label>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#73777e]">person</span>
                    <input 
                      name="nombreAsesor"
                      value={formData.nombreAsesor}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent border-0 border-b border-[#c3c6ce]/20 focus:border-[#C5A059] outline-none focus:ring-0 px-0 py-2 text-[#1a1c1b] font-medium placeholder:text-[#c3c6ce]/60 transition-colors" 
                      placeholder="Ej. Juan Pérez" 
                      type="text"
                    />
                  </div>
                </div>

                <div className="bg-[#f4f4f2]/50 p-5 rounded-2xl transition-colors focus-within:bg-[#f4f4f2]">
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-[#1A3651]/70 mb-2">WhatsApp del Asesor</label>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#25D366]">chat</span>
                    <input 
                      name="whatsappAsesor"
                      value={formData.whatsappAsesor}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent border-0 border-b border-[#c3c6ce]/20 focus:border-[#C5A059] outline-none focus:ring-0 px-0 py-2 text-[#1a1c1b] font-medium placeholder:text-[#c3c6ce]/60 transition-colors" 
                      placeholder="Ej. +52 123 456 7890" 
                      type="tel"
                    />
                  </div>
                </div>
              </div>

              {/* Botón de Envío */}
              <div className="col-span-1 md:col-span-2 mt-6 flex flex-col md:flex-row justify-end items-center gap-4">
                {successLink ? (
                  <div className="flex flex-col items-end w-full md:w-auto animate-in fade-in zoom-in duration-500">
                     <p className="text-[#25D366] text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      Visita Creada
                    </p>
                    <a 
                      href={successLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        setFormData({
                          nombreCliente: '', whatsappCliente: '', ubicacionPropiedad: '', urlGoogleMaps: '', urlPropiedad: '', fechaVisita: '', horaVisita: '', nombreAsesor: '', whatsappAsesor: ''
                        });
                        setSuccessLink('');
                      }}
                      className="group relative bg-[#25D366] text-white font-bold text-sm tracking-wide px-8 py-5 rounded-2xl shadow-[0_12px_24px_-8px_rgba(37,211,102,0.5)] hover:shadow-[0_16px_32px_-8px_rgba(37,211,102,0.6)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden w-full md:w-auto cursor-pointer"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="relative z-10">Abrir WhatsApp Directo</span>
                      <span className="material-symbols-outlined relative z-10" style={{ fontVariationSettings: "'FILL' 1" }}>open_in_new</span>
                    </a>
                  </div>
                ) : (
                  <button 
                    disabled={isSubmitting}
                    className="group relative bg-[#C5A059] text-white font-bold text-sm tracking-wide px-8 py-5 rounded-2xl shadow-[0_12px_24px_-8px_rgba(197,160,89,0.5)] hover:shadow-[0_16px_32px_-8px_rgba(197,160,89,0.6)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden w-full md:w-auto disabled:opacity-70 disabled:cursor-not-allowed" 
                    type="submit"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10">{isSubmitting ? 'Generando Enlace...' : 'Enviar Invitación por WhatsApp'}</span>
                    {!isSubmitting && <span className="material-symbols-outlined relative z-10 group-hover:translate-x-1 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>}
                  </button>
                )}
              </div>

            </form>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 h-20 pb-safe bg-white/90 backdrop-blur-md rounded-t-3xl shadow-[0_-4px_24px_rgba(26,54,81,0.06)] text-[11px] font-semibold uppercase tracking-widest">
        <a className="flex flex-col items-center justify-center text-[#1A3651]/50 hover:text-[#C5A059] active:scale-90 transition-all gap-1 w-16" href="#!">
          <span className="material-symbols-outlined text-[24px]">home</span>
          <span className="text-[9px] mt-1">Inicio</span>
        </a>
        <a className="flex flex-col items-center justify-center text-[#1A3651]/50 hover:text-[#C5A059] active:scale-90 transition-all gap-1 w-16" href="#!">
          <span className="material-symbols-outlined text-[24px]">bookmarks</span>
          <span className="text-[9px] mt-1">Deseos</span>
        </a>
        <a className="flex flex-col items-center justify-center text-[#1A3651]/50 hover:text-[#C5A059] active:scale-90 transition-all gap-1 w-16 relative" href="#!">
          <div className="absolute top-0 right-2 w-2 h-2 bg-[#ba1a1a] rounded-full"></div>
          <span className="material-symbols-outlined text-[24px]">chat_bubble</span>
          <span className="text-[9px] mt-1">WhatsApp</span>
        </a>
        <a className="flex flex-col items-center justify-center text-[#C5A059] scale-110 active:scale-90 transition-all gap-1 w-16 relative" href="#!">
          <div className="absolute -bottom-2 w-1 h-1 bg-[#C5A059] rounded-full"></div>
          <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
          <span className="text-[9px] mt-1">Perfil</span>
        </a>
      </nav>
    </div>
  );
};
