// frontend/state/search/executeSearch.ts

import type { SearchResponse } from "@/models/CourseModel";
import type { Dispatch, RootState } from "@/state/store";
import { searchFailed, searchRequested, searchSucceeded } from "./searchSlice";

export function executeSearch() {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const { query, page, pageSize, sort, filters } = getState().search;
    if (!query?.trim()) {
      // remove surrounding whitespace from query
      dispatch(
        searchSucceeded({
          items: [],
          total: 0,
          page: 1,
          pageSize: pageSize || 10,
        }),
      );
      return;
    }

    dispatch(searchRequested());

    const params = new URLSearchParams({
      query,
      page: String(page),
      pageSize: String(pageSize),
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
      const res = await fetch(`/api/search?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as SearchResponse;
      dispatch(searchSucceeded(data));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Search failed";
      dispatch(searchFailed(message));
    }
  };
}
