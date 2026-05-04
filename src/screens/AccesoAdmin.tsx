import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase'; // Asegúrate de que apunte a tu archivo firebase.ts en src

export const AccesoAdmin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 1. El Guardia de Seguridad (Validar credenciales en Firebase Auth)
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. El Archivero (Buscar el perfil y el rol en Firestore)
      const userDoc = await getDoc(doc(db, 'asesores', user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // Guardamos el rol y nombre temporalmente en el navegador para usarlos después
        localStorage.setItem('userRole', userData.rol);
        localStorage.setItem('userName', userData.nombre || 'Asesor');

        // 3. Abrir la puerta hacia la ruta correcta en tu App.tsx
        navigate('/agendar'); 
      } else {
        setError('Tu usuario no tiene un perfil asignado en el sistema.');
        await auth.signOut(); // Lo sacamos si no tiene perfil
      }
    } catch (err: any) {
      console.error(err);
      setError('Correo o contraseña incorrectos.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2a3c53] flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-3xl w-full max-w-md p-8 md:p-10 shadow-2xl">
        
        {/* Encabezado */}
        <div className="flex flex-col items-center mb-8">
          <img src="/logo.png" alt="Tu Conexión Inmobiliaria" className="h-16 mb-4" /> {/* Ajusta la ruta de tu logo */}
          <h1 className="text-2xl font-black text-[#1A3651] uppercase tracking-wide">Portal de Asesores</h1>
          <p className="text-[#73777e] text-sm mt-2 text-center">Inicia sesión para gestionar tus visitas y clientes.</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleLogin} className="space-y-6">
          
          {/* Mensaje de Error */}
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center font-medium border border-red-100">
              {error}
            </div>
          )}

          {/* Campo: Correo */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-[#1A3651]/70 mb-2">
              Correo Electrónico
            </label>
            <div className="flex items-center gap-3 bg-[#f4f4f2]/50 p-4 rounded-xl border border-[#c3c6ce]/20 focus-within:border-[#C5A059] transition-colors">
              <span className="material-symbols-outlined text-[#73777e] text-xl">mail</span>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="asesor@tuconexion.com" 
                className="bg-transparent w-full outline-none text-[#1A3651] font-medium placeholder:text-[#c3c6ce]/80 text-sm"
                required
              />
            </div>
          </div>

          {/* Campo: Contraseña */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-[#1A3651]/70 mb-2">
              Contraseña
            </label>
            <div className="flex items-center gap-3 bg-[#f4f4f2]/50 p-4 rounded-xl border border-[#c3c6ce]/20 focus-within:border-[#C5A059] transition-colors">
              <span className="material-symbols-outlined text-[#73777e] text-xl">lock</span>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="bg-transparent w-full outline-none text-[#1A3651] font-medium placeholder:text-[#c3c6ce]/80 text-sm tracking-widest"
                required
              />
            </div>
          </div>

          {/* Botón Ingresar */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#C5A059] hover:bg-[#b08d4b] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#C5A059]/30 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70"
          >
            {isLoading ? 'Verificando...' : 'Ingresar al Sistema'}
            {!isLoading && <span className="material-symbols-outlined text-xl">login</span>}
          </button>

        </form>
      </div>
    </div>
  );
};