import type React from "react";
import Navbar from "../../components/Navbar";

export default function ServiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 w-46">
        <Navbar />
      </aside>

      <main className="ml-46 min-h-screen overflow-auto">{children}</main>
    </div>
  );
}
