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
    
    // 🔥 EL TRUCO DE VELOCIDAD: Le pedimos SOLO los campos exactos que ocupamos (&_fields=...)
    const camposRequeridos = 'id,title,link,datos_app,houzez_price,property_bedrooms,property_bathrooms,property_garage,featured_image_src';
    const wpUrl = `${dominioWordPress}/wp-json/wp/v2/properties?per_page=40&_fields=${camposRequeridos}`; 

    logDebug.push(`Llamando versión ultrarrápida: ${wpUrl}`);
    
    // 🛡️ PARACAÍDAS ANTI-APAGÓN: Límite interno de 8.5 segundos
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8500);

    try {
      const wpRes = await fetch(wpUrl, { signal: controller.signal });
      clearTimeout(timeoutId); // Si responde a tiempo, quitamos el límite

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
              habitaciones: parseInt(prop.datos_app?.recamaras || prop.property_bedrooms) || 0,
              banos: parseFloat(prop.datos_app?.banos || prop.property_bathrooms) || 0,
              estacionamientos: parseInt(prop.datos_app?.estacionamientos || prop.property_garage) || 0,
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
             const pasaPrecio = p.precio >= min && p.precio <= max;
             const pasaRecamaras = p.habitaciones >= recDeseadas;
             const pasaBanos = p.banos >= banosDeseados;
             const pasaEstacionamientos = p.estacionamientos >= estDeseados;

             const tituloURL = (p.titulo + " " + p.url).toLowerCase();
             let pasaUbicacion = false;

             if (ciudadBuscada.includes("riviera")) {
               const keywordsRiviera = ["riviera", "tibur", "conchal", "dorado", "lomas", "mandara", "bello", "tajin", "mandinga", "sendero", "real"];
               pasaUbicacion = keywordsRiviera.some(kw => tituloURL.includes(kw));
             } 
             else if (ciudadBuscada.includes("boca")) {
               const keywordsBoca = ["boca", "costa de oro", "mocambo", "tampiquera", "virginia", "reforma", "estatuto", "americas", "petrolera", "hoyo", "tampico"];
               pasaUbicacion = keywordsBoca.some(kw => tituloURL.includes(kw));
             }
             else if (ciudadBuscada.includes("medell")) {
               const keywordsMedellin = ["medell", "puente moreno", "tejar", "arboledas", "playa de vacas", "dos lomas"];
               pasaUbicacion = keywordsMedellin.some(kw => tituloURL.includes(kw));
             }
             else if (ciudadBuscada.includes("veracruz")) {
               const keywordsVeracruz = ["veracruz", "reforma", "zaragoza", "centro", "norte", "floresta", "magon", "brisa", "pino"];
               pasaUbicacion = keywordsVeracruz.some(kw => tituloURL.includes(kw));
               if (tituloURL.includes("riviera") || tituloURL.includes("tibur")) pasaUbicacion = false;
             }
             else { pasaUbicacion = true; }

             if (!pasaPrecio && p.precio > 0) logDebug.push(`Rechazo Precio: ${p.titulo} ($${p.precio})`);
             else if (pasaPrecio && !pasaRecamaras) logDebug.push(`Rechazo Rec: ${p.titulo}`);
             else if (pasaPrecio && pasaRecamaras && !pasaBanos) logDebug.push(`Rechazo Baños: ${p.titulo}`);
             else if (pasaPrecio && pasaRecamaras && pasaBanos && !pasaUbicacion) logDebug.push(`Rechazo Zona (${ciudadBuscada}): ${p.titulo}`);

             return pasaPrecio && pasaRecamaras && pasaBanos && pasaEstacionamientos && pasaUbicacion;
          });
          
          logDebug.push(`Aprobadas: ${propiedadesInyectadas.length}`);
        }
      } else {
         logDebug.push(`WordPress respondió con error: ${wpRes.status}`);
      }
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        logDebug.push("⚠️ WordPress tardó más de 8.5 segs en enviar la lista. Abortamos para no congelar la App.");
      } else {
        logDebug.push(`⚠️ Error de conexión: ${fetchError.message}`);
      }
    }

    // AHORA SÍ GUARDAMOS SEGUROS EN FIREBASE
    await db.collection('visitas').doc(visitaId).update({
      opcionesCatalogo: propiedadesInyectadas,
      busquedaCompletada: true,
      debug_log: logDebug
    });

    return res.status(200).json({ success: true, resultados: propiedadesInyectadas.length });

  } catch (error) {
    logDebug.push(`Error Fatal en Vercel: ${error.message}`);
    await db.collection('visitas').doc(visitaId).update({ debug_log: logDebug });
    return res.status(500).json({ error: error.message });
  }
}