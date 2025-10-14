"use client";

import { redirect, useParams, useRouter } from "next/navigation";
import profoundWords from "profane-words";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { CourseHeaderProps } from "@/components/CourseHeader";
import type { PostProps } from "@/components/Post";
import type { ReviewFormData } from "@/components/review";
import { useSessionData } from "@/hooks/sessionHooks";
import {
  checkIfCourseCodeExists,
  getCourseCredits,
  getCourseInfo,
} from "@/lib/courses";
import {
  createReview,
  dislikeReview,
  findAllReviews,
  likeReview,
} from "@/lib/reviews";

type Review = {
  id: string;
  userId: string;
  courseCode: string;
  easyScore: number;
  usefulScore: number;
  interestingScore: number;
  wouldRecommend: boolean;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  likeCount: number;
  dislikeCount: number;
  userVote: string | null;
};

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

const getEasyScoreDistribution = (posts: PostProps[]) => {
  const counts = [0, 0, 0, 0, 0];
  posts.forEach((post) => {
    if (post.easyScore >= 1 && post.easyScore <= 5) {
      counts[post.easyScore - 1] += 1;
    }
  });
  return counts;
};

const getUsefulScoreDistribution = (posts: PostProps[]) => {
  const counts = [0, 0, 0, 0, 0];
  posts.forEach((post) => {
    if (post.usefulScore >= 1 && post.usefulScore <= 5) {
      counts[post.usefulScore - 1] += 1;
    }
  });
  return counts;
};

const getInterestingScoreDistribution = (posts: PostProps[]) => {
  const counts = [0, 0, 0, 0, 0];
  posts.forEach((post) => {
    if (post.interestingScore >= 1 && post.interestingScore <= 5) {
      counts[post.interestingScore - 1] += 1;
    }
  });
  return counts;
};

// Average rating distribution (1-5 stars)
const getRatingDistribution = (posts: PostProps[]) => {
  const counts = [0, 0, 0, 0, 0];
  posts.forEach((post) => {
    const avgScore = Math.round(
      (post.easyScore + post.usefulScore + post.interestingScore) / 3,
    );
    if (avgScore >= 1 && avgScore <= 5) {
      counts[avgScore - 1] += 1;
    }
  });
  return counts;
};

const getPercentageWouldRecommend = (posts: PostProps[]) => {
  return (
    (posts.filter((post) => post.wouldRecommend).length / posts.length) * 100
  );
};

const likePost = async (postId: string, userId: string) => {
  try {
    await likeReview(postId, userId);
  } catch (error) {
    console.error(error);
    toast.error("Failed to like review");
  }
};

const dislikePost = async (postId: string, userId: string) => {
  try {
    await dislikeReview(postId, userId);
  } catch (error) {
    console.error(error);
    toast.error("Failed to dislike review");
  }
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
    const credits = await getCourseCredits(courseCode);
    return {
      courseCode: courseInfo.course_code,
      courseName: courseInfo.course_name,
      credits: credits || null,
      syllabus: `${courseInfo.content} \n\n ${courseInfo.goals}`,
      courseRating: getAverageRating(posts),
      ratingDistribution: getRatingDistribution(posts),
      easyScoreDistribution: getEasyScoreDistribution(posts),
      usefulScoreDistribution: getUsefulScoreDistribution(posts),
      interestingScoreDistribution: getInterestingScoreDistribution(posts),
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

const getCoursePosts = async (courseCode: string, userId?: string) => {
  const posts = (await findAllReviews(courseCode, userId)) as Review[];
  return posts?.map((post) => ({
    postId: post.id,
    wouldRecommend: post.wouldRecommend,
    content: post.content,
    easyScore: post.easyScore,
    usefulScore: post.usefulScore,
    interestingScore: post.interestingScore,
    likeCount: post.likeCount || 0,
    dislikeCount: post.dislikeCount || 0,
    userVote: post.userVote || null,
  })) as (PostProps & { postId: string })[];
};

const getPageData = async (courseCode: string, userId: string) => {
  const exists = await checkIfCourseCodeExists(courseCode);
  const posts = await getCoursePosts(courseCode, userId);
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
      const updatedPosts = await getCoursePosts(courseCode, userId);
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

  const handleLikePost = async (postId: string) => {
    if (!userId) return;
    await likePost(postId, userId);

    // Refresh posts to get updated like counts
    const updatedPosts = await getCoursePosts(params.courseCode, userId);
    setPosts(updatedPosts);
  };

  const handleDislikePost = async (postId: string) => {
    if (!userId) return;
    await dislikePost(postId, userId);

    // Refresh posts to get updated like counts
    const updatedPosts = await getCoursePosts(params.courseCode, userId);
    setPosts(updatedPosts);
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
        easyScoreDistribution={getEasyScoreDistribution(posts)}
        usefulScoreDistribution={getUsefulScoreDistribution(posts)}
        interestingScoreDistribution={getInterestingScoreDistribution(posts)}
        ratingDistribution={getRatingDistribution(posts)}
        courseRating={getAverageRating(posts)}
        userId={userId}
        onAddReview={handleAddReview}
        posts={posts}
        onLikePost={handleLikePost}
        onDislikePost={handleDislikePost}
      />
    );
  }
}
