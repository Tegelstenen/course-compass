import { createSlice } from "@reduxjs/toolkit";

interface userState {
  value: string;
}

// Initializing the value
const initialState: userState = {
  value: "user",
};

// createSlice form redux toolkit sets up things behind the scenes
const userSlice = createSlice({
  name: "user",
  initialState,
  // Template action, just to show the syntax
  reducers: {
    changeName: (state) => {
      state.value = "newUser";
    },
  },
});

export const { changeName } = userSlice.actions;
export default userSlice.reducer;
