"use client";

import { UseQuestStore } from "@/app/store/UseQuestStore";
import { useState } from "react";
import { Quest } from "../types/quest";

interface QuestCardProps {
  quest: Quest;
}

function QuestCard({ quest }: QuestCardProps) {
  const [comment, setComment] = useState("");

  const postComment = UseQuestStore((state) => state.postComment);
  const postLike = UseQuestStore((state) => state.postLike);
  const postRank = UseQuestStore((state) => state.postRank);

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

  return (
    <div className="bg-white shadow-md rounded-2xl p-4 border border-gray-200">
      {/* User Info */}
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-bold">
          {quest.userId?.username?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold">{quest.userId?.username}</p>
          <p className="text-xs text-gray-500">
            {new Date(quest.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Message */}
      <p className="text-gray-800 mb-3">{quest.message}</p>

      {/* Rank */}
      <p className="text-sm text-gray-600 mb-3">
        Rank Value:{" "}
        <button
          onClick={handleRank}
          className="text-blue-600 font-semibold hover:underline"
        >
          {quest.rankValue}
        </button>
      </p>

      {/* Actions */}
      <div className="flex items-center space-x-6 text-gray-500 text-sm mb-3">
        <button onClick={handleLike} className="hover:text-blue-500">
          👍 {quest.likes?.length || 0}
        </button>
        <button className="hover:text-blue-500">
          💬 {quest.comments?.length || 0}
        </button>
      </div>

      {/* Comment Input */}
      <div className="flex space-x-2">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          onClick={handleAddComment}
          className="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
        >
          Post
        </button>
      </div>
    </div>
  );
}

export default QuestCard;
