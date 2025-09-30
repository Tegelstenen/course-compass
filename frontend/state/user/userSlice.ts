import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { clearSession, getSession } from "../session/sessionSlice";

interface UserState {
  name: string;
  email: string;
}

const initialState: UserState = {
  name: "",
  email: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
    },
    clearUser: (state) => {
      state.name = "";
      state.email = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSession.rejected, (state) => {
        state.name = "";
        state.email = "";
      })
      .addCase(clearSession, (state) => {
        state.name = "";
        state.email = "";
      });
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
