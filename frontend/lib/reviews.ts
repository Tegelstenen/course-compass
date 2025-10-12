import type { ReviewFormData } from "@/components/review";

export async function createReview(
  courseCode: string,
  userId: string,
  reviewForm: ReviewFormData,
): Promise<void> {
  const backend = process.env.NEXT_PUBLIC_BACKEND_DOMAIN;
  if (!backend) throw new Error("NEXT_PUBLIC_BACKEND_DOMAIN is not set");

  const res = await fetch(`${backend}/reviews`, {
    cache: "no-store",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ courseCode, userId, ...reviewForm }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}