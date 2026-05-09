"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db, auth } from "@/lib/firebase"; 
import { collection, addDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function NewGamePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    title: "",
    price_pln: "",
    min_players: "",
    max_players: "",
    description: "",
    category: "",  // DODANE
    publisher: "", // DODANE
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Musisz być zalogowany, aby dodać grę do bazy!");
      return;
    }

    try {
      await addDoc(collection(db, "games"), {
        title: form.title,
        price_pln: parseFloat(form.price_pln) || 0,
        min_players: parseInt(form.min_players) || 0,
        max_players: parseInt(form.max_players) || 0,
        category: form.category,   // DODANE
        publisher: form.publisher, // DODANE
        description: [form.description], 
        isSold: false,
        createdAt: new Date(),
        ownerId: user.uid,   
        ownerEmail: user.email 
      });

      alert("Gra została zapisana w chmurze!");
      router.push("/games");
      router.refresh(); 
    } catch (error) {
      console.error("Błąd dodawania:", error);
      alert("Wystąpił błąd podczas zapisywania w Firebase.");
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto text-black">
      <h1 className="text-2xl font-bold mb-6">Dodaj nową grę</h1>

      {!user && (
        <div className="bg-red-100 p-3 text-red-700 rounded mb-4">
          Uwaga: Musisz się najpierw zalogować na liście gier!
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input 
          name="title" 
          placeholder="Tytuł gry" 
          onChange={handleChange} 
          className="border p-2 rounded"
          required
        />

        {/* NOWE POLA: KATEGORIA I WYDAWCA */}
        <div className="flex gap-2">
          <input 
            name="category" 
            placeholder="Kategoria" 
            onChange={handleChange} 
            className="border p-2 rounded w-1/2"
          />
          <input 
            name="publisher" 
            placeholder="Wydawca" 
            onChange={handleChange} 
            className="border p-2 rounded w-1/2"
          />
        </div>
        
        <input 
          name="price_pln" 
          placeholder="Cena (PLN)" 
          type="number" 
          onChange={handleChange} 
          className="border p-2 rounded"
          required
        />
        
        <div className="flex gap-2">
          <input 
            name="min_players" 
            placeholder="Min. graczy" 
            type="number" 
            onChange={handleChange} 
            className="border p-2 rounded w-1/2"
          />
          <input 
            name="max_players" 
            placeholder="Max. graczy" 
            type="number" 
            onChange={handleChange} 
            className="border p-2 rounded w-1/2"
          />
        </div>
        
        <textarea
          name="description"
          placeholder="Opis gry..."
          onChange={handleChange}
          className="border p-2 rounded min-h-[120px]"
          required
        />

        <button 
          type="submit" 
          disabled={!user}
          className={`p-3 rounded font-bold text-white transition ${
            user ? 'bg-green-600 hover:bg-green-700 cursor-pointer' : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Zapisz w Firebase
        </button>
        
        <button 
          type="button" 
          onClick={() => router.back()} 
          className="text-gray-500 hover:underline text-sm"
        >
          Wróć bez zapisywania
        </button>
      </form>
    </div>
  );
}