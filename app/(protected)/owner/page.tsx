import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import {
  Home, Plus, MapPin, IndianRupee,
  ShieldCheck, ShieldAlert, Lock, BarChart3,
  TrendingUp, BedDouble, ArrowRight, UserCircle2, ShieldQuestion,
  MessageSquareWarning, UploadCloud
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email || session.user.role !== "OWNER") {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      properties: {
        orderBy: { createdAt: "desc" },
        include: { images: { take: 1 } },
      },
    },
  });

  if (!user) redirect("/login");

  const properties = user.properties;
  const isVerified = user.isVerified;
  const remark = user.remark ?? null;
  const availableCount = properties.filter((p) => p.isAvailable).length;
  const occupiedCount = properties.length - availableCount;

  return (
    <>
      <div className="fixed inset-0 -z-10 bg-gray-50/50" aria-hidden="true" />
      <div className="max-w-[1400px] mx-auto space-y-10 pb-20 relative">

        {/* ── Header ─────────────────────────────────────────────────── */}

        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden relative">
          {/* Subtle background decoration */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-cyan-50 via-blue-50 to-indigo-50 opacity-50"></div>

          <div className="p-8 sm:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10 mt-4">
            <div className="flex items-center gap-6">
              <div className="h-24 w-24 bg-white border-4 border-white shadow-xl rounded-[2rem] flex items-center justify-center text-cyan-600 text-4xl font-black shrink-0 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-[1.7rem] -z-10"></div>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900">{user.name}</h2>
                <div className="flex flex-wrap items-center mt-3 gap-3">
                  {isVerified ? (
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-widest shadow-sm">
                      <ShieldCheck size={14} /> Verified Owner
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-widest shadow-sm">
                      <ShieldAlert size={14} /> Verification Pending
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              {isVerified ? (
                <Link
                  href="/owner/profile"
                  className="inline-flex flex-col items-center justify-center gap-2 px-6 py-5 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-2xl hover:bg-gray-50 hover:border-cyan-200 hover:text-cyan-700 transition-all active:scale-95 shadow-sm shrink-0 min-w-[120px]"
                >
                  <UserCircle2 size={20} className="text-cyan-600 mb-1" />
                  View Profile
                </Link>
              ) : (
                <Link
                  href="/owner/profile/edit"
                  className="inline-flex flex-col items-center justify-center gap-2 px-6 py-5 bg-amber-50 border border-amber-200 text-amber-700 text-sm font-bold rounded-2xl hover:bg-amber-100 hover:border-amber-300 transition-all active:scale-95 shadow-sm shrink-0 min-w-[120px]"
                >
                  <ShieldQuestion size={20} className="text-amber-500 mb-1" />
                  Verify Profile
                </Link>
              )}
            </div>
          </div>

          {/* ── Remark / Upload-doc banner (only when not verified) ── */}
          {!isVerified && (
            <div className={`mx-8 sm:mx-10 mb-8 rounded-2xl border px-5 py-4 flex items-start gap-4 ${
              remark
                ? "bg-rose-50 border-rose-200"
                : "bg-blue-50 border-blue-200"
            }`}>
              <div className={`p-2.5 rounded-xl shrink-0 ${
                remark ? "bg-rose-100 text-rose-600" : "bg-blue-100 text-blue-600"
              }`}>
                {remark
                  ? <MessageSquareWarning size={18} />
                  : <UploadCloud size={18} />}
              </div>
              <div className="flex-1 min-w-0">
                {remark ? (
                  <>
                    <p className="text-sm font-black text-rose-700 mb-0.5">Verification Rejected</p>
                    <p className="text-sm text-rose-600 font-medium leading-relaxed">{remark}</p>
                    <Link
                      href="/owner/profile/edit"
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-black text-rose-700 hover:text-rose-900 underline underline-offset-2 transition-colors"
                    >
                      Update your profile &amp; resubmit →
                    </Link>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-black text-blue-700 mb-0.5">Action Required — Upload Documents</p>
                    <p className="text-sm text-blue-600 font-medium leading-relaxed">
                      Your account is pending verification. Please upload the required documents so the admin can review and approve your profile.
                    </p>
                    <Link
                      href="/owner/profile/edit"
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-black text-blue-700 hover:text-blue-900 underline underline-offset-2 transition-colors"
                    >
                      Go to profile &amp; upload documents →
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Stats ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-7 rounded-[2.5rem] shadow-xl shadow-gray-200/30 border border-gray-100 relative overflow-hidden group hover:border-cyan-200 transition-colors">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-cyan-50 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center justify-between relative z-10 mb-6">
              <div className="p-3.5 bg-cyan-50 text-cyan-600 rounded-2xl">
                <BarChart3 size={24} strokeWidth={2.5} />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</p>
            </div>
            <div className="relative z-10">
              <p className="text-4xl font-black text-gray-900">{properties.length}</p>
              <p className="text-sm font-bold text-gray-500 mt-1">Properties Listed</p>
            </div>
          </div>

          <div className="bg-white p-7 rounded-[2.5rem] shadow-xl shadow-gray-200/30 border border-gray-100 relative overflow-hidden group hover:border-emerald-200 transition-colors">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-emerald-50 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center justify-between relative z-10 mb-6">
              <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl">
                <TrendingUp size={24} strokeWidth={2.5} />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Vacant</p>
            </div>
            <div className="relative z-10">
              <p className="text-4xl font-black text-gray-900">{availableCount}</p>
              <p className="text-sm font-bold text-gray-500 mt-1">Available Units</p>
            </div>
          </div>

          <div className="bg-white p-7 rounded-[2.5rem] shadow-xl shadow-gray-200/30 border border-gray-100 relative overflow-hidden group hover:border-rose-200 transition-colors">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-rose-50 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center justify-between relative z-10 mb-6">
              <div className="p-3.5 bg-rose-50 text-rose-600 rounded-2xl">
                <BedDouble size={24} strokeWidth={2.5} />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Rented</p>
            </div>
            <div className="relative z-10">
              <p className="text-4xl font-black text-gray-900">{occupiedCount}</p>
              <p className="text-sm font-bold text-gray-500 mt-1">Occupied Units</p>
            </div>
          </div>
        </div>

        {/* ── Properties ─────────────────────────────────────────────── */}
        <div className="pt-4">
          <div className="flex items-center justify-between mb-8 px-2">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-cyan-50 text-cyan-600 rounded-2xl border border-cyan-100">
                <Home size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                  My Properties
                </h2>
                <p className="text-sm text-gray-500 font-medium mt-0.5">Manage your current listings.</p>
              </div>
            </div>
            {isVerified && (
              <Link
                href="/owner/property/new"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3 bg-gray-900 text-white text-sm font-black rounded-2xl hover:bg-cyan-600 transition-all duration-300 active:scale-95 shadow-xl shadow-gray-200 group"
              >
                <Plus size={16} className="text-gray-400 group-hover:text-white transition-colors" />
                Add Property
              </Link>
            )}
          </div>

          {properties.length === 0 ? (
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/30 border border-gray-100 p-16 text-center">
              <div className="w-24 h-24 bg-gray-50 rounded-[2rem] border border-gray-100 flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Home size={40} className="text-gray-300" />
              </div>
              <h3 className="text-2xl font-black text-gray-900">No listings yet</h3>
              <p className="mt-3 text-base text-gray-500 font-medium max-w-md mx-auto leading-relaxed">
                Create your first property listing to reach thousands of students looking for accommodation.
              </p>
              {isVerified && (
                <Link
                  href="/owner/property/new"
                  className="mt-8 inline-flex items-center justify-center gap-3 px-8 py-4 bg-gray-900 text-white text-sm font-black rounded-2xl hover:bg-cyan-600 transition-all active:scale-95 shadow-xl shadow-gray-200 group"
                >
                  <Plus size={18} className="text-gray-400 group-hover:text-white transition-colors" />
                  Create First Listing
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => {
                const coverUrl = property.images[0]?.url ?? null;
                return (
                  <Link
                    href={`/owner/property/${property.id}`}
                    key={property.id}
                    className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden group hover:-translate-y-2 hover:shadow-2xl hover:border-cyan-200 transition-all duration-500 block flex flex-col h-full"
                  >
                    {/* Cover image */}
                    <div className="h-60 bg-gray-50 relative overflow-hidden p-2">
                      <div className="absolute inset-2 rounded-[2rem] overflow-hidden z-0">
                        {coverUrl ? (
                          <Image
                            src={coverUrl}
                            alt={property.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                            unoptimized
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <Home size={48} className="text-gray-300" />
                          </div>
                        )}
                      </div>

                      {/* Tags Layer */}
                      <div className="relative z-10 flex justify-between items-start p-4">
                        {/* Status badge */}
                        <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full shadow-md border ${property.isAvailable
                            ? "bg-white/95 text-emerald-600 border-white/20 backdrop-blur-sm"
                            : "bg-white/95 text-rose-600 border-white/20 backdrop-blur-sm"
                          }`}>
                          {property.isAvailable ? "Available" : "Occupied"}
                        </span>

                        {/* Rent badge */}
                        <div className="bg-gray-900/90 backdrop-blur-md px-4 py-2 rounded-2xl text-sm font-black text-white shadow-xl flex items-center gap-1 border border-gray-700/50">
                          <IndianRupee size={14} className="text-cyan-400" />
                          {property.rent.toLocaleString("en-IN")}
                          <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest ml-1">
                            /{property.rentType === "PER_BED" ? "bed" : "room"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-7 flex flex-col flex-grow">
                      <div className="flex items-center gap-2 text-[9px] font-black text-cyan-700 mb-4 uppercase tracking-[0.2em] flex-wrap">
                        <span className="bg-cyan-50 px-3 py-1.5 rounded-full border border-cyan-100">{property.type}</span>
                        <span className="bg-cyan-50 px-3 py-1.5 rounded-full border border-cyan-100">{property.gender}</span>
                        <span className="bg-cyan-50 px-3 py-1.5 rounded-full border border-cyan-100">{property.occupancy.toLowerCase().replace('_', ' ')}</span>
                      </div>

                      <h3 className="text-lg font-extrabold text-gray-900 mb-3 line-clamp-2 group-hover:text-cyan-600 transition-colors leading-snug">
                        {property.title}
                      </h3>

                      <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                        <p className="text-gray-500 flex items-center gap-2 font-bold text-sm truncate">
                          <MapPin size={16} className="text-gray-300 shrink-0" />
                          <span className="truncate">{property.city}, {property.state}</span>
                        </p>
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-cyan-50 group-hover:text-cyan-600 text-gray-400 transition-colors shrink-0">
                          <ArrowRight size={14} />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
