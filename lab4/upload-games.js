const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc } = require("firebase/firestore");
const fs = require("fs");

const firebaseConfig = {
  apiKey: "AIzaSyCzEsgsC2xNZVDExtnEpMgoE6p8jc9WMqQ",
  authDomain: "board-games-market.firebaseapp.com",
  projectId: "board-games-market",
  storageBucket: "board-games-market.firebasestorage.app",
  messagingSenderId: "621547946208",
  appId: "1:621547946208:web:245801ebdcd753a39c9085"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const gamesData = JSON.parse(fs.readFileSync("./data/board-games.json", "utf8"));

async function upload() {
  console.log("Wysyłam gry do Firebase...");
  try {
    const gamesCol = collection(db, "games");
    
    console.log("Typ danych:", typeof gamesData);
    
    // Szukamy tablicy z grami niezależnie od tego, jak się nazywa klucz
    const items = Array.isArray(gamesData) 
      ? gamesData 
      : (gamesData.games || gamesData.boardGames || Object.values(gamesData).find(Array.isArray));

    if (!items || !Array.isArray(items)) {
      throw new Error("Nie znaleziono tablicy z grami w pliku JSON!");
    }

    for (const game of items) {
      // Usuwamy id z pliku JSON, żeby Firebase nadało swoje własne unikalne ID
      const { id, ...gameWithoutId } = game;
      await addDoc(gamesCol, { ...gameWithoutId, isSold: false });
      console.log(`Dodano: ${game.title || "Gra bez tytułu"}`);
    }
    
    console.log("---");
    console.log("Sukces! Wszystkie gry są w chmurze.");
  } catch (e) {
    console.error("Błąd wysyłania:", e.message);
  }
}

upload();