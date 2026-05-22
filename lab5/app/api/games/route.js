import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data/board-games.json");

export async function POST(req) {
  const body = await req.json();

  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  const newGame = {
    id: Date.now(),
    title: body.title,
    price_pln: Number(body.price_pln),
    min_players: Number(body.min_players),
    max_players: Number(body.max_players),
    description: body.description,
    images: [],
    auction: null,
    is_expansion: false,
    type: "custom",
  };

  data.board_games.push(newGame);

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  return Response.json({ ok: true });
}