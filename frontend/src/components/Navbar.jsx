import React from "react";
import { Link } from "react-router-dom";
import { LogOut, House, Settings, UserPen, Notebook } from "lucide-react";

import { useAuthStore } from "../store/useAuthStore";

const Navbar = () => {
  // Get the needed variables and function from useAuthStore
  const { authUser, logout } = useAuthStore();

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
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <House className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">LetsChat</h1>
            </Link>
          </div>

          {/* Right part */}
          <div className="flex items-center gap-2">
            {/* Moments and profile */}
            {authUser && (
              <div className="flex items-center justify-center gap-2">
                <Link to={"/moments"} className={`btn btn-sm gap-2`}>
                  <Notebook className="size-5" />
                  <span className="hidden sm:inline">Moments</span>
                </Link>
                <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                  <UserPen className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
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
              <span className="hidden sm:inline">Settings</span>
            </Link>
            {authUser && (
              <button className="flex gap-2 items-center" onClick={logout}>
                <LogOut className="size-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
