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
  const { query, filters } = useSelector((s: RootState) => s.search);
  const dispatch = useDispatch<Dispatch>(); // connect between redux and the component

  const [localQuery] = useState(query); // setLocalQuery
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
        clearTimeout(debounceRef.current as NodeJS.Timeout);
      }
    };
  }, [localQuery, query, dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  const _onSubmit = useCallback(
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
    /*<div>
      <h1>Search</h1>
      <p>Query: {query}</p>
    </div>*/
    null // the View will handle the rendering
  );
}
