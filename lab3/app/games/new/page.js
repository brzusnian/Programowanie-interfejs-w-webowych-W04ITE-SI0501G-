"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewGamePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    price_pln: "",
    min_players: "",
    max_players: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("/api/games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    router.push("/games");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Dodaj grę</h1>

      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Tytuł" onChange={handleChange} />
        <br />

        <input name="price_pln" placeholder="Cena" onChange={handleChange} />
        <br />

        <input name="min_players" placeholder="Min graczy" onChange={handleChange} />
        <br />

        <input name="max_players" placeholder="Max graczy" onChange={handleChange} />
        <br />

        <textarea
          name="description"
          placeholder="Opis"
          onChange={handleChange}
        />

        <br />
        <button type="submit">Dodaj</button>
      </form>
    </div>
  );
}