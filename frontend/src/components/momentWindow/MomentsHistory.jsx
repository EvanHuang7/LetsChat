import React, { useEffect, useState } from "react";
import { ThumbsUp, MessageSquare } from "lucide-react";

import { useMomentStore } from "../../store/useMomentStore";
import { useAuthStore } from "../../store/useAuthStore";
import MomentSkeleton from "../skeletons/MomentSkeleton";
import CommentsHistory from "./commentWindow/CommentsHistory";
import CommentWriter from "./commentWindow/CommentWriter";

const MomentsHistory = () => {
  const { isMomentsLoading, moments, getMoments, updateLikeStatus } =
    useMomentStore();
  const { authUser } = useAuthStore();

  // Intialize this state in this component instead of CommentWriter
  // component because it will remember the commentText even if
  // user close and reopen the CommentWriter component
  const [commentText, setCommentText] = useState("");
  const [activeCommentMomentId, setActiveCommentMomentId] = useState(null);

  useEffect(() => {
    getMoments("All");
  }, [getMoments]);

  // Update like status
  const handleUpdateLikeStatus = (moment) => {
    // Check the moment and authUser
    if (!moment || !authUser) return;

    // Update like stauts
    updateLikeStatus({
      momentId: moment._id,
      like: !moment.userIdsOfLike.includes(authUser._id),
    });
  };

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
                  {/* Like and comments section */}
                  <div
                    className={`mb-1 flex items-center gap-2 justify-between text-zinc-400`}
                  >
                    {/* Like button and likes number */}
                    <div className={`flex items-center gap-2`}>
                      {moment?.userIdsOfLike?.length > 0 && (
                        <p>{moment?.userIdsOfLike?.length} likes </p>
                      )}
                      <button
                        type="button"
                        className=""
                        onClick={() => handleUpdateLikeStatus(moment)}
                      >
                        <ThumbsUp
                          className={
                            moment.userIdsOfLike.includes(authUser._id)
                              ? "text-blue-500"
                              : "text-zinc-400"
                          }
                          size={20}
                        />
                      </button>
                    </div>

                    {/* Comment button and comments number */}
                    <div className={`flex items-center gap-2 mb-0.5`}>
                      {moment?.comments?.length > 0 && (
                        <p>{moment?.comments?.length} comments</p>
                      )}
                      <button
                        type="button"
                        className="mt-1"
                        onClick={() => setActiveCommentMomentId(moment._id)}
                      >
                        <MessageSquare size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comment Writer */}
              {activeCommentMomentId === moment._id && (
                <CommentWriter
                  commentText={commentText}
                  setCommentText={setCommentText}
                  activeCommentMomentId={activeCommentMomentId}
                  setActiveCommentMomentId={setActiveCommentMomentId}
                />
              )}

              {/* Existing comments */}
              {moment?.comments?.length > 0 && (
                <CommentsHistory comments={moment.comments} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MomentsHistory;
