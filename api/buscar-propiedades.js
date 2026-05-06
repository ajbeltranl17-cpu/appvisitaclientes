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

  const { visitaId, presupuestoMax, tipoPropiedad } = req.body;
  if (!visitaId) return res.status(400).json({ error: 'Falta el ID de visita' });

  try {
    console.log(`Buscando propiedades para la visita ${visitaId}...`);
    let propiedadesInyectadas = [];
    
    // El dominio de tu página web
    const dominioWordPress = 'https://tuconexioninmobiliaria.com'; 
    
    // CAMBIO: Ahora pedimos hasta 12 propiedades para llenar el catálogo
    const wpUrl = `${dominioWordPress}/wp-json/wp/v2/properties?per_page=12`;

    try {
      const wpRes = await fetch(wpUrl);
      
      if (wpRes.ok) {
        const wpData = await wpRes.json();
        if (Array.isArray(wpData) && wpData.length > 0) {
          propiedadesInyectadas = wpData.map(prop => ({
            id: prop.id?.toString() || Math.random().toString(),
            titulo: prop.title?.rendered || 'Excelente Propiedad',
            precio: prop.houzez_price || prop.meta?.houzez_price || presupuestoMax || 3500000, 
            habitaciones: prop.property_bedrooms || prop.meta?.property_bedrooms || 3,
            banos: prop.property_bathrooms || prop.meta?.property_bathrooms || 2,
            imagen: prop.featured_image_src || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
            url: prop.link || dominioWordPress
          }));
          console.log("¡Éxito! Catálogo extraído de WordPress.");
        }
      }
    } catch (errorWP) {
      console.error("No se pudo conectar con WordPress:", errorWP.message);
    }

    // SISTEMA DE RESPALDO: Si WP falla, mandamos 5 propiedades demo variadas
    if (propiedadesInyectadas.length === 0) {
      console.log("Usando catálogo de respaldo...");
      const precioBase = presupuestoMax ? parseInt(presupuestoMax, 10) : 3500000;
      
      propiedadesInyectadas = [
        { id: '101', titulo: "Residencia Exclusiva (Demo)", precio: precioBase, habitaciones: 3, banos: 2, imagen: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800", url: dominioWordPress },
        { id: '102', titulo: "Departamento Panorámico (Demo)", precio: precioBase * 0.85, habitaciones: 2, banos: 2, imagen: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800", url: dominioWordPress },
        { id: '103', titulo: "Villa con Jardín (Demo)", precio: precioBase * 1.15, habitaciones: 4, banos: 3, imagen: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", url: dominioWordPress },
        { id: '104', titulo: "Loft Moderno (Demo)", precio: precioBase * 0.70, habitaciones: 1, banos: 1, imagen: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800", url: dominioWordPress },
        { id: '105', titulo: "Casa Familiar (Demo)", precio: precioBase * 0.95, habitaciones: 3, banos: 3, imagen: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800", url: dominioWordPress }
      ];
    }

    // GUARDAMOS TODO EL CATÁLOGO EN FIREBASE
    await db.collection('visitas').doc(visitaId).update({
      opcionesCatalogo: propiedadesInyectadas,
      busquedaCompletada: true
    });

    return res.status(200).json({ success: true });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}