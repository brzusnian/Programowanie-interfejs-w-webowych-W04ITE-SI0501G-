'use client'; // Musi być na samej górze, bo używamy stanów (useEffect, useReducer)

import Link from "next/link";
import { useReducer, useEffect } from 'react';
import { favoritesReducer, initialState } from '@/lib/favoritesReducer';

export default function GameCard({ game }) {
  const image = game.images?.[0] || "/placeholder.png";

  // 1. Inicjalizacja reducera dla ulubionych
  const [favorites, dispatch] = useReducer(favoritesReducer, initialState);

  // 2. Ładowanie stanu z localStorage po załadowaniu karty w przeglądarce
  useEffect(() => {
    const saved = localStorage.getItem('favorites');
    if (saved) {
      dispatch({ type: 'INIT', payload: JSON.parse(saved) });
    }
  }, []);

  // 3. Sprawdzenie, czy ta konkretna gra jest już w ulubionych
  const isFavorite = favorites.some(fav => fav.id === game.id);

  // 4. Obsługa kliknięcia w serduszko
  const handleFavoriteClick = (e) => {
    e.preventDefault(); // Blokuje akcję, żeby kliknięcie w serduszko nie odpaliło Linku
    if (isFavorite) {
      dispatch({ type: 'REMOVE', payload: game.id });
    } else {
      dispatch({ type: 'ADD', payload: game });
    }
  };

  return (
    <div className="card">
      <img src={image} alt={game.title} />
      <h2>{game.title}</h2>
      <p>{game.type}</p>
      <p>{game.price_pln} zł</p>
      
      {/* --- NOWY PRZYCISK ULUBIONYCH (Wymaganie na 3.0) --- */}
      <button
        onClick={handleFavoriteClick}
        style={{
          marginTop: '8px',
          width: '100%',
          padding: '8px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          backgroundColor: isFavorite ? '#ef4444' : '#6b7280',
          color: 'white',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'background-color 0.2s'
        }}
      >
        {isFavorite ? '❤️ Usuń z ulubionych' : '🤍 Dodaj do ulubionych'}
      </button>
      {/* ------------------------------------------------- */}

      <Link href={`/games/${game.id}`} style={{ display: 'block', marginTop: '8px' }}>
        Zobacz szczegóły
      </Link>
    </div>
  );
}