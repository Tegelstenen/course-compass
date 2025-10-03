"use client";

import { useDispatch, useSelector } from "react-redux";
import SettingsView from "@/views/SettingsView";
import type { Dispatch, RootState } from "@/state/store";
import { uploadProfilePicture, deleteAccount } from "@/state/user/userThunk";
import { setProfilePicture } from "@/state/user/userSlice";


export default function SettingsController() {
    const dispatch = useDispatch();
    const { profilePicture } = useSelector((state: RootState) => state.user);

    // Handle file upload
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {

        const localPreview = URL.createObjectURL(file);
        dispatch(setProfilePicture(localPreview));   
        //dispatch(uploadProfilePicture(file) as any);  // temporarily disabled
        }
    };


    // Handle account deletion
    const handleDeleteAccount = () => {
        if (confirm("Are you sure you want to delete your account? This can't be undone.")) {
        dispatch(deleteAccount() as any);
        }
    };

  return (
    <SettingsView
      preview={profilePicture}
      handleFileChange={handleFileChange}
      handleDeleteAccount={handleDeleteAccount}
    />
  );
}
