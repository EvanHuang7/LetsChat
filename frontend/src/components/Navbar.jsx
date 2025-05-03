import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LogOut,
  House,
  Settings,
  UserPen,
  Notebook,
  UserPlus,
  Bell,
  BellOff,
} from "lucide-react";

import NewMessageToast from "./conversation/conversationChildCompos/NewMessageToast";
import { usePrevious } from "../lib/utils";
import { showLimitedToast } from "../lib/toastStackManager";

import { useAuthStore } from "../store/useAuthStore";
import { useConnectionStore } from "../store/useConnectionStore";
import { useConversationStore } from "../store/useConversationStore";
import { useMessageStore } from "../store/useMessageStore";

const Navbar = () => {
  // Get the needed variables and function from useAuthStore
  const { authUser, setCurrentPath, toggleMessageNotification, logout } =
    useAuthStore();
  const {
    getConnections,
    pendingConnections,
    subscribeToConnections,
    unsubscribeFromConnections,
  } = useConnectionStore();
  const { setSelectedConversation } = useConversationStore();
  const {
    unreadNumInHomeIcon,
    setUnreadNumInHomeIcon,
    subscribeToMessages,
    unsubscribeFromMessages,
    newMessageForToast,
  } = useMessageStore();

  const location = useLocation();
  const prevPath = usePrevious(location.pathname);

  // Check if user currently is in home or conversation page
  const isHomeOrConversationPage =
    location.pathname === "/" || location.pathname.startsWith("/conversation/");
  const isCallPage = location.pathname.startsWith("/call/");

  // Subscribe socket events
  useEffect(() => {
    // If user auth granted or a user logged in,
    if (authUser) {
      // Start listening to newMessage event for displaying unread message
      // number in home button of navbar
      subscribeToMessages();
      // Get the pending connection number for displaying it in the New
      // connection button of navbar
      getConnections();
      // Start listening to newConnection event
      subscribeToConnections();

      // Define a cleanup function. It will be run before the component is
      // removed (unmounted) or before the effect re-runs (if dependencies change)
      return () => {
        unsubscribeFromMessages();
        unsubscribeFromConnections();
      };
    }
  }, [authUser]);

  // When user go to another page from home or conversation page
  useEffect(() => {
    const wasHomeOrConversationPage =
      prevPath === "/" || prevPath?.startsWith("/conversation/");
    const isNowDifferentPage =
      location.pathname !== "/" &&
      !location.pathname.startsWith("/conversation/");
    const isLogOutAction = location.pathname === "/login";

    if (wasHomeOrConversationPage && isNowDifferentPage && !isLogOutAction) {
      // Set selectedConversation to null to update unread message num
      setSelectedConversation(null);
    }
  }, [location.pathname, prevPath]);

  // Update the current path
  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location.pathname]);

  // Display the new message toast
  useEffect(() => {
    if (
      authUser &&
      authUser?.messageNotificationEnabled &&
      newMessageForToast
    ) {
      showLimitedToast(
        (t) => (
          <NewMessageToast t={t} newMessageForToast={newMessageForToast} />
        ),
        {
          duration: 4000,
        }
      );
    }
  }, [authUser, newMessageForToast]);

  const handleToggleMessageNotification = () => {
    // Call toggleMessageNotification api function
    toggleMessageNotification({
      messageNotificationState: !authUser.messageNotificationEnabled,
    });
  };

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <NewMessageToast />

          {/* Left part, logo */}
          <div className="relative group">
            <div
              className={`flex items-center gap-8 ${
                isCallPage ? "pointer-events-none opacity-50" : ""
              }`}
            >
              <Link
                to="/"
                className="flex items-center gap-2.5 hover:opacity-80 transition-all"
                onClick={() => setUnreadNumInHomeIcon(0)}
              >
                <div className="relative size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <House className="w-5 h-5 text-primary" />

                  {/* 🔴 unread message badge */}
                  {unreadNumInHomeIcon > 0 && !isHomeOrConversationPage && (
                    <span
                      className="absolute -top-1 -right-1 min-w-[1rem] h-4 px-1 text-[10px] sm:text-xs font-semibold 
                text-white bg-red-500 rounded-full flex items-center justify-center shadow-md animate-pulse"
                    >
                      {unreadNumInHomeIcon}
                    </span>
                  )}
                </div>
                <h1
                  className="text-lg font-bold hidden sm:block"
                  style={{
                    display: window.innerWidth < 430 ? "none" : "block",
                  }}
                >
                  LetsChat
                </h1>
              </Link>
            </div>
            {isCallPage && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2
                         w-max max-w-xs px-4 py-2 rounded-xl bg-neutral text-neutral-content text-sm
                         opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100
                         transition-all duration-200 z-20 shadow-lg text-center hidden sm:inline"
              >
                Leave the call to use the navbar
              </div>
            )}
          </div>

          {/* Right part */}
          <div className={isCallPage ? "relative group" : "relative"}>
            <div
              className={`flex items-center gap-2 ${
                isCallPage ? "pointer-events-none opacity-50" : ""
              }`}
            >
              {/* Moments button */}
              {authUser && (
                <div className="flex items-center justify-center gap-2">
                  <Link to={"/moments/all"} className={`btn btn-sm gap-2`}>
                    <Notebook className="size-5" />
                    <span className="hidden lg:inline">All Moments</span>
                  </Link>

                  {/* New Connections Button with 🔴 pending connection number badge */}
                  <div className="relative">
                    <Link to={"/newconnections"} className="btn btn-sm gap-2">
                      <UserPlus className="size-5" />
                      <span className="hidden lg:inline">New Connections</span>
                    </Link>
                    {pendingConnections.length > 0 && (
                      <span
                        className="absolute -top-1 -right-1 min-w-[1rem] h-4 px-1 text-[10px] 
                      sm:text-xs font-semibold text-white bg-red-500 rounded-full 
                      flex items-center justify-center shadow-md"
                      >
                        {pendingConnections.length}
                      </span>
                    )}
                  </div>

                  {/* Profile button */}
                  <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                    <UserPen className="size-5" />
                    <span className="hidden lg:inline">Profile</span>
                  </Link>
                </div>
              )}

              {/* Settings button */}
              <Link
                to={"/settings"}
                className={`
              btn btn-sm gap-2 transition-colors
              
              `}
              >
                <Settings className="w-4 h-4" />
                <span className="hidden lg:inline">Settings</span>
              </Link>

              {/* Bell button */}
              {authUser && (
                <div className={isCallPage ? "relative" : "relative group"}>
                  <button
                    className="btn btn-sm gap-2"
                    onClick={handleToggleMessageNotification}
                  >
                    {authUser.messageNotificationEnabled ? (
                      <Bell className="size-5" />
                    ) : (
                      <BellOff className="size-5" />
                    )}
                  </button>

                  {/* Responsive tooltip with text split on small screens */}
                  {!isCallPage && (
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2
                           w-max max-w-xs px-4 py-2 rounded-xl bg-neutral text-neutral-content text-sm
                           opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100
                           transition-all duration-200 z-20 shadow-lg text-center hidden sm:inline"
                    >
                      <span className="block lg:inline">
                        Message notification
                      </span>{" "}
                      <span className="block lg:inline">
                        is {authUser.messageNotificationEnabled ? "ON" : "OFF"}{" "}
                        now
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Logout button */}
              {authUser && (
                <button className="flex gap-2 items-center" onClick={logout}>
                  <LogOut className="size-5" />
                  <span className="hidden lg:inline">Logout</span>
                </button>
              )}
            </div>
            {isCallPage && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2
                         w-max max-w-xs px-4 py-2 rounded-xl bg-neutral text-neutral-content text-sm
                         opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100
                         transition-all duration-200 z-20 shadow-lg text-center hidden sm:inline"
              >
                Leave the call to use the navbar
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
