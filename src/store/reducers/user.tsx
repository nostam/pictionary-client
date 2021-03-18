import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../index";

interface userState {
  user: object;
  loading: boolean;
  errMsg: String | null;
}
const initialState: userState = { user: {}, loading: false, errMsg: null };

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    fetchingInfo: (state) => {
      state.loading = true;
    },
    handleError: (state, action: PayloadAction<string>) => {
      state.errMsg = action.payload;
    },
    setCurrentUser: (state, action: PayloadAction<object>) => {
      state.user = action.payload;
      state.loading = false;
    },
  },
});

export const { setCurrentUser, handleError, fetchingInfo } = userSlice.actions;
export const selectUser = (state: RootState) => state.user;
export default userSlice.reducer;
