import { getGameById } from "@/lib/api";

// Dodajemy async przed funkcją
export default async function GameDetailsPage({ params }) {
  // W Next.js 15 musimy "wyjąć" parametry za pomocą await
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const game = getGameById(id);

  if (!game) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>Gra nie istnieje</h1>
        <p>Szukane ID: {id}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>{game.title}</h1>

      <div className="details-images" style={{ display: "flex", gap: "10px", margin: "20px 0" }}>
        {game.images.length > 0 ? (
          game.images.map((img, index) => (
            <img 
              key={index} 
              src={`/${img}`} 
              alt={game.title} 
              style={{ width: "300px", borderRadius: "8px" }}
            />
          ))
        ) : (
          <div style={{ width: "300px", height: "200px", background: "#eee", display: "flex", alignItems: "center", justifyContent: "center" }}>
             Brak zdjęcia
          </div>
        )}
      </div>

      <div style={{ background: "#f9f9f9", padding: "15px", borderRadius: "8px" }}>
        <p><strong>Typ:</strong> {game.type}</p>
        <p><strong>Wydawnictwo:</strong> {game.publisher}</p>
        <p><strong>Sugerowana ilość graczy:</strong> {game.min_players} - {game.max_players}</p>
        <p><strong>Średni czas gry:</strong> {game.avg_play_time_minutes} min</p>
        <p><strong>Cena:</strong> {game.price_pln} zł</p>
      </div>

      <h2>Opis</h2>
      {(Array.isArray(game.description)
        ? game.description
        : [game.description]
        ).map((line, index) => (
        <p key={index} style={{ marginBottom: "10px" }}>
            {line}
        </p>
))}
      
    </div>
  );
}