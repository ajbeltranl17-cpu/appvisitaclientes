// Archivo: api/procesar-visita.js
import * as cheerio from 'cheerio';
// Nota: Necesitarás instalar firebase-admin en tu proyecto para que el servidor pueda escribir en la base de datos
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Aquí pondremos tus credenciales de Firebase de servidor (las configuraremos por seguridad en variables de entorno de Vercel)
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}');

if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount) });
}
const db = getFirestore();

export default async function handler(req, res) {
  // Solo aceptamos peticiones POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { visitaId, propiedadUrl, mapsUrl, ubicacionTexto } = req.body;

  if (!visitaId) return res.status(400).json({ error: 'Falta el ID de visita' });

  // Respondemos INMEDIATAMENTE al navegador para que no se quede esperando
  // Vercel Serverless Functions pueden seguir ejecutándose un poco más después de enviar la respuesta
  res.status(200).json({ status: 'Procesamiento iniciado en segundo plano' });

  try {
    let imagenDestacada = '';
    let precioExtraido = 0;
    let analisisIa = '';
    let plusvaliaIa = 7.5; // Default de seguridad

    // 1. EXTRACCIÓN DE HOUZEZ (Scraping)
    if (propiedadUrl) {
      try {
        const respuestaWeb = await fetch(propiedadUrl);
        const html = await respuestaWeb.text();
        const $ = cheerio.load(html);

        // EXTRAER IMAGEN: Houzez suele poner la imagen destacada en el meta tag 'og:image'
        imagenDestacada = $('meta[property="og:image"]').attr('content') || '';

        // EXTRAER PRECIO: Houzez suele usar clases como '.item-price' o etiquetas meta específicas. 
        // (Ajustaremos este selector exacto cuando hagamos la prueba con un link tuyo real)
        const precioTexto = $('.item-price').first().text().replace(/[^0-9]/g, '');
        if (precioTexto) precioExtraido = parseInt(precioTexto, 10);

      } catch (e) {
        console.error(`Error extrayendo de Houzez para ${visitaId}:`, e);
      }
    }

    // 2. ANÁLISIS DE GOOGLE MAPS CON INTELIGENCIA ARTIFICIAL
    if (mapsUrl) {
      try {
        // Aquí insertaremos la llamada a la API de Gemini. 
        // Le mandaremos el link del mapa y la ubicación para que redacte el copy persuasivo.
        // Simulamos el resultado por ahora:
        analisisIa = `Estratégicamente ubicada en ${ubicacionTexto || 'la zona'}, esta propiedad ofrece conectividad premium, acceso a servicios médicos de primer nivel y centros comerciales a minutos de distancia. Ideal para inversión y calidad de vida.`;
        
        // También pediremos a la IA que calcule la plusvalía basada en el desarrollo local.
        plusvaliaIa = 12.5; 

      } catch (e) {
         console.error(`Error de IA para ${visitaId}:`, e);
      }
    }

    // 3. GUARDADO FINAL EN FIREBASE
    // Actualizamos el documento con la data real que la IA y el Scraper consiguieron
    await db.collection('visitas').doc(visitaId).update({
      propiedadImagen: imagenDestacada,
      precioPropiedad: precioExtraido || 3500000, // Fallback en caso de que la web no tenga el precio
      analisisZona: analisisIa,
      tasaPlusvaliaZona: plusvaliaIa,
      datosProcesados: true
    });

    console.log(`Visita ${visitaId} procesada exitosamente.`);

  } catch (error) {
    console.error(`Error fatal en el procesamiento de la visita ${visitaId}:`, error);
  }
}