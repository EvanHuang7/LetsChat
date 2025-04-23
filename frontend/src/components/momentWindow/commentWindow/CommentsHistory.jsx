import React from "react";

const CommentsHistory = ({ comments }) => {
  return (
    <div className="mt-2 pt-2 pl-2 ml-10 bg-base-300">
      {/* Comments section */}
      <div className="space-y-4">
        {/* Hardcoded comments for demo */}
        {comments.map((comment) => (
          <div key={comment._id} className="flex items-start gap-3 pb-3">
            <img
              src={comment.posterId.profilePic}
              alt={comment.posterId.fullName}
              className="w-8 h-8 rounded-full object-cover border"
            />
            <div className="flex-1">
              {/* Comment user name */}
              <div className="text-sm font-medium text-base-content">
                {comment.posterId.fullName}
              </div>
              {/* Comment create date */}
              <div className="text-xs text-zinc-400 mb-1">
                {new Date(comment.createdAt).toLocaleString()}
              </div>
              {/* Comment text */}
              <div className="text-sm text-base-content leading-relaxed break-words">
                {comment.text}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsHistory;
