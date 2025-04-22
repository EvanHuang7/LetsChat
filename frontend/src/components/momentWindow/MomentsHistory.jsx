import React from "react";
import { useEffect } from "react";
import { ThumbsUp, MessageSquare } from "lucide-react";

import { useMomentStore } from "../../store/useMomentStore";
import MomentSkeleton from "../skeletons/MomentSkeleton";

const MomentsHistory = () => {
  const { isMomentsLoading, moments, getMoments } = useMomentStore();
  useEffect(() => {
    getMoments("All");
  }, [getMoments]);

  if (isMomentsLoading) {
    return (
      <div>
        <MomentSkeleton />
      </div>
    );
  }

  return (
    <div>
      {moments.length === 0 ? (
        <p className="text-center">No moments found.</p>
      ) : (
        <div className="space-y-6">
          {moments.map((moment) => (
            <div
              key={moment._id}
              className="bg-base-200 rounded-lg p-5 shadow-md"
            >
              <div className="flex items-start gap-4">
                {/* User profile image */}
                <div className="flex-shrink-0">
                  <img
                    src={moment.posterId.profilePic || "/avatar.png"}
                    alt={moment.posterId.fullName}
                    className="size-10 rounded-full object-cover border"
                  />
                </div>

                {/* User name */}
                <div className="w-full">
                  <h3 className="font-semibold text-base-content">
                    {moment.posterId.fullName}
                  </h3>
                  {/* Moment create date */}
                  <div className="text-xs text-zinc-400 mb-2">
                    {new Date(moment.createdAt).toLocaleString()}
                  </div>
                  {/* Moment text and image */}
                  <div className="text-sm leading-relaxed break-words mb-5">
                    {moment.text.split("\n").map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
                  </div>
                  {moment.image && (
                    <img
                      src={moment.image}
                      alt={moment._id}
                      className="rounded-lg max-h-64 object-contain mb-5"
                    />
                  )}
                  {/* Like and comments */}
                  <div
                    className={`mb-1 flex items-center gap-2 justify-between text-zinc-400`}
                  >
                    {/* Like and like numbers */}
                    <div className={`flex items-center gap-2`}>
                      <p>1 likes </p>
                      <button type="button" className="">
                        <ThumbsUp size={20} />
                      </button>
                    </div>

                    {/* Comment and comment numbers */}
                    <div className={`flex items-center gap-2 mb-0.5`}>
                      <p>2 comments</p>
                      <button type="button" className="mt-1">
                        <MessageSquare size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

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
                      text: "This is so inspiring!",
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
                    <div key={comment.id} className="flex items-start gap-3">
                      <img
                        src={comment.user.avatar}
                        alt={comment.user.name}
                        className="w-8 h-8 rounded-full object-cover border"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-base-content">
                          {comment.user.name}
                        </div>
                        <div className="text-sm text-base-content">
                          {comment.text}
                        </div>
                        <div className="text-xs text-zinc-400">
                          {new Date(comment.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MomentsHistory;
