"use client";
import CourseHeader, {
  type CourseHeaderProps,
} from "@/components/CourseHeader";
import Post, { type PostProps } from "@/components/Post";

import PostActionBar from "@/components/PostActionBar";

export type CourseViewProps = CourseHeaderProps & {
  posts: (PostProps & { postId: string })[];
  onPostLike: (postId: string) => void;
  onPostDislike: (postId: string) => void;
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
      />
      <div className="flex flex-col gap-6 items-center">
        {props.posts.map((post) => (
          <div key={post.postId}>
            <Post
              wouldRecommend={post.wouldRecommend}
              content={post.content}
              easyScore={post.easyScore}
              usefulScore={post.usefulScore}
              interestingScore={post.interestingScore}
            />
            <PostActionBar
              postId={post.postId}
              onPostLike={props.onPostLike}
              onPostDislike={props.onPostDislike}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
