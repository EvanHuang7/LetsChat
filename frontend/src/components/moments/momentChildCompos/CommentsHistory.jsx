import React from "react";

const CommentsHistory = ({ comments }) => {
  return (
    <div className="mt-2 pt-2 pl-2 ml-10 bg-base-300">
      {/* Comments section */}
      <div className="space-y-4">
        {comments.map((comment, index) => (
          <div
            key={comment._id}
            className={`flex items-start gap-3 pb-3 ${
              index !== comments.length - 1
                ? "border-b border-base-content/10"
                : ""
            }`}
          >
            <img
              src={comment.posterId.profilePic || "/avatar.png"}
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
                {comment.text.split("\n").map((line, i) => (
                  <React.Fragment key={i}>
                    {line.split(" ").map((word, j) => {
                      const isURL = /^https?:\/\/\S+$/i.test(word);
                      return (
                        <React.Fragment key={j}>
                          {isURL ? (
                            <a
                              href={word}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 underline break-all"
                            >
                              {word}
                            </a>
                          ) : (
                            `${word} `
                          )}
                        </React.Fragment>
                      );
                    })}
                    <br />
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsHistory;
