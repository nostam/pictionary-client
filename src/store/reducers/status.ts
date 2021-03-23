import { createSlice } from "@reduxjs/toolkit";
import { IStatus } from "../../utils/interfaces";
const initialState: IStatus = { error: null, loading: false };

export const errorSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    updateError: (state, action) => {
      state.error = action.payload;
    },
  },
});
export const { updateError } = errorSlice.actions;
export default errorSlice.reducer;
