"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import {
  ArrowLeft, Building2, Plus, MapPin, Globe,
  Hash, ExternalLink, Trash2, Loader2, CheckCircle2,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";

interface College {
  id: string;
  name: string;
  shortName: string | null;
  city: string;
  state: string;
  zipcode: string | null;
  websiteUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
}

export default function AdminCollegesPage() {
  const { data: session, status } = useSession();
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Security check
  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
    if (session?.user && session.user.role !== "ADMIN") redirect("/login");
  }, [status, session]);

  const fetchColleges = async () => {
    try {
      const res = await fetch("/api/admin/colleges");
      const data = await res.json();
      setColleges(Array.isArray(data) ? data : []);
    } catch {
      console.error("Failed to fetch colleges");
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") fetchColleges();
  }, [status]);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // Strip empty optional strings so API receives null via the || null pattern
    Object.keys(data).forEach((k) => {
      if (data[k] === "") delete data[k];
    });

    try {
      const res = await fetch("/api/admin/colleges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to add college");
      }

      await fetchColleges();
      (e.target as HTMLFormElement).reset();
      showSuccess("College registered successfully!");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (collegeId: string, collegeName: string) => {
    if (
      !window.confirm(
        `Delete "${collegeName}"? This will also remove it from any linked properties.`
      )
    )
      return;

    setDeleteLoading(collegeId);
    try {
      const res = await fetch("/api/admin/colleges", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: collegeId }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete college");
      }

      await fetchColleges();
      showSuccess(`"${collegeName}" deleted.`);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setDeleteLoading(null);
    }
  };

  /* ── Shared style helpers ─────────────────────────────────────────── */
  const inputCls =
    "block w-full px-4 py-3.5 bg-gray-50/60 border border-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 transition-all text-sm font-semibold";

  const iconInputCls =
    "block w-full pl-10 pr-4 py-3.5 bg-gray-50/60 border border-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 transition-all text-sm font-semibold";

  const labelCls =
    "block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1";

  /* ── Loading state ────────────────────────────────────────────────── */
  if (status === "loading" || fetchLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
          <p className="text-sm font-bold text-gray-500">Loading college directory…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-20">

      {/* ── Header ────────────────────────────────────────────────────── */}
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
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">College Directory</h1>
        </div>

        {/* Stats pill */}
        <div className="ml-auto hidden sm:flex items-center gap-2 px-5 py-2.5 bg-cyan-50 border border-cyan-100 rounded-2xl">
          <GraduationCap size={18} className="text-cyan-600" />
          <span className="text-sm font-black text-cyan-700">{colleges.length}</span>
          <span className="text-xs font-bold text-cyan-500">Institutions</span>
        </div>
      </div>

      {/* ── Success toast ──────────────────────────────────────────────── */}
      {successMsg && (
        <div className="flex items-center gap-3 px-6 py-4 bg-emerald-50 border border-emerald-200 rounded-2xl shadow-sm">
          <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
          <p className="text-sm font-bold text-emerald-700">{successMsg}</p>
        </div>
      )}

      {/* ── Register New Institution ────────────────────────────────────── */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/40 border border-gray-100/80 p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-cyan-50 rounded-xl text-cyan-600 border border-cyan-100">
            <Plus size={20} />
          </div>
          <div>
            <h2 className="text-lg font-black text-gray-900">Register New Institution</h2>
            <p className="text-xs text-gray-400 font-medium mt-0.5">
              Fields marked <span className="text-red-400">*</span> are required.
            </p>
          </div>
        </div>

        <form onSubmit={handleAdd}>
          {/* Row 1 — Name, Short Name, City, State, Zipcode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-5">
            {/* Full Name */}
            <div className="lg:col-span-2">
              <label className={labelCls}>
                Full Name <span className="text-red-400">*</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-cyan-500 transition-colors">
                  <Building2 size={15} />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  className={iconInputCls}
                  placeholder="E.g. Indian Institute of Technology"
                />
              </div>
            </div>

            {/* Short Name */}
            <div>
              <label className={labelCls}>Abbreviation</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-cyan-500 transition-colors">
                  <Hash size={15} />
                </div>
                <input
                  type="text"
                  name="shortName"
                  className={iconInputCls}
                  placeholder="IIT"
                />
              </div>
            </div>

            {/* City */}
            <div>
              <label className={labelCls}>
                City <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="city"
                required
                className={inputCls}
                placeholder="Mumbai"
              />
            </div>

            {/* State */}
            <div>
              <label className={labelCls}>
                State <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="state"
                required
                className={inputCls}
                placeholder="Maharashtra"
              />
            </div>
          </div>

          {/* Row 2 — Zipcode, Website, Lat, Lng */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-7">
            {/* Zipcode */}
            <div>
              <label className={labelCls}>Pin Code</label>
              <input
                type="text"
                name="zipcode"
                maxLength={6}
                className={inputCls}
                placeholder="400076"
              />
            </div>

            {/* Website */}
            <div className="lg:col-span-1">
              <label className={labelCls}>Official Website</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-cyan-500 transition-colors">
                  <Globe size={15} />
                </div>
                <input
                  type="url"
                  name="websiteUrl"
                  className={iconInputCls}
                  placeholder="https://iit.ac.in"
                />
              </div>
            </div>

            {/* Latitude */}
            <div>
              <label className={labelCls}>Latitude</label>
              <input
                type="number"
                step="any"
                name="latitude"
                className={inputCls}
                placeholder="19.0760"
              />
            </div>

            {/* Longitude */}
            <div>
              <label className={labelCls}>Longitude</label>
              <input
                type="number"
                step="any"
                name="longitude"
                className={inputCls}
                placeholder="72.8777"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-gray-950 text-white text-sm font-black rounded-2xl hover:bg-cyan-600 transition-all active:scale-[0.99] shadow-lg shadow-gray-900/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Registering…
              </>
            ) : (
              <>
                <Plus size={18} />
                Register Institution
              </>
            )}
          </button>
        </form>
      </div>

      {/* ── College Directory Table ─────────────────────────────────────── */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/30 border border-gray-100/80 overflow-hidden">
        {/* Table Header */}
        <div className="px-8 py-5 bg-gray-50/60 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
            <Building2 size={16} className="text-cyan-600" />
            Registered Institutions
          </h2>
          <span className="px-3 py-1 bg-white border border-gray-200 text-gray-700 text-xs font-black rounded-full shadow-sm">
            {colleges.length} total
          </span>
        </div>

        {colleges.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4 text-center px-6">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
              <GraduationCap size={28} className="text-gray-300" />
            </div>
            <div>
              <p className="font-black text-gray-700">No institutions yet</p>
              <p className="text-sm text-gray-400 font-medium mt-1">
                Register your first college above to get started.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    Institution
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    Location
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    Coordinates
                  </th>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {colleges.map((college) => (
                  <tr key={college.id} className="hover:bg-gray-50/60 transition-colors group">

                    {/* Institution */}
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="h-11 w-11 bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-100 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                          <span className="text-sm font-black text-cyan-600">
                            {(college.shortName || college.name).charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm font-black text-gray-900 leading-tight">
                              {college.name}
                            </h3>
                            {college.shortName && (
                              <span className="px-2 py-0.5 bg-cyan-50 text-cyan-700 text-[9px] font-bold rounded-full border border-cyan-100 uppercase tracking-wide">
                                {college.shortName}
                              </span>
                            )}
                          </div>
                          {college.websiteUrl && (
                            <a
                              href={college.websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] font-bold text-cyan-600 hover:text-cyan-700 hover:underline mt-1 transition-colors"
                            >
                              <ExternalLink size={9} />
                              Official Website
                            </a>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-1.5 text-sm font-bold text-gray-700">
                        <MapPin size={14} className="text-gray-400 shrink-0" />
                        <span>{college.city}, {college.state}</span>
                      </div>
                      {college.zipcode && (
                        <span className="mt-1.5 inline-block px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px] font-bold">
                          PIN {college.zipcode}
                        </span>
                      )}
                    </td>

                    {/* Coordinates */}
                    <td className="px-6 py-5">
                      {college.latitude && college.longitude ? (
                        <div className="text-xs font-bold text-gray-500 space-y-0.5 font-mono">
                          <div>{college.latitude.toFixed(4)}° N</div>
                          <div>{college.longitude.toFixed(4)}° E</div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-300 font-medium">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-8 py-5 text-right">
                      <button
                        onClick={() => handleDelete(college.id, college.name)}
                        disabled={deleteLoading === college.id}
                        title={`Delete ${college.name}`}
                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-30"
                      >
                        {deleteLoading === college.id ? (
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
