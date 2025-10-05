"use client";

import UserQuests from "@/app/Components/UserQuests";
import { UseAuthStore } from "@/app/store/UseAuthStore";
import { Calendar, Edit3, Mail, Trash2, User2 } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import NewQuest from "../Quest/NewQuest/page";

function Profile() {
  const router = useRouter();
  const isLoading = UseAuthStore((state) => state.isLoading);
  const auth = UseAuthStore((state) => state.auth);
  const profile = UseAuthStore((state) => state.profile);
  const deleteAccount = UseAuthStore((state) => state.deleteAccount);
  const updateAccount = UseAuthStore((state) => state.updateAccount);

  useEffect(() => {
    profile();
  }, [profile]);

  if (isLoading) {
    return <div className="text-center py-10 text-gray-500">Loading...</div>;
  }

  if (!auth) {
    return <div className="text-center py-10 text-red-500">No profile found</div>;
  }

  // Update profile info (username/email, etc.)
  const handleUpdate = async() => {
    let updatedName: string = auth.username || "";

    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <input
            type="text"
            defaultValue={auth.username}
            className="input text-white input-bordered w-full"
            onChange={(e) => (updatedName = e.target.value)}
          />
          <div className="flex gap-2 justify-end">
            <button
              className="btn btn-sm btn-primary"
              onClick={async (e) => {
                e.stopPropagation();
                toast.dismiss(t.id);
                await updateAccount(updatedName);
                toast.success("Profile updated successfully");
              }}
            >
              Update
            </button>
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  const handleDelete = async() => {
    toast(
      (t) => (
        <div className="flex items-center gap-3">
          <span>Are you sure you want to delete your account?</span>
          <button
            className="btn btn-sm btn-error"
            onClick={async (e) => {
              e.stopPropagation();
              toast.dismiss(t.id);
              await deleteAccount();
              await signOut();
              router.push(`/pages/Signup`);
            }}
          >
            Yes
          </button>
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
        </div>
      ),
      { duration: Infinity }
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      {/* Profile Card */}
      <div className="shadow-md rounded-2xl p-6 max-w-lg mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-sky-100 p-4 rounded-full">
            <User2 className="w-10 h-10 text-sky-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{auth?.username}</h2>
            <p className="text-gray-500">{auth?.email}</p>
          </div>
        </div>

        <div className="space-y-3 text-gray-700">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-sky-500" />
            <span>{auth?.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-500" />
            <span>
              Joined:{" "}
              {auth?.createdAt
                ? new Date(auth?.createdAt).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-500" />
            <span>
              Updated:{" "}
              {auth?.updatedAt
                ? new Date(auth?.updatedAt).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={handleUpdate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:bg-blue-700"
          >
            <Edit3 size={18} />
            Update
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 active:bg-red-700"
          >
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </div>

      <div className="mt-10">
        <NewQuest />
      </div>
      <div>
        <UserQuests />
      </div>
    </div>
  );
}

export default Profile;
