import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// 1. Importaciones del Flujo Administrativo (Asesores)
import { AccesoAdmin } from './screens/AccesoAdmin';     // Pantalla de Login
import { AgendarVisita } from './screens/AgendarVisita'; // Formulario de captura
import { AdminAsesores } from './screens/AdminAsesores'; // Panel que acabamos de crear

// 2. Importaciones del Flujo del Cliente
import { Bienvenida } from './screens/Bienvenida';
import { Dashboard } from './screens/Dashboard';
import { IniciarVisita } from './screens/IniciarVisita';
import { AnalisisZona } from './screens/AnalisisZona';
import { CalculadoraHipotecaria } from './screens/CalculadoraHipotecaria';
import { CalculadoraPlusvalia } from './screens/CalculadoraPlusvalia';
import { GaleriaVisita } from './screens/GaleriaVisita';
import { DisenoIA } from './screens/DisenoIA';
import { SwipePareja } from './screens/SwipePareja';
import { MisDeseos } from './screens/MisDeseos';
import { CatalogoPropiedades } from './screens/CatalogoPropiedades';
import { MatrizComparativa } from './screens/MatrizComparativa';

export default function App() {
  return (
    <AppProvider>
      <Routes>
        {/* =========================================
            RUTAS ADMINISTRATIVAS (SIN ID DE VISITA) 
           ========================================= */}
        {/* La ruta principal ahora es el Login */}
        <Route path="/" element={<AccesoAdmin />} />
        
        {/* Pantalla donde el asesor llena los datos del cliente */}
        <Route path="/agendar" element={<AgendarVisita />} />
        
        {/* Panel de administración de usuarios */}
        <Route path="/admin/asesores" element={<AdminAsesores />} />


        {/* =========================================
            RUTAS DEL CLIENTE (REQUIEREN ID DE VISITA) 
           ========================================= */}
           <Route path="/bienvenida/:idVisita" element={<Bienvenida />} />
        <Route path="/dashboard/:idVisita" element={<Dashboard />} />
        <Route path="/iniciar-visita/:idVisita" element={<IniciarVisita />} />
        <Route path="/analisis/:idVisita" element={<AnalisisZona />} />
        <Route path="/calculadora/:idVisita" element={<CalculadoraHipotecaria />} />
        <Route path="/plusvalia/:idVisita" element={<CalculadoraPlusvalia />} />
        <Route path="/galeria/:idVisita" element={<GaleriaVisita />} />
      <Route path="/diseno-ia/:idVisita" element={<DisenoIA />} />
        <Route path="/swipe/:idVisita" element={<SwipePareja />} />
      <Route path="/mis-deseos/:idVisita" element={<MisDeseos />} />
        <Route path="/catalogo/:idVisita" element={<CatalogoPropiedades />} />
        <Route path="/matriz/:idVisita" element={<MatrizComparativa />} />

        {/* Comodín: Si la ruta no existe, regresa al Login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppProvider>
  );
}