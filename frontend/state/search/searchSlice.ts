import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Course } from "@/models/CourseModel";

type LoadingStatus = "idle" | "loading" | "succeeded" | "failed";
interface SearchState {
  query: string;
  departmentFilter: string | null;
  courses: Course[];
  error: string | null;
  status: LoadingStatus;
}

const initialState: SearchState = {
  query: "",
  departmentFilter: null,
  courses: [],
  error: null,
  status: "idle",
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    setDepartmentFilter: (state, action: PayloadAction<string | null>) => {
      state.departmentFilter = action.payload;
    },
  },
});

export const { setQuery, setDepartmentFilter } = searchSlice.actions;

export default searchSlice.reducer;
