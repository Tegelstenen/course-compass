export interface Course {
  code: string; // cource code
  name: string; // title of course
  description: string;
  department: string;
  rating?: number;
  credits?: number;
  // add credits and description
}

export interface SearchParams {
  query: string;
  page: number;
  pageSize: number;
  sort?: string;
  filters?: Record<string, string | string[]>;
}

export interface SearchResponse {
  items: Course[];
  total: number;
  page: number;
  pageSize: number;
  timings?: { tookMs: number };
  // could also include facets, i.e. filters ("get all courses over a certain rating")
}
