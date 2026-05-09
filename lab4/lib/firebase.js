import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCzEsgsC2xNZVDExtnEpMgoE6p8jc9WMqQ",
  authDomain: "board-games-market.firebaseapp.com",
  projectId: "board-games-market",
  storageBucket: "board-games-market.firebasestorage.app",
  messagingSenderId: "621547946208",
  appId: "1:621547946208:web:245801ebdcd753a39c9085",
  measurementId: "G-FLD15KMRF3"
};

// Inicjalizacja aplikacji
const app = initializeApp(firebaseConfig);

// Eksportujemy konkretne usługi, żeby ich używać w komponentach
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();