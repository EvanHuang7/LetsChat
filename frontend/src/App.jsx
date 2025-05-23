import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

import HomePage from "./pages/HomePage";
import CallPage from "./pages/CallPage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import MomentsPage from "./pages/MomentsPage";
import NewConnectionsPage from "./pages/NewConnectionsPage";
import Navbar from "./components/Navbar";

import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";

const App = () => {
  // Get the needed variables and function from useAuthStore
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

  // Do something when application starts
  useEffect(() => {
    // Call checkAuth() function
    checkAuth(),
      // Set the page theme by setting a "data-theme" attribute
      // with a theme value for <html> tag
      document.documentElement.setAttribute("data-theme", theme);
  }, [checkAuth, theme]);

  // Display a loading state if it's checking the auth status
  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/conversation/:conversationId"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/call/:conversationId"
          element={authUser ? <CallPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/moments/:id"
          element={authUser ? <MomentsPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/newconnections"
          element={authUser ? <NewConnectionsPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
        <Route path="/settings" element={<SettingsPage />} />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
