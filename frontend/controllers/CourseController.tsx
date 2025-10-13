"use client";

import { redirect, useParams, useRouter } from "next/navigation";
import profoundWords from "profane-words";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { CourseHeaderProps } from "@/components/CourseHeader";
import type { PostProps } from "@/components/Post";
import type { ReviewFormData } from "@/components/review";
import { useSessionData } from "@/hooks/sessionHooks";
import { checkIfCourseCodeExists, getCourseInfo } from "@/lib/courses";
import { createReview, findAllReviews } from "@/lib/reviews";
import CourseView from "@/views/CourseView";

import SuspenseView from "@/views/SuspenseView";

const getAverageRating = (posts: PostProps[]) => {
  const totalScores = posts.reduce(
    (acc, post) => ({
      easyScore: acc.easyScore + post.easyScore,
      usefulScore: acc.usefulScore + post.usefulScore,
      interestingScore: acc.interestingScore + post.interestingScore,
    }),
    { easyScore: 0, usefulScore: 0, interestingScore: 0 },
  );

  const numberOfPosts = posts.length;
  const averageEasyScore = totalScores.easyScore / numberOfPosts;
  const averageUsefulScore = totalScores.usefulScore / numberOfPosts;
  const averageInterestingScore = totalScores.interestingScore / numberOfPosts;

  return Math.round(
    (averageEasyScore + averageUsefulScore + averageInterestingScore) / 3,
  );
};

const getPercentageWouldRecommend = (posts: PostProps[]) => {
  return (
    (posts.filter((post) => post.wouldRecommend).length / posts.length) * 100
  );
};

const likePost = (_postId: string) => {
  toast(`Like not implemented`);
};

const dislikePost = (_postId: string) => {
  toast(`Dislike not implemented`);
};

const addReview = async (
  courseCode: string,
  userId: string,
  reviewForm: ReviewFormData,
): Promise<boolean> => {
  const plainText = reviewForm.content.replace(/<[^>]*>/g, " ");
  const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const profoundMatches = profoundWords
    .filter(Boolean)
    .filter((badWord) =>
      new RegExp(`\\b${escapeRegex(String(badWord))}\\b`, "i").test(plainText),
    );
  if (profoundMatches.length > 0) {
    toast(`Please refrain from using profane language`, {
      description: `Dissaproved words: ${profoundMatches.join(", ")}`,
    });
    return false;
  } else {
    try {
      await createReview(courseCode, userId, reviewForm);
      toast.success("Review added successfully!");
      return true;
    } catch (error) {
      console.error(error);
      toast.error("Failed to add review", {
        description: "Try again later",
      });
      return false;
    }
  }
};

const getCourseHeader = async (
  courseCode: string,
  userId: string,
  posts: PostProps[],
) => {
  try {
    const courseInfo = await getCourseInfo(courseCode);
    return {
      courseCode: courseInfo.course_code,
      courseName: courseInfo.course_name,
      credits: 0,
      syllabus: `${courseInfo.content} \n\n ${courseInfo.goals}`,
      courseRating: getAverageRating(posts),
      percentageWouldRecommend: getPercentageWouldRecommend(posts),
      userId,
      onAddReview: addReview,
    };
  } catch (e) {
    console.error("Failed to load course info", e);

    if (e instanceof Error && e.message.includes("not found")) {
      toast.error(`Course ${courseCode} not found`);
    } else {
      toast.error("Failed to load course information");
    }

    redirect("/search");
  }
};

const getCoursePosts = async (courseCode: string) => {
  const posts = await findAllReviews(courseCode);
  return posts?.map((post) => ({
    postId: post.id,
    wouldRecommend: post.wouldRecommend,
    content: post.content,
    easyScore: post.easyScore,
    usefulScore: post.usefulScore,
    interestingScore: post.interestingScore,
  })) as (PostProps & { postId: string })[];
};

const getPageData = async (courseCode: string, userId: string) => {
  const exists = await checkIfCourseCodeExists(courseCode);
  const posts = await getCoursePosts(courseCode);
  const courseHeader = await getCourseHeader(courseCode, userId, posts);
  return { exists, courseHeader, posts };
};

export default function CourseController() {
  const params = useParams<{ courseCode: string }>();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const { userId } = useSessionData();
  const [courseHeader, setCourseHeader] = useState<CourseHeaderProps | null>(
    null,
  );
  const [posts, setPosts] = useState<(PostProps & { postId: string })[] | null>(
    null,
  );

  const handleAddReview = async (
    courseCode: string,
    userId: string,
    reviewForm: ReviewFormData,
  ): Promise<boolean> => {
    try {
      const created = await addReview(courseCode, userId, reviewForm);
      if (!created) return false;

      // refresh the posts and course header data
      const updatedPosts = await getCoursePosts(courseCode);
      const updatedCourseHeader = await getCourseHeader(
        courseCode,
        userId,
        updatedPosts,
      );

      setPosts(updatedPosts);
      setCourseHeader(updatedCourseHeader);
      return true;
    } catch (error) {
      console.error(error);
      toast.error("Failed to add review", {
        description: "Try again later",
      });
      return false;
    }
  };

  useEffect(() => {
    if (!params.courseCode) {
      router.push("/search");
      return;
    }

    setIsChecking(true);
    getPageData(params.courseCode, userId)
      .then(({ exists, courseHeader, posts }) => {
        if (!exists) {
          toast("Course not found");
          router.push("/search");
        }
        setCourseHeader(courseHeader);
        setPosts(posts);
      })
      .catch((e) => {
        console.error("Failed to load course codes", e);
        toast("Failed to load course codes");
        router.push("/search");
      })
      .finally(() => setIsChecking(false));
  }, [params.courseCode, router, userId]);

  if (!params.courseCode || isChecking || !courseHeader || !posts) {
    return <SuspenseView />;
  } else {
    return (
      <CourseView
        courseCode={courseHeader.courseCode}
        courseName={courseHeader.courseName}
        credits={courseHeader.credits}
        syllabus={courseHeader.syllabus}
        percentageWouldRecommend={getPercentageWouldRecommend(posts)}
        courseRating={getAverageRating(posts)}
        userId={userId}
        onAddReview={handleAddReview}
        posts={posts}
        onLikePost={likePost}
        onDislikePost={dislikePost}
      />
    );
  }
}
