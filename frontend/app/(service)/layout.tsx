// frontend/app/(service)/layout.tsx
import type React from "react";
import AuthProvider from "@/providers/AuthProvider";
import Navbar from "../../components/Navbar";

// This layout component wraps all pages in the (service) group
export default function ServiceLayout({
  children,
}: {
  children: React.ReactNode; // 'children' is the content of the nested pages (e.g., the page.tsx file)
}) {
  return (
    <AuthProvider>
      <div className="flex w-full">
        <Navbar />
        <main className="p-8">{children}</main>
      </div>
    </AuthProvider>
  );
}
