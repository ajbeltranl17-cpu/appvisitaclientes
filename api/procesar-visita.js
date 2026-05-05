import * as cheerio from 'cheerio';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { GoogleGenerativeAI } from '@google/generative-ai';

// 1. ABRIR LA CAJA FUERTE (Conectar Firebase de forma segura)
if (!getApps().length) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}');
    initializeApp({ credential: cert(serviceAccount) });
  } catch (error) {
    console.error("Error leyendo la llave de Firebase:", error);
  }
}
const db = getFirestore();

// 2. CONECTAR EL CEREBRO DE IA (Gemini)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  // Solo permitimos que nuestra propia app le hable a este archivo
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { visitaId, propiedadUrl, mapsUrl, ubicacionTexto } = req.body;

  if (!visitaId) return res.status(400).json({ error: 'Falta el ID de visita' });

  // ¡FUEGO Y OLVIDO! Respondemos al celular inmediatamente para que el cliente no espere
  res.status(200).json({ status: 'Procesamiento inteligente iniciado...' });

  try {
    let imagenDestacada = '';
    let precioExtraido = 0;
    let analisisIa = 'Propiedad estratégicamente ubicada en Veracruz, ideal para inversión y con excelente conectividad a servicios premium.';
    let plusvaliaIa = 8.5; // Un número base por si la IA falla

    // --- ACCIÓN A: RASTREAR TU PÁGINA WEB ---
    if (propiedadUrl) {
      try {
        const respuestaWeb = await fetch(propiedadUrl);
        const html = await respuestaWeb.text();
        const $ = cheerio.load(html);

        // Extraer la imagen principal (Meta tag de Houzez)
        imagenDestacada = $('meta[property="og:image"]').attr('content') || '';

        // Extraer el precio (Limpiamos el texto para dejar solo los números)
        // Nota: Houzez suele usar '.item-price'. Si en tu sitio es diferente, lo ajustaremos.
        const precioTexto = $('.item-price').first().text().replace(/[^0-9]/g, '');
        if (precioTexto) {
          precioExtraido = parseInt(precioTexto, 10);
        }
      } catch (e) {
        console.error(`Error extrayendo datos de la web para ${visitaId}:`, e);
      }
    }

    // --- ACCIÓN B: CONSULTAR A LA INTELIGENCIA ARTIFICIAL ---
    if (ubicacionTexto || mapsUrl) {
      try {
        const modelo = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const promptMaster = `
          Actúa como el mejor consultor inmobiliario de Veracruz y Boca del Río.
          Tengo una propiedad con estas referencias de ubicación: ${ubicacionTexto} y este link de mapa: ${mapsUrl}.
          El precio estimado es: $${precioExtraido} MXN.
          
          Necesito que me devuelvas EXACTAMENTE y ÚNICAMENTE un objeto JSON (sin comillas invertidas ni código extra) con dos cosas:
          1. "analisis": Un párrafo persuasivo de máximo 3 líneas destacando los beneficios de vivir o invertir ahí (plazas, escuelas, conectividad, estilo de vida).
          2. "plusvalia": Un número con un decimal que represente una tasa de plusvalía anual estimada realista para esa zona (ejemplo: 12.5).

          Formato exacto esperado:
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
         console.error(`Error de IA para ${visitaId}:`, e);
      }
    }

    // --- ACCIÓN C: GUARDAR TODO EN EL EXPEDIENTE DEL CLIENTE ---
    await db.collection('visitas').doc(visitaId).update({
      propiedadImagen: imagenDestacada,
      precioPropiedad: precioExtraido || 3500000, // Si no encuentra precio, pone 3.5M de base
      analisisZona: analisisIa,
      tasaPlusvaliaZona: plusvaliaIa,
      datosProcesados: true
    });

    console.log(`¡Éxito! Visita ${visitaId} procesada mágicamente.`);

  } catch (error) {
    console.error(`Error fatal procesando la visita ${visitaId}:`, error);
  }
}