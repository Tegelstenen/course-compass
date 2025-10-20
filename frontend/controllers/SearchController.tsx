"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUser } from "@/hooks/userHooks";
import { executeSearch } from "@/state/search/executeSearchThunk";
import {
  filtersChanged,
  pageChanged,
  queryChanged,
} from "@/state/search/searchSlice";
import type { Dispatch, RootState } from "@/state/store";
import SearchView from "@/views/SearchView";
import type { Course } from "../models/CourseModel";

export default function SearchController() {
  // Access state
  const { query, filters, results, isLoading, error } = useSelector(
    (s: RootState) => s.search,
  );
  const { userFavorites } = useUser(); // useUser hook to fetch from Redux
  const dispatch = useDispatch<Dispatch>(); // connect between redux and the component
  const router = useRouter();
  const [localQuery, setLocalQuery] = useState(
    query || "interaction programming",
  ); // redux synced
  const [resultsFull, setResultsFull] = useState<Course[]>([]);
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

  // Adds 'isUserFavorites' to the result course object
  useEffect(() => {
    const resultsWithFavorites = results.map((result) => ({
      ...result,
      isUserFavorite: userFavorites.includes(result.course_code),
    }));
    setResultsFull(resultsWithFavorites);
  }, [results, userFavorites]);

  // Are the "useCallbacks" really necessary here for the callback functions?

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

  const onSeeReviews = useCallback(
    (courseCode: string) => {
      router.push(`/course/${courseCode}`);
    },
    [router],
  );

  const onAddFavorite = (code: string) => {
    //TODO: call hook to add course
    console.log("in controller and adding course to favorite..");
    return;
  };

  return (
    <SearchView
      localQuery={localQuery}
      setLocalQuery={setLocalQuery}
      onSubmit={onSubmit}
      isLoading={isLoading}
      error={error}
      results={resultsFull} // Needs to be of type Course
      filters={filters}
      onFiltersChange={_onFiltersChange}
      onSeeReviews={onSeeReviews}
      onAddFavorite={onAddFavorite}
    />
  );
}
