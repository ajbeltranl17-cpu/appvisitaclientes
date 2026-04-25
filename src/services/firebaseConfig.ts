import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCnqUTfbtKiQIzxwv9NpcSJlvLpXGm90OI",
  authDomain: "tuconexiongratis.firebaseapp.com",
  projectId: "tuconexiongratis",
  storageBucket: "tuconexiongratis.firebasestorage.app",
  messagingSenderId: "440980361178",
  appId: "1:440980361178:web:733159d8332a23c6f8fae3"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
