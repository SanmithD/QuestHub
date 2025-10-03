import { User2 } from "lucide-react";
import { useEffect } from "react";
import { UseQuestStore } from "../store/UseQuestStore";

type CommentsProps = {
  id: string;
};

function Comments({id}: CommentsProps) {
  const isLoading = UseQuestStore((state) => state.isCommentLoading);
  const fetchComments = UseQuestStore((state) => state.fetchComments);
  const comments = UseQuestStore((state) => state.comments);

  useEffect(() => {
    if (id) {
      fetchComments(id, 10);
    }
  }, []);

  if (isLoading) {
    return <div className="text-gray-500">Loading comments...</div>;
  }

  if (!comments || comments.length === 0) {
    return <div className="text-gray-400">No comments yet</div>;
  }

  return (
    <div className="mt-4 space-y-3">
      {comments.map((c, idx) => (
        <div
          key={idx}
          className="p-3 border rounded-lg bg-gray-50 text-sm text-gray-700"
        >
          <p className="font-medium flex items-center text-[18px] gap-1"><User2 size={20} /> {c.userId?.username}</p>
          <p>{c.message}</p>
          {c.createdAt && (
            <p className="text-xs text-gray-400 mt-1">
              {new Date(c.createdAt).toLocaleString()}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export default Comments;
