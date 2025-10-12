import type { ReviewFormData } from "@/components/review";
import type { SelectReview } from "../../types/database/schema";

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

export async function findAllReviews(
  courseCode: string,
): Promise<SelectReview[] | null> {
  const backend = process.env.NEXT_PUBLIC_BACKEND_DOMAIN;
  if (!backend) throw new Error("NEXT_PUBLIC_BACKEND_DOMAIN is not set");

  // Build URL with optional courseCode query param
  const url = `${backend}/reviews?courseCode=${encodeURIComponent(courseCode)}`;

  const res = await fetch(url, {
    cache: "no-store",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

