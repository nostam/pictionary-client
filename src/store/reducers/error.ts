import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IError } from "../../utils/interfaces";
const initialState: IError = { message: null };

export const errorSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    updateError: (state, action: PayloadAction<IError>) => {
      state = action.payload;
    },
  },
});
export const { updateError } = errorSlice.actions;
export default errorSlice.reducer;
