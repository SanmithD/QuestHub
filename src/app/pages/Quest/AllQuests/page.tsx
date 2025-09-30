"use client";

import QuestCard from "@/app/Components/QuestCard";
import { UseQuestStore } from "@/app/store/UseQuestStore";
import { useEffect, useState } from "react";

function AllQuest() {
  const [page, setPage] = useState(1);
  const isLoading = UseQuestStore((state) => state.isLoading);
  const getAllQuests = UseQuestStore((state) => state.getAllQuests);
  const quests = UseQuestStore((state) => state.quests);

  useEffect(() => {
    getAllQuests(JSON.stringify(page), JSON.stringify(10));
  }, []);

  if (isLoading) {
    return <p className="text-center mt-4">Loading quests...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-6 space-y-4">
      {quests && quests.length > 0 ? (
        quests.map((quest) => <QuestCard key={quest.questId} quest={quest} />)
      ) : (
        <p className="text-center text-gray-500">No quests found</p>
      )}
    </div>
  );
}

export default AllQuest;
