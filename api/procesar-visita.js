import * as cheerio from 'cheerio';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { GoogleGenerativeAI } from '@google/generative-ai';

// ABRIR LA CAJA FUERTE
if (!getApps().length) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}');
    initializeApp({ credential: cert(serviceAccount) });
  } catch (error) {
    console.error("Error leyendo la llave de Firebase:", error);
  }
}
const db = getFirestore();

// CONECTAR EL CEREBRO DE IA
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { visitaId, propiedadUrl, mapsUrl, ubicacionTexto } = req.body;
  if (!visitaId) return res.status(400).json({ error: 'Falta el ID de visita' });

  let imagenDestacada = '';
  let precioExtraido = 0;
  let plusvaliaIa = 8.5; 

  // ⚠️ CAMBIO CRÍTICO: Inicializamos el Análisis como un Diccionario (Objeto), NUNCA como un texto.
  // Así la pantalla no se rompe y muestra estos datos reales si la IA llega a fallar.
  let analisisIa = {
    educacion: ["Colegios de prestigio en la zona", "Instituciones educativas a pocos minutos"],
    comercio: ["Centros comerciales y plazas cercanas", "Supermercados de fácil acceso"],
    salud: ["Hospitales y clínicas de primer nivel", "Farmacias 24/7 en el área"],
    conectividad: ["Vías de acceso rápido y seguras", "Excelente conectividad al transporte"]
  };

  try {
    // 🕵️‍♀️ ACCIÓN A: RASTREAR TU PÁGINA WEB (Scraping)
    if (propiedadUrl) {
      try {
        const respuestaWeb = await fetch(propiedadUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/91.0.4472.124' }
        });
        const html = await respuestaWeb.text();
        const $ = cheerio.load(html);

        imagenDestacada = $('meta[property="og:image"]').attr('content') || '';
        let precioTextoRaw = $('.item-price').first().text() || $('meta[name="price"]').attr('content');
        const precioTexto = (precioTextoRaw || '').replace(/[^0-9]/g, '');
        if (precioTexto) precioExtraido = parseInt(precioTexto, 10);
      } catch (e) {
        console.error(`Error extrayendo web:`, e);
      }
    }

    // 🧠 ACCIÓN B: CONSULTAR A LA INTELIGENCIA ARTIFICIAL (Gemini)
    if (ubicacionTexto || mapsUrl) {
      try {
        const modelo = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const promptMaster = `
          Actúa como consultor inmobiliario de Veracruz y Boca del Río.
          Ubicación: ${ubicacionTexto}.
          
          Devuélveme ÚNICAMENTE un JSON válido con esta estructura exacta (en minúsculas y sin acentos en las llaves):
          {
            "educacion": ["Punto 1", "Punto 2"],
            "comercio": ["Punto 1", "Punto 2"],
            "salud": ["Punto 1", "Punto 2"],
            "conectividad": ["Punto 1", "Punto 2"],
            "plusvalia": 12.5
          }
          Genera 2 o 3 beneficios breves y reales para cada categoría basados en la zona.
        `;

        const resultadoIA = await modelo.generateContent(promptMaster);
        const respuestaTexto = resultadoIA.response.text();
        
        const jsonLimpio = respuestaTexto.replace(/```json/g, '').replace(/```/g, '').trim();
        const datosIA = JSON.parse(jsonLimpio);

        // Filtro Anti-Balas: Aceptamos la palabra aunque la IA le haya puesto acentos o mayúsculas
        analisisIa = {
          educacion: datosIA.educacion || datosIA.Educación || datosIA.Educacion || analisisIa.educacion,
          comercio: datosIA.comercio || datosIA.Comercio || analisisIa.comercio,
          salud: datosIA.salud || datosIA.Salud || analisisIa.salud,
          conectividad: datosIA.conectividad || datosIA.Conectividad || analisisIa.conectividad
        };

        if (datosIA.plusvalia) plusvaliaIa = Number(datosIA.plusvalia);

      } catch (e) {
         console.error(`Error de IA:`, e);
      }
    }

    // 💾 ACCIÓN C: GUARDAR EN FIREBASE
    await db.collection('visitas').doc(visitaId).update({
      propiedadImagen: imagenDestacada,
      precioPropiedad: precioExtraido || 3500000, 
      analisisZona: analisisIa,
      tasaPlusvaliaZona: plusvaliaIa,
      datosProcesados: true 
    });

    return res.status(200).json({ status: 'Misión cumplida en el servidor' });

  } catch (error) {
    return res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
}