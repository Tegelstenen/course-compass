"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { executeSearch } from "@/state/search/executeSearchThunk";
import {
  filtersChanged,
  pageChanged,
  queryChanged,
} from "@/state/search/searchSlice";
import type { Dispatch, RootState } from "@/state/store";

export default function SearchController() {
  // Access state
  const { query, filters, results, isLoading, error } = useSelector(
    (s: RootState) => s.search,
  );
  const dispatch = useDispatch<Dispatch>(); // connect between redux and the component

  const [localQuery, setLocalQuery] = useState(query); // redux synced
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null); // useRef is used to store the timeout id

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      if (localQuery !== query) {
        dispatch(queryChanged(localQuery));
        dispatch(executeSearch());
      }
    }, 300);
    return () => {
      if (debounceRef.current) {
        // debounceRef is used to clear the timeout id
        clearTimeout(debounceRef.current); // timeout is for debouncing the search (so double clicks don't trigger multiple searches)
      }
    };
  }, [localQuery, query, dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault?.();
      dispatch(queryChanged(localQuery));
      dispatch(executeSearch());
    },
    [localQuery, dispatch], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const _onPageChange = useCallback(
    (nextPage: number) => {
      dispatch(pageChanged(nextPage));
      dispatch(executeSearch());
    },
    [dispatch], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const _onFiltersChange = useCallback(
    (next: typeof filters) => {
      dispatch(filtersChanged(next));
      dispatch(executeSearch());
    },
    [dispatch], // eslint-disable-line react-hooks/exhaustive-deps
  );

  // onSortChange

  return (
    // controller will render the View in the future
    // the View will handle the rendering, so this is only temporary!!!
    <form onSubmit={onSubmit}>
      <input
        type="text"
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        placeholder="Search..."
      />
      <button type="submit">Search</button>
      {/* Test output */}
      <p>You searched for: {localQuery}</p>

      {isLoading && <p>Searching...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <ul>
        {results.map((course) => (
          <li key={course._id}>
            <strong>{course.course_code}</strong>: {course.course_name}
          </li>
        ))}
      </ul>
    </form>
  );
}
