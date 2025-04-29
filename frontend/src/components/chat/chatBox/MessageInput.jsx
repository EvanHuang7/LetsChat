import React, { useState, useRef } from "react";
import { Image, Send, X, Smile, Trash } from "lucide-react";
import toast from "react-hot-toast";

import { useMessageStore } from "../../../store/useMessageStore";

import GifsContainer from "./GifsContainer";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const { sendMessage } = useMessageStore();

  const fileInputRef = useRef(null);
  const gifButtonRef = useRef(null);

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

  return (
    <div className="p-4 w-full relative">
      {/* GIF container */}
      <GifsContainer
        showGifPicker={showGifPicker}
        setShowGifPicker={setShowGifPicker}
        gifButtonRef={gifButtonRef}
      />

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
          ref={gifButtonRef}
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
          {/* Upload image Button */}
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
        {/* Send message Button */}
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
