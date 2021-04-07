import { createSlice } from "@reduxjs/toolkit";
import { IRoom } from "../../utils/interfaces";
import { difficulty } from "../../utils/interfaces";

interface IProps {
  game: IRoom;
}

const initialState: IProps = {
  game: {
    words: [],
    difficulty: difficulty.easy,
  },
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    updateGame: (state, action) => {
      state.game = { ...state.game, ...action.payload };
    },
    clearGame: (state) => {
      state.game = initialState.game;
    },
  },
});
export const { updateGame, clearGame } = gameSlice.actions;
export default gameSlice.reducer;
