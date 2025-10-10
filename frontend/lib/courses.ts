export async function checkIfCourseCodeExists(
  courseCode: string,
): Promise<boolean> {
  const backend = process.env.NEXT_PUBLIC_BACKEND_DOMAIN;
  if (!backend) throw new Error("NEXT_PUBLIC_BACKEND_DOMAIN is not set");

  const res = await fetch(
    `${backend}/course/neon/courseCodeExists/${courseCode}`,
    {
      cache: "no-store",
    },
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const data = (await res.json()) as { exists: boolean };
  return data.exists;
}
