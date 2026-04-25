import React from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import { useAppContext } from '../context/AppContext';
import { BrandLogo } from './BrandLogo';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { idVisita } = useParams<{ idVisita: string }>();
  const { navigate: contextNavigate } = useAppContext();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      contextNavigate('LOGIN');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const isActive = (path: string) => location.pathname.includes(path);

  return (
    <>
      {/* Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-[#1a3651]/50 backdrop-blur-sm z-[60] transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Drawer */}
      <div className={`fixed top-0 left-0 h-full w-[80%] max-w-sm bg-white dark:bg-slate-900 shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#e2e3e1] dark:border-slate-800 bg-[#f9f9f7] dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <BrandLogo className="w-10 h-10 object-contain" />
            <span className="font-headline font-extrabold text-[#1a3651] dark:text-white uppercase tracking-tight text-sm">Tu Conexión Inmobiliaria</span>
          </div>
          <button onClick={onClose} className="text-[#43474d] hover:text-[#ba1a1a] p-1 active:scale-95 transition-transform">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Sidebar Links */}
        <div className="flex-grow flex flex-col py-4 overflow-y-auto">
          {/* General Links */}
          <Link to="/" onClick={onClose} className={`flex items-center gap-4 px-6 py-4 hover:bg-[#f4f4f2] hover:text-[#c5a059] dark:hover:bg-slate-800 transition-colors ${location.pathname === '/' ? 'bg-[#f4f4f2] border-r-4 border-[#c5a059] text-[#c5a059]' : 'text-[#1a3651] dark:text-white'}`}>
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-headline font-bold tracking-wide">Panel Principal</span>
          </Link>
          
          <Link to="/catalogo" onClick={onClose} className={`flex items-center gap-4 px-6 py-4 hover:bg-[#f4f4f2] hover:text-[#c5a059] dark:hover:bg-slate-800 transition-colors ${isActive('/catalogo') ? 'bg-[#f4f4f2] border-r-4 border-[#c5a059] text-[#c5a059]' : 'text-[#1a3651] dark:text-white'}`}>
            <span className="material-symbols-outlined">home_work</span>
            <span className="font-headline font-bold tracking-wide">Catálogo de Propiedades</span>
          </Link>
          
          <Link to="/deseos" onClick={onClose} className={`flex items-center gap-4 px-6 py-4 hover:bg-[#f4f4f2] hover:text-[#c5a059] dark:hover:bg-slate-800 transition-colors ${isActive('/deseos') ? 'bg-[#f4f4f2] border-r-4 border-[#c5a059] text-[#c5a059]' : 'text-[#1a3651] dark:text-white'}`}>
            <span className="material-symbols-outlined">favorite</span>
            <span className="font-headline font-bold tracking-wide">Mis Deseos</span>
          </Link>

          {/* Tools Links (Only visible if there is an idVisita) */}
          {idVisita && (
            <div className="mt-4 pt-4 border-t border-[#e2e3e1] dark:border-slate-800">
              <h3 className="px-6 mb-2 font-body text-xs uppercase tracking-widest text-[#73777e] font-semibold">Herramientas de esta propiedad</h3>
              
              <Link to={`/iniciar-visita/${idVisita}`} onClick={onClose} className={`flex items-center gap-4 px-6 py-4 hover:bg-[#f4f4f2] hover:text-[#c5a059] dark:hover:bg-slate-800 transition-colors ${isActive('/iniciar-visita') ? 'bg-[#f4f4f2] border-r-4 border-[#c5a059] text-[#c5a059]' : 'text-[#1a3651] dark:text-white'}`}>
                <span className="material-symbols-outlined">photo_camera</span>
                <span className="font-headline font-bold tracking-wide">Modo Visita / Fotos</span>
              </Link>
              
              <Link to={`/analisis/${idVisita}`} onClick={onClose} className={`flex items-center gap-4 px-6 py-4 hover:bg-[#f4f4f2] hover:text-[#c5a059] dark:hover:bg-slate-800 transition-colors ${isActive('/analisis') ? 'bg-[#f4f4f2] border-r-4 border-[#c5a059] text-[#c5a059]' : 'text-[#1a3651] dark:text-white'}`}>
                <span className="material-symbols-outlined">map</span>
                <span className="font-headline font-bold tracking-wide">Análisis de Zona</span>
              </Link>
              
              <Link to={`/calculadora/${idVisita}`} onClick={onClose} className={`flex items-center gap-4 px-6 py-4 hover:bg-[#f4f4f2] hover:text-[#c5a059] dark:hover:bg-slate-800 transition-colors ${isActive('/calculadora') ? 'bg-[#f4f4f2] border-r-4 border-[#c5a059] text-[#c5a059]' : 'text-[#1a3651] dark:text-white'}`}>
                <span className="material-symbols-outlined">calculate</span>
                <span className="font-headline font-bold tracking-wide">Calculadora Hipotecaria</span>
              </Link>
              
              <Link to={`/plusvalia/${idVisita}`} onClick={onClose} className={`flex items-center gap-4 px-6 py-4 hover:bg-[#f4f4f2] hover:text-[#c5a059] dark:hover:bg-slate-800 transition-colors ${isActive('/plusvalia') ? 'bg-[#f4f4f2] border-r-4 border-[#c5a059] text-[#c5a059]' : 'text-[#1a3651] dark:text-white'}`}>
                <span className="material-symbols-outlined">trending_up</span>
                <span className="font-headline font-bold tracking-wide">Calculadora de Plusvalía</span>
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-[#e2e3e1] dark:border-slate-800 bg-[#f9f9f7] dark:bg-slate-900">
          <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full bg-white dark:bg-slate-800 hover:bg-[#f4f4f2] dark:hover:bg-slate-700 text-[#ba1a1a] py-3 rounded-xl font-bold shadow-sm border border-[#e2e3e1] dark:border-slate-700 transition-colors active:scale-95">
            <span className="material-symbols-outlined">logout</span>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </>
  );
};
