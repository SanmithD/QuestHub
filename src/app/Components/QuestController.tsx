"use client";
import { ArrowUp, MessageCircleMore, ThumbsUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { UseQuestStore } from "../store/UseQuestStore";
import { Quest } from "../types/quest";

function QuestController({ quest }: { quest: Quest }) {
  const router = useRouter();
  const postLike = UseQuestStore(useCallback((state) => state.postLike, []));
  const postRank = UseQuestStore(useCallback((state) => state.postRank, []));

  const likeCount = useMemo(
    () => quest?.likes?.length || 0,
    [quest?.likes?.length]
  );
  const commentCount = useMemo(
    () => quest?.comments?.length || 0,
    [quest?.comments?.length]
  );
  const rank = useMemo(
    () => quest?.rankValue || 0,
    [quest?.rankValue]
  );

  const handleLike = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      postLike(quest._id);
    },
    [postLike, quest._id]
  );

  const handleComment = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      router.push(`/pages/Quest/AllQuests/${quest._id}`);
    },
    [router, quest._id]
  );

  const handleRank = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const newRankValue = quest.rankValue === 1 ? 0 : 1;
      postRank(quest._id, newRankValue);
    },
    [postRank, quest._id, quest.rankValue]
  );

  return (
    <div>
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <button
          className="flex items-center text-[20px] gap-1 cursor-pointer hover:text-blue-600 transition-colors"
          onClick={handleLike}
        >
          <ThumbsUp className="w-5 h-5" />
          <span>{likeCount}</span>
        </button>
        <button
          onClick={handleComment}
          className="flex items-center text-[20px] gap-1 cursor-pointer hover:text-blue-600 transition-colors"
        >
          <MessageCircleMore className="w-5 h-5" />
          <span>{commentCount} </span>
        </button>
        <button
          onClick={handleRank}
          className="flex items-center text-[20px] cursor-pointer hover:text-blue-600 transition-colors"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
        <span>{rank}</span>
      </div>
    </div>
  );
}

export default QuestController;
