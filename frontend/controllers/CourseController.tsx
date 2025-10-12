"use client";

import type { CourseHeaderProps } from "@/components/CourseHeader";
import type { PostProps } from "@/components/Post";
import type { ReviewFormData } from "@/components/review";
import { useSessionData } from "@/hooks/sessionHooks";
import { checkIfCourseCodeExists, getCourseInfo } from "@/lib/courses";
import { createReview } from "@/lib/reviews";
import CourseView from "@/views/CourseView";
import { LoremIpsum } from "lorem-ipsum";
import { redirect, useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import SuspenseView from "@/views/SuspenseView";

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
    content: `<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl" style="text-align: center;"><span style="white-space: pre-wrap;">Excellent Course Experience</span></h1><p class="leading-7 [&:not(:first-child)]:mt-6"><span style="white-space: pre-wrap;">This course was absolutely fantastic! The professor explained complex machine learning concepts in a way that was easy to understand. The assignments were challenging but fair, and the projects really helped solidify my understanding.</span></p><p class="leading-7 [&:not(:first-child)]:mt-6" style="text-align: right;"><b><strong class="font-bold" style="white-space: pre-wrap;">I would definitely recommend this course to anyone interested in ML. The hands-on approach and real-world examples made learning enjoyable.</strong></b></p><blockquote class="mt-6 border-l-2 pl-6 italic" style="text-align: left;"><span style="white-space: pre-wrap;">"The best course I've taken this semester!"</span></blockquote>`,
    easyScore: 5,
    usefulScore: 5,
    interestingScore: 5,
  },
  {
    postId: "2",
    wouldRecommend: false,
    content: `<h2 class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">Mixed Feelings About This Course</h2><p class="leading-7 [&:not(:first-child)]:mt-6"><span style="white-space: pre-wrap;">The course content was interesting and the professor was knowledgeable, but the workload was quite heavy. There were multiple assignments due each week, and the final project was particularly challenging.</span></p><p class="leading-7 [&:not(:first-child)]:mt-6"><span style="white-space: pre-wrap;">The lectures were well-structured, but I felt like some topics were rushed. The group projects were helpful for understanding the material, but coordinating with teammates was sometimes difficult.</span></p><ul class="my-6 ml-6 list-disc [&>li]:mt-2"><li class="mt-2">Heavy workload</li><li class="mt-2">Fast-paced lectures</li><li class="mt-2">Group work challenges</li></ul>`,
    easyScore: 4,
    usefulScore: 4,
    interestingScore: 4,
  },
  {
    postId: "3",
    wouldRecommend: false,
    content: `<h3 class="scroll-m-20 text-2xl font-semibold tracking-tight">Not What I Expected</h3><p class="leading-7 [&:not(:first-child)]:mt-6"><span style="white-space: pre-wrap;">This course was much more difficult than I anticipated. The prerequisites weren't clearly communicated, and I felt lost from the beginning. The professor moved through material very quickly without checking if students understood.</span></p><p class="leading-7 [&:not(:first-child)]:mt-6" style="text-align: center;"><em><span style="white-space: pre-wrap;">The assignments were poorly explained and the grading was inconsistent.</span></em></p><blockquote class="mt-6 border-l-2 pl-6 italic" style="text-align: left;"><span style="white-space: pre-wrap;">"I wish I had taken a different course instead."</span></blockquote><p class="leading-7 [&:not(:first-child)]:mt-6"><br></p>`,
    easyScore: 1,
    usefulScore: 1,
    interestingScore: 1,
  },
  {
    postId: "4",
    wouldRecommend: false,
    content: `<h2 class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">Disappointing Experience</h2><p class="leading-7 [&:not(:first-child)]:mt-6"><span style="white-space: pre-wrap;">The course structure was confusing and the professor was often unavailable for help. The textbook was outdated and didn't match the lecture content. Many students struggled to understand the material.</span></p><ol class="my-7 ml-6 list-decimal [&>li]:mt-2"><li class="mt-2">Poor course organization</li><li class="mt-2">Unhelpful professor</li><li class="mt-2">Outdated materials</li><li class="mt-2">Lack of support</li></ol><p class="leading-7 [&:not(:first-child)]:mt-6"><span style="white-space: pre-wrap;">I would not recommend this course to other students. The experience was frustrating and didn't provide the learning outcomes I was hoping for.</span></p>`,
    easyScore: 1,
    usefulScore: 1,
    interestingScore: 1,
  },
];

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
  try {
    await createReview(courseCode, userId, reviewForm);
    toast.success("Review added successfully!");
  } catch (error) {
    console.error(error);
    toast.error("Failed to add review", {
      description: "Try again later",
    });
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
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return mockPosts;
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
  const [posts, setPosts] = useState<PostProps[] | null>(null);

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
        onAddReview={addReview}
        posts={posts}
        onLikePost={likePost}
        onDislikePost={dislikePost}
      />
    );
  }
}
