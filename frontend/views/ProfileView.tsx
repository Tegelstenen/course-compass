import Image from "next/image";
import { Button } from "@/components/ui/button";

type SettingsViewProps = {
  name: string;
  email: string;
  preview: string | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDeleteAccount: () => void;
};

export default function ProfileView({
  name,
  email,
  preview,
  handleFileChange,
  handleDeleteAccount,
}: SettingsViewProps) {
  return (
    <div className="flex">
      <main className="flex-1 p-6 ml-12">
        <h1 className="text-2xl font-bold mb-8">My Profile</h1>

          {/* Profile picture section */}
          <section className="space-y-4">
          <h2 className="text-lg font-semibold">User information</h2>
          
          <p className="text-sm text-gray-700 mb-6">
          <strong className="font-medium">Name:</strong>{" "}
          {name?.trim() || email?.split("@")[0] || "Loading user..."}
          </p>
        </section>

        {/* Profile picture section */}
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

        {/* Delete account section */}
        <section className="mt-12 border-t pt-8">
          <h2 className="text-lg font-semibold text-600 mb-4">
            Delete account
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Deleting your account is permanent and cannot be undone. All your
            data will be removed.
          </p>
          <button
            type="button"
            className="px-4 py-2 rounded-md bg-red-600 text-white font-medium hover:bg-red-700 transition"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </button>
        </section>
      </main>
    </div>
  );
}
