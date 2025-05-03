import React, { useState, useRef } from "react";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

import { useMomentStore } from "../../store/useMomentStore";

const MomentWriter = () => {
  const { postMoment } = useMomentStore();

  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const formRef = useRef();

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

  const handlePostMoment = (event) => {
    // Prevent refreshing the page
    event.preventDefault();
    // Check text and image are empty or not
    if (!text.trim() && !imagePreview) {
      console.log("Function errored because both text and image are empty");
      toast.error("Sorry, an error occurs");
      return;
    }

    // Post moment
    postMoment({
      text: text.trim(),
      image: imagePreview,
    });

    // Clear form
    setText("");
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="p-1 w-full mb-6">
      <form
        ref={formRef}
        onSubmit={handlePostMoment}
        className="flex items-center gap-2"
      >
        <div className="flex-1 flex gap-2">
          {/* Input textarea field */}
          <textarea
            type="textarea"
            className="w-full textarea input-bordered rounded-lg input-sm sm:input-md h-36"
            placeholder="Post a moment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {/* Hidden input image DOM */}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
        </div>
      </form>

      <div
        className={`mt-3 flex items-center gap-2 ${
          imagePreview ? "justify-between" : "justify-end"
        }`}
      >
        {/* Image preview */}
        {imagePreview && (
          <div className="flex items-center gap-2">
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
              />
              <button
                onClick={removeImage}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
                flex items-center justify-center"
                type="button"
              >
                <X className="size-3" />
              </button>
            </div>
          </div>
        )}

        {/* Upload image button and post button */}
        <div
          className={`flex items-center gap-2 ${
            imagePreview ? "mb-10" : "mb-0"
          }`}
        >
          <button
            type="button"
            className={`btn btn-circle hidden sm:flex
                        ${imagePreview ? "text-emerald-500" : "text-zinc-500"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
          {/* post moment button */}
          <button
            type="submit"
            className="btn btn-circle"
            disabled={!text.trim() && !imagePreview}
            onClick={() => formRef.current?.requestSubmit()}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MomentWriter;
