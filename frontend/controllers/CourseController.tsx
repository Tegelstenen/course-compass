"use client";

import { LoremIpsum } from "lorem-ipsum";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { PostProps } from "@/components/Post";
import type { ReviewFormData } from "@/components/review";
import { useSessionData } from "@/hooks/sessionHooks";
import { checkIfCourseCodeExists } from "@/lib/courses";
import CourseView from "@/views/CourseView";

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 5,
    min: 1,
  },
  wordsPerSentence: {
    max: 16,
    min: 4,
  },
});

const mockPosts = [
  {
    postId: "1",
    wouldRecommend: true,
    content: lorem.generateSentences(1),
    easyScore: 5,
    usefulScore: 5,
    interestingScore: 5,
  },
  {
    postId: "2",
    wouldRecommend: false,
    content: lorem.generateParagraphs(3),
    easyScore: 4,
    usefulScore: 4,
    interestingScore: 4,
  },
  {
    postId: "3",
    wouldRecommend: false,
    content: lorem.generateParagraphs(3),
    easyScore: 1,
    usefulScore: 1,
    interestingScore: 1,
  },
  {
    postId: "4",
    wouldRecommend: false,
    content: lorem.generateParagraphs(3),
    easyScore: 1,
    usefulScore: 1,
    interestingScore: 1,
  },
];

const mockCourseHeader = {
  courseCode: "DD1420",
  courseName: "Foundations of Machine Learning",
  credits: 7.5,
  syllabus: lorem.generateParagraphs(10),
};

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

const likePost = (postId: string) => {
  toast(`Like not implemented`);
};

const dislikePost = (postId: string) => {
  toast(`Dislike not implemented`);
};

const addReview = async (
  courseCode: string,
  userId: string,
  reviewForm: ReviewFormData,
) => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  toast(`Review not implemented`, {
    description: `Review for ${courseCode} by ${userId} with ${reviewForm.content}`,
  });
};

const getCourseHeader = (courseCode: string) => {
  return mockCourseHeader;
};

const getCoursePosts = (courseCode: string) => {
  return mockPosts;
};

export default function CourseController() {
  const params = useParams<{ courseCode: string }>();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const { userId, isLoading: isLoadingUserId } = useSessionData();
  useEffect(() => {
    if (!params.courseCode) {
      router.push("/search");
      return;
    }

    setIsChecking(true);
    checkIfCourseCodeExists(params.courseCode)
      .then((exists) => {
        if (!exists) {
          toast("Course not found");
          router.push("/search");
        }
      })
      .catch((e) => {
        console.error("Failed to load course codes", e);
        toast("Failed to load course codes");
        router.push("/search");
      })
      .finally(() => setIsChecking(false));
  }, [params.courseCode, router]);

  if (!params.courseCode || isChecking) {
    return null; // or a skeleton/loader
  }

  const posts = getCoursePosts(params.courseCode);
  const courseHeader = getCourseHeader(params.courseCode);

  return (
    <CourseView
      courseCode={courseHeader.courseCode}
      courseName={courseHeader.courseName}
      credits={courseHeader.credits}
      syllabus={courseHeader.syllabus}
      percentageWouldRecommend={getPercentageWouldRecommend(posts)}
      courseRating={getAverageRating(posts)}
      userId={userId}
      onAddReview={addReview}
      posts={posts}
      onLikePost={likePost}
      onDislikePost={dislikePost}
    />
  );
}
