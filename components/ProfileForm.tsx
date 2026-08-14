"use client";

import { User } from "@/generated/prisma/client";
import { Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ProfileFormProps {
  user: User;
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/owner/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update profile");
      }

      router.push("/owner");
      router.refresh();
    } catch (error: any) {
      alert(error.message);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
          <input 
            type="text" 
            name="name" 
            defaultValue={user.name} 
            required 
            className="block w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-600/20 focus:border-cyan-600 transition-all text-sm font-medium"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">Phone Number</label>
          <input 
            type="tel" 
            name="phone" 
            defaultValue={user.phone} 
            required 
            className="block w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-600/20 focus:border-cyan-600 transition-all text-sm font-medium"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
          <input 
            type="email" 
            value={user.email} 
            disabled 
            className="block w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-2xl text-gray-500 cursor-not-allowed transition-all text-sm font-medium"
          />
          <p className="text-[11px] text-gray-500 ml-2 font-medium">Email address cannot be changed.</p>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <label className="text-sm font-bold text-gray-700 ml-1">ID Proof Type</label>
          <select 
            name="idProofType" 
            defaultValue={user.idProofType || ""} 
            className="block w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-600/20 focus:border-cyan-600 transition-all text-sm font-medium"
          >
            <option value="">Select ID Proof</option>
            <option value="AADHAAR">Aadhaar Card</option>
            <option value="PAN">PAN Card</option>
            <option value="VOTER_ID">Voter ID</option>
          </select>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
        <Link href="/owner" className="px-6 py-3 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95 shadow-sm">
          Cancel
        </Link>
        <button type="submit" disabled={loading} className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-cyan-600 text-white text-sm font-black rounded-2xl hover:bg-cyan-700 transition-all active:scale-95 shadow-lg shadow-cyan-600/20 disabled:opacity-70">
          <Save size={18} />
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
