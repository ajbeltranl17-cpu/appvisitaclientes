import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { BrandLogo } from '../components/BrandLogo';

interface Asesor {
  id: string;
  nombre: string;
  telefono: string;
  fotoUrl: string;
}

export const AdminAsesores = () => {
  const navigate = useNavigate();
  const [asesores, setAsesores] = useState<Asesor[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para el formulario de nuevo asesor
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoTelefono, setNuevoTelefono] = useState('');
  const [nuevaFoto, setNuevaFoto] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Leer los asesores desde Firebase
  const fetchAsesores = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'asesores'));
      const asesoresData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Asesor[];
      setAsesores(asesoresData);
    } catch (error) {
      console.error("Error al cargar asesores:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAsesores();
  }, []);

  // Agregar un nuevo asesor a Firebase
  const handleAgregarAsesor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoNombre || !nuevoTelefono) return alert("Nombre y teléfono son obligatorios");
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'asesores'), {
        nombre: nuevoNombre,
        telefono: nuevoTelefono.replace(/\D/g, ''), 
        fotoUrl: nuevaFoto || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80'
      });
      
      setNuevoNombre('');
      setNuevoTelefono('');
      setNuevaFoto('');
      fetchAsesores();
    } catch (error) {
      console.error("Error al agregar asesor:", error);
      alert("Hubo un error al guardar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Eliminar un asesor de Firebase
  const handleEliminarAsesor = async (id: string, nombre: string) => {
    if (!window.confirm(`¿Estás seguro de que deseas dar de baja a ${nombre}?`)) return;
    
    try {
      await deleteDoc(doc(db, 'asesores', id));
      fetchAsesores();
    } catch (error) {
      console.error("Error al eliminar asesor:", error);
      alert("Hubo un error al eliminar.");
    }
  };

  return (
    <div className="bg-[#f4f4f2] min-h-screen text-[#1a1c1b] font-body flex">
      
      {/* Sidebar de Administración (Izquierda) */}
      <aside className="w-64 bg-[#1A3651] text-white hidden md:flex flex-col shadow-2xl z-20 fixed h-full">
        <div className="p-6 flex flex-col items-center border-b border-white/10">
          <BrandLogo className="h-12 w-auto mb-3" />
          <span className="font-headline font-bold text-sm tracking-widest uppercase text-[#C5A059]">Admin Panel</span>
        </div>
        <nav className="flex-1 py-6 px-3 flex flex-col gap-2">
          
          {/* Botón para agendar visita desde el menú lateral */}
          <button 
            onClick={() => navigate('/')} // Ajusta esta ruta si tu pantalla de inicio/agendar es diferente
            className="flex items-center gap-3 px-4 py-3 bg-[#C5A059] text-white hover:bg-[#b08d4a] rounded-lg font-bold transition-colors mb-4 shadow-md"
          >
            <span className="material-symbols-outlined">add_circle</span>
            Agendar Visita
          </button>

          <button className="flex items-center gap-3 px-4 py-3 bg-white/10 rounded-lg text-white font-semibold transition-colors">
            <span className="material-symbols-outlined text-[#C5A059]">badge</span>
            Gestión de Asesores
          </button>
          <button className="flex items-center gap-3 px-4 py-3 text-white/60 hover:bg-white/5 hover:text-white rounded-lg font-semibold transition-colors">
            <span className="material-symbols-outlined">real_estate_agent</span>
            Catálogo Web
          </button>
          <button className="flex items-center gap-3 px-4 py-3 text-white/60 hover:bg-white/5 hover:text-white rounded-lg font-semibold transition-colors">
            <span className="material-symbols-outlined">analytics</span>
            Métricas
          </button>
        </nav>
        <div className="p-6 border-t border-white/10">
          <button className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
            <span className="material-symbols-outlined">logout</span> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 p-6 md:p-12">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-headline text-[#1A3651] mb-2">Gestión de Asesores</h1>
            <p className="text-[#43474d] text-lg">Da de alta, actualiza o elimina los accesos de tu equipo de ventas.</p>
          </div>
          
          {/* Botón de Acción Principal para el Administrador */}
          <button 
            onClick={() => navigate('/')} // Ajusta esta ruta si tu pantalla de inicio/agendar es diferente
            className="bg-[#1A3651] hover:bg-[#2e4965] text-white px-6 py-3 rounded-xl font-headline font-bold flex items-center gap-2 transition-all shadow-md active:scale-95"
          >
            <span className="material-symbols-outlined">add_circle</span>
            Nueva Visita (Atención Directa)
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Formulario de Alta (Columna Izquierda) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-[#e2e3e1] p-6 sticky top-10">
              <h2 className="font-headline text-xl font-bold text-[#1A3651] mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#C5A059]">person_add</span>
                Alta de Asesor
              </h2>
              
              <form onSubmit={handleAgregarAsesor} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#73777e] uppercase tracking-wider mb-2">Nombre Completo</label>
                  <input 
                    type="text" 
                    value={nuevoNombre}
                    onChange={(e) => setNuevoNombre(e.target.value)}
                    placeholder="Ej. Rodrigo Martínez"
                    className="w-full px-4 py-3 bg-[#f4f4f2] border border-[#c3c6ce] rounded-xl focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-[#73777e] uppercase tracking-wider mb-2">WhatsApp (con código de país)</label>
                  <input 
                    type="text" 
                    value={nuevoTelefono}
                    onChange={(e) => setNuevoTelefono(e.target.value)}
                    placeholder="Ej. 522291234567"
                    className="w-full px-4 py-3 bg-[#f4f4f2] border border-[#c3c6ce] rounded-xl focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#73777e] uppercase tracking-wider mb-2">URL de Fotografía (Opcional)</label>
                  <input 
                    type="url" 
                    value={nuevaFoto}
                    onChange={(e) => setNuevaFoto(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-4 py-3 bg-[#f4f4f2] border border-[#c3c6ce] rounded-xl focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="mt-4 w-full bg-[#C5A059] hover:bg-[#b08d4a] text-white font-bold py-3 rounded-xl transition-all shadow-md flex justify-center items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="material-symbols-outlined animate-spin">refresh</span>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">save</span> Guardar Asesor
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Lista de Asesores Activos (Columna Derecha) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-[#e2e3e1] overflow-hidden">
              <div className="p-6 border-b border-[#e2e3e1] flex justify-between items-center bg-[#f9f9f7]">
                <h2 className="font-headline text-xl font-bold text-[#1A3651] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#C5A059]">group</span>
                  Asesores Activos
                </h2>
                <span className="bg-[#1A3651] text-white text-xs font-bold px-3 py-1 rounded-full">{asesores.length} Equipo</span>
              </div>

              {loading ? (
                <div className="p-12 flex justify-center">
                  <div className="w-10 h-10 border-4 border-[#1A3651]/20 border-t-[#C5A059] rounded-full animate-spin"></div>
                </div>
              ) : asesores.length === 0 ? (
                <div className="p-12 text-center text-[#73777e]">
                  <span className="material-symbols-outlined text-4xl mb-2 opacity-50">group_off</span>
                  <p>No hay asesores registrados aún.</p>
                </div>
              ) : (
                <div className="divide-y divide-[#e2e3e1]">
                  {asesores.map((asesor) => (
                    <div key={asesor.id} className="p-6 flex items-center justify-between hover:bg-[#f4f4f2] transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#e2e3e1]">
                          <img src={asesor.fotoUrl} alt={asesor.nombre} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h3 className="font-headline font-bold text-lg text-[#1A3651]">{asesor.nombre}</h3>
                          <div className="flex items-center gap-1 text-sm text-[#43474d] mt-1">
                            <span className="material-symbols-outlined text-[16px] text-[#25D366]">chat</span>
                            +{asesor.telefono}
                          </div>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => handleEliminarAsesor(asesor.id, asesor.nombre)}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-[#ba1a1a] hover:bg-[#ffdad6] transition-colors opacity-0 group-hover:opacity-100"
                        title="Dar de baja"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};