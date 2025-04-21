import { useEffect, useState } from "react";

import PostMoment from "../components/momentWindow/PostMoment";

const MomentsPage = () => {
  const [moments, setMoments] = useState([
    {
      id: "user-123",
      content: `In the heart of a bustling digital city, where lines of code shape towering skyscrapers of thought and innovation, there lived a developer who believed that every keystroke carried the power of creation. Mornings began with a gentle hum of the coffee machine, a ritual as sacred as the first git pull, and the screen flickered to life with an ocean of possibilities. Projects danced in Trello boards, issues whispered for attention in GitHub repositories, and yet amidst the noise, the developer found poetry in the logic, clarity in the syntax. JavaScript bugs were but puzzles to be unraveled, and CSS quirks, a subtle challenge to one’s artistry. Outside, the world moved fast—but inside that glowing terminal, time bent to the will of focus. Ideas once scribbled on napkins became deployed features, and mistakes transformed into lessons buried deep in commit histories. And as the moonlight spilled across the keyboard late into the night, the city of code never slept—only evolved, ever in pursuit of something elegant, something meaningful.`,
      image:
        "https://res.cloudinary.com/dapo3wc6o/image/upload/v1745190773/fgty4qvjd3t01pxvzga9.gif",
      author: {
        profilePic: "",
        fullName: "Test Evan",
      },
    },
    {
      id: "user-456",
      content:
        "testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest testtesttesttesttesttesttesttesttesttesttesttest testtesttesttesttesttesttesttesttesttesttesttest testtesttesttesttesttesttesttesttesttesttesttest testtesttesttesttesttesttesttesttesttesttesttest testtesttesttesttesttesttesttesttesttesttesttest testtesttesttesttesttesttesttesttesttesttest",
      image:
        "https://res.cloudinary.com/dapo3wc6o/image/upload/v1745105771/bpfdsnva3jmwksysgb68.png",
      author: {
        profilePic: "",
        fullName: "Test EV",
      },
    },
  ]);

  useEffect(() => {
    // Simulated fetch call to load blogs
    const fetchBlogs = async () => {
      const response = await fetch("/api/blogs");
      const data = await response.json();

      //   setBlogs(data);
      //   setBlogs([{
      //         id: "user-123",
      //         content: "test testtesttesttesttesttesttesttesttesttesttest",
      //         author: {
      //             profilePic: "",
      //             fullName: "Test Evan",
      //         },
      //   }]);
    };

    // fetchBlogs();
  }, []);

  return (
    <div className="h-screen pt-20">
      <div className="max-w-3xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          {/* Post a moment */}
          <PostMoment />
          {/* Moment List */}
          {moments.length === 0 ? (
            <p className="text-center">No moments found.</p>
          ) : (
            <div className="space-y-6">
              {moments.map((moment) => (
                <div
                  key={moment.id}
                  className="bg-base-200 rounded-lg p-5 shadow-md"
                >
                  <div className="flex items-start gap-4 mb-4">
                    {/* User profile image */}
                    <div className="flex-shrink-0">
                      <img
                        src={moment.author.profilePic || "/avatar.png"}
                        alt={moment.author.fullName}
                        className="size-10 rounded-full object-cover border"
                      />
                    </div>
                    {/* User name, moment text and moment image */}
                    <div className="max-w-xl">
                      <h3 className="font-semibold text-base-content mb-2">
                        {moment.author.fullName}
                      </h3>
                      <p className="text-sm leading-relaxed break-words mb-3">
                        {moment.content}
                      </p>
                      {moment.image && (
                        <img
                          src={moment.image}
                          alt={moment.id}
                          className="rounded-lg max-h-64 object-contain mb-3"
                        />
                      )}
                    </div>
                  </div>
                  {/* Moment create date */}
                  <div className="text-right text-xs text-zinc-400 mt-2">
                    {new Date(moment.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MomentsPage;
