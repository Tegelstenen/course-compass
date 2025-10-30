import { createSlice } from "@reduxjs/toolkit";
import { fetchCourseInfo } from "./courseThunk";

interface CourseInfo {
  credits: number | null;
  course_name: string;
  course_code: string;
  department: string;
  goals: string;
  content: string;
}

interface CourseState {
  courseInfo: CourseInfo | null;
  loading: boolean;
  error: string | null;
}

const initialState: CourseState = {
  courseInfo: null,
  loading: false,
  error: null,
};

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourseInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseInfo.fulfilled, (state, action) => {
        state.courseInfo = action.payload;
        state.loading = false;
      })
      .addCase(fetchCourseInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? null;
      });
  },
});

export default courseSlice.reducer;
