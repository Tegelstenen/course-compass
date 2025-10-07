import Link from "next/link";
import { ArrowRightIcon } from "@/components/icon";
import { Button } from "@/components/ui/button";

interface HomeViewProps {
  onSubmit: () => void;
}

export default function HomeView(props: HomeViewProps) {
  const handleClick = () => {
    console.log("clicked!");
    props.onSubmit();
  };

  return (
    <div
      className="flex flex-col w-full justify-left p-40 text-secondary"
      style={{
        backgroundImage: 'url("course_map.jpg")',
        backgroundSize: "75%", // Set a specific size, e.g., 30% of the container
        backgroundPosition: "right center", // Align to the left, centered vertically
        backgroundRepeat: "no-repeat", // Crucial: prevents the image from tiling
      }}
    >
      {/* Fades from transparent (left) over the image, to the background color (right) */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-transparent"></div>

      <div className="relative z-10 w-1/2 text-wrap">
        <h1 className="text-4xl font-extrabold tracking-wide leading-snug md:text-5xl">
          Explore, find and express your thoughts of all KTH courses!
        </h1>
        <h2 className="text-xl pt-8 font-serif">
          A very short description of the app. Course Compass is built on
          student reviews to give an honest picture of the course contents.
        </h2>
      </div>
      <div className="flex relative z-10 w-full pt-8">
        <Button size="larger" variant="default" onClick={handleClick}>
          Get started
          <ArrowRightIcon />
        </Button>
      </div>
    </div>
  );
}
