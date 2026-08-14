"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Loader2,
  CheckCircle2,
  Sparkles,
  Tag,
  Layers,
  XCircle,
} from "lucide-react";
import Link from "next/link";

interface Amenity {
  id: string;
  name: string;
  createdAt: string;
  _count: { properties: number };
}

// Preset suggestions for quick-add
const SUGGESTIONS = [
  "Wi-Fi", "AC", "Parking", "Laundry", "CCTV",
  "Gym", "Mess / Food", "Hot Water", "Power Backup",
  "Furnished", "Study Room", "Housekeeping",
  "Water Purifier", "Refrigerator", "Microwave",
  "TV", "Attached Bathroom", "Balcony", "Security Guard",
];

export default function AdminAmenitiesPage() {
  const { data: session, status } = useSession();
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auth guard
  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
    if (session?.user && session.user.role !== "ADMIN") redirect("/login");
  }, [status, session]);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAmenities = async () => {
    try {
      const res = await fetch("/api/admin/amenities");
      const data = await res.json();
      setAmenities(Array.isArray(data) ? data : []);
    } catch {
      showToast("error", "Failed to load amenities.");
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") fetchAmenities();
  }, [status]);

  const handleAdd = async (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    // Prevent duplicate add optimistically
    if (amenities.some((a) => a.name.toLowerCase() === trimmed.toLowerCase())) {
      showToast("error", `"${trimmed}" already exists.`);
      return;
    }

    setAdding(true);
    try {
      const res = await fetch("/api/admin/amenities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to add amenity.");
      }

      const newAmenity: Amenity = await res.json();
      setAmenities((prev) => [...prev, newAmenity].sort((a, b) => a.name.localeCompare(b.name)));
      setNameInput("");
      inputRef.current?.focus();
      showToast("success", `"${trimmed}" added successfully!`);
    } catch (err: any) {
      showToast("error", err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAdd(nameInput);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"? It will be removed from all linked properties.`)) return;

    setDeleteLoading(id);
    try {
      const res = await fetch("/api/admin/amenities", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to delete.");
      }

      setAmenities((prev) => prev.filter((a) => a.id !== id));
      showToast("success", `"${name}" deleted.`);
    } catch (err: any) {
      showToast("error", err.message);
    } finally {
      setDeleteLoading(null);
    }
  };

  // Suggestions not yet in the list
  const unusedSuggestions = SUGGESTIONS.filter(
    (s) => !amenities.some((a) => a.name.toLowerCase() === s.toLowerCase())
  );

  /* ── Loading ──────────────────────────────────────────────────────── */
  if (status === "loading" || fetchLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
          <p className="text-sm font-bold text-gray-500">Loading amenities…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1100px] mx-auto space-y-8 pb-20">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-5">
        <Link
          href="/admin"
          className="p-3 bg-white shadow-md hover:shadow-lg rounded-2xl border border-gray-100 transition-all active:scale-90 group shrink-0"
        >
          <ArrowLeft size={22} className="text-gray-500 group-hover:text-cyan-600 transition-colors" />
        </Link>
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-0.5">
            Admin Control Panel
          </p>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Amenities</h1>
        </div>

        {/* Count pill */}
        <div className="ml-auto hidden sm:flex items-center gap-2 px-5 py-2.5 bg-violet-50 border border-violet-100 rounded-2xl">
          <Sparkles size={16} className="text-violet-500" />
          <span className="text-sm font-black text-violet-700">{amenities.length}</span>
          <span className="text-xs font-bold text-violet-400">Amenities</span>
        </div>
      </div>

      {/* ── Toast ──────────────────────────────────────────────────── */}
      {toast && (
        <div
          className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl border text-sm font-bold shadow-sm transition-all
            ${toast.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : "bg-red-50 border-red-200 text-red-700"
            }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 size={16} className="shrink-0 text-emerald-500" />
          ) : (
            <XCircle size={16} className="shrink-0 text-red-400" />
          )}
          {toast.msg}
        </div>
      )}

      {/* ── Add Amenity Card ────────────────────────────────────────── */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/40 border border-gray-100/80 p-8">
        <div className="flex items-center gap-3 mb-7">
          <div className="p-2.5 bg-violet-50 rounded-xl text-violet-600 border border-violet-100">
            <Plus size={20} />
          </div>
          <div>
            <h2 className="text-lg font-black text-gray-900">Add New Amenity</h2>
            <p className="text-xs text-gray-400 font-medium mt-0.5">
              Amenity names must be unique across the platform.
            </p>
          </div>
        </div>

        {/* Input form */}
        <form onSubmit={handleFormSubmit} className="flex gap-3">
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-violet-500 transition-colors">
              <Tag size={16} />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="E.g. Wi-Fi, AC, Parking…"
              maxLength={60}
              className="block w-full pl-10 pr-4 py-3.5 bg-gray-50/60 border border-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-400 transition-all text-sm font-semibold"
            />
          </div>
          <button
            type="submit"
            disabled={adding || !nameInput.trim()}
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-gray-950 text-white text-sm font-black rounded-2xl hover:bg-violet-600 transition-all active:scale-95 shadow-lg shadow-gray-900/10 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {adding ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Plus size={16} />
            )}
            {adding ? "Adding…" : "Add"}
          </button>
        </form>

        {/* Quick-add suggestions */}
        {unusedSuggestions.length > 0 && (
          <div className="mt-6">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
              Quick Add
            </p>
            <div className="flex flex-wrap gap-2">
              {unusedSuggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleAdd(s)}
                  disabled={adding}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-50 border border-gray-200 text-gray-600 text-xs font-bold rounded-full hover:bg-violet-50 hover:border-violet-200 hover:text-violet-700 transition-all active:scale-95 disabled:opacity-40"
                >
                  <Plus size={11} />
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Amenities List ──────────────────────────────────────────── */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/30 border border-gray-100/80 overflow-hidden">
        {/* Table header */}
        <div className="px-8 py-5 bg-gray-50/60 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
            <Layers size={15} className="text-violet-500" />
            All Amenities
          </h2>
          <span className="px-3 py-1 bg-white border border-gray-200 text-gray-700 text-xs font-black rounded-full shadow-sm">
            {amenities.length} total
          </span>
        </div>

        {amenities.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4 text-center px-6">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
              <Tag size={26} className="text-gray-300" />
            </div>
            <div>
              <p className="font-black text-gray-700">No amenities yet</p>
              <p className="text-sm text-gray-400 font-medium mt-1">
                Add your first amenity above — owners will see them when listing a property.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    Amenity Name
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    Used By
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    Added On
                  </th>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {amenities.map((amenity) => (
                  <tr key={amenity.id} className="hover:bg-gray-50/60 transition-colors group">

                    {/* Name */}
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center shrink-0">
                          <Tag size={13} className="text-violet-500" />
                        </div>
                        <span className="text-sm font-black text-gray-900">{amenity.name}</span>
                      </div>
                    </td>

                    {/* Usage count */}
                    <td className="px-6 py-4">
                      {amenity._count.properties > 0 ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-50 border border-cyan-100 text-cyan-700 text-xs font-black rounded-full">
                          <Layers size={11} />
                          {amenity._count.properties} {amenity._count.properties === 1 ? "property" : "properties"}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-300 font-bold">Unused</span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-500 font-bold">
                        {new Date(amenity.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </td>

                    {/* Delete */}
                    <td className="px-8 py-4 text-right">
                      <button
                        onClick={() => handleDelete(amenity.id, amenity.name)}
                        disabled={deleteLoading === amenity.id}
                        title={`Delete ${amenity.name}`}
                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-30"
                      >
                        {deleteLoading === amenity.id ? (
                          <Loader2 size={16} className="animate-spin text-red-400" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
