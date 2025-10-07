"use client";

import { QuestDetails } from "@/app/store/UseQuestStore";
import { UseSearchStore } from "@/app/store/UseSearchStore";
import { HistoryType } from "@/app/types/quest";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export default function SearchQuest() {
  const router = useRouter();
  const fetchHistory = UseSearchStore((state) => state.fetchHistory);
  const saveHistory = UseSearchStore((state) => state.saveHistory);
  const searchQuest = UseSearchStore((state) => state.searchQuest);
  const history = UseSearchStore((state) => state.history);
  const quests = UseSearchStore((state) => state.quests);
  const isSearchLoading = UseSearchStore((state) => state.isSearchLoading);
  const removeHistory = UseSearchStore((state) => state.removeHistory);

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    fetchHistory(5);
  }, [fetchHistory]);

  console.log(history);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      searchQuest(debouncedQuery, 10);
    }
  }, [debouncedQuery, searchQuest]);

  const handleRoute = async (id: string) => {
    await saveHistory(id);
    router.push(`/pages/Quest/AllQuests/${id}`);
  };

  return (
    <div className="max-w-xl mx-auto mt-6 p-4 space-y-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search quests..."
          className="input input-bordered w-full"
        />
        {isSearchLoading && (
          <span className="loading loading-spinner loading-sm self-center"></span>
        )}
      </div>

      {!query && history.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Recent Searches</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {history.map((item: HistoryType) => (
              <button
                key={item._id}
                onClick={() => setQuery(item.questId.message)}
                className="flex items-center justify-between p-3 border rounded-lg shadow-sm hover:shadow-md hover:bg-gray-400 transition duration-200 cursor-pointer text-left"
              >
                <div>
                <p className="text-[18px] font-medium">
                  {item.questId.message.length > 50
                    ? item.questId.message.substring(0, 50) + "..."
                    : item.questId.message}
                </p>
                <span className="text-xs text-gray-500 mt-1">
                  By {item.userId.username}
                </span>
                </div>
                <button onClick={()=>removeHistory((item._id) as string)} className="relative z-50 hover:text-red-500 cursor-pointer" >
                    <X/>
                </button>
              </button>
            ))}
          </div>
        </div>
      )}

      {query && (
        <div>
          <h3 className="font-semibold mb-2">Results</h3>
          {isSearchLoading && <p>Loading results...</p>}
          {quests.length > 0 ? (
            <div className="space-y-3">
              {quests.map((quest: QuestDetails) => (
                <div
                  key={quest._id}
                  onClick={() => handleRoute(quest._id)}
                  className="p-4 border rounded-lg shadow-sm hover:bg-gray-400 cursor-pointer"
                >
                  <p className="font-semibold text-gray-500">By {quest.userId?.username}</p>
                  <p className="text-sm text-gray-500">
                    {quest.createdAt
                      ? new Date(quest.createdAt).toLocaleString()
                      : "Unknown date"}
                  </p>
                  <p className="mt-2">{quest.message}</p>
                </div>
              ))}
            </div>
          ) : (
            !isSearchLoading && (
              <p className="text-gray-500">No results found</p>
            )
          )}
        </div>
      )}
    </div>
  );
}
