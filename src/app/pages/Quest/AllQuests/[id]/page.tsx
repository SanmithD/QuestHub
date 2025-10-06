"use client";

import Comments from "@/app/Components/Comments";
import { UseQuestStore } from "@/app/store/UseQuestStore";
import { Calendar, Heart, MessageSquare, Trophy, User } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type QuestInfoProps = {
  params: Promise<{ id: string }>;
};

function QuestInfo({ params }: QuestInfoProps) {
  const { id } = React.use(params);
  const router = useRouter();
  const [userComment, setUserComment] = useState("");
  const getQuestById = UseQuestStore((state) => state.getQuestById);
  const postComment = UseQuestStore((state) => state.postComment);
  const isLoading = UseQuestStore((state) => state.isLoading);
  const quest = UseQuestStore((state) => state.currentQuest);

  useEffect(() => {
    if (id) {
      getQuestById(id);
    }
  }, [getQuestById, id]);

  if (isLoading) {
    return (
      <div className="text-center py-10 text-gray-500">Loading quest...</div>
    );
  }

  if (!quest) {
    return (
      <div className="text-center py-10 text-gray-500">No quest found</div>
    );
  }

  const handlePostComment = async () => {
    if (!userComment.trim()) return;
    await postComment(id.toString(), userComment);
    setUserComment("");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 rounded-2xl shadow-lg space-y-6">
      {quest?.userId && (
        <div onClick={()=>router.push(`/pages/User/${quest.userId?._id}`)} className="flex items-center gap-3 border-b pb-4">
          <div className="p-2 bg-gray-100 rounded-full">
            <User className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <p className="font-semibold text-lg cursor-pointer ">{quest.userId.username}</p>
            <p className="text-sm text-gray-500">{quest.userId.email}</p>
          </div>
        </div>
      )}

      <div>
        <p className="text-lg leading-relaxed">{quest.message}</p>
      </div>

      <div className="flex flex-wrap items-center gap-6 text-gray-600 text-sm">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>
            {quest.createdAt
              ? new Date(quest.createdAt).toLocaleString()
              : "Unknown date"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Heart className="w-4 h-4 text-red-500" />
          <span>{quest.likes?.length || 0} Likes</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageSquare className="w-4 h-4" />
          <span>{quest.comment?.length || 0} Comments</span>
        </div>
        <div className="flex items-center gap-1">
          <Trophy className="w-4 h-4 text-yellow-500" />
          <span>Rank {quest.rankValue}</span>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-gray-700" /> Comments
        </h2>
        <div className="w-full flex my-2 gap-1">
          <input
            type="text"
            name="comment"
            value={userComment}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUserComment(e.target.value)
            }
            className="w-full outline-0 border px-4 py-2 rounded-sm"
            placeholder="Share you'r opinion..."
          />
          <button
            type="button"
            disabled={isLoading}
            onClick={handlePostComment}
            className="w-fit px-2 py-0.5 bg-sky-500 font-bold text-white tracking-wider cursor-pointer hover:bg-sky-800"
          >
            {isLoading ? "Sending..." : "Share"}{" "}
          </button>
        </div>
        <Comments id={id} />
      </div>
    </div>
  );
}

export default QuestInfo;
