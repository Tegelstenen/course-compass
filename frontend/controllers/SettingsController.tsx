"use client"; 
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function SettingsController() {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file); // create preview URL
      setPreview(url);
    }
  };

  return (
    <div className="flex">
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-8">Account Settings</h1>

        {/* Profile picture upload */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Profile Picture</h2>

          <div className="flex flex-col items-center gap-4">
            {preview ? (
              <Image
                src={preview}
                alt="Profile Preview"
                width={150}
                height={150}
                className="rounded-full border object-cover w-36 h-36"
              />
            ) : (
              <div className="w-36 h-36 rounded-full bg-gray-200 flex items-center justify-center border">
                <span className="text-gray-500 text-sm">No image</span>
              </div>
            )}

            <div>
              <input
                type="file"
                accept="image/*"
                id="profile-upload"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="profile-upload">
                <Button asChild>
                  <span>Upload New</span>
                </Button>
              </label>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}