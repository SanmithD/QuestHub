"use client";

import { UseQuestStore } from "@/app/store/UseQuestStore";
import { Bookmark } from "lucide-react";
import { useState } from "react";
import { UseBookmarkStore } from "../store/UseBookmarkStore";
import { Quest } from "../types/quest";

interface QuestCardProps {
  quest: Quest;
}

function QuestCard({ quest }: QuestCardProps) {
  const [comment, setComment] = useState("");

  const postComment = UseQuestStore((state) => state.postComment);
  const postLike = UseQuestStore((state) => state.postLike);
  const postRank = UseQuestStore((state) => state.postRank);
  const bookmark = UseBookmarkStore((state) => state.bookmark);
  const isBooked = UseBookmarkStore((state) => state.booked[quest._id]);

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    await postComment(quest._id, comment);
    setComment("");
  };

  const handleLike = async () => {
    await postLike(quest._id);
  };

  const handleRank = async () => {
    await postRank(quest._id);
  };

  const handleBook = async (questId: string) => {
    await bookmark(questId);
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-5 border border-gray-200 hover:shadow-xl transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-400 to-blue-500 flex items-center justify-center text-white font-bold shadow">
            {quest.userId?.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-800">
              {quest.userId?.username}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(quest.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        <button
          onClick={() => handleBook(quest._id)}
          className={`p-2 rounded-full transition-colors ${
            isBooked
              ? "text-yellow-500 bg-yellow-100"
              : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50"
          }`}
        >
          <Bookmark className="w-5 h-5" />
        </button>
      </div>

      <p className="text-gray-700 mb-4 leading-relaxed">{quest.message}</p>

      <p className="text-sm text-gray-600 mb-4">
        Rank Value:{" "}
        <button
          onClick={handleRank}
          className="text-blue-600 font-medium hover:underline"
        >
          {quest.rankValue}
        </button>
      </p>

      <div className="flex items-center space-x-6 text-gray-500 text-sm mb-4">
        <button
          onClick={handleLike}
          className="flex items-center gap-1 hover:text-blue-600 transition-colors"
        >
          👍 {quest.likes?.length || 0}
        </button>
        <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
          💬 {quest.comments?.length || 0}
        </button>
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddComment}
          className="px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors"
        >
          Post
        </button>
      </div>
    </div>
  );
}

export default QuestCard;
