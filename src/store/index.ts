import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./reducers/user";
import roomList from "./reducers/rooms";

const store = configureStore({
  reducer: { user: userSlice, rooms: roomList },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
