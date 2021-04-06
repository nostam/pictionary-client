import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../index";
import { IUser } from "../../utils/interfaces";
interface userState {
  user: IUser | undefined;
}
const initialState: userState = {
  user: undefined,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<object>) => {
      state.user = { ...state.user, ...action.payload };
    },
    clearUser: (state) => {
      state.user = undefined;
    },
  },
});

export const { setCurrentUser, clearUser } = userSlice.actions;
export const selectUser = (state: RootState) => state.user;
export default userSlice.reducer;
