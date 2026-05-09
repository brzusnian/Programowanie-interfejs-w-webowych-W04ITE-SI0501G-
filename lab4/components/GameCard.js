import Link from "next/link";

export default function GameCard({ game }) {
  const image = game.images?.[0] || "/placeholder.png";

  return (
    <div className="card">
      <img src={image} alt={game.title} />
      <h2>{game.title}</h2>
      <p>{game.type}</p>
      <p>{game.price_pln} zł</p>
      <Link href={`/games/${game.id}`}>Zobacz szczegóły</Link>
    </div>
  );
}