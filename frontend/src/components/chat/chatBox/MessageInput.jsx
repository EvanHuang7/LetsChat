import React, { useState, useRef, useEffect } from "react";
import { Image, Send, X, Smile, Trash } from "lucide-react";
import toast from "react-hot-toast";

import { useChatStore } from "../../../store/useChatStore";

// Dummy saved GIFs array — replace with real data from your store
const savedGifs = [
  "https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif",
  "https://media.giphy.com/media/l0HlNQ03J5JxX6lva/giphy.gif",
  "https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif",
  "https://res.cloudinary.com/dapo3wc6o/image/upload/v1745183404/xpu4r8i3zqujwmxk10m5.gif",
  "https://res.cloudinary.com/dapo3wc6o/image/upload/v1745182310/w0qmo5xpaieqp7gdmi59.gif",
  "https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif",
  "https://res.cloudinary.com/dapo3wc6o/image/upload/v1745183357/gncezmzkn9mzhbcyzjve.gif",
  "https://media.giphy.com/media/l0HlNQ03J5JxX6lva/giphy.gif",
];

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [gifs, setGifs] = useState(savedGifs); // useState for GIFs
  const [gifToDelete, setGifToDelete] = useState(null);

  const fileInputRef = useRef(null);
  const gifPickerRef = useRef(null);

  const { sendMessage } = useChatStore();

  // Click outside area to close gif container if gif container is open
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Prevent closing GIF picker if the delete gif confirm modal is open
      if (gifToDelete) return;

      if (
        gifPickerRef.current &&
        !gifPickerRef.current.contains(event.target)
      ) {
        setShowGifPicker(false);
      }
    };

    if (showGifPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showGifPicker, gifToDelete]);

  const handleImageChange = (event) => {
    // Get image file of user selected and check it
    const file = event.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Convert the image to base64 format
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64Image = reader.result;
      // Set image preview with base64 format image
      setImagePreview(base64Image);
    };
  };

  const removeImage = () => {
    // Clear image preview
    setImagePreview(null);
    // Clear the image value in hidden input image field
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = (event) => {
    // Prevent refreshing the page
    event.preventDefault();
    // Check text and image are empty or not
    if (!text.trim() && !imagePreview) {
      console.log("Function errored because both text and image are empty");
      toast.error("Sorry, an error occurs");
      return;
    }

    // Send message
    sendMessage({
      text: text.trim(),
      image: imagePreview,
    });

    // Clear form
    setText("");
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendGifImage = (gifUrl) => {
    sendMessage({ text: "", image: gifUrl });
    setShowGifPicker(false);
  };

  const confirmDeleteGif = () => {
    if (gifToDelete) {
      setGifs((prevGifs) => prevGifs.filter((gif) => gif !== gifToDelete));
      setGifToDelete(null);
      toast.success("GIF deleted!");
    }
  };

  return (
    <div className="p-4 w-full relative">
      {/* GIF container */}
      {showGifPicker && (
        <div
          ref={gifPickerRef}
          className="
            absolute bottom-16 left-0 w-72 sm:w-[500px]
            bg-base-200 p-3 rounded-lg shadow-md z-50
            grid grid-cols-2 sm:grid-cols-4 gap-2
            max-h-40 sm:max-h-none overflow-y-auto
          "
        >
          {gifs.map((gif, idx) => (
            <div key={idx} className="relative group">
              <img
                src={gif}
                alt={`GIF ${idx}`}
                className="
                  w-full h-20 sm:h-28 object-cover cursor-pointer
                  rounded-md border border-zinc-300
                "
                onClick={() => handleSendGifImage(gif)}
              />
              {/* Delete Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setGifToDelete(gif);
                }}
                className="
                  hidden group-hover:flex absolute top-1 right-1
                  w-5 h-5 bg-red-500 text-white rounded-full
                  items-center justify-center text-xs
                "
              >
                <Trash size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Confirm Delete Modal */}
      <dialog
        id="delete_gif_modal"
        className="modal"
        open={gifToDelete !== null}
      >
        <div
          className="modal-box max-w-xs sm:max-w-sm" // 👈 smaller modal size
          onClick={(e) => e.stopPropagation()} // 👈 prevent closing on outside click
        >
          <h3 className="font-bold text-lg">Delete GIF?</h3>
          <p className="py-4 text-zinc-600">
            Are you sure you want to delete this GIF?
          </p>
          <div className="modal-action">
            <form method="dialog" className="flex gap-3">
              <button
                type="button"
                onClick={() => setGifToDelete(null)}
                className="btn btn-sm bg-gray-200 hover:bg-gray-300 text-black"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  confirmDeleteGif();
                }}
                className="btn btn-sm bg-red-500 hover:bg-red-600 text-white"
              >
                Delete
              </button>
            </form>
          </div>
        </div>
      </dialog>

      {/* Image preview */}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        {/* Gif Button */}
        <button
          type="button"
          onClick={() => setShowGifPicker(!showGifPicker)}
          className="btn btn-sm btn-circle text-zinc-500 hover:text-primary"
        >
          <Smile size={20} />
        </button>

        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          <button
            type="button"
            className={`hidden sm:flex btn btn-circle ${
              imagePreview ? "text-emerald-500" : "text-zinc-400"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>

        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
