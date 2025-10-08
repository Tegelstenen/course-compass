import { SearchItem } from "@/components/SearchItem";
import { Course } from "@/models/CourseModel";

type SearchViewProps = {
  localQuery: string;
  setLocalQuery: (q: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  isLoading: boolean;
  error: string | undefined;
  results: Course[];
};

export default function SearchView({
  localQuery,
  setLocalQuery,
  onSubmit,
  isLoading,
  error,
  results,
}: SearchViewProps) {
  return (
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
