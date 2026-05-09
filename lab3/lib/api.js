import data from "@/data/board-games.json";

// wszystkie gry
export function getAllGames() {
  return data.board_games;
}

// jedna gra po ID
export function getGameById(id) {
  return data.board_games.find(
    (game) => game.id === Number(id)
  );
}