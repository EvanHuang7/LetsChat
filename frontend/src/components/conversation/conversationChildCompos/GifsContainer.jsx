import React, { useState, useRef, useEffect } from "react";
import { Trash } from "lucide-react";
import toast from "react-hot-toast";

import { useAuthStore } from "../../../store/useAuthStore";
import { useMessageStore } from "../../../store/useMessageStore";

const GifsContainer = ({ showGifPicker, setShowGifPicker, gifButtonRef }) => {
  const { authUser, updateStickers } = useAuthStore();
  const { sendMessage } = useMessageStore();

  const [gifs, setGifs] = useState(null);
  const [gifToDelete, setGifToDelete] = useState(null);

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
  }, [
    showGifPicker,
    gifToDelete,
    setShowGifPicker,
    gifPickerRef,
    gifButtonRef,
  ]);

  useEffect(() => {
    setGifs(authUser.stickers);
  }, [authUser]);

  const handleSendGifImage = (gifUrl) => {
    sendMessage({ text: "", image: gifUrl });
    setShowGifPicker(false);
  };

  const confirmDeleteGif = () => {
    // Check input
    if (!gifToDelete?.gif) {
      console.log("Function errored because sticker url is required");
      toast.error("Sorry, no sticker found");
      return;
    }
    if (gifToDelete?.idx === undefined || gifToDelete?.idx === null) {
      console.log("Function errored because sticker index is required");
      toast.error("Sorry, sticker postion not found");
      return;
    }

    // Call updateStickers api function
    updateStickers({
      add: false,
      stickerUrl: gifToDelete.gif,
      stickerIndex: gifToDelete.idx,
    });

    // Clear gifToDelete
    setGifToDelete(null);
  };

  return (
    <div>
      {/* GIF container */}
      {showGifPicker && (
        <div
          ref={gifPickerRef}
          className="
                absolute bottom-16 left-0 w-60 sm:w-[500px]
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
                      w-full h-25 sm:h-28 object-cover cursor-pointer
                      rounded-md border border-zinc-300
                    "
                onClick={() => handleSendGifImage(gif)}
              />
              {/* Delete Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setGifToDelete({
                    gif: gif,
                    idx: idx,
                  });
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
          className="modal-box max-w-xs sm:max-w-sm"
          onClick={(e) => e.stopPropagation()} // prevent closing on outside click
        >
          <h3 className="font-bold text-lg">Delete Sticker?</h3>
          <p className="py-4 text-zinc-600">
            Are you sure you want to delete this sticker?
          </p>
          <div className="modal-action">
            <form method="dialog" className="flex gap-3">
              <button
                type="button"
                onClick={() => setGifToDelete(null)}
                className="btn btn-sm btn-outline"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  confirmDeleteGif();
                }}
                className="btn btn-sm btn-outline btn-error"
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
