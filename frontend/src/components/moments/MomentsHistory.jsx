import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { ThumbsUp, MessageSquare, FilePlus } from "lucide-react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

import { useMomentStore } from "../../store/useMomentStore";
import { useAuthStore } from "../../store/useAuthStore";
import MomentSkeleton from "../skeletons/MomentSkeleton";
import CommentsHistory from "./comments/CommentsHistory";
import CommentWriter from "./comments/CommentWriter";

// "forwardRef((props, ref)" is used to expose method to parent component
// "ref" is ref object as input from parent component
const MomentsHistory = forwardRef((props, ref) => {
  const { isMomentsLoading, moments, getMoments, updateLikeStatus } =
    useMomentStore();
  const { authUser } = useAuthStore();
  const { id } = useParams();

  // Intialize this state in this component instead of CommentWriter
  // component because it will remember the commentText even if
  // user close and reopen the CommentWriter component
  const [commentText, setCommentText] = useState("");
  const [activeCommentMomentId, setActiveCommentMomentId] = useState(null);

  const [lastMomentCreatedAt, setLastMomentCreatedAt] = useState(null); // to track the last moment timestamp
  const [loadingMore, setLoadingMore] = useState(false); // to prevent multiple loads at the same time

  useEffect(() => {
    getMoments(id, { lastMomentCreatedAt: null });
  }, [id, getMoments]);

  useEffect(() => {
    // Update lastMomentCreatedAt whenever moments change
    if (moments.length > 0) {
      const lastMoment = moments[moments.length - 1];
      setLastMomentCreatedAt(lastMoment.createdAt); // Update with last moment's createdAt timestamp
    }
  }, [moments]);

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

  // Load more moments when button is clicked or user scrolls to the bottom
  const loadMoreMoments = async () => {
    if (loadingMore || !lastMomentCreatedAt) return; // Prevent multiple loads

    setLoadingMore(true);
    try {
      // Get moments older than the last moment created time
      await getMoments(id, { lastMomentCreatedAt });
    } catch (error) {
      console.log("Error in loadMoreMoments: ", error);
      toast.error("Failed to load more moments.");
    } finally {
      setLoadingMore(false);
    }
  };

  // Built-in function useImperativeHandle is used to expose
  // state variables and methods to parent component
  useImperativeHandle(ref, () => ({
    loadMoreMoments,
  }));

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
        <p className="text-center text-base-content/60">No moments found.</p>
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
                    className={`mb-1 flex items-center gap-2 justify-between`}
                  >
                    {/* Like button and likes number */}
                    <div className={`flex items-center gap-2`}>
                      {moment?.userIdsOfLike?.length > 0 && (
                        <p>{moment?.userIdsOfLike?.length} likes </p>
                      )}
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
                    </div>

                    {/* Comment button and comments number */}
                    <div className={`flex items-center gap-2`}>
                      {moment?.comments?.length > 0 && (
                        <p>{moment?.comments?.length} comments</p>
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

      {/* Show More Button */}
      {!loadingMore && (
        <div className="text-center">
          <button
            type="button"
            className="btn btn-primary gap-2 mt-2"
            onClick={loadMoreMoments}
          >
            <FilePlus size={20} />
            Show more moments
          </button>
        </div>
      )}

      {loadingMore && <p className="text-center">Loading more moments...</p>}
    </div>
  );
});

export default MomentsHistory;
