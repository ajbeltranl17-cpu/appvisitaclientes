import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// Tu configuración web de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCnqUTfbtKiQIzxwv9NpcSJlvLpXGm90OI",
  authDomain: "tuconexiongratis.firebaseapp.com",
  projectId: "tuconexiongratis",
  storageBucket: "tuconexiongratis.appspot.com",
  messagingSenderId: "440980361178",
  appId: "1:440980361178:web:733159d8332a23c6f8fae3"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar y exportar los servicios que usaremos en la app
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);