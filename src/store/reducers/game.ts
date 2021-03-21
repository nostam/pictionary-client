import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IRoom } from "../../utils/interfaces";
import { difficulty } from "../../utils/interfaces";

const initialState: IRoom = {
  words: ["smile", "star"],
  difficulty: difficulty.easy,
  status: null,
};

export const gameSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    updateGame: (state, action: PayloadAction<IRoom>) => {
      state = action.payload;
    },
  },
});
export const { updateGame } = gameSlice.actions;
export default gameSlice.reducer;
