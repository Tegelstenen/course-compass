import { Separator } from "@/components/ui/separator";
import { Rating, RatingButton } from "@/components/ui/shadcn-io/rating";
import { Skeleton } from "@/components/ui/skeleton";

export function CourseItemSkeleton() {
  return (
    <div className="outline-solid outline-1 outline-muted-foreground/10 rounded-md p-4">
      <div className="space-y-1">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>
          <Rating value={5} readOnly>
            {(["one", "two", "three", "four", "five"] as const).map(
              (starId) => (
                <RatingButton
                  className="text-gray-100"
                  key={`star-${1}-${starId}`}
                />
              ),
            )}
          </Rating>
        </div>
        <Separator orientation="vertical" />
        <Skeleton className="h-4 w-10" />
        <Separator orientation="vertical" />
        <Skeleton className="h-4 w-10" />
      </div>
    </div>
  );
}
