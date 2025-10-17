"use client";

import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Session from "supertokens-auth-react/recipe/session";
import type { Dispatch, RootState } from "@/state/store";
import { setProfilePicture } from "@/state/user/userSlice";
import {
  deleteAccount,
  getUser,
  uploadProfilePicture,
} from "@/state/user/userThunk";
import ProfileView from "@/views/ProfileView";

export default function ProfileController() {
  const router = useRouter();
  const dispatch = useDispatch<Dispatch>();
  const { name, email, profilePicture } = useSelector(
    (state: RootState) => state.user,
  );

  // Handle file upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const localPreview = URL.createObjectURL(file);
      dispatch(setProfilePicture(localPreview));

      try {
        await dispatch(uploadProfilePicture(file) as any);
        await dispatch(getUser() as any);
        URL.revokeObjectURL(localPreview);
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (
      confirm(
        "Are you sure you want to delete your account? This can't be undone.",
      )
    ) {
      await dispatch(deleteAccount());
      await Session.signOut();
      router.push("/");
    }
  };

  return (
    <ProfileView
      name={name}
      email={email}
      preview={profilePicture}
      handleFileChange={handleFileChange}
      handleDeleteAccount={handleDeleteAccount}
    />
  );
}
