import { createAsyncThunk } from "@reduxjs/toolkit";
import { getCourseCredits, getCourseInfo } from "@/lib/courses";

// Thunk to fetch course info and credits
export const fetchCourseInfo = createAsyncThunk(
  "course/fetchCourseInfo",
  async (courseCode: string) => {
    const [info, credits] = await Promise.all([
      getCourseInfo(courseCode),
      getCourseCredits(courseCode),
    ]);
    return { ...info, credits };
  },
);
