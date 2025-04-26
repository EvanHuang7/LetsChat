import React, { useState, useRef, useEffect } from "react";
import { Trash } from "lucide-react";
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

const GifsContainer = ({ showGifPicker, setShowGifPicker, gifButtonRef }) => {
  const [gifs, setGifs] = useState(savedGifs); // useState for GIFs
  const [gifToDelete, setGifToDelete] = useState(null);
  const { sendMessage } = useChatStore();

  const gifPickerRef = useRef(null);

  // Click outside area to close gif container if gif container is open
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Prevent closing GIF picker if the delete gif confirm modal is open
      if (gifToDelete) return;

      if (
        gifPickerRef.current &&
        !gifPickerRef.current.contains(event.target) &&
        !(gifButtonRef.current && gifButtonRef.current.contains(event.target))
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
  }, [showGifPicker, gifToDelete, setShowGifPicker]);

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
    <div>
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
                      absolute top-1 right-1
                      w-5 h-5  text-white rounded-full
                      items-center justify-center text-xs
                      flex sm:hidden group-hover:flex
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
    </div>
  );
};

export default GifsContainer;
