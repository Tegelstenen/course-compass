import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "./search/searchSlice";
import sessionReducer from "./session/sessionSlice";
import userReducer from "./user/userSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    search: searchReducer,
    session: sessionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type Dispatch = typeof store.dispatch;
