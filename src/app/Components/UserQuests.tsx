"use client";

import { ArrowUp, MessageCircle, ThumbsUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { UseAuthStore } from "../store/UseAuthStore";
import { UseQuestStore } from "../store/UseQuestStore";
import { UserQuestType } from "../types/quest";

function UserQuests() {
  const router = useRouter();
  const getUserQuest = UseAuthStore((state) => state.getUserQuest);
  const booked = UseAuthStore((state) => state.userQuest);
  const isQuestLoading = UseAuthStore((state) => state.isQuestLoading);

  const updateQuest = UseQuestStore((state) => state.updateQuest);
  const deleteQuest = UseQuestStore((state) => state.deleteQuest);

  useEffect(() => {
    getUserQuest();
  }, [getUserQuest]);

  if (isQuestLoading) {
    return <div className="p-4 text-gray-500">Loading quests...</div>;
  }

  if (!booked || booked.length === 0) {
    return <div className="p-4 text-gray-400">No quests found.</div>;
  }

  // Update using toast with input
  const handleUpdate = (id: string, prevMessage: string) => {
    let newMessage = prevMessage;

    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <input
            type="text"
            defaultValue={prevMessage}
            className="input text-white input-bordered w-full"
            onChange={(e) => (newMessage = e.target.value)}
          />
          <div className="flex gap-2 justify-end">
            <button
              className="btn btn-sm btn-primary"
              onClick={async (e) => {
                e.stopPropagation();
                toast.dismiss(t.id);
                await updateQuest(id, newMessage);
                getUserQuest();
                toast.success("Quest updated successfully");
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

  // Delete with toast confirmation
  const handleDelete = (id: string) => {
    toast(
      (t) => (
        <div className="flex items-center gap-2">
          <span>Delete this quest?</span>
          <button
            className="btn btn-sm btn-error"
            onClick={async (e) => {
              e.stopPropagation();
              toast.dismiss(t.id);
              await deleteQuest(id);
              getUserQuest();
              toast.success("Quest deleted successfully");
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
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">My Quests</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {booked.map((bookmark: UserQuestType) => (
          <div
            key={bookmark._id}
            onClick={() =>
              router.push(`/pages/Quest/AllQuests/${bookmark._id}`)
            }
            className="card bg-base-200 cursor-pointer shadow-md rounded-xl p-4 hover:shadow-lg hover:bg-gray-400 transition-shadow relative"
          >
            <div className="card-body p-0">
              <h2 className="card-title text-lg font-semibold">
                {bookmark.message ?? "Untitled Quest"}
              </h2>

              <div className="flex items-center gap-4 mt-3 text-gray-600">
                <div className="flex items-center gap-1">
                  <ThumbsUp className="w-4 h-4" />{" "}
                  <span>{bookmark.likes?.length || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />{" "}
                  <span>{bookmark.comments?.length || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ArrowUp className="w-4 h-4" />{" "}
                  <span>{bookmark.rankValue || 0}</span>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-2">
                Created on{" "}
                {bookmark.createdAt
                  ? new Date(bookmark.createdAt).toLocaleString()
                  : "Unknown date"}
              </p>

              <div className="flex justify-end gap-2 mt-3">
                <button
                  type="button"
                  className="btn btn-sm btn-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpdate(bookmark._id, bookmark.message || "");
                  }}
                >
                  Update
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-error"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(bookmark._id);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserQuests;
