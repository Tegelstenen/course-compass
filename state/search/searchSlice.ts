import { createSlice } from "@reduxjs/toolkit";
import { db } from "@/lib/db/db";
import { courses } from "@/lib/db/schema";

interface searchState {
  query: string;
  departmentFilter: string | null;
  // courses: Course[];
  // error: string | null;
  // loading: boolean | null;
}

const initialState: searchState = {
  query: "",
  departmentFilter: null,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setQuery: (state, action) => {},
    setDepartmentFilter: (state, action) => {},
  },
});

export const { setQuery, setDepartmentFilter } = searchSlice.actions;

export default searchSlice.reducer;
