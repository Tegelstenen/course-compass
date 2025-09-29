import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomeView() {
  return (
    <div
      className="flex flex-col w-full justify-left p-40 bg-secondary"
      style={{
        backgroundImage: 'url("course_map.jpg")',
        backgroundSize: "75%", // Set a specific size, e.g., 30% of the container
        backgroundPosition: "right center", // Align to the left, centered vertically
        backgroundRepeat: "no-repeat", // Crucial: prevents the image from tiling
      }}
    >
      {/* Fades from transparent (left) over the image, to the background color (right) */}
      <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 via-secondary/70 to-transparent"></div>

      <div className="relative z-10 w-1/2 text-wrap">
        <h1 className="text-4xl font-extrabold tracking-wide leading-snug md:text-5xl">
          Explore, find and express your thoughts of all KTH courses!
        </h1>
        <h2 className="text-xl pt-8">
          A very short description of the app. Course Compass is built on
          student reviews to give an honest picture of the course contents.
        </h2>
      </div>
      <div className="flex relative z-10 w-full pt-8">
        <Button size="larger" variant="default" asChild>
          <Link href="/search" className="flex items-center">
            Get started
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ml-2 h-5 w-3"
              aria-label="Forward arrow icon"
            >
              <title>Arrow icon</title>
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </Button>
      </div>
    </div>
  );
}
