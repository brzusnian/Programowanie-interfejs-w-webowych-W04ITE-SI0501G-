"use client";

import { useState, useEffect, Suspense } from "react"; // Dodany Suspense
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { db, auth } from "@/lib/firebase";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword 
} from "firebase/auth"; 
import SearchBar from "@/components/SearchBar";
import Filters from "@/components/Filters";

// GŁÓWNA FUNKCJA EKSPORTOWANA (Naprawia błąd Netlify)
export default function GamesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-black font-bold">Ładowanie...</div>}>
      <GamesList />
    </Suspense>
  );
}

// TWOJA LOGIKA PRZENIESIONA TUTAJ
function GamesList() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") || 1);
  const pageSize = 10;

  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      alert("Błąd logowania: " + err.message);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
      } catch (createErr) {
        alert("Błąd: " + createErr.message);
      }
    }
  };

  const handleLogout = () => signOut(auth);

  useEffect(() => {
    async function fetchGames() {
      try {
        const gamesCol = collection(db, "games");
        const gameSnapshot = await getDocs(gamesCol);
        const gameList = gameSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setGames(gameList);
      } catch (error) {
        console.error("Błąd:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchGames();
  }, []);

  const handleDelete = async (id) => {
    if (!user) return alert("Musisz być zalogowany!");
    if (confirm("Czy na pewno chcesz usunąć SWOJĄ grę?")) {
      try {
        await deleteDoc(doc(db, "games", id));
        setGames(games.filter(g => g.id !== id));
        alert("Usunięto pomyślnie.");
      } catch (err) {
        alert("Błąd: " + err.message);
      }
    }
  };

  const handleEditGame = async (id, currentTitle, currentPrice) => {
    const newTitle = prompt("Edytuj tytuł:", currentTitle);
    const newPrice = prompt("Edytuj cenę (PLN):", currentPrice);

    if (newTitle && newPrice) {
      try {
        const gameRef = doc(db, "games", id);
        await updateDoc(gameRef, {
          title: newTitle,
          price_pln: parseFloat(newPrice) || 0
        });
        
        setGames(games.map(g => g.id === id ? { ...g, title: newTitle, price_pln: newPrice } : g));
        alert("Gra została zaktualizowana!");
      } catch (err) {
        alert("Błąd edycji: " + err.message);
      }
    }
  };

  const handleToggleSold = async (game) => {
    if (!user) return alert("Musisz być zalogowany!");
    try {
      const gameRef = doc(db, "games", game.id);
      await updateDoc(gameRef, { isSold: !game.isSold });
      setGames(games.map(g => g.id === game.id ? { ...g, isSold: !game.isSold } : g));
    } catch (err) {
      alert("Błąd: " + err.message);
    }
  };

  const types = [...new Set(games.map((g) => g.category || g.type).filter(Boolean))];
  const filteredGames = games.filter((game) => {
    const titleMatch = (game.title || "").toLowerCase().includes(search.toLowerCase());
    const typeMatch = selectedType ? (game.category === selectedType || game.type === selectedType) : true;
    return titleMatch && typeMatch;
  });

  const startIndex = (page - 1) * pageSize;
  const paginatedGames = filteredGames.slice(startIndex, startIndex + pageSize);

  if (loading) return <div className="p-8 text-center text-black font-bold">Ładowanie danych z bazy...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto text-black">
      {/* PASEK LOGOWANIA */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-8 p-6 bg-white rounded-xl shadow-md gap-4 border border-gray-200">
        <div>
          {user ? (
            <p className="text-lg">Witaj, <span className="font-bold text-blue-600">{user.email}</span></p>
          ) : (
            <p className="text-gray-500 italic">Zaloguj się, aby zarządzać grami</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {user ? (
            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold transition">
              Wyloguj
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <button onClick={handleLogin} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold transition">
                Zaloguj przez Google
              </button>
              <form onSubmit={handleEmailLogin} className="flex flex-col gap-2 border-t pt-2 mt-2">
                <input type="email" placeholder="Email" className="border p-2 rounded text-sm" onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Hasło" className="border p-2 rounded text-sm" onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded text-sm font-bold">Logowanie / Rejestracja</button>
              </form>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Board Games Market</h1>
        <Link href="/games/new">
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-bold shadow-md transition">
            + Dodaj nową grę
          </button>
        </Link>
      </div>

      <div className="filters mb-8 bg-white p-4 rounded-lg shadow-sm flex flex-col md:flex-row gap-4 border">
        <SearchBar search={search} setSearch={setSearch} />
        <Filters selectedType={selectedType} setSelectedType={setSelectedType} types={types} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paginatedGames.map((game) => (
          <div 
            key={game.id} 
            style={{
              opacity: game.isSold ? 0.4 : 1,
              filter: game.isSold ? 'grayscale(100%)' : 'none',
              backgroundColor: game.isSold ? '#f3f4f6' : '#ffffff',
              pointerEvents: game.isSold ? 'none' : 'auto'
            }}
            className="border p-5 rounded-xl shadow-sm transition-all duration-300 flex flex-col"
          >
            <div className="flex-grow">
              <Link href={`/games/${game.id}`}>
                <h2 className="text-2xl font-bold text-blue-700 hover:underline mb-1 cursor-pointer">{game.title}</h2>
              </Link>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {game.category && (
                  <span className="text-[10px] uppercase tracking-wider bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold">
                    {game.category}
                  </span>
                )}
                {game.publisher && (
                  <span className="text-[10px] uppercase tracking-wider bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-bold">
                    Wydawca: {game.publisher}
                  </span>
                )}
              </div>

              <p className="text-gray-600 mb-4 line-clamp-2">{game.description?.[0] || "Brak opisu"}</p>
              <p className="font-black text-2xl text-green-700 mb-4">{game.price_pln || game.price} PLN</p>
            </div>
            
            <div className="flex flex-col gap-2 border-t pt-4 mt-4">
              {user && user.uid !== game.ownerId && (
                <button 
                  onClick={() => handleToggleSold(game)}
                  className={`w-full py-2 rounded-lg text-white font-bold transition ${game.isSold ? 'bg-orange-500' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {game.isSold ? "Kupione" : "Kup Teraz"}
                </button>
              )}

              {user && user.uid === game.ownerId && (
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEditGame(game.id, game.title, game.price_pln)}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg font-bold"
                  >
                    Edytuj
                  </button>
                  <button 
                    onClick={() => handleDelete(game.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-bold"
                  >
                    Usuń moją grę
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 flex justify-center items-center gap-4 bg-white p-4 rounded-lg shadow-sm border">
        {page > 1 && <Link href={`/games?page=${page - 1}`} className="text-blue-600 font-bold">⬅ poprzednia</Link>}
        <span className="bg-blue-100 text-blue-800 px-4 py-1 rounded-full font-bold">Strona {page}</span>
        {startIndex + pageSize < filteredGames.length && <Link href={`/games?page=${page + 1}`} className="text-blue-600 font-bold">następna ➡</Link>}
      </div>
    </div>
  );
}