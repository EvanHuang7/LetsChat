import React from "react";
import { Send, X } from "lucide-react";

import { useMomentStore } from "../../../store/useMomentStore";

const CommentWriter = () => {
  const {
    commentText,
    setCommentText,
    setActiveCommentMomentId,
    handlePostComment,
  } = useMomentStore();

  return (
    <div className="mt-4 ml-10 bg-base-300 p-3 pt-1 rounded relative">
      {/* Close button */}
      <button
        onClick={() => setActiveCommentMomentId(null)}
        className="absolute top-2 right-2 mr-2 mt-2 text-zinc-400 hover:text-zinc-600"
      >
        <X size={18} />
      </button>

      {/* Input textarea */}
      <textarea
        rows="3"
        className="w-full p-2 mt-2 border border-zinc-300 rounded text-sm resize-none"
        placeholder="Write a comment..."
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
      />

      {/* Post comment button */}
      <div className="text-right mt-2">
        <button className="btn btn-circle" onClick={handlePostComment}>
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default CommentWriter;
