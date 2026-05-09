"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getAllGames } from "@/lib/api";
import GameList from "@/components/GameList";
import SearchBar from "@/components/SearchBar";
import Filters from "@/components/Filters";

export default function GamesPage() {
  const games = getAllGames();

  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") || 1);

  const pageSize = 10;

  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const types = [...new Set(games.map((g) => g.type))];

  const filteredGames = games.filter((game) => {
    const matchesSearch = game.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesType = selectedType
      ? game.type === selectedType
      : true;

    return matchesSearch && matchesType;
  });

  const startIndex = (page - 1) * pageSize;

  const paginatedGames = filteredGames.slice(
    startIndex,
    startIndex + pageSize
  );

  return (
    <div>
      <h1>Lista gier</h1>

      <Link href="/games/new">
        <button>Dodaj grę</button>
      </Link>

      <div className="filters">
        <SearchBar search={search} setSearch={setSearch} />
        <Filters
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          types={types}
        />
      </div>

      <GameList games={paginatedGames} />

      {/* PAGINACJA */}
      <div style={{ marginTop: 20 }}>
        {page > 1 && (
          <Link href={`/games?page=${page - 1}`}>
            ⬅ poprzednia
          </Link>
        )}

        <span style={{ margin: "0 10px" }}>
          Strona {page}
        </span>

        {startIndex + pageSize < filteredGames.length && (
          <Link href={`/games?page=${page + 1}`}>
            następna ➡
          </Link>
        )}
      </div>
    </div>
  );
}