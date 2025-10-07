import { ThumbsDown, ThumbsUp } from "lucide-react";
import { Button } from "./ui/button";

export type PostActionBarProps = {
  postId: string;
  onPostLike: (postId: string) => void;
  onPostDislike: (postId: string) => void;
};

export default function PostActionBar(props: Readonly<PostActionBarProps>) {
  return (
    <div className="flex gap-2 justify-end py-1">
      <Button variant="ghost" onClick={() => props.onPostLike(props.postId)}>
        <ThumbsUp className="size-4" />
      </Button>
      <Button variant="ghost" onClick={() => props.onPostDislike(props.postId)}>
        <ThumbsDown className="size-4" />
      </Button>
    </div>
  );
}
