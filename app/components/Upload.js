"use client";

import { useState } from "react";

const Upload = ({ onImagesUpload }) => {
  const [images, setImages] = useState([]); // Array of uploaded image URLs
  const [loading, setLoading] = useState(false);

  const handleImagesChange = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);
    const uploadedImages = [];

    // Iterate over selected files and upload each one
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);
      // Replace with your actual upload preset name from Cloudinary (and ensure it's set to unsigned)
      formData.append("upload_preset", "ml_default");

      try {
        const res = await fetch("https://api.cloudinary.com/v1_1/drupytlml/image/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          console.error(`Upload failed for ${file.name}`);
          continue;
        }

        const data = await res.json();
        uploadedImages.push(data.secure_url);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }

    // Update state with new images
    setImages((prevImages) => [...prevImages, ...uploadedImages]);
    // Pass uploaded image URLs back to parent component
    if (onImagesUpload) onImagesUpload(uploadedImages);
    setLoading(false);
  };

  return (
    <div className="mb-4">
      <label className="block mb-1 font-bold">Upload Images</label>
      <input type="file" multiple onChange={handleImagesChange} className="border p-2 w-full" />
      {loading && <p>Uploading...</p>}
      <div className="mt-2 flex flex-wrap gap-2">
        {images.map((imgUrl, index) => (
          <img key={index} src={imgUrl} alt={`Uploaded ${index}`} className="w-24 h-auto object-cover" />
        ))}
      </div>
    </div>
  );
};

export default Upload;
