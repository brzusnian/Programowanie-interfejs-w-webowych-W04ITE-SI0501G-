"use client";

export default function SearchBar({ search, setSearch }) {
  return (
    <input
      type="text"
      placeholder="Szukaj gry..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="input"
    />
  );
}