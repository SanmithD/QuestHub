"use client";

import { User2 } from "lucide-react";
import { useEffect, useState } from "react";
import { UseQuestStore } from "../store/UseQuestStore";
import { QuestComment } from "../types/quest";

type CommentsProps = {
  id: string;
};

function Comments({ id }: CommentsProps) {
  const [limit, setLimit] = useState(10);
  const isLoading = UseQuestStore((state) => state.isCommentLoading);
  const fetchComments = UseQuestStore((state) => state.fetchComments);
  const comments = UseQuestStore((state) => state.comments) as QuestComment[];

  useEffect(() => {
    if (id) {
      fetchComments(id, limit);
    }
  }, [id, limit, fetchComments]);

  if (isLoading) {
    return <div className="text-gray-500">Loading comments...</div>;
  }

  if (!comments || comments.length === 0) {
    return <div className="text-gray-400">No comments yet</div>;
  }

  return (
    <div className="h-screen overflow-y-scroll mt-4 space-y-3">
      {comments.map((c) => (
        <div
          key={c._id}
          className="p-3 rounded-lg text-sm "
        >
          <p className="font-medium flex items-center text-[18px] gap-1">
            <User2 size={20} /> {c.userId?.username ? c.userId?.username : 'Unknown'}
          </p>
          <p>{c.message}</p>
          {c.createdAt && (
            <p className="text-xs text-gray-400 mt-1">
              {new Date(c.createdAt).toLocaleString()}
            </p>
          )}
        </div>
      ))}

      <button
        className="px-3 py-1 mt-4 bg-sky-500 rounded"
        onClick={() => setLimit(limit + 10)}
      >
        Load more
      </button>
    </div>
  );
}

export default Comments;
