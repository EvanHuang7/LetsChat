import { useParams } from "react-router-dom";
import React, { useRef, useEffect } from "react";

import MomentWriter from "../components/moments/MomentWriter";
import MomentsContainer from "../components/moments/MomentsContainer";

const MomentsPage = () => {
  const { id } = useParams();
  // Initalize a ref object to store the states and functions from child
  const momentsRef = useRef();

  // Detect scroll event to trigger load more moments when scrolled to the bottom
  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const clientHeight = document.documentElement.clientHeight;
    const scrollHeight = document.documentElement.scrollHeight;

    const atBottom = scrollTop + clientHeight >= scrollHeight - 5;
    if (atBottom) {
      // Call the function from child component
      momentsRef.current?.loadMoreMoments();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="h-screen pt-20">
      <div className="max-w-3xl mx-auto p-4 py-8">
        <div className="bg-base-100 rounded-xl p-6 space-y-8">
          {/* Post a moment */}
          {id === "all" && <MomentWriter />}
          {/* Moment List, Pass ref object as input to child */}
          <MomentsContainer ref={momentsRef} />
        </div>
      </div>
    </div>
  );
};

export default MomentsPage;
