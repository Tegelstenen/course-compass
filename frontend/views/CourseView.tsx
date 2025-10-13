"use client";
import CourseHeader, {
  type CourseHeaderProps,
} from "@/components/CourseHeader";
import Post, { type PostProps } from "@/components/Post";

export type CourseViewProps = CourseHeaderProps & {
  posts: (PostProps & { postId: string })[];
  onLikePost: (postId: string) => void;
  onDislikePost: (postId: string) => void;
};

export default function CourseView(props: CourseViewProps) {
  return (
    <div className="flex h-full w-full flex-col gap-6 p-6">
      <CourseHeader
        courseCode={props.courseCode}
        courseName={props.courseName}
        courseRating={props.courseRating}
        credits={props.credits}
        syllabus={props.syllabus}
        percentageWouldRecommend={props.percentageWouldRecommend}
        onAddReview={props.onAddReview}
        userId={props.userId}
      />
      <div className="flex flex-col gap-6 items-center">
        {props.posts && props.posts.length > 0 ? (
          props.posts.map((post) => (
            <Post
              key={post.postId}
              wouldRecommend={post.wouldRecommend}
              content={post.content}
              easyScore={post.easyScore}
              usefulScore={post.usefulScore}
              interestingScore={post.interestingScore}
              likeCount={post.likeCount}
              dislikeCount={post.dislikeCount}
              userVote={post.userVote}
              postId={post.postId}
              onPostLike={props.onLikePost}
              onPostDislike={props.onDislikePost}
            />
          ))
        ) : (
          <div className="mt-12 text-center text-muted-foreground text-lg">
            No reviews yet. Be the first to add a review for this course!
          </div>
        )}
      </div>
    </div>
  );
}
