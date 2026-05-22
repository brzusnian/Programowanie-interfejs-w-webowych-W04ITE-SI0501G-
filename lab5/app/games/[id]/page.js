"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";

export default function GameDetails() {
  const { id } = useParams(); // Pobiera ID z adresu URL
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGame() {
      if (!id) return;
      try {
        // Tworzymy referencję do konkretnego dokumentu
        const gameRef = doc(db, "games", id);
        const gameSnap = await getDoc(gameRef);

        if (gameSnap.exists()) {
          setGame({ id: gameSnap.id, ...gameSnap.data() });
        } else {
          console.log("Nie ma takiego dokumentu!");
        }
      } catch (error) {
        console.error("Błąd pobierania gry:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchGame();
  }, [id]);

  if (loading) return <div className="p-8">Ładowanie szczegółów...</div>;
  if (!game) return <div className="p-8">Błąd: Gra nie istnieje w bazie danych!</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Link href="/games" className="text-blue-500 hover:underline">← Powrót do listy</Link>
      
      <h1 className="text-3xl font-bold mt-4">{game.title}</h1>
      <p className="text-xl text-green-600 font-bold my-2">{game.price_pln || game.price} PLN</p>
      
      <div className="bg-gray-100 p-4 rounded mt-4">
        <h3 className="font-bold mb-2">Opis gry:</h3>
        {game.description?.map((paragraph, index) => (
          <p key={index} className="mb-2 text-gray-800">{paragraph}</p>
        ))}
      </div>

      <div className="mt-6 text-sm text-gray-500">
        <p>Kategoria: {game.category || game.type}</p>
        <p>Wydawca: {game.publisher}</p>
        <p>Gracze: {game.min_players} - {game.max_players}</p>
        <p>Status: {game.isSold ? "Sprzedane" : "Dostępne"}</p>
      </div>
    </div>
  );
}