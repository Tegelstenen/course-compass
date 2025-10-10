import { ArrowRightIcon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { motion, Variants} from "motion/react"


interface LandingPageViewProps {
  onSubmit: () => void;
}

// Animation presets (avoid doing this inline of the div)
const containerVariants: Variants = {
  hidden: { opacity: 0 }, // initial state
  visible: { // final state
    opacity: 1,
    transition: {
      staggerChildren: 0.015, // the delay between each child
    },
  },
};
const childVariants: Variants = {
  hidden: { // initial
    opacity: 0,
    y: 20, // sets the text 20px down
  },
  visible: {
    opacity: 1,
    y: 0, // final
    transition: {
      type: "spring",
      damping: 10,
      stiffness: 50,
    },
  },
};

const textToAnimate = "Explore, find and express your thoughts of all KTH courses!";

export default function LandingPageView(props: LandingPageViewProps) {

  const handleClick = () => {
    console.log("clicked!");
    props.onSubmit();
  };
  const characters = Array.from(textToAnimate);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"

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

      <div
        className="relative z-10 w-1/2 text-wrap">
        <h1 className="text-5xl font-extrabold tracking-wide leading-snug md:text-5xl">
          {characters.map((char, index) => {
            return (
              <motion.span 
                variants={childVariants}
                key={index}
                style={{ display: 'inline-block' }} 
                >
                  {char === " " ? "\u00A0" : char}
              </motion.span>
            );
          })}
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
    </motion.div>
  );
}
