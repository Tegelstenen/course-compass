import { Separator } from "@/components/ui/separator";
import { Rating, RatingButton } from "@/components/ui/shadcn-io/rating";

type SearchItemProps = {
  courseName: string;
  courseCode: string;
  rating: number;
  semester: string;
  ects: number;
};

export function SearchItem({
  courseName = "Calculus in Several Variables",
  courseCode = "SF1626",
  rating = 4,
  semester = "P1",
  ects = 7.5,
}: SearchItemProps) {
  return (
    <div className="outline-solid outline-1 outline-muted-foreground/10 rounded-md p-4">
      <div className="space-y-1">
        <h4 className="text-sm leading-none font-medium">{courseName}</h4>
        <p className="text-muted-foreground text-sm">{courseCode}</p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>
          <Rating value={rating} readOnly>
            {(["one", "two", "three", "four", "five"] as const).map((starId) => (
              <RatingButton
                className="text-yellow-600"
                key={`star-${courseCode}-${starId}`}
              />
            ))}
          </Rating>
        </div>
        <Separator orientation="vertical" />
        <div>{semester}</div>
        <Separator orientation="vertical" />
        <div>{ects} ECTS</div>
      </div>
    </div>
  );
}
