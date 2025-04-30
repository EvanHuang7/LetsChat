import React from "react";
import { MessageSquarePlus } from "lucide-react";
import { MessagesSquare } from "lucide-react";

const NoConversation = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50">
      <div className="max-w-md text-center space-y-6">
        {/* Icon Display */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center
             justify-center animate-bounce"
            >
              <MessagesSquare className="w-8 h-8 text-primary " />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <h2 className="text-2xl font-bold">Welcome to LetsChat!</h2>
        <div className="text-sm text-center text-base-content/60">
          <span>
            Start a conversation by{" "}
            <a href="/newconnections" className="underline">
              connecting a new friend
            </a>{" "}
            or{" "}
            <button
              className="btn btn-xs btn-outline rounded-full"
              onClick={(e) => e.stopPropagation()}
            >
              <MessageSquarePlus className="size-3" />
              <span className="text-base-content">Create a group</span>
            </button>{" "}
            and invite your friend to group!
          </span>
        </div>
      </div>
    </div>
  );
};

export default NoConversation;
