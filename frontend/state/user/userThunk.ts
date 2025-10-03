import type { Dispatch, RootState } from "@/state/store";
import { clearUser, setProfilePicture, setUser } from "./userSlice";

// Uploading profile picture
export function uploadProfilePicture(file: File) {
  return async (dispatch: Dispatch) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:8080/user/profile-picture", {
        // temporary URL
        method: "POST",
        body: formData,
        credentials: "include", // send cookies/session to backend
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      dispatch(setProfilePicture(data.url));
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };
}

// Delete account
export function deleteAccount() {
  return async (dispatch: Dispatch) => {
    try {
      const res = await fetch("/api/user", { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      dispatch(clearUser());
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };
}
