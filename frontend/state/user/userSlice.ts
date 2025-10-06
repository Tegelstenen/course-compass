import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { clearSession, getSession } from "../session/sessionSlice";

export interface UserState {
  name: string;
  email: string;
  userFavorites: [];
  profilePicture: string | null;
}

const initialState: UserState = {
  name: "",
  email: "",
  userFavorites: [],
  profilePicture: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.profilePicture = action.payload.profilePicture ?? null;
    },
    setProfilePicture: (state, action: PayloadAction<string>) => {
      state.profilePicture = action.payload;
    },
    clearUser: (state) => {
      state.name = "";
      state.email = "";
      state.profilePicture = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSession.rejected, (state) => {
        state.name = "";
        state.email = "";
        state.profilePicture = null;
      })
      .addCase(clearSession, (state) => {
        state.name = "";
        state.email = "";
        state.profilePicture = null;
      });
  },
});

export const { setUser, setProfilePicture, clearUser } = userSlice.actions;
export default userSlice.reducer;
