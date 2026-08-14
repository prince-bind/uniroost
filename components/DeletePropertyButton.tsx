"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface DeletePropertyButtonProps {
  propertyId: string;
}

export default function DeletePropertyButton({ propertyId }: DeletePropertyButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this property? This action cannot be undone.");
    
    if (!confirmDelete) return;

    setIsDeleting(true);

    try {
      const res = await fetch(`/api/owner/properties/${propertyId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete property");
      }

      router.push("/owner");
      router.refresh();
    } catch (error: any) {
      console.error(error);
      alert(error.message);
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-rose-50 text-rose-600 border border-rose-200 text-sm font-bold rounded-2xl hover:bg-rose-600 hover:text-white transition-all active:scale-95 shadow-sm shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
      title="Delete Property"
    >
      <Trash2 size={16} />
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}
