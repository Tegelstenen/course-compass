import { LoremIpsum } from "lorem-ipsum";
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
  onAddReview: () => {
    console.log("implement add review");
  },
  onReadCourseSyllabus: () => {
    console.log("implement read course syllabus");
  },
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
  console.log("tried to like post", postId);
};

const mockOnPostDislike = (postId: string) => {
  console.log("tried to dislike post", postId);
};

export default function CourseController() {
  return (
    <CourseView
      courseCode={mockCourseHeader.courseCode}
      courseName={mockCourseHeader.courseName}
      credits={mockCourseHeader.credits}
      percentageWouldRecommend={getPercentageWouldRecommend(mockPosts)}
      courseRating={getAverageRating(mockPosts)}
      onAddReview={mockCourseHeader.onAddReview}
      onReadCourseSyllabus={mockCourseHeader.onReadCourseSyllabus}
      posts={mockPosts}
      onPostLike={mockOnPostLike}
      onPostDislike={mockOnPostDislike}
    />
  );
}
