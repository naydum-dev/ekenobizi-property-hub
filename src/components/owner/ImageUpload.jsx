import { useRef, useState } from "react";
import { resizeImage } from "../../utils/imageResize";

const MAX_IMAGES = 6;
const MAX_FILE_SIZE_MB = 5;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function ImageUpload({ images, setImages, error }) {
  const inputRef = useRef(null);
  const [processing, setProcessing] = useState(false);

  function validateFile(file) {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return `${file.name}: only JPG, PNG, or WEBP allowed`;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return `${file.name}: file must be under ${MAX_FILE_SIZE_MB}MB`;
    }
    return null;
  }

  async function handleFilesSelected(e) {
    const selected = Array.from(e.target.files);
    e.target.value = ""; // allow re-selecting the same file later

    if (images.length + selected.length > MAX_IMAGES) {
      alert(`You can upload a maximum of ${MAX_IMAGES} images`);
      return;
    }

    setProcessing(true);

    const validFiles = [];
    for (const file of selected) {
      const err = validateFile(file);
      if (err) {
        alert(err);
        continue;
      }

      let processedFile = file;
      try {
        // Resize/compress before it ever touches Storage — caps at 1200px, ~0.8 quality JPEG
        processedFile = await resizeImage(file, 1200, 0.8);
      } catch {
        // If resizing fails for any reason, fall back to the original file
        // rather than blocking the owner's upload entirely
        processedFile = file;
      }

      validFiles.push({
        file: processedFile,
        preview: URL.createObjectURL(processedFile),
        id: crypto.randomUUID(),
      });
    }

    setProcessing(false);

    setImages((prev) => {
      const updated = [...prev, ...validFiles];
      // if nothing was primary yet, make the first image primary
      if (!updated.some((img) => img.isPrimary) && updated.length > 0) {
        updated[0].isPrimary = true;
      }
      return updated;
    });
  }

  function handleSetPrimary(id) {
    setImages((prev) =>
      prev.map((img) => ({ ...img, isPrimary: img.id === id })),
    );
  }

  function handleRemove(id) {
    setImages((prev) => {
      const removed = prev.find((img) => img.id === id);
      if (removed) URL.revokeObjectURL(removed.preview);

      const updated = prev.filter((img) => img.id !== id);

      // if we removed the primary image, promote the new first image
      if (removed?.isPrimary && updated.length > 0) {
        updated[0].isPrimary = true;
      }
      return updated;
    });
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Property Images
      </label>

      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-brand-green transition-colors"
      >
        <p className="text-gray-600">
          {processing ? "Processing images..." : "Click to select images"}
        </p>
        <p className="text-sm text-gray-400 mt-1">
          JPG, PNG, or WEBP · up to {MAX_FILE_SIZE_MB}MB each · max {MAX_IMAGES}{" "}
          images
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          multiple
          onChange={handleFilesSelected}
          disabled={processing}
          className="hidden"
        />
      </div>

      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
          {images.map((img) => (
            <div key={img.id} className="relative group">
              <img
                src={img.preview}
                alt="Property preview"
                onClick={() => handleSetPrimary(img.id)}
                className={`w-full h-24 object-cover rounded-lg cursor-pointer border-2 ${
                  img.isPrimary ? "border-brand-gold" : "border-transparent"
                }`}
              />
              {img.isPrimary && (
                <span className="absolute top-1 left-1 bg-brand-gold text-white text-xs px-2 py-0.5 rounded-full">
                  Primary
                </span>
              )}
              <button
                type="button"
                onClick={() => handleRemove(img.id)}
                aria-label="Remove image"
                className="absolute top-1 right-1 bg-black/60 text-white w-5 h-5 rounded-full text-xs leading-none flex items-center justify-center"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <p className="text-sm text-gray-500 mt-2">
          Click a thumbnail to set it as the primary image.
        </p>
      )}
    </div>
  );
}
