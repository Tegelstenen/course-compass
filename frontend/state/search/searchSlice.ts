import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  Course,
  SearchParams,
  SearchResponse,
} from "@/models/CourseModel";

interface SearchState {
  query: string;
  results: Course[]; // search results are course objects
  total: number;
  page: number; // current page
  pageSize: number; // number of results per page
  isLoading: boolean;
  error?: string;
  filters: Record<string, string | string[]>;
  sort?: string; // sort by
}

const initialState: SearchState = {
  query: "",
  results: [],
  total: 0,
  page: 1,
  pageSize: 10,
  isLoading: false,
  filters: {},
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    queryChanged(state, action: PayloadAction<string>) {
      state.query = action.payload;
      state.page = 1;
    },
    pageChanged(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    filtersChanged(state, action: PayloadAction<SearchState["filters"]>) {
      state.filters = action.payload;
      state.page = 1;
    },
    sortChanged(state, action: PayloadAction<string | undefined>) {
      state.sort = action.payload;
      state.page = 1;
    },
    searchRequested(state) {
      state.isLoading = true;
      state.error = undefined;
    },
    searchSucceeded(state, action: PayloadAction<SearchResponse>) {
      const { items, total, page, pageSize } = action.payload;
      state.results = items;
      state.total = total;
      state.page = page;
      state.pageSize = pageSize;
      state.isLoading = false;
    },
    searchFailed(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  queryChanged,
  pageChanged,
  filtersChanged,
  sortChanged,
  searchRequested,
  searchSucceeded,
  searchFailed,
} = searchSlice.actions;

export default searchSlice.reducer;
