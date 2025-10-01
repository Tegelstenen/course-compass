export interface Course {
  // the course interface makes sure the course objects are consistent
  code: string; // cource code
  name: string; // title of course
  description: string; // make sure this exists in the backend
  department: string;
  rating?: number;
  credits?: number;
  // add credits and description
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
