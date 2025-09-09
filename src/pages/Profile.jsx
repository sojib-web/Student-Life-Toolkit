import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  updateProfile,
  updatePassword,
  updateEmail,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Profile() {
  const { user } = useAuth();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [tempPhoto, setTempPhoto] = useState(user?.photoURL || "");
  const [email, setEmail] = useState(user?.email || "");
  const [emailPassword, setEmailPassword] = useState(""); // For reauth
  const [password, setPassword] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  // ===== Upload Image to Cloudinary with Progress =====
  const handleImageUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    setUploadProgress(0);

    setTempPhoto(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const xhr = new XMLHttpRequest();
      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`
      );

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percent);
        }
      });

      xhr.onload = () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          setPhotoURL(data.secure_url);
          toast.success("Image uploaded successfully!");
        } else {
          toast.error("Failed to upload image!");
          console.error(xhr.responseText);
        }
        setUploading(false);
        setUploadProgress(0);
      };

      xhr.onerror = () => {
        toast.error("Upload error!");
        setUploading(false);
        setUploadProgress(0);
      };

      xhr.send(formData);
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image!");
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // ===== Save Profile =====
  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty!");
      return;
    }

    try {
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: photoURL,
      });
      toast.success("Profile updated successfully!");
      setEditing(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile!");
    }
  };

  // ===== Change Email =====
  const handleChangeEmail = async () => {
    if (!emailPassword) {
      toast.error("Enter your current password to change email!");
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        emailPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updateEmail(auth.currentUser, email);
      toast.success("Email updated successfully!");
      setEmailPassword("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update email: " + error.message);
    }
  };

  // ===== Change Password =====
  const handleChangePassword = async () => {
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters!");
      return;
    }
    try {
      await updatePassword(auth.currentUser, password);
      toast.success("Password updated successfully!");
      setPassword("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update password!");
    }
  };

  // ===== Delete Account =====
  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account?"))
      return;

    try {
      await deleteUser(auth.currentUser);
      toast.success("Account deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete account!");
    }
  };

  // ===== Remove Profile Picture =====
  const handleRemovePhoto = () => {
    setPhotoURL("");
    setTempPhoto("");
    toast.info("Profile picture removed");
  };

  return (
    <div className="flex justify-center items-start sm:items-center min-h-screen  dark:bg-gray-900 p-4 sm:p-6">
      <Card className="p-6 w-full max-w-lg shadow-lg rounded-xl bg-white dark:bg-gray-800">
        <div className="flex flex-col items-center">
          <img
            src={
              tempPhoto ||
              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            }
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-pink-400 shadow-lg object-cover"
          />
          <h2 className="text-2xl font-bold mt-3 text-gray-800 dark:text-white text-center break-words">
            {name}
          </h2>
          <p className="text-gray-500 dark:text-gray-300 break-words">
            {email}
          </p>
        </div>

        {/* Edit Profile */}
        {editing && (
          <div className="mt-4 flex flex-col gap-4">
            <Input
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              type="email"
              placeholder="Update Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Current Password for Email Change"
              value={emailPassword}
              onChange={(e) => setEmailPassword(e.target.value)}
            />

            <div className="flex flex-col gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files[0])}
              />
              <Button variant="destructive" onClick={handleRemovePhoto}>
                Remove Picture
              </Button>
              {uploading && (
                <div className="w-full mt-2 bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-pink-400 h-3 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                  <p className="text-sm text-gray-500 mt-1">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              )}
            </div>

            <Button onClick={handleSave} disabled={uploading}>
              {uploading ? "Saving..." : "Save Changes"}
            </Button>

            <Button onClick={handleChangeEmail} className="mt-2">
              Update Email
            </Button>
          </div>
        )}

        {!editing && (
          <Button
            className="mt-4 w-full sm:w-auto"
            onClick={() => setEditing(true)}
          >
            Edit Profile
          </Button>
        )}

        {/* Change Password */}
        <div className="mt-6 flex flex-col gap-2">
          <Input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button className="w-full sm:w-auto" onClick={handleChangePassword}>
            Change Password
          </Button>
        </div>

        {/* Delete Account */}
        <Button
          variant="destructive"
          className="mt-6 w-full sm:w-auto"
          onClick={handleDeleteAccount}
        >
          Delete Account
        </Button>
      </Card>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        theme={isDarkMode ? "dark" : "light"}
      />
    </div>
  );
}
