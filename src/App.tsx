import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// Importamos al Guardia de Seguridad
import { RutaProtegida } from './components/RutaProtegida';

// 1. Importaciones del Flujo Administrativo (Asesores)
import { AccesoAdmin } from './screens/AccesoAdmin';     // Pantalla de Login General
import { AgendarVisita } from './screens/AgendarVisita'; // Formulario de captura
import { AdminAsesores } from './screens/AdminAsesores'; // Panel de control de asesores

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
        {/* Pantalla principal de inicio de sesión */}
        <Route path="/" element={<AccesoAdmin />} />
        
        {/* Pantalla donde se registran clientes (Protegida para cualquiera que inicie sesión) */}
        <Route 
          path="/agendar" 
          element={
            <RutaProtegida>
              <AgendarVisita />
            </RutaProtegida>
          } 
        />
        
        {/* Panel de administración (Protegida EXCLUSIVAMENTE para el Admin) */}
        <Route 
          path="/admin/asesores" 
          element={
            <RutaProtegida requireAdmin={true}>
              <AdminAsesores />
            </RutaProtegida>
          } 
        />


        {/* =========================================
            RUTAS DEL CLIENTE (REQUIEREN ID DE VISITA) 
           ========================================= */}
        {/* Estas rutas quedan libres para que el cliente acceda con su ID */}
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