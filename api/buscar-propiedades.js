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

  // Recibimos MIN y MAX
  const { visitaId, presupuestoMin, presupuestoMax, tipoPropiedad } = req.body;
  if (!visitaId) return res.status(400).json({ error: 'Falta el ID de visita' });

  try {
    let propiedadesInyectadas = [];
    const dominioWordPress = 'https://tuconexioninmobiliaria.com'; 
    const wpUrl = `${dominioWordPress}/wp-json/wp/v2/properties?per_page=20`; // Pedimos más propiedades base para que el filtro tenga de dónde escoger

    try {
      const wpRes = await fetch(wpUrl);
      
      if (wpRes.ok) {
        const wpData = await wpRes.json();
        if (Array.isArray(wpData) && wpData.length > 0) {
          
          // MAPEO Y FILTRADO ESTRICTO
          propiedadesInyectadas = wpData.map(prop => ({
            id: prop.id?.toString() || Math.random().toString(),
            titulo: prop.title?.rendered || 'Propiedad Inmobiliaria',
            precio: prop.houzez_price || prop.meta?.houzez_price || 0, 
            habitaciones: prop.property_bedrooms || prop.meta?.property_bedrooms || 3,
            banos: prop.property_bathrooms || prop.meta?.property_bathrooms || 2,
            imagen: prop.featured_image_src || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
            url: prop.link || dominioWordPress
          })).filter(p => {
             // LA REGLA ESTRICTA DE RANGO
             const precioPropiedad = Number(p.precio);
             const minimo = Number(presupuestoMin) || 2000000;
             const maximo = Number(presupuestoMax) || 15000000;
             
             return precioPropiedad >= minimo && precioPropiedad <= maximo;
          });
          
        }
      }
    } catch (errorWP) {
      console.error("Error al conectar con WordPress:", errorWP.message);
    }

    // Guardamos en Firebase (incluso si está vacío, se va vacío y la app muestra el botón de Whatsapp)
    await db.collection('visitas').doc(visitaId).update({
      opcionesCatalogo: propiedadesInyectadas,
      busquedaCompletada: true
    });

    return res.status(200).json({ success: true, resultados: propiedadesInyectadas.length });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}