import React from "react";

const CommentsHistory = () => {
  return (
    <div className="mt-2 pt-2 pl-2 ml-10 bg-base-300">
      {/* Comments section */}
      <div className="space-y-4">
        {/* Hardcoded comments for demo */}
        {[
          {
            id: 1,
            user: {
              name: "Alice Johnson",
              avatar: "/avatar1.png",
            },
            text: "This is so inspiring! This is so inspiring! This is so inspiring! This is so inspiring! This is so inspiring! This is so inspiring! This is so inspiring!This is so inspiring! This is so inspiring!This is so inspiring! This is so inspiring!",
            createdAt: "2025-04-20T09:30:00Z",
          },
          {
            id: 2,
            user: {
              name: "Ben Carter",
              avatar: "/avatar2.png",
            },
            text: "Love the photo 🙌",
            createdAt: "2025-04-20T10:15:00Z",
          },
        ].map((comment) => (
          <div key={comment.id} className="flex items-start gap-3 pb-3">
            <img
              src={comment.user.avatar}
              alt={comment.user.name}
              className="w-8 h-8 rounded-full object-cover border"
            />
            <div className="flex-1">
              {/* Comment user name */}
              <div className="text-sm font-medium text-base-content">
                {comment.user.name}
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
