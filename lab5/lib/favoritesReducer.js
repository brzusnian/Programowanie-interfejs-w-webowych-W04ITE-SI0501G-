export const initialState = [];

export function favoritesReducer(state, action) {
  switch (action.type) {
    case 'INIT':
      // Ładowanie zapisanych gier z pamięci przeglądarki
      return action.payload;
    case 'ADD':
      // Zabezpieczenie, żeby nie dodać dwa razy tej samej gry
      if (state.some(game => game.id === action.payload.id)) return state;
      const updatedAdd = [...state, action.payload];
      localStorage.setItem('favorites', JSON.stringify(updatedAdd));
      return updatedAdd;
    case 'REMOVE':
      // Usuwanie gry z listy
      const updatedRemove = state.filter(game => game.id !== action.payload);
      localStorage.setItem('favorites', JSON.stringify(updatedRemove));
      return updatedRemove;
    default:
      return state;
  }
}