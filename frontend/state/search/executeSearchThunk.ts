// frontend/state/search/executeSearch.ts

import type { Course, SearchResponse } from "@/models/CourseModel";
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

    // encode filters as filters[key]=value
    Object.entries(filters || {}).forEach(([k, v]) => {
      if (Array.isArray(v)) {
        v.forEach((vv) => {
          params.append(`filters[${k}]`, vv);
        });
      } else {
        params.append(`filters[${k}]`, v);
      }
    });

    try {
      const res = await fetch(`/api/search?${params.toString()}`); // fetch is used to access the search endpoint in backend with params query, page number, and number of results per page
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const raw = (await res.json()) as { results: Course[] };

      const data: SearchResponse = {
        results: raw.results,
        total: raw.results.length, // we will use this to display the total number of results
        page,
        pageSize,
      };

      dispatch(searchSucceeded(data));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Search failed";
      dispatch(searchFailed(message));
    }
  };
}
