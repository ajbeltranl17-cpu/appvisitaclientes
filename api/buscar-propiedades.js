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

  const { visitaId, presupuestoMin, presupuestoMax, ubicacionTexto, recamaras, banos, estacionamientos } = req.body;
  if (!visitaId) return res.status(400).json({ error: 'Falta el ID' });

  // 🕵️‍♂️ AQUÍ GUARDAREMOS LAS PISTAS
  let logDebug = []; 

  try {
    let propiedadesInyectadas = [];
    const dominioWordPress = 'https://tuconexioninmobiliaria.com'; 
    
    // 1. INTENTAMOS AMBAS PUERTAS PARA NO FALLAR
    const endpoints = ['properties', 'property'];
    let wpData = null;

    for (let ep of endpoints) {
       const wpUrl = `${dominioWordPress}/wp-json/wp/v2/${ep}?per_page=40`; 
       logDebug.push(`Buscando en: ${wpUrl}`);
       try {
         const wpRes = await fetch(wpUrl);
         if (wpRes.ok) {
           const data = await wpRes.json();
           if (Array.isArray(data) && data.length > 0) {
             wpData = data;
             logDebug.push(`¡Éxito! Encontramos ${data.length} propiedades en la puerta /${ep}`);
             break; // Rompe el ciclo porque ya encontró la puerta correcta
           } else {
             logDebug.push(`La puerta /${ep} está vacía.`);
           }
         } else {
           logDebug.push(`La puerta /${ep} dio error de conexión.`);
         }
       } catch (e) {
         logDebug.push(`Fallo técnico en /${ep}: ${e.message}`);
       }
    }

    if (wpData) {
      logDebug.push("Traduciendo datos de WordPress a la App...");
      const propiedadesMapeadas = wpData.map(prop => {
        // Leemos el precio que nos da el plugin que instalaste (o el default)
        const precioRaw = prop.datos_app?.precio_real || prop.houzez_price || prop.meta?.houzez_price || 0;
        const precioLimpio = parseInt(String(precioRaw).replace(/[^0-9]/g, ''), 10) || 0;
        const imagenReal = prop.datos_app?.imagen_real || prop.featured_image_src || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800';

        return {
          id: prop.id?.toString() || Math.random().toString(),
          titulo: prop.title?.rendered || 'Propiedad',
          precio: precioLimpio, 
          habitaciones: parseInt(prop.property_bedrooms || prop.meta?.property_bedrooms || prop.fave_property_bedrooms) || 0,
          banos: parseFloat(prop.property_bathrooms || prop.meta?.property_bathrooms || prop.fave_property_bathrooms) || 0,
          estacionamientos: parseInt(prop.property_garage || prop.meta?.property_garage || prop.fave_property_garage) || 0,
          imagen: imagenReal,
          url: prop.link || dominioWordPress
        };
      });

      // Vemos si sí está leyendo los precios
      if (propiedadesMapeadas.length > 0) {
         logDebug.push(`Ejemplo leído: ${propiedadesMapeadas[0].titulo} | Precio: $${propiedadesMapeadas[0].precio} | Rec: ${propiedadesMapeadas[0].habitaciones}`);
      }

      // APLICAMOS FILTROS DEL CLIENTE
      const min = Number(presupuestoMin) || 0;
      const max = Number(presupuestoMax) || 999000000;
      const recDeseadas = Number(recamaras) || 1;
      const banosDeseados = Number(banos) || 1;
      const estDeseados = Number(estacionamientos) || 0;
      const ciudadBuscada = (ubicacionTexto || "").toLowerCase().trim();

      propiedadesInyectadas = propiedadesMapeadas.filter(p => {
         const pasaPrecio = p.precio >= min && p.precio <= max;
         const pasaRecamaras = p.habitaciones >= recDeseadas;
         const pasaBanos = p.banos >= banosDeseados;
         const pasaEstacionamientos = p.estacionamientos >= estDeseados;

         const tituloURL = (p.titulo + " " + p.url).toLowerCase();
         let keyword = ciudadBuscada;
         if (keyword.includes("boca")) keyword = "boca";
         if (keyword.includes("riviera")) keyword = "riviera";
         if (keyword.includes("medell")) keyword = "medell";
         
         const pasaUbicacion = tituloURL.includes(keyword) || keyword === "";

         // Si rechaza por precio, que nos diga por qué
         if (!pasaPrecio && p.precio > 0) logDebug.push(`Rechazada por precio: ${p.titulo} ($${p.precio})`);

         return pasaPrecio && pasaRecamaras && pasaBanos && pasaEstacionamientos && pasaUbicacion;
      });

      logDebug.push(`Total de propiedades que pasaron la prueba: ${propiedadesInyectadas.length}`);
    } else {
      logDebug.push("WordPress no mandó datos.");
    }

    // 💾 GUARDAMOS EN FIREBASE JUNTO CON EL REPORTE ESPÍA
    await db.collection('visitas').doc(visitaId).update({
      opcionesCatalogo: propiedadesInyectadas,
      busquedaCompletada: true,
      debug_log: logDebug // <- ESTO NOS DIRÁ LA VERDAD ABSOLUTA
    });

    return res.status(200).json({ success: true, resultados: propiedadesInyectadas.length });

  } catch (error) {
    logDebug.push(`Error Fatal: ${error.message}`);
    await db.collection('visitas').doc(visitaId).update({ debug_log: logDebug });
    return res.status(500).json({ error: error.message });
  }
}