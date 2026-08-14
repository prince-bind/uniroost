"use client";

import { useState, useCallback, useRef } from "react";
import { UploadCloud, X, ImageIcon, Loader2, CheckCircle2 } from "lucide-react";
import Image from "next/image";

interface UploadedImage {
  url: string;
  publicId: string;
  preview: string;
}

interface ImageUploaderProps {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  maxImages?: number;
}

export default function ImageUploader({
  images,
  onChange,
  maxImages = 8,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File): Promise<UploadedImage | null> => {
    const preview = URL.createObjectURL(file);
    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("/api/owner/upload", {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
      }

      const data = await res.json();
      return { url: data.url, publicId: data.publicId, preview };
    } catch (err: any) {
      URL.revokeObjectURL(preview);
      alert(`Failed to upload "${file.name}": ${err.message}`);
      return null;
    }
  };

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const remaining = maxImages - images.length;
      if (remaining <= 0) {
        alert(`Maximum ${maxImages} images allowed.`);
        return;
      }

      const toUpload = Array.from(files).slice(0, remaining);
      const names = toUpload.map((f) => f.name);
      setUploading((prev) => [...prev, ...names]);

      const results = await Promise.all(toUpload.map(uploadFile));
      const successful = results.filter(Boolean) as UploadedImage[];

      onChange([...images, ...successful]);
      setUploading((prev) => prev.filter((n) => !names.includes(n)));
    },
    [images, maxImages, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleRemove = async (index: number) => {
    const imgToRemove = images[index];
    const updated = [...images];
    URL.revokeObjectURL(imgToRemove.preview);
    updated.splice(index, 1);
    onChange(updated);

    // Delete from Cloudinary if it's a newly uploaded image (has publicId)
    if (imgToRemove.publicId) {
      try {
        await fetch("/api/owner/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicId: imgToRemove.publicId }),
        });
      } catch (err) {
        console.error("Failed to delete image from Cloudinary", err);
      }
    }
  };

  const isUploading = uploading.length > 0;
  const isFull = images.length >= maxImages;

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      {!isFull && (
        <div
          onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-300 group
            ${isDragging
              ? "border-cyan-500 bg-cyan-50"
              : "border-gray-200 bg-gray-50/60 hover:border-cyan-400 hover:bg-cyan-50/50"
            }
            ${isUploading ? "cursor-wait opacity-70" : ""}
          `}
        >
          {isUploading ? (
            <>
              <Loader2 size={40} className="text-cyan-600 animate-spin" />
              <p className="text-gray-600 font-bold text-sm">
                Uploading {uploading.length} image{uploading.length > 1 ? "s" : ""}…
              </p>
            </>
          ) : (
            <>
              <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm group-hover:border-cyan-300 group-hover:shadow-md transition-all">
                <UploadCloud size={36} className="text-cyan-600" />
              </div>
              <div className="text-center">
                <p className="text-gray-700 font-bold text-sm">
                  Drag & drop images here, or{" "}
                  <span className="text-cyan-600 underline underline-offset-2">browse files</span>
                </p>
                <p className="text-gray-400 text-xs font-medium mt-1.5">
                  JPEG, PNG, WebP · Max 10 MB per file · Up to {maxImages} images
                </p>
              </div>
            </>
          )}

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((img, index) => (
            <div
              key={img.publicId || index}
              className="relative group aspect-square rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 shadow-md"
            >
              <Image
                src={img.preview || img.url}
                alt={`Property image ${index + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                unoptimized
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gray-900/0 group-hover:bg-gray-900/30 transition-all duration-300" />

              {/* Remove button */}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 active:scale-90 shadow-md"
              >
                <X size={14} strokeWidth={3} />
              </button>

              {/* Cover badge */}
              {index === 0 && (
                <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-cyan-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-md">
                  Cover
                </div>
              )}
            </div>
          ))}

          {/* Add more tile */}
          {!isFull && !isUploading && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/60 hover:border-cyan-400 hover:bg-cyan-50/50 flex flex-col items-center justify-center gap-2 transition-all group"
            >
              <ImageIcon size={22} className="text-gray-400 group-hover:text-cyan-600 transition-colors" />
              <span className="text-[10px] font-black text-gray-400 group-hover:text-gray-600 uppercase tracking-widest">
                Add More
              </span>
            </button>
          )}
        </div>
      )}

      {/* Count indicator */}
      <div className="flex items-center gap-2">
        <CheckCircle2 size={14} className={images.length > 0 ? "text-emerald-500" : "text-gray-300"} />
        <span className="text-xs font-bold text-gray-400">
          {images.length}/{maxImages} images uploaded
          {images.length === 0 && " · At least 1 required"}
        </span>
      </div>
    </div>
  );
}
