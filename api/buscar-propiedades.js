import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

if (!getApps().length) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}');
    initializeApp({ credential: cert(serviceAccount) });
  } catch (error) {
    console.error("Error iniciando Firebase Admin:", error);
  }
}
const db = getFirestore();

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Método no permitido');

  const { visitaId } = req.body;
  if (!visitaId) return res.status(400).json({ error: 'Falta el ID de visita' });

  try {
    let propiedadesInyectadas = [];
    const dominioWordPress = 'https://tuconexioninmobiliaria.com'; 

    // 1. INTENTAMOS AMBAS PUERTAS (Singular y Plural)
    const urlsToTry = [
      `${dominioWordPress}/wp-json/wp/v2/property?per_page=15`,
      `${dominioWordPress}/wp-json/wp/v2/properties?per_page=15`
    ];

    let wpData = null;
    for (const url of urlsToTry) {
      try {
        console.log("Explorando URL:", url);
        const wpRes = await fetch(url);
        if (wpRes.ok) {
          wpData = await wpRes.json();
          if (Array.isArray(wpData) && wpData.length > 0) {
            console.log(`¡Éxito! Encontramos ${wpData.length} propiedades en ${url}`);
            break; // Salimos del ciclo si funcionó
          }
        }
      } catch (e) {
        console.error("Fallo al conectar con:", url);
      }
    }

    // 2. MAPEO SIN FILTROS (Para ver qué datos nos da WordPress realmente)
    if (Array.isArray(wpData) && wpData.length > 0) {
      propiedadesInyectadas = wpData.map(prop => {
        // Buscamos el precio en los diferentes lugares donde Houzez suele esconderlo
        const precioDetectado = prop.houzez_price || prop.fave_property_price || prop.meta?.houzez_price || prop.meta?.fave_property_price || 0;
        
        // Limpiamos el precio por si viene con comas o signos de pesos
        const precioLimpio = parseInt(String(precioDetectado).replace(/[^0-9]/g, ''), 10) || 0;

        return {
          id: prop.id?.toString() || Math.random().toString(),
          titulo: prop.title?.rendered || 'Propiedad en Venta',
          precio: precioLimpio, 
          habitaciones: prop.property_bedrooms || prop.meta?.property_bedrooms || prop.fave_property_bedrooms || 3,
          banos: prop.property_bathrooms || prop.meta?.property_bathrooms || prop.fave_property_bathrooms || 2,
          imagen: prop.featured_image_src || prop.fave_property_images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
          url: prop.link || dominioWordPress
        };
      });
    }

    // 3. GUARDAMOS EN FIREBASE
    await db.collection('visitas').doc(visitaId).update({
      opcionesCatalogo: propiedadesInyectadas,
      busquedaCompletada: true
    });

    return res.status(200).json({ success: true, encontradas: propiedadesInyectadas.length });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}