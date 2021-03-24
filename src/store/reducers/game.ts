import { createSlice, PayloadAction } from "@reduxjs/toolkit";
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
      state.game = action.payload;
    },
  },
});
export const { updateGame } = gameSlice.actions;
export default gameSlice.reducer;
