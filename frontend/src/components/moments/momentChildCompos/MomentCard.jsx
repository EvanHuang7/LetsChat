import React, { useState } from "react";
import { ThumbsUp, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";

import CommentsHistory from "./CommentsHistory";
import CommentWriter from "./CommentWriter";

import { useAuthStore } from "../../../store/useAuthStore";
import { useMomentStore } from "../../../store/useMomentStore";

const MomentCard = ({ moment }) => {
  const { authUser } = useAuthStore();
  const { updateLikeStatus } = useMomentStore();

  // Intialize this state in this component instead of CommentWriter
  // component because it will remember the commentText even if
  // user close and reopen the CommentWriter component
  const [commentText, setCommentText] = useState("");
  const [activeCommentMomentId, setActiveCommentMomentId] = useState(null);

  // Update like status
  const handleUpdateLikeStatus = (moment) => {
    // Check the moment and authUser
    if (!moment || !authUser) {
      console.log(
        "Function errored because of either moment or authUser is empty"
      );
      toast.error("Sorry, an error occurs");
      return;
    }

    // Update like stauts
    updateLikeStatus({
      momentId: moment._id,
      like: !moment.userIdsOfLike.includes(authUser._id),
    });
  };

  return (
    <div key={moment._id} className="bg-base-200 rounded-lg p-5 shadow-md">
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
          {moment.text && (
            <div className="text-sm leading-relaxed break-words mb-2">
              {moment.text.split("\n").map((line, i) => (
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
          )}

          {moment.image && (
            <img
              src={moment.image}
              alt={moment._id}
              className="rounded-lg max-h-40 sm:max-h-64 object-contain mb-3"
              onError={(e) => {
                e.target.onerror = null; // prevent infinite loop
                e.target.src = "/fallback-image.png"; // fallback image
              }}
            />
          )}
          {/* Like and comments section */}
          <div className={`mb-1 flex items-center gap-2 justify-between`}>
            {/* Like button and likes number */}
            <div className={`flex items-center gap-2`}>
              <button
                type="button"
                className="btn btn-xs gap-2"
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
              {moment?.userIdsOfLike?.length > 0 && (
                <p>{moment?.userIdsOfLike?.length}</p>
              )}
            </div>

            {/* Comment button and comments number */}
            <div className={`flex items-center gap-2 pb-0.25`}>
              {moment?.comments?.length > 0 && (
                <p
                  className="hidden sm:block"
                  style={{
                    display: window.innerWidth < 430 ? "none" : "block",
                  }}
                >
                  {moment?.comments?.length}
                  {moment?.comments?.length === 1 ? " comment" : " comments"}
                </p>
              )}
              <button
                type="button"
                className="btn btn-xs gap-2"
                onClick={() => setActiveCommentMomentId(moment._id)}
              >
                <MessageSquare className="text-zinc-400" size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comment Writer */}
      <div
        className={`
        transition-all duration-300 ease-in-out overflow-hidden
        ${
          activeCommentMomentId === moment._id
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0"
        }
      `}
      >
        <CommentWriter
          commentText={commentText}
          setCommentText={setCommentText}
          activeCommentMomentId={activeCommentMomentId}
          setActiveCommentMomentId={setActiveCommentMomentId}
        />
      </div>

      {/* Existing comments */}
      {moment?.comments?.length > 0 && (
        <CommentsHistory comments={moment.comments} />
      )}
    </div>
  );
};

export default MomentCard;
