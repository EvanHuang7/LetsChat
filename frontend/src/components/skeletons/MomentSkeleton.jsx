import React from "react";

const MomentSkeleton = () => {
  // Create an array of 6 items for skeleton messages
  const skeletonMessages = Array(6).fill(null);

  return (
    <div className="space-y-6">
      {/* skeleton container */}
      {skeletonMessages.map((_, idx) => (
        <div key={idx} className="bg-base-200 rounded-lg p-5 shadow-md">
          <div className="flex items-start gap-4 mb-4">
            {/* User profile image skeleton */}
            <div className="flex-shrink-0">
              <div className="chat-image avatar">
                <div className="size-10 rounded-full">
                  <div className="skeleton w-full h-full rounded-full" />
                </div>
              </div>
            </div>

            <div className="w-full">
              {/* User name skeleton */}
              <h3 className="font-semibold text-base-content mb-2">
                <div className="skeleton h-4 w-16" />
              </h3>
              {/* Moment text skeleton */}
              <div className="mb-5">
                <div className="skeleton h-16 w-full max-w-xl" />
              </div>
              {/* Moment create date skeleton */}
              <div className="flex items-center justify-end">
                <div className="skeleton h-4 w-16" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MomentSkeleton;
