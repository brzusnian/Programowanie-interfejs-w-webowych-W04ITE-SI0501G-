"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditGamePage({ params }) {
  const router = useRouter();

  const [form, setForm] = useState(null);

  useEffect(() => {
    const loadGame = async () => {
      const res = await fetch("/api/games/" + params.id);
      const data = await res.json();
      setForm(data);
    };

    loadGame();
  }, [params.id]);

  if (!form) return <p>Ładowanie...</p>;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("/api/games/" + params.id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    router.push("/games/" + params.id);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Edytuj grę</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="title"
          value={form.title || ""}
          onChange={handleChange}
        />
        <br />

        <input
          name="price_pln"
          value={form.price_pln || ""}
          onChange={handleChange}
        />
        <br />

        <input
          name="min_players"
          value={form.min_players || ""}
          onChange={handleChange}
        />
        <br />

        <input
          name="max_players"
          value={form.max_players || ""}
          onChange={handleChange}
        />
        <br />

        <textarea
          name="description"
          value={form.description || ""}
          onChange={handleChange}
        />

        <br />
        <button>Zapisz</button>
      </form>
    </div>
  );
}