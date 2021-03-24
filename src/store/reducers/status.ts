import { createSlice } from "@reduxjs/toolkit";
import { IStatus } from "../../utils/interfaces";
const initialState: IStatus = { error: null, loading: false, alert: null };

export const errorSlice = createSlice({
  name: "status",
  initialState,
  reducers: {
    updateError: (state, action) => {
      state.error = action.payload;
    },
    updateAlert: (state, action) => {
      state.alert = action.payload;
    },
  },
});
export const { updateError, updateAlert } = errorSlice.actions;
export default errorSlice.reducer;
