import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data/board-games.json");

function readData() {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

export async function GET(_, { params }) {
  const data = readData();

  const game = data.board_games.find(
    (g) => g.id === Number(params.id)
  );

  return Response.json(game);
}

export async function PUT(req, { params }) {
  const body = await req.json();
  const data = readData();

  const index = data.board_games.findIndex(
    (g) => g.id === Number(params.id)
  );

  if (index !== -1) {
    data.board_games[index] = {
      ...data.board_games[index],
      ...body,
    };
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  return Response.json({ ok: true });
}