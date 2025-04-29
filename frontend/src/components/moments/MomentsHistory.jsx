import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { FilePlus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

import MomentSkeleton from "../skeletons/MomentSkeleton";
import MomentCard from "./MomentCard";

import { useMomentStore } from "../../store/useMomentStore";

// "forwardRef((props, ref)" is used to expose method to parent component
// "ref" is ref object as input from parent component
const MomentsHistory = forwardRef((props, ref) => {
  const { isMomentsLoading, moments, getMoments, clearMoments } =
    useMomentStore();

  const [lastMomentCreatedAt, setLastMomentCreatedAt] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false); // to prevent multiple loads at the same time
  const [hasMoreMoments, setHasMoreMoments] = useState(true);

  const { id } = useParams();

  useEffect(() => {
    // Clear existing moments if switching userId in url
    clearMoments();
    getMoments(id, { lastMomentCreatedAt: null });
  }, [id, getMoments, clearMoments]);

  useEffect(() => {
    // Update lastMomentCreatedAt whenever moments change
    if (moments.length > 0) {
      const lastMoment = moments[moments.length - 1];
      setLastMomentCreatedAt(lastMoment.createdAt); // Update with last moment's createdAt timestamp
    }
  }, [moments]);

  // Load more moments when button is clicked or user scrolls to the bottom
  const loadMoreMoments = async () => {
    if (loadingMore || !lastMomentCreatedAt || !hasMoreMoments) return; // Prevent multiple loads

    setLoadingMore(true);
    try {
      // Get moments older than the last moment created time
      const stillHasMore = await getMoments(id, { lastMomentCreatedAt });
      if (!stillHasMore) {
        setHasMoreMoments(false);
      }
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
            <MomentCard key={moment._id} moment={moment} />
          ))}
        </div>
      )}

      {/* Show More Button */}
      {hasMoreMoments && !loadingMore && moments.length > 0 && (
        <div className="text-center">
          <button
            type="button"
            className="btn gap-2 mt-2"
            onClick={loadMoreMoments}
          >
            <FilePlus size={20} />
            Show more moments
          </button>
        </div>
      )}

      {loadingMore && (
        <div className="flex items-center justify-center gap-2 mt-3">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading...
        </div>
      )}
    </div>
  );
});

export default MomentsHistory;
