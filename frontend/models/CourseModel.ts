export interface Course {
  _id: string;
  course_code: string;
  course_name: string;
  content: string;
  goals: string;
  department: string;
  rating?: number;
  credits?: number;
}

export interface SearchParams {
  // ensure this matches the backend in the future
  query: string;
  page: number;
  pageSize: number;
  sort?: string;
  filters?: Record<string, string | string[]>;
}

export interface SearchResponse {
  results: Course[]; // ensures the results are course objects (but this has to be updated to match backend logic)
  total: number;
  page: number;
  pageSize: number;
  timings?: { tookMs: number };
  // could also include facets, i.e. filters ("get all courses over a certain rating")
}
