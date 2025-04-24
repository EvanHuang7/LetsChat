import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  LogOut,
  House,
  Settings,
  UserPen,
  Notebook,
  UserPlus,
} from "lucide-react";

import { useAuthStore } from "../store/useAuthStore";
import { useConnectionStore } from "../store/useConnectionStore";
import { useChatStore } from "../store/useChatStore";

const Navbar = () => {
  // Get the needed variables and function from useAuthStore
  const { authUser, logout } = useAuthStore();
  const {
    subscribeToMessages,
    unsubscribeFromMessages,
    unreadMessagesNumberMap,
  } = useChatStore();
  const { getConnections, pendingConnections } = useConnectionStore();

  const [totalUnreadMessages, setTotalUnreadMessages] = useState(0);

  useEffect(() => {
    // If user auth granted or a user logged in,
    if (authUser) {
      // Call subscribeToMessages() to start listening to newMessage event
      // for displaying unread message number
      subscribeToMessages();
      // Call getConnections() to get the pending conversation number
      // for displaying it in the navbar
      getConnections();

      // Define a cleanup function. It will be run before the component is
      // removed (unmounted) or before the effect re-runs (if dependencies change)
      return () => unsubscribeFromMessages();
    }
  }, [authUser, subscribeToMessages, getConnections, unsubscribeFromMessages]);

  useEffect(() => {
    const total = Array.from(unreadMessagesNumberMap.values()).reduce(
      (sum, num) => sum + num,
      0
    );
    setTotalUnreadMessages(total);
  }, [unreadMessagesNumberMap]);

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Left part, logo */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="relative size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <House className="w-5 h-5 text-primary" />

                {/* 🔴 unread message badge */}
                {totalUnreadMessages > 0 && (
                  <span
                    className="absolute -top-1 -right-1 min-w-[1rem] h-4 px-1 text-[10px] sm:text-xs font-semibold 
                text-white bg-red-500 rounded-full flex items-center justify-center shadow-md"
                  >
                    {totalUnreadMessages}
                  </span>
                )}
              </div>
              <h1 className="text-lg font-bold">LetsChat</h1>
            </Link>
          </div>

          {/* Right part */}
          <div className="flex items-center gap-2">
            {/* Moments, connection and profile button links */}
            {authUser && (
              <div className="flex items-center justify-center gap-2">
                <Link to={"/moments"} className={`btn btn-sm gap-2`}>
                  <Notebook className="size-5" />
                  <span className="hidden md:inline">Moments</span>
                </Link>

                {/* New Connections Button with 🔴 pending connection number badge */}
                <div className="relative">
                  <Link to={"/newconnections"} className="btn btn-sm gap-2">
                    <UserPlus className="size-5" />
                    <span className="hidden md:inline">New Connections</span>
                  </Link>
                  {pendingConnections.length > 0 && (
                    <span
                      className="absolute -top-1 -right-1 min-w-[1rem] h-4 px-1 text-[10px] sm:text-xs font-semibold 
    text-white bg-red-500 rounded-full flex items-center justify-center shadow-md"
                    >
                      {pendingConnections.length}
                    </span>
                  )}
                </div>

                <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                  <UserPen className="size-5" />
                  <span className="hidden md:inline">Profile</span>
                </Link>
              </div>
            )}

            {/* Settings and logout*/}
            <Link
              to={"/settings"}
              className={`
              btn btn-sm gap-2 transition-colors
              
              `}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden md:inline">Settings</span>
            </Link>
            {authUser && (
              <button className="flex gap-2 items-center" onClick={logout}>
                <LogOut className="size-5" />
                <span className="hidden md:inline">Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
