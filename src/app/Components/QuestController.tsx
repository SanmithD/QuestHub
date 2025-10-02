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
    
    const likeCount = useMemo(() => quest?.likes?.length || 0, [quest?.likes?.length]);
    
    const handleLike = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        postLike(quest._id);
    }, [postLike, quest._id]);
    
    const handleComment = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(`/pages/Quest/AllQuests/${quest._id}`);
    }, [router, quest._id]);
    
    const handleRank = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        postRank(quest._id);
    }, [postRank, quest._id]);

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
                    className="hover:text-blue-600 transition-colors"
                >
                    <MessageCircleMore className="w-5 h-5" />
                </button>
                <button 
                    onClick={handleRank}
                    className="hover:text-blue-600 transition-colors"
                >
                    <ArrowUp className="w-5 h-5" />
                </button>
            </div>
        </div>
    )
}

export default QuestController;
