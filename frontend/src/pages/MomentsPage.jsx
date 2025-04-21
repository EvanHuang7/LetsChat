import { useEffect, useState } from "react";
import { User } from "lucide-react";

const MomentsPage = () => {
  const [blogs, setBlogs] = useState([ {
    id: "user-123",
    title: "first Title",
    content: "test testtesttesttesttesttesttesttesttesttesttest",
    image: "https://res.cloudinary.com/dapo3wc6o/image/upload/v1745190773/fgty4qvjd3t01pxvzga9.gif",
    author: {
        profilePic: "",
        fullName: "Test Evan",
    }},
    {
    id: "user-456",
    title: "second Title",
    content: "test testtesttesttesttesttesttesttesttesttesttesttest testtesttesttesttesttesttesttesttesttesttesttest testtesttesttesttesttesttesttesttesttesttesttest testtesttesttesttesttesttesttesttesttesttesttest testtesttesttesttesttesttesttesttesttesttesttest testtesttesttesttesttesttesttesttesttesttesttest testtesttesttesttesttesttesttesttesttesttesttest testtesttesttesttesttesttesttesttesttesttesttest testtesttesttesttesttesttesttesttesttesttesttest testtesttesttesttesttesttesttesttesttesttesttest testtesttesttesttesttesttesttesttesttesttesttest testtesttesttesttesttesttesttesttesttesttest",
    image: "https://res.cloudinary.com/dapo3wc6o/image/upload/v1745105771/bpfdsnva3jmwksysgb68.png",
    author: {
        profilePic: "",
        fullName: "Test EV",
    }},
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
          {/* Page Title */}
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Blog Posts</h1>
            <p className="mt-2 text-sm">Explore what others are sharing</p>
          </div>

          {/* Blog List */}
          {blogs.length === 0 ? (
            <p className="text-center">No blogs found.</p>
          ) : (
            <div className="space-y-6">
              {blogs.map((blog) => (
                <div key={blog.id} className="bg-base-200 rounded-lg p-5 shadow-md">
                  <div className="flex items-start gap-4 mb-4">
                    {/* User info */}
                    <div className="flex-shrink-0">
                      <img
                        src={blog.author.profilePic || "/avatar.png"}
                        alt={blog.author.fullName}
                        className="size-10 rounded-full object-cover border"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-base-content">
                          {blog.author.fullName}
                        </h3>
                      </div>
                      
                      {/* Blog info */}
                      <p className="text-sm leading-relaxed">
                        {blog.content}
                      </p>
                      {blog.image && (
                        <div className="mb-3">
                          <img
                            src={blog.image}
                            alt={blog.title}
                            className="rounded-lg max-h-64 object-contain"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Blog create date */}
                  <div className="text-right text-xs text-zinc-400 mt-2">
                    {new Date(blog.createdAt).toLocaleDateString()}
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
