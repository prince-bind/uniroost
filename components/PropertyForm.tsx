"use client";

import { Property } from "@/generated/prisma/client";
import { Save, Check, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import ImageUploader from "@/components/ImageUploader";

interface UploadedImage {
  url: string;
  publicId: string;
  preview: string;
}

interface PropertyFormProps {
  property?: (Property & {
    amenities?: { amenityId: string }[];
    images?: { url: string }[];
    colleges?: { collegeId: string; distanceKm: number | null }[];
  }) | null;
  allAmenities: { id: string; name: string }[];
  allColleges: { id: string; name: string; city: string; state: string }[];
}

export default function PropertyForm({ property, allAmenities, allColleges }: PropertyFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>(
    property?.images?.map((img) => ({ url: img.url, publicId: "", preview: img.url })) ?? []
  );

  const [selectedAmenities, setSelectedAmenities] = useState<Set<string>>(
    new Set(property?.amenities?.map((a) => a.amenityId) ?? [])
  );
  const [amenitySearch, setAmenitySearch] = useState("");

  const toggleAmenity = (id: string) => {
    setSelectedAmenities((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filteredAmenities = useMemo(
    () => allAmenities.filter((a) => a.name.toLowerCase().includes(amenitySearch.toLowerCase())),
    [allAmenities, amenitySearch]
  );

  const [collegeSearch, setCollegeSearch] = useState("");
  const [selectedColleges, setSelectedColleges] = useState<Map<string, number>>(
    new Map(property?.colleges?.map((c) => [c.collegeId, c.distanceKm ?? 0]) ?? [])
  );

  const toggleCollege = (id: string) => {
    setSelectedColleges((prev) => {
      const next = new Map(prev);
      next.has(id) ? next.delete(id) : next.set(id, 0);
      return next;
    });
  };

  const setCollegeDistance = (id: string, dist: number) => {
    setSelectedColleges((prev) => new Map(prev).set(id, dist));
  };

  const filteredColleges = useMemo(
    () =>
      allColleges.filter(
        (c) =>
          c.name.toLowerCase().includes(collegeSearch.toLowerCase()) ||
          c.city.toLowerCase().includes(collegeSearch.toLowerCase())
      ),
    [allColleges, collegeSearch]
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (uploadedImages.length === 0) {
      alert("Please upload at least one property image.");
      return;
    }

    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const collegeEntries = Array.from(selectedColleges.entries()).map(([collegeId, distanceKm]) => ({
      collegeId,
      distanceKm,
    }));

    const payload = {
      title: formData.get("title"),
      description: formData.get("description"),
      rent: formData.get("rent"),
      rentType: formData.get("rentType"),
      address: formData.get("address"),
      city: formData.get("city"),
      state: formData.get("state"),
      zipcode: formData.get("zipcode"),
      latitude: formData.get("latitude") ? parseFloat(formData.get("latitude") as string) : null,
      longitude: formData.get("longitude") ? parseFloat(formData.get("longitude") as string) : null,
      type: formData.get("type"),
      gender: formData.get("gender"),
      occupancy: formData.get("occupancy"),
      isFurnished: formData.get("isFurnished") === "true",
      isAvailable: formData.get("isAvailable") === "true",
      amenityIds: Array.from(selectedAmenities),
      imageUrls: uploadedImages.map((img) => img.url),
      colleges: collegeEntries,
    };

    try {
      const url = property ? `/api/owner/properties/${property.id}` : "/api/owner/properties";
      const method = property ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save property");
      }

      router.push("/owner");
      router.refresh();
    } catch (error: any) {
      console.error(error);
      alert(error.message);
      setLoading(false);
    }
  }

  const handleCancel = async () => {
    setIsCanceling(true);
    // Delete any newly uploaded images that have a publicId
    const newImages = uploadedImages.filter(img => img.publicId);
    if (newImages.length > 0) {
      try {
        await Promise.all(
          newImages.map(img =>
            fetch("/api/owner/upload", {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ publicId: img.publicId }),
            })
          )
        );
      } catch (err) {
        console.error("Failed to cleanup newly uploaded images", err);
      }
    }
    router.push(property ? `/owner/property/${property.id}` : "/owner");
  };

  /* ── Light-theme style helpers ────────────────────────────────── */
  const inputCls =
    "block w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 transition-all text-sm font-bold shadow-sm";
  const labelCls = "block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1";
  const sectionCls = "bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/30 border border-gray-100 p-8 sm:p-12 relative overflow-hidden";
  const sectionTitle = "text-xl font-black text-gray-900 mb-1.5";
  const sectionSub = "text-sm text-gray-500 font-medium mb-8";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* ── Basic Details ─────────────────────────────────────────── */}
      <div className={sectionCls}>
        <h2 className={sectionTitle}>Basic Details</h2>
        <p className={sectionSub}>Title, description and pricing information.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label className={labelCls}>Property Title <span className="text-red-400">*</span></label>
            <input type="text" name="title" defaultValue={property?.title ?? ""} required className={inputCls} placeholder="E.g. Spacious PG near BITS Pilani" />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Description</label>
            <textarea name="description" defaultValue={property?.description ?? ""} rows={4} className={inputCls} placeholder="Describe the property, surroundings, house rules…" />
          </div>
          <div>
            <label className={labelCls}>Rent Amount (₹) <span className="text-red-400">*</span></label>
            <input type="number" name="rent" defaultValue={property?.rent ?? ""} required className={inputCls} placeholder="E.g. 7500" />
          </div>
          <div>
            <label className={labelCls}>Rent Type <span className="text-red-400">*</span></label>
            <select name="rentType" defaultValue={property?.rentType ?? "PER_BED"} required className={inputCls}>
              <option value="PER_BED">Per Bed</option>
              <option value="PER_ROOM">Per Room</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Property Images ───────────────────────────────────────── */}
      <div className={sectionCls}>
        <h2 className={sectionTitle}>Property Images</h2>
        <p className={sectionSub}>Upload high-quality photos. First image becomes the cover.</p>
        <ImageUploader images={uploadedImages} onChange={setUploadedImages} maxImages={8} />
      </div>

      {/* ── Amenities ─────────────────────────────────────────────── */}
      <div className={sectionCls}>
        <h2 className={sectionTitle}>Amenities</h2>
        <p className={sectionSub}>
          Select all amenities available at this property.
          {selectedAmenities.size > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-cyan-50 text-cyan-700 text-[10px] font-black rounded-full border border-cyan-100">
              {selectedAmenities.size} selected
            </span>
          )}
        </p>

        {allAmenities.length === 0 ? (
          <p className="text-gray-400 text-sm">No amenities configured yet — ask your admin to add some.</p>
        ) : (
          <>
            <div className="relative mb-4">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={amenitySearch}
                onChange={(e) => setAmenitySearch(e.target.value)}
                placeholder="Search amenities…"
                className="block w-full pl-10 pr-4 py-2.5 bg-gray-50/60 border border-gray-100 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 text-sm font-semibold transition-all"
              />
            </div>

            {filteredAmenities.length === 0 ? (
              <p className="text-gray-400 text-sm">No amenities match your search.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {filteredAmenities.map((amenity) => {
                  const checked = selectedAmenities.has(amenity.id);
                  return (
                    <button
                      key={amenity.id}
                      type="button"
                      onClick={() => toggleAmenity(amenity.id)}
                      className={`flex items-center gap-2.5 p-3.5 rounded-2xl border text-sm font-bold text-left transition-all active:scale-95 ${
                        checked
                          ? "bg-cyan-50 border-cyan-200 text-cyan-700"
                          : "bg-gray-50/60 border-gray-100 text-gray-600 hover:bg-white hover:border-gray-200 hover:text-gray-900"
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-md border shrink-0 flex items-center justify-center transition-all ${
                        checked ? "bg-cyan-500 border-cyan-500" : "border-gray-300 bg-white"
                      }`}>
                        {checked && <Check size={11} strokeWidth={3} className="text-white" />}
                      </span>
                      {amenity.name}
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Nearby Colleges ───────────────────────────────────────── */}
      <div className={sectionCls}>
        <h2 className={sectionTitle}>Nearby Colleges</h2>
        <p className={sectionSub}>
          Select colleges close to your property and enter the distance.
          {selectedColleges.size > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-cyan-50 text-cyan-700 text-[10px] font-black rounded-full border border-cyan-100">
              {selectedColleges.size} linked
            </span>
          )}
        </p>

        {allColleges.length === 0 ? (
          <p className="text-gray-400 text-sm">No colleges in the database yet — ask your admin to add some.</p>
        ) : (
          <>
            <div className="relative mb-4">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={collegeSearch}
                onChange={(e) => setCollegeSearch(e.target.value)}
                placeholder="Search by college name or city…"
                className="block w-full pl-10 pr-4 py-2.5 bg-gray-50/60 border border-gray-100 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 text-sm font-semibold transition-all"
              />
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {filteredColleges.length === 0 ? (
                <p className="text-gray-400 text-sm font-medium py-4 text-center">No colleges match your search.</p>
              ) : (
                filteredColleges.map((college) => {
                  const selected = selectedColleges.has(college.id);
                  const dist = selectedColleges.get(college.id) ?? 0;
                  return (
                    <div
                      key={college.id}
                      className={`flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-2xl border transition-all ${
                        selected
                          ? "bg-cyan-50 border-cyan-200"
                          : "bg-gray-50/60 border-gray-100 hover:border-gray-200 hover:bg-white"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleCollege(college.id)}
                        className="flex items-center gap-3 flex-1 text-left"
                      >
                        <span className={`w-5 h-5 rounded-lg border shrink-0 flex items-center justify-center transition-all ${
                          selected ? "bg-cyan-500 border-cyan-500" : "border-gray-300 bg-white"
                        }`}>
                          {selected && <Check size={12} strokeWidth={3} className="text-white" />}
                        </span>
                        <div>
                          <p className={`text-sm font-bold ${selected ? "text-cyan-800" : "text-gray-700"}`}>
                            {college.name}
                          </p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            {college.city}, {college.state}
                          </p>
                        </div>
                      </button>

                      {selected && (
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Distance</span>
                          <div className="relative">
                            <input
                              type="number"
                              step="0.1"
                              min="0"
                              value={dist}
                              onChange={(e) => setCollegeDistance(college.id, parseFloat(e.target.value) || 0)}
                              className="w-24 px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 pr-8"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400">KM</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>

      {/* ── Property Details ──────────────────────────────────────── */}
      <div className={sectionCls}>
        <h2 className={sectionTitle}>Property Details</h2>
        <p className={sectionSub}>Type, occupancy, location and availability.</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-5">
          <div>
            <label className={labelCls}>Property Type</label>
            <select name="type" defaultValue={property?.type ?? "PG"} className={inputCls}>
              <option value="PG">PG</option>
              <option value="FLAT">Flat / Apartment</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Allowed Gender</label>
            <select name="gender" defaultValue={property?.gender ?? "UNISEX"} className={inputCls}>
              <option value="BOYS">Boys Only</option>
              <option value="GIRLS">Girls Only</option>
              <option value="UNISEX">Unisex</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Occupancy</label>
            <select name="occupancy" defaultValue={property?.occupancy ?? "SINGLE"} className={inputCls}>
              <option value="SINGLE">Single</option>
              <option value="DOUBLE">Double Sharing</option>
              <option value="TRIPLE">Triple Sharing</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
          <div>
            <label className={labelCls}>Street Address <span className="text-red-400">*</span></label>
            <input type="text" name="address" defaultValue={property?.address ?? ""} required className={inputCls} placeholder="Street / Lane / Building name" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelCls}>City <span className="text-red-400">*</span></label>
              <input type="text" name="city" defaultValue={property?.city ?? ""} required className={inputCls} placeholder="Delhi" />
            </div>
            <div>
              <label className={labelCls}>State <span className="text-red-400">*</span></label>
              <input type="text" name="state" defaultValue={property?.state ?? ""} required className={inputCls} placeholder="UP" />
            </div>
            <div>
              <label className={labelCls}>PIN <span className="text-red-400">*</span></label>
              <input type="text" name="zipcode" defaultValue={property?.zipcode ?? ""} required className={inputCls} placeholder="110001" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
          <div>
            <label className={labelCls}>Latitude <span className="text-gray-300 font-semibold normal-case tracking-normal">(optional)</span></label>
            <input type="number" name="latitude" step="any" defaultValue={property?.latitude ?? ""} className={inputCls} placeholder="e.g. 28.6139" />
          </div>
          <div>
            <label className={labelCls}>Longitude <span className="text-gray-300 font-semibold normal-case tracking-normal">(optional)</span></label>
            <input type="number" name="longitude" step="any" defaultValue={property?.longitude ?? ""} className={inputCls} placeholder="e.g. 77.2090" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>Furnished Status</label>
            <select name="isFurnished" defaultValue={property ? (property.isFurnished ? "true" : "false") : "false"} className={inputCls}>
              <option value="true">Furnished</option>
              <option value="false">Unfurnished</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Availability</label>
            <select name="isAvailable" defaultValue={property ? (property.isAvailable ? "true" : "false") : "true"} className={inputCls}>
              <option value="true">Available</option>
              <option value="false">Occupied</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Submit ────────────────────────────────────────────────── */}
      <div className="flex justify-end gap-4 pt-4 pb-8">
        <button
          type="button"
          onClick={handleCancel}
          disabled={loading || isCanceling}
          className="px-8 py-4 bg-white border border-gray-200 text-gray-700 text-sm font-black rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95 shadow-sm flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isCanceling ? "Canceling…" : "Cancel"}
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2.5 px-10 py-4 bg-gray-900 text-white text-sm font-black rounded-2xl hover:bg-cyan-600 transition-all duration-300 active:scale-95 shadow-xl shadow-gray-200 disabled:opacity-60 disabled:cursor-not-allowed group"
        >
          <Save size={18} className="text-gray-400 group-hover:text-white transition-colors" />
          {loading ? "Saving…" : property ? "Update Property" : "Create Listing"}
        </button>
      </div>
    </form>
  );
}
