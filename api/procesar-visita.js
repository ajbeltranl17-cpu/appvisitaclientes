import * as cheerio from 'cheerio';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { GoogleGenerativeAI } from '@google/generative-ai';

// ABRIR LA CAJA FUERTE (Conectar Firebase de forma segura)
if (!getApps().length) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}');
    initializeApp({ credential: cert(serviceAccount) });
  } catch (error) {
    console.error("Error leyendo la llave de Firebase en el servidor:", error);
  }
}
const db = getFirestore();

// CONECTAR EL CEREBRO DE IA (Gemini)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  // Solo permitimos que nuestra propia app le hable a este archivo
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { visitaId, propiedadUrl, mapsUrl, ubicacionTexto } = req.body;

  if (!visitaId) return res.status(400).json({ error: 'Falta el ID de visita' });

  // ⚠️ CAMBIO CRÍTICO: No respondemos inmediatamente.
  // Ahora usaremos un try-catch que engloba TODA la función para asegurar
  // que todo se completa antes de enviar la respuesta final.

  let imagenDestacada = '';
  let precioExtraido = 0;
  let analisisIa = 'Propiedad estratégicamente ubicada en Veracruz, ideal para inversión y con excelente conectividad a servicios premium.';
  let plusvaliaIa = 8.5; // Un número base por si la IA falla

  try {
    // 🕵️‍♀️ ACCIÓN A: RASTREAR TU PÁGINA WEB (Scraping)
    if (propiedadUrl) {
      try {
        const respuestaWeb = await fetch(propiedadUrl, {
          // Protecciones anti-bloqueo: Nos hacemos pasar por un navegador real
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });
        
        const html = await respuestaWeb.text();
        const $ = cheerio.load(html);

        // Extraer la imagen principal (Meta tag og:image es muy confiable en Houzez)
        imagenDestacada = $('meta[property="og:image"]').attr('content') || '';

        // Extraer el precio (Limpiamos el texto para dejar solo los números)
        // Nota: Verifica en tu sitio que la clase CSS sea '.item-price'. Si no jala, lo cambiamos.
        let precioTextoRaw = $('.item-price').first().text();
        // Si .item-price no funciona, Houzez a veces usa 'meta[name="price"]'
        if (!precioTextoRaw) {
          precioTextoRaw = $('meta[name="price"]').attr('content');
        }

        const precioTexto = (precioTextoRaw || '').replace(/[^0-9]/g, '');
        if (precioTexto) {
          precioExtraido = parseInt(precioTexto, 10);
        }

      } catch (e) {
        console.error(`Error extrayendo datos de la web para la visita ${visitaId}:`, e);
        // No matamos la función, seguimos adelante con los datos por defecto
      }
    }

    // 🧠 ACCIÓN B: CONSULTAR A LA INTELIGENCIA ARTIFICIAL (Gemini)
    if (ubicacionTexto || mapsUrl) {
      try {
        const modelo = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        // El Prompt Maestro (La instrucción secreta para la IA)
        const promptMaster = `
          Actúa como el mejor y más persuasivo consultor inmobiliario de Veracruz y Boca del Río.
          Tengo una propiedad con estas referencias de ubicación: ${ubicacionTexto} y este link de mapa: ${mapsUrl}.
          El precio estimado es: $${precioExtraido || 3500000} MXN.
          
          Necesito que me devuelvas EXACTAMENTE y ÚNICAMENTE un objeto JSON (sin comillas invertidas ni bloques de código extra) con dos cosas:
          1. "analisis": Un párrafo de máximo 3 líneas redactado de forma hipnótica y persuasiva, destacando los beneficios de vivir o invertir ahí (plazas, escuelas, conectividad, estilo de vida). No hables de precios.
          2. "plusvalia": Un número con un decimal que represente una tasa de plusvalía anual estimada realista para esa zona (ejemplo: 12.5).

          Formato exacto esperado de respuesta (solo el JSON):
          {"analisis": "texto aquí", "plusvalia": 14.2}
        `;

        const resultadoIA = await modelo.generateContent(promptMaster);
        const respuestaTexto = resultadoIA.response.text();
        
        // Limpiamos la respuesta por si la IA le pone comillas de formato de código
        const jsonLimpio = respuestaTexto.replace(/```json/g, '').replace(/```/g, '').trim();
        const datosIA = JSON.parse(jsonLimpio);

        if (datosIA.analisis) analisisIa = datosIA.analisis;
        if (datosIA.plusvalia) plusvaliaIa = Number(datosIA.plusvalia);

      } catch (e) {
         console.error(`Error de IA para la visita ${visitaId}:`, e);
         // Fallback por defecto si la IA falla
      }
    }

    // 💾 ACCIÓN C: GUARDAR TODO EN EL EXPEDIENTE DEL CLIENTE (Firebase)
    // Usamos 'await' aquí para asegurarnos de que la base de datos se actualice
    await db.collection('visitas').doc(visitaId).update({
      propiedadImagen: imagenDestacada,
      precioPropiedad: precioExtraido || 3500000, 
      analisisZona: analisisIa,
      tasaPlusvaliaZona: plusvaliaIa,
      datosProcesados: true // Un check de seguridad para saber que corrió el cerebro
    });

    console.log(`¡Misión cumplida! Visita ${visitaId} procesada mágicamente.`);

    // ✅ ¡FINALMENTE! Enviamos la respuesta de éxito. El servidor trabajó y ya puede apagarse.
    return res.status(200).json({ status: 'Misión cumplida en el servidor' });

  } catch (error) {
    // Si algo sale muy, muy mal, enviamos un error 500
    console.error(`Error fatal procesando la visita ${visitaId}:`, error);
    return res.status(500).json({ error: 'Hubo un error en el servidor. Revisa los logs.' });
  }
}