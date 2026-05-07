import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

if (!getApps().length) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}');
    initializeApp({ credential: cert(serviceAccount) });
  } catch (error) {
    console.error("Error Firebase Admin:", error);
  }
}
const db = getFirestore();

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Método no permitido');

  // Recibimos todos los deseos del cliente
  const { visitaId, presupuestoMin, presupuestoMax, ubicacionTexto, recamaras, banos, estacionamientos } = req.body;
  if (!visitaId) return res.status(400).json({ error: 'Falta el ID' });

  try {
    let propiedadesInyectadas = [];
    const dominioWordPress = 'https://tuconexioninmobiliaria.com'; 
    const wpUrl = `${dominioWordPress}/wp-json/wp/v2/property?per_page=30`; 

    try {
      const wpRes = await fetch(wpUrl);
      
      if (wpRes.ok) {
        const wpData = await wpRes.json();
        
        if (Array.isArray(wpData) && wpData.length > 0) {
          
          const propiedadesMapeadas = wpData.map(prop => {
            const precioRaw = prop.datos_app?.precio_real || prop.houzez_price || prop.meta?.houzez_price || 0;
            const precioLimpio = parseInt(String(precioRaw).replace(/[^0-9]/g, ''), 10) || 0;
            const imagenReal = prop.datos_app?.imagen_real || prop.featured_image_src || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800';

            return {
              id: prop.id?.toString() || Math.random().toString(),
              titulo: prop.title?.rendered || 'Propiedad Inmobiliaria',
              precio: precioLimpio, 
              habitaciones: parseInt(prop.property_bedrooms || prop.meta?.property_bedrooms || prop.fave_property_bedrooms) || 0,
              // Usamos parseFloat porque a veces los baños son 2.5 o 3.5
              banos: parseFloat(prop.property_bathrooms || prop.meta?.property_bathrooms || prop.fave_property_bathrooms) || 0,
              estacionamientos: parseInt(prop.property_garage || prop.meta?.property_garage || prop.fave_property_garage) || 0,
              imagen: imagenReal,
              url: prop.link || dominioWordPress
            };
          });

          // APLICAMOS TODOS LOS FILTROS
          const min = Number(presupuestoMin) || 0;
          const max = Number(presupuestoMax) || 999000000;
          const recamarasDeseadas = Number(recamaras) || 1;
          const banosDeseados = Number(banos) || 1;
          const estacionamientosDeseados = Number(estacionamientos) || 0;
          const ciudadBuscada = (ubicacionTexto || "").toLowerCase().trim();

          propiedadesInyectadas = propiedadesMapeadas.filter(p => {
             // Regla 1: Precio exacto
             const pasaPrecio = p.precio >= min && p.precio <= max;
             
             // Regla 2: Lógica "X o más" para distribución
             const pasaRecamaras = p.habitaciones >= recamarasDeseadas;
             const pasaBanos = p.banos >= banosDeseados;
             const pasaEstacionamientos = p.estacionamientos >= estacionamientosDeseados;

             // Regla 3: Ubicación (Buscamos la ciudad en el título o URL)
             const tituloURL = (p.titulo + " " + p.url).toLowerCase();
             let keyword = ciudadBuscada;
             if (keyword.includes("boca")) keyword = "boca";
             if (keyword.includes("riviera")) keyword = "riviera";
             if (keyword.includes("medell")) keyword = "medell";
             
             const pasaUbicacion = tituloURL.includes(keyword) || keyword === "";

             // Si la propiedad pasa todos los filtros, la agregamos al catálogo
             return pasaPrecio && pasaRecamaras && pasaBanos && pasaEstacionamientos && pasaUbicacion;
          });
        }
      }
    } catch (errorWP) {
      console.error("Error conectando a WP:", errorWP.message);
    }

    await db.collection('visitas').doc(visitaId).update({
      opcionesCatalogo: propiedadesInyectadas,
      busquedaCompletada: true
    });

    return res.status(200).json({ success: true, resultados: propiedadesInyectadas.length });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}