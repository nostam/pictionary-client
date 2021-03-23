import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IRoom } from "../../utils/interfaces";
import { difficulty } from "../../utils/interfaces";

interface IProps {
  game: IRoom;
}

const initialState: IProps = {
  game: {
    words: ["smile", "star"],
    difficulty: difficulty.easy,
  },
};

export const gameSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    updateGame: (state, action: PayloadAction<IRoom>) => {
      state.game = action.payload;
    },
  },
});
export const { updateGame } = gameSlice.actions;
export default gameSlice.reducer;
