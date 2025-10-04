"use client";

import { UseBookmarkStore } from "@/app/store/UseBookmarkStore";
import { BookQuest } from "@/app/types/quest";
import { ArrowUp, MessageCircle, ThumbsUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function Bookmarked() {
    const router = useRouter();
  const getBook = UseBookmarkStore((state) => state.getBookmarked);
  const booked = UseBookmarkStore((state) => state.booked);
  const isLoading = UseBookmarkStore((state) => state.isLoading);

  useEffect(() => {
    getBook();
  }, [getBook]);

  if (isLoading) {
    return <div className="p-4 text-gray-500">Loading bookmarks...</div>;
  }

  if (!booked) {
    return <div className="p-4 text-gray-400">No bookmarks yet.</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Bookmarked Quests</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {booked.map((bookmark: BookQuest) => (
          <div
            key={bookmark._id}
            onClick={()=>router.push(`/pages/Quest/AllQuests/${bookmark.questId?._id}`)}
            className="card bg-base-200 cursor-pointer shadow-md rounded-xl p-4 hover:shadow-lg transition-shadow hover:bg-gray-400 "
          >
            <div className="card-body p-0">
              <h2 className="card-title text-lg font-semibold">
                {bookmark.questId?.message ?? "Untitled Quest"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                by {bookmark.userId?.username ?? "Unknown User"}
              </p>

              <div className="flex items-center gap-4 mt-3 text-gray-600">
                <div className="flex items-center gap-1">
                  <ThumbsUp className="w-4 h-4" />{" "}
                  <span>{bookmark.questId?.likes?.length || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />{" "}
                  <span>{bookmark.questId?.comments?.length || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ArrowUp className="w-4 h-4" />{" "}
                  <span>{bookmark.questId?.rankValue || 0}</span>
                </div>
              </div>

              <p className="text-xs text-gray-600 mt-2">
                Bookmarked on {bookmark.createdAt
                    ? new Date(bookmark.createdAt).toLocaleString()
                    : "Unknown date"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Bookmarked;
