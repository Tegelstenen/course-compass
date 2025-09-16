import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import searchReducer from "./search/searchSlice"; 

export const store = configureStore({
  reducer: {
    user: userReducer,
    search: searchReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type Dispatch = typeof store.dispatch;
