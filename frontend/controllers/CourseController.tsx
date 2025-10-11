import { LoremIpsum } from "lorem-ipsum";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import type { PostProps } from "@/components/Post";
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

const mockOnPostLike = (postId: string) => {
  toast(`Like not implemented`);
};

const mockOnPostDislike = (postId: string) => {
  toast(`Dislike not implemented`);
};

const addReview = (courseCode: string) => {
  toast(`Review not implemented`);
};

const readCourseSyllabus = (syllabus: string) => {
  toast(`Open syllabus not implemented`);
};

const getCourseHeader = (courseCode: string) => {
  return mockCourseHeader;
};

const getCoursePosts = (courseCode: string) => {
  return mockPosts;
};

const getAllCourseCodes = () => {
  const mockCourseCodes = ["DD1420", "DD1421", "DD1422", "DD1423", "DD1424"];
  return mockCourseCodes;
};

export default function CourseController() {
  const params = useParams<{ courseCode: string }>();
  const router = useRouter();
  const allCourseCodes = getAllCourseCodes();
  const posts = getCoursePosts(params.courseCode);
  const courseHeader = getCourseHeader(params.courseCode);

  if (params.courseCode && !allCourseCodes.includes(params.courseCode)) {
    toast(`Course not found`);
    router.push("/search");
    return null;
  }

  return (
    <CourseView
      courseCode={courseHeader.courseCode}
      courseName={courseHeader.courseName}
      credits={courseHeader.credits}
      syllabus={courseHeader.syllabus}
      percentageWouldRecommend={getPercentageWouldRecommend(posts)}
      courseRating={getAverageRating(posts)}
      onAddReview={addReview}
      onReadCourseSyllabus={readCourseSyllabus}
      posts={posts}
      onPostLike={mockOnPostLike}
      onPostDislike={mockOnPostDislike}
    />
  );
}
