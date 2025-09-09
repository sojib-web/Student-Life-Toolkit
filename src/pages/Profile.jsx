import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  updateProfile,
  updatePassword,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "@/utils/axiosInstance";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function Profile() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [tempPhoto, setTempPhoto] = useState(user?.photoURL || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  // ===== Upload Image =====
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
      await updateProfile(auth.currentUser, { displayName: name, photoURL });
      await auth.currentUser.reload();

      try {
        const payload = {
          email: auth.currentUser.email,
          displayName: auth.currentUser.displayName,
          photoURL: auth.currentUser.photoURL,
        };
        await axiosInstance.post("/users", payload);
      } catch (err) {
        console.error("Failed to save profile to DB:", err.message);
      }

      toast.success("Profile updated successfully!");
      setEditing(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile!");
    }
  };

  // ===== Change Password =====
  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters!");
      return;
    }
    if (!currentPassword) {
      toast.error("Enter current password for verification!");
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      await auth.currentUser.reload();

      toast.success("Password updated successfully!");
      setNewPassword("");
      setCurrentPassword("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update password: " + error.message);
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

  const handleRemovePhoto = () => {
    setPhotoURL("");
    setTempPhoto("");
    toast.info("Profile picture removed");
  };

  return (
    <div className="flex justify-center items-start sm:items-center min-h-screen  dark:bg-gray-900 p-4 sm:p-6 transition-colors">
      <Card className="p-6 w-full max-w-md shadow-xl rounded-2xl bg-white dark:bg-gray-800 transition-colors">
        {/* Profile Image */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={
              tempPhoto ||
              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            }
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-pink-400 shadow-lg object-cover"
          />
          <h2 className="text-2xl font-semibold mt-3 text-gray-800 dark:text-gray-200 text-center break-words">
            {name}
          </h2>
        </div>

        {/* Edit Form */}
        {editing && (
          <div className="flex flex-col gap-4">
            <Input
              value={name}
              placeholder="Enter Name"
              onChange={(e) => setName(e.target.value)}
              className="dark:bg-gray-700 dark:text-gray-200"
            />

            <div className="relative">
              <Input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                placeholder="Current Password"
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </span>
            </div>

            <div className="relative">
              <Input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                placeholder="New Password"
                onChange={(e) => setNewPassword(e.target.value)}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </span>
            </div>

            <Button
              onClick={handleChangePassword}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Change Password
            </Button>

            <Input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files[0])}
              className="dark:bg-gray-700 dark:text-gray-200"
            />
            <Button variant="destructive" onClick={handleRemovePhoto}>
              Remove Picture
            </Button>

            {uploading && (
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden mt-2">
                <div
                  className="bg-pink-400 h-3 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
                <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}

            <Button
              onClick={handleSave}
              disabled={uploading}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              {uploading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}

        {/* Edit/Delete buttons side by side */}
        {!editing && (
          <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
            <Button
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </Button>

            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </Button>
          </div>
        )}
      </Card>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        theme={isDarkMode ? "dark" : "light"}
      />
    </div>
  );
}
