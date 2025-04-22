import React from "react";
import { useEffect } from "react";

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
              <div className="flex items-start gap-4 mb-4">
                {/* User profile image */}
                <div className="flex-shrink-0">
                  <img
                    src={moment.posterId.profilePic || "/avatar.png"}
                    alt={moment.posterId.fullName}
                    className="size-10 rounded-full object-cover border"
                  />
                </div>

                {/* User name, moment text and moment image */}
                <div className="max-w-xl">
                  <h3 className="font-semibold text-base-content mb-2">
                    {moment.posterId.fullName}
                  </h3>
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
                      className="rounded-lg max-h-64 object-contain mb-3"
                    />
                  )}
                </div>
              </div>
              {/* Moment create date */}
              <div className="text-right text-xs text-zinc-400 mt-2">
                {new Date(moment.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MomentsHistory;
