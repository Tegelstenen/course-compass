// frontend/state/search/executeSearch.ts

import type { Course } from "@/models/CourseModel";
import type { Dispatch, RootState } from "@/state/store";
import { searchFailed, searchRequested, searchSucceeded } from "./searchSlice";

export function executeSearch() {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const { query, page, pageSize, sort, filters } = getState().search;
    if (!query?.trim()) {
      // remove surrounding whitespace from query
      dispatch(
        // dispatch is used to dispatch an action to the store
        searchSucceeded({
          results: [], // results items
          total: 0,
          page: 1,
          pageSize: pageSize || 10, // default number of results per page is 10 for now
        }),
      );
      return;
    }

    dispatch(searchRequested()); // search requested (start of search)

    const params = new URLSearchParams({
      q: query, // query
      page: String(page), // page number
      size: String(pageSize), // how many results per page
    });
    if (sort) params.set("sort", sort);

    // encode filters directly as query parameters
    Object.entries(filters || {}).forEach(([k, v]) => {
      if (Array.isArray(v)) {
        v.forEach((vv) => {
          params.append(k, vv);
        });
      } else {
        params.append(k, v);
      }
    });

    try {
      // const res = await fetch(`/api/search?${params.toString()}`); // fetch is used to access the search endpoint in backend with params query, page number, and number of results per page
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/search?${params.toString()}`,
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const raw = (await res.json()) as {
        results: Course[];
        total: number;
      };

      dispatch(
        searchSucceeded({
          results: raw.results,
          total: raw.total,
          page: 1,
          pageSize, // unchanged, but not used yet
        }),
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Search failed";
      dispatch(searchFailed(message));
    }
  };
}
