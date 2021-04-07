import {
  uniqueNamesGenerator,
  adjectives,
  animals,
} from "unique-names-generator";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../index";
import { IUser } from "../../utils/interfaces";

interface userState {
  user: IUser;
}
const initialState: userState = {
  user: {
    username: uniqueNamesGenerator({
      dictionaries: [adjectives, animals],
    }),
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<object>) => {
      state.user = { ...state.user, ...action.payload };
    },
    clearUser: (state) => {
      state.user = initialState.user;
    },
  },
});

export const { setCurrentUser, clearUser } = userSlice.actions;
export const selectUser = (state: RootState) => state.user;
export default userSlice.reducer;
