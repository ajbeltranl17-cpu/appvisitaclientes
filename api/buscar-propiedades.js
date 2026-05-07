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

  let logDebug = []; 

  try {
    let propiedadesInyectadas = [];
    const dominioWordPress = 'https://tuconexioninmobiliaria.com'; 
    // Subimos a 50 para que el embudo jale más inventario antes de filtrar
    const wpUrl = `${dominioWordPress}/wp-json/wp/v2/properties?per_page=20`; 

    logDebug.push(`Llamando a: ${wpUrl}`);
    const wpRes = await fetch(wpUrl);
    
    if (wpRes.ok) {
      const wpData = await wpRes.json();
      if (Array.isArray(wpData) && wpData.length > 0) {
        
        const propiedadesMapeadas = wpData.map(prop => {
          const precioRaw = prop.datos_app?.precio_real || prop.houzez_price || 0;
          const precioLimpio = parseInt(String(precioRaw).replace(/[^0-9]/g, ''), 10) || 0;
          const imagenReal = prop.datos_app?.imagen_real || prop.featured_image_src || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800';

          return {
            id: prop.id?.toString() || Math.random().toString(),
            titulo: prop.title?.rendered || 'Propiedad Inmobiliaria',
            precio: precioLimpio, 
            habitaciones: parseInt(prop.datos_app?.recamaras || prop.property_bedrooms || prop.fave_property_bedrooms) || 0,
            banos: parseFloat(prop.datos_app?.banos || prop.property_bathrooms || prop.fave_property_bathrooms) || 0,
            estacionamientos: parseInt(prop.datos_app?.estacionamientos || prop.property_garage || prop.fave_property_garage) || 0,
            imagen: imagenReal,
            url: prop.link || dominioWordPress
          };
        });

        const min = Number(presupuestoMin) || 0;
        const max = Number(presupuestoMax) || 999000000;
        const recDeseadas = Number(recamaras) || 1;
        const banosDeseados = Number(banos) || 1;
        const estDeseados = Number(estacionamientos) || 0;
        const ciudadBuscada = (ubicacionTexto || "").toLowerCase().trim();

        propiedadesInyectadas = propiedadesMapeadas.filter(p => {
           // 1. FILTROS BÁSICOS
           const pasaPrecio = p.precio >= min && p.precio <= max;
           const pasaRecamaras = p.habitaciones >= recDeseadas;
           const pasaBanos = p.banos >= banosDeseados;
           const pasaEstacionamientos = p.estacionamientos >= estDeseados;

           // 2. EL CEREBRO DE ZONAS LOCALES
           const tituloURL = (p.titulo + " " + p.url).toLowerCase();
           let pasaUbicacion = false;

           if (ciudadBuscada.includes("riviera")) {
             // Todas las palabras clave que significan "Riviera Veracruzana"
             const keywordsRiviera = ["riviera", "tibur", "conchal", "dorado", "lomas", "mandara", "bello", "tajin", "mandinga", "sendero", "real",”rioja”];
             pasaUbicacion = keywordsRiviera.some(kw => tituloURL.includes(kw));
           } 
           else if (ciudadBuscada.includes("boca")) {
             // Palabras clave de Boca del Río
             const keywordsBoca = ["boca", "costa de oro", "mocambo", "tampiquera", "virginia", "estatuto", "americas", "petrolera", "hoyo", "costa verde", ”graciano”, “morro”, “primero de mayo” ];
             pasaUbicacion = keywordsBoca.some(kw => tituloURL.includes(kw));
           }
           else if (ciudadBuscada.includes("medell")) {
             // Palabras clave de Medellín
             const keywordsMedellin = ["medell", "puente moreno", "tejar", "arboledas", "playa de vacas", "dos lomas"];
             pasaUbicacion = keywordsMedellin.some(kw => tituloURL.includes(kw));
           }
           else if (ciudadBuscada.includes("veracruz")) {
             // Palabras clave del municipio de Veracruz
             const keywordsVeracruz = ["veracruz", "reforma", "zaragoza", "centro", "norte", "floresta", "magon", "brisa", "pino"];
             pasaUbicacion = keywordsVeracruz.some(kw => tituloURL.includes(kw));
             
             // Evitamos que "Veracruz" incluya a la Riviera Veracruzana por error
             if (tituloURL.includes("riviera") || tituloURL.includes("tibur")) pasaUbicacion = false;
           }
           else {
             // Si el cliente no puso zona, pasa todo
             pasaUbicacion = true; 
           }

           // Mantenemos al espía vigilando
           if (!pasaPrecio && p.precio > 0) logDebug.push(`Rechazada por PRECIO: ${p.titulo} ($${p.precio})`);
           else if (pasaPrecio && !pasaRecamaras) logDebug.push(`Rechazada por RECÁMARAS (Tiene ${p.habitaciones}): ${p.titulo}`);
           else if (pasaPrecio && pasaRecamaras && !pasaBanos) logDebug.push(`Rechazada por BAÑOS: ${p.titulo}`);
           else if (pasaPrecio && pasaRecamaras && pasaBanos && !pasaUbicacion) logDebug.push(`Rechazada por UBICACIÓN (${ciudadBuscada}): ${p.titulo}`);

           return pasaPrecio && pasaRecamaras && pasaBanos && pasaEstacionamientos && pasaUbicacion;
        });
        
        logDebug.push(`Total aprobadas para el catálogo: ${propiedadesInyectadas.length}`);
      }
    }

    await db.collection('visitas').doc(visitaId).update({
      opcionesCatalogo: propiedadesInyectadas,
      busquedaCompletada: true,
      debug_log: logDebug
    });

    return res.status(200).json({ success: true, resultados: propiedadesInyectadas.length });

  } catch (error) {
    logDebug.push(`Error: ${error.message}`);
    await db.collection('visitas').doc(visitaId).update({ debug_log: logDebug });
    return res.status(500).json({ error: error.message });
  }
}
