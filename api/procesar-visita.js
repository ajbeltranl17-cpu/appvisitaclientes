import * as cheerio from 'cheerio';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { GoogleGenerativeAI } from '@google/generative-ai';

if (!getApps().length) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}');
    initializeApp({ credential: cert(serviceAccount) });
  } catch (error) {
    console.error("Error Firebase Admin:", error);
  }
}
const db = getFirestore();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Solo POST');

  const { visitaId, propiedadUrl, mapsUrl, ubicacionTexto } = req.body;
  console.log("Iniciando proceso para ID:", visitaId);

  let imagenDestacada = '';
  let precioExtraido = 0;
  let plusvaliaIa = 8.5;
  let analisisIa = {
    educacion: ["Colegios de prestigio en la zona", "Instituciones educativas a pocos minutos"],
    comercio: ["Centros comerciales y plazas cercanas", "Supermercados de fácil acceso"],
    salud: ["Hospitales y clínicas de primer nivel", "Farmacias 24/7 en el área"],
    conectividad: ["Vías de acceso rápido y seguras", "Excelente conectividad al transporte"]
  };

  try {
    // 1. RASTREO WEB CON TIEMPO LÍMITE (AbortController)
    if (propiedadUrl) {
      try {
        console.log("Rastreando web...");
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6000); // 6 segundos máximo

        const resp = await fetch(propiedadUrl, { 
          headers: { 'User-Agent': 'Mozilla/5.0' },
          signal: controller.signal 
        });
        clearTimeout(timeout);

        const html = await resp.text();
        const $ = cheerio.load(html);
        imagenDestacada = $('meta[property="og:image"]').attr('content') || '';
        let pRaw = $('.item-price').first().text() || $('meta[name="price"]').attr('content') || '';
        precioExtraido = parseInt(pRaw.replace(/[^0-9]/g, ''), 10) || 0;
        console.log("Precio extraído:", precioExtraido);
      } catch (e) {
        console.log("Error o timeout en rastreo web, continuando...");
      }
    }

    // 2. INTELIGENCIA ARTIFICIAL
    if (ubicacionTexto || mapsUrl) {
      try {
        console.log("Consultando a Gemini...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Analiza la ubicación: ${ubicacionTexto}. Devuelve SOLO un JSON con esta estructura exacta: {"educacion":["punto1","punto2"],"comercio":["punto1","punto2"],"salud":["punto1","punto2"],"conectividad":["punto1","punto2"],"plusvalia":12.5}. Sé específico con beneficios de Veracruz/Boca del Río.`;
        
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        // Limpiador de JSON más robusto
        const start = text.indexOf('{');
        const end = text.lastIndexOf('}');
        
        if (start !== -1 && end !== -1) {
          const rawJson = text.substring(start, end + 1);
          const data = JSON.parse(rawJson);
          
          analisisIa = {
            educacion: data.educacion || data.Educacion || data.Educación || analisisIa.educacion,
            comercio: data.comercio || data.Comercio || analisisIa.comercio,
            salud: data.salud || data.Salud || analisisIa.salud,
            conectividad: data.conectividad || data.Conectividad || analisisIa.conectividad
          };
          if (data.plusvalia) plusvaliaIa = Number(data.plusvalia);
          console.log("IA respondió correctamente.");
        }
      } catch (e) {
        console.log("Error en IA, usando datos por defecto.");
      }
    }

    // 3. GUARDADO FINAL (Misión Crítica)
    console.log("Guardando en Firebase...");
    await db.collection('visitas').doc(visitaId).update({
      propiedadImagen: imagenDestacada,
      precioPropiedad: precioExtraido || 3500000,
      analisisZona: analisisIa,
      tasaPlusvaliaZona: plusvaliaIa,
      datosProcesados: true // ESTO ES LO QUE QUITA LA CARGA EN LA APP
    });

    console.log("Proceso finalizado con éxito.");
    return res.status(200).json({ success: true });

  } catch (e) {
    console.error("Error fatal en la función:", e);
    // Intentamos guardar al menos que ya procesamos para que no se quede la pantalla cargando
    try {
        await db.collection('visitas').doc(visitaId).update({ datosProcesados: true });
    } catch (dbErr) {}
    return res.status(500).json({ error: e.message });
  }
}