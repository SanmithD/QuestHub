"use client";

import { UseAuthStore } from "@/app/store/UseAuthStore";
import { QuestDetails } from "@/app/store/UseQuestStore";
import { MessageCircle, Star, ThumbsUp } from "lucide-react";
import React, { useEffect, useState } from "react";

type UserProfileId = {
  params: Promise<{ id: string }>;
};

function ProfileById({ params }: UserProfileId) {
  const { id }= React.use(params);

  const [limit, setLimit] = useState(10);
  const getProfile = UseAuthStore((state) => state.getProfile);
  const user = UseAuthStore((state) => state.userData);
  const isLoading = UseAuthStore((state) => state.isLoading);

  useEffect(() => {
    if (id) getProfile(id, limit);
  }, [id, getProfile, limit]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">User not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* User Info */}
      <div className="bg-base-200 rounded-xl shadow p-6 mb-8">
        <h2 className="text-3xl font-bold">{user.res.username}</h2>
        <p className="text-gray-600">{user.res.email}</p>
        <p className="text-sm text-gray-500 mt-2">
          Joined : {user.res?.createdAt
              ? new Date(user.res?.createdAt).toLocaleString()
              : "Unknown date"}
        </p>
      </div>

      {/* User Quests */}
      <div>
        <h3 className="text-2xl font-semibold mb-4">Quests</h3>
        <div className="space-y-4">
          {user.userQuest?.length > 0 ? (
            user.userQuest?.map((quest: QuestDetails) => (
              <div
                key={quest._id}
                className="bg-base-100 border rounded-xl p-4 shadow hover:shadow-md transition"
              >
                <p className="text-lg font-medium">{quest.message}</p>
                <p className="text-xs text-gray-500">
                  {user.userQuest.createdAt
              ? new Date(user.userQuest.createdAt).toLocaleString()
              : "Unknown date"}
                </p>

                <div className="flex gap-4 mt-3 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4" />
                    {quest.likes?.length || 0}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {quest.comment?.length || 0}
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-yellow-500" />
                    {quest.rankValue}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No quests yet</p>
          )}
        </div>
        {user.userQuest && user.userQuest.length >= limit && (
        <div className="flex justify-center mt-6">
          <button
            className="btn btn-outline"
            onClick={() => setLimit((prev) => prev + 10)}
          >
            Load More
          </button>
        </div>
      )}
      </div>
    </div>
  );
}

export default ProfileById;
