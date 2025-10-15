"use client";

export default function Error({ error }: { error: Error }) {
  console.error(error);
  return (<h2>Something went wrong.</h2>);
}