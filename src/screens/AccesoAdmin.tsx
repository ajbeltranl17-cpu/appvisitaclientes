import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrandLogo } from '../components/BrandLogo';

export const AccesoAdmin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Por ahora, simulamos un inicio de sesión exitoso y vamos directo a agendar
    navigate('/agendar');
  };

  return (
    <div className="bg-[#1A3651] min-h-screen flex items-center justify-center p-4 font-body relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-b from-white to-transparent blur-3xl"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-t from-[#C5A059] to-transparent blur-3xl"></div>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 md:p-10 relative z-10">
        <div className="flex flex-col items-center mb-10 text-center">
          <BrandLogo className="h-16 w-auto mb-4" />
          <h1 className="font-headline text-2xl font-extrabold text-[#1A3651] tracking-tight uppercase">Portal de Asesores</h1>
          <p className="text-[#43474d] text-sm mt-2">Inicia sesión para gestionar tus visitas y clientes.</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label className="block text-xs font-bold text-[#73777e] uppercase tracking-wider mb-2">Correo Electrónico</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#73777e]">
                <span className="material-symbols-outlined text-[20px]">mail</span>
              </span>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="asesor@tuconexion.com"
                className="w-full pl-11 pr-4 py-3 bg-[#f4f4f2] border border-[#c3c6ce] rounded-xl focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all text-[#1A3651] font-medium"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#73777e] uppercase tracking-wider mb-2">Contraseña</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#73777e]">
                <span className="material-symbols-outlined text-[20px]">lock</span>
              </span>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-[#f4f4f2] border border-[#c3c6ce] rounded-xl focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all text-[#1A3651] font-medium"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="mt-4 w-full bg-[#C5A059] hover:bg-[#b08d4a] text-white font-headline font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95 flex justify-center items-center gap-2"
          >
            <span>Ingresar al Sistema</span>
            <span className="material-symbols-outlined text-[20px]">login</span>
          </button>
        </form>
      </div>
    </div>
  );
};