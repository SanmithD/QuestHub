"use client";

import { UseBookmarkStore } from "@/app/store/UseBookmarkStore";
import { UseQuestStore } from "@/app/store/UseQuestStore";
import { Quest } from "@/app/types/quest";
import { Bookmark } from "lucide-react";
import { useRouter } from "next/navigation";
import { lazy, Suspense, useEffect, useState } from "react";

const QuestController = lazy(()=>import('@/app/Components/QuestController'))

function AllQuest() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const isLoading = UseQuestStore((state) => state.isLoading);
  const getAllQuests = UseQuestStore((state) => state.getAllQuests);
  const quests = UseQuestStore((state) => state.quests);
  const bookmark = UseBookmarkStore((state) => state.bookmark);
  const booked = UseBookmarkStore((state) => state.booked);

  useEffect(() => {
    getAllQuests(page, limit);
  }, [page,limit, getAllQuests]);

  const loadMore = () =>{
    setLimit(limit + 10);
    setPage(page + 1);
  }

  if (isLoading) {
    return <p className="text-center mt-4">Loading quests...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-6 space-y-4">
      {quests && quests.length > 0 ? (
        quests.map((quest) => (
          <div
            key={quest._id}
            className="shadow rounded-xl p-4 border hover:bg-gray-400 border-gray-200"
          >
            <div onClick={()=>router.push(`/pages/Quest/AllQuests/${quest._id}`)}  className="cursor-pointer flex flex-col gap-2 mb-2">
              <div>
                <p className="font-semibold">{quest.userId?.username}</p>
                <p className="text-xs text-gray-500">
                  {quest.createdAt
                    ? new Date(quest.createdAt).toLocaleString()
                    : "Unknown date"}
                </p>
              </div>
            <p className=" mb-3">{quest.message.length > 200 ? quest.message.slice(0,200) + quest.message.substring(0,200) + "..." : quest.message}</p>
            </div>

            <div className="flex items-center gap-2" >
              <Suspense fallback={"Loading..."} >
            <QuestController quest={quest as unknown as Quest} />
            </Suspense>
            <button
                onClick={() => bookmark(quest._id)}
                className="p-2 rounded-full cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <Bookmark
                  className={`w-5 h-5 `}
                />
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No quests found</p>
      )}
      <button className="btn w-full text-center" onClick={loadMore} >Load more</button>
    </div>
  );
}

export default AllQuest;
