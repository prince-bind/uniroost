"use client";

import { useState } from "react";
import { User, IdProofType } from "@/generated/prisma/client";
import { useRouter } from "next/navigation";
import { Save, UploadCloud, Loader2, Image as ImageIcon, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface OwnerProfileFormProps {
  user: User;
}

interface ImageState {
  url: string;
  publicId?: string;
}

export default function OwnerProfileForm({ user }: OwnerProfileFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  
  // State for images
  const [profileImage, setProfileImage] = useState<ImageState | null>(
    user.profileImage ? { url: user.profileImage } : null
  );
  const [idProofImage, setIdProofImage] = useState<ImageState | null>(
    user.idProofUrl ? { url: user.idProofUrl } : null
  );

  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingIdProof, setUploadingIdProof] = useState(false);

  const uploadFile = async (file: File, isProfile: boolean) => {
    const form = new FormData();
    form.append("file", file);
    
    if (isProfile) setUploadingProfile(true);
    else setUploadingIdProof(true);

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
      if (isProfile) setProfileImage({ url: data.url, publicId: data.publicId });
      else setIdProofImage({ url: data.url, publicId: data.publicId });
    } catch (err: any) {
      alert(`Failed to upload: ${err.message}`);
    } finally {
      if (isProfile) setUploadingProfile(false);
      else setUploadingIdProof(false);
    }
  };

  const deleteImage = async (publicId: string) => {
    try {
      await fetch("/api/owner/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId }),
      });
    } catch (err) {
      console.error("Failed to delete image", err);
    }
  };

  const removeProfileImage = () => {
    if (profileImage?.publicId) deleteImage(profileImage.publicId);
    setProfileImage(null);
  };

  const removeIdProofImage = () => {
    if (idProofImage?.publicId) deleteImage(idProofImage.publicId);
    setIdProofImage(null);
  };

  const handleCancel = async () => {
    setIsCanceling(true);
    const toDelete = [];
    if (profileImage?.publicId) toDelete.push(profileImage.publicId);
    if (idProofImage?.publicId) toDelete.push(idProofImage.publicId);
    
    if (toDelete.length > 0) {
      await Promise.all(toDelete.map(deleteImage));
    }
    router.push("/owner/profile");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      idProofType: formData.get("idProofType"),
      idProofNo: formData.get("idProofNo"),
      profileImage: profileImage?.url || null,
      idProofUrl: idProofImage?.url || null,
    };

    try {
      const res = await fetch("/api/owner/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update profile");
      }

      router.push("/owner/profile");
      router.refresh();
    } catch (error: any) {
      console.error(error);
      alert(error.message);
      setLoading(false);
    }
  };

  const inputCls = "block w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 transition-all text-sm font-bold shadow-sm";
  const labelCls = "block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1";
  const sectionCls = "bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/30 border border-gray-100 p-8 sm:p-12 relative overflow-hidden";
  const sectionTitle = "text-xl font-black text-gray-900 mb-1.5";
  const sectionSub = "text-sm text-gray-500 font-medium mb-8";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* ── Basic Information ──────────────────────────────────────── */}
      <div className={sectionCls}>
        <h2 className={sectionTitle}>Basic Information</h2>
        <p className={sectionSub}>Update your personal details.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="sm:col-span-2">
            <label className={labelCls}>Full Name <span className="text-red-400">*</span></label>
            <input type="text" name="name" defaultValue={user.name} required className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Email Address</label>
            <input type="email" value={user.email} disabled className={`${inputCls} opacity-60 cursor-not-allowed`} />
            <p className="text-xs text-gray-400 mt-2 ml-2 font-medium">Email cannot be changed.</p>
          </div>
          <div>
            <label className={labelCls}>Phone Number <span className="text-red-400">*</span></label>
            <input type="tel" name="phone" defaultValue={user.phone} required className={inputCls} />
          </div>
        </div>
      </div>

      {/* ── Documents & Images ─────────────────────────────────────── */}
      <div className={sectionCls}>
        <h2 className={sectionTitle}>Documents & Verification</h2>
        <p className={sectionSub}>Upload your profile picture and identity proof.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Profile Image Upload */}
          <div>
            <label className={labelCls}>Profile Picture</label>
            <div className="mt-2">
              {profileImage ? (
                <div className="relative w-32 h-32 group rounded-full overflow-hidden border-4 border-gray-50 shadow-md">
                  <Image src={profileImage.url} alt="Profile" fill className="object-cover" unoptimized />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button" onClick={removeProfileImage} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md">
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-32 h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-full cursor-pointer hover:bg-cyan-50 hover:border-cyan-300 transition-all group relative overflow-hidden">
                  {uploadingProfile ? (
                    <Loader2 size={24} className="text-cyan-600 animate-spin" />
                  ) : (
                    <>
                      <ImageIcon size={24} className="text-gray-400 group-hover:text-cyan-600 mb-2 transition-colors" />
                      <span className="text-[10px] font-black text-gray-400 group-hover:text-cyan-600 uppercase tracking-widest text-center px-2">Upload</span>
                    </>
                  )}
                  <input type="file" accept="image/*" className="hidden" disabled={uploadingProfile} onChange={(e) => {
                    if (e.target.files?.[0]) uploadFile(e.target.files[0], true);
                  }} />
                </label>
              )}
            </div>
          </div>

          {/* ID Proof Upload */}
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>ID Proof Type</label>
                <select name="idProofType" defaultValue={user.idProofType ?? ""} className={inputCls}>
                  <option value="">Select ID Type</option>
                  <option value="AADHAAR">Aadhaar Card</option>
                  <option value="PAN">PAN Card</option>
                  <option value="VOTER_ID">Voter ID</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Document Number</label>
                <input 
                  type="text" 
                  name="idProofNo" 
                  defaultValue={user.idProofNo ?? ""} 
                  className={inputCls} 
                  placeholder="e.g. ABCDE1234F" 
                />
              </div>
            </div>
            
            <div>
              <label className={labelCls}>ID Document Image</label>
              <div className="mt-2">
                {idProofImage ? (
                  <div className="relative w-full h-40 group rounded-2xl overflow-hidden border border-gray-200 shadow-md">
                    <Image src={idProofImage.url} alt="ID Proof" fill className="object-cover" unoptimized />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button type="button" onClick={removeIdProofImage} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md">
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-40 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-cyan-50 hover:border-cyan-300 transition-all group">
                    {uploadingIdProof ? (
                      <Loader2 size={28} className="text-cyan-600 animate-spin" />
                    ) : (
                      <>
                        <UploadCloud size={28} className="text-gray-400 group-hover:text-cyan-600 mb-2 transition-colors" />
                        <span className="text-sm font-bold text-gray-600 group-hover:text-cyan-700 transition-colors">Upload Document</span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">JPEG, PNG, WEBP</span>
                      </>
                    )}
                    <input type="file" accept="image/*" className="hidden" disabled={uploadingIdProof} onChange={(e) => {
                      if (e.target.files?.[0]) uploadFile(e.target.files[0], false);
                    }} />
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Submit ────────────────────────────────────────────────── */}
      <div className="flex justify-end gap-4 pt-4 pb-8">
        <button
          type="button"
          onClick={handleCancel}
          disabled={loading || uploadingProfile || uploadingIdProof || isCanceling}
          className="px-8 py-4 bg-white border border-gray-200 text-gray-700 text-sm font-black rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95 shadow-sm flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isCanceling ? "Canceling..." : "Cancel"}
        </button>
        <button
          type="submit"
          disabled={loading || uploadingProfile || uploadingIdProof || isCanceling}
          className="inline-flex items-center justify-center gap-2.5 px-10 py-4 bg-gray-900 text-white text-sm font-black rounded-2xl hover:bg-cyan-600 transition-all duration-300 active:scale-95 shadow-xl shadow-gray-200 disabled:opacity-60 disabled:cursor-not-allowed group"
        >
          <Save size={18} className="text-gray-400 group-hover:text-white transition-colors" />
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>

    </form>
  );
}
