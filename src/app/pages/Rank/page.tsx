"use client";

import { UseQuestStore } from "@/app/store/UseQuestStore";
import { TopRankType } from "@/app/types/quest";
import { Star, ThumbsUp, Trophy, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function TopRanks() {
  const router = useRouter();
  const [limit, setLimit] = useState(20);
  const fetchTopQuest = UseQuestStore((state) => state.fetchTopQuest);
  const isLoading = UseQuestStore((state) => state.isLoading);
  const topQuest = UseQuestStore((state) => state.topQuest);
  const postLike = UseQuestStore((state) => state.postLike);

  useEffect(() => {
    fetchTopQuest(limit);
  }, [limit, fetchTopQuest]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!topQuest || topQuest.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No top ranked quests found</p>
      </div>
    );
  }

  const getRankColor = (index: number) => {
    if (index === 0) return "bg-yellow-400 text-black";
    if (index === 1) return "bg-gray-300 text-black"; 
    if (index === 2) return "bg-amber-700 text-white"; 
    return "bg-base-200 text-gray-700"; 
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="w-full flex justify-center items-center">
        <h2 className="text-3xl font-bold mb-5 text-center flex items-center gap-2">
          <Trophy className="mt-1 text-sky-500 " />
          Top Quest
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full border rounded-lg">
          <thead className="bg-base-200">
            <tr>
              <th className="text-center">Rank</th>
              <th>User</th>
              <th>Quest</th>
              <th className="text-center">Score</th>
              <th className="text-center">Likes</th>
              <th className="text-center">Date</th>
            </tr>
          </thead>
          <tbody>
            {topQuest.map((rank: TopRankType, i: number) => (
              <tr
                key={rank._id}
                onClick={() =>
                  router.push(`/pages/Quest/AllQuests/${rank.questId._id}`)
                }
                className="hover:bg-base-100 cursor-pointer transition"
              >
                <td className="text-center">
                  <span
                    className={`badge ${getRankColor(i)} font-bold px-3 py-2`}
                  >
                    #{i + 1}
                  </span>
                </td>

                <td>
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    <span className="font-medium">
                      {rank?.userId?.username || "Unknown User"}
                    </span>
                  </div>
                </td>

                <td className="max-w-sm truncate">
                  {rank?.questId?.message || "No message"}
                </td>

                <td className="text-center">
                  <div className="flex justify-center items-center gap-1 text-yellow-500">
                    <Star className="w-5 h-5 fill-yellow-500" />
                    <span>{rank?.rankValue}</span>
                  </div>
                </td>

                <td className="text-center">
                  <div
                    onClick={(e) => {
                      e.stopPropagation(), postLike(rank?.questId?._id);
                    }}
                    className="flex justify-center items-center gap-1 text-gray-600 hover:text-sky-500"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{rank?.questId?.likes?.length || 0}</span>
                  </div>
                </td>

                <td className="text-center text-sm text-gray-500">
                  {rank.createdAt
                    ? new Date(rank.createdAt).toLocaleDateString()
                    : "Unknown"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-6">
        <button
          className="btn btn-outline"
          onClick={() => setLimit((prev) => prev + 10)}
        >
          Load More
        </button>
      </div>
    </div>
  );
}

export default TopRanks;
