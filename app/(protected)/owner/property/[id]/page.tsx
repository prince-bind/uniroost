import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
  ArrowLeft, Edit, MapPin, Home, IndianRupee, BedDouble,
  Users, CheckCircle, XCircle, Sparkles, GraduationCap, Tag, Navigation,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import DeletePropertyButton from "@/components/DeletePropertyButton";

export default async function PropertyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email || session.user.role !== "OWNER") {
    redirect("/login");
  }

  const { id } = await params;

  const [property, user] = await Promise.all([
    prisma.property.findUnique({
      where: { id },
      include: {
        images: true,
        amenities: { include: { amenity: true } },
        colleges: { include: { college: true } },
      },
    }),
    prisma.user.findUnique({ where: { email: session.user.email } }),
  ]);

  if (!property || property.ownerId !== user?.id) {
    redirect("/owner");
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <Link
            href="/owner"
            className="p-3 bg-white shadow-md hover:shadow-lg rounded-2xl border border-gray-100 transition-all active:scale-90 group shrink-0"
          >
            <ArrowLeft size={20} className="text-gray-500 group-hover:text-cyan-600 transition-colors" />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-full ${
                property.isAvailable
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-rose-100 text-rose-700"
              }`}>
                {property.isAvailable ? "Available" : "Occupied"}
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-full bg-gray-100 text-gray-600">
                {property.type}
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-full bg-gray-100 text-gray-600">
                {property.gender}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight truncate">
              {property.title}
            </h1>
            <p className="mt-1 text-gray-500 font-medium text-sm flex items-center gap-1.5">
              <MapPin size={14} className="text-gray-400 shrink-0" />
              {property.address}, {property.city}, {property.state} – {property.zipcode}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <DeletePropertyButton propertyId={property.id} />
          <Link
            href={`/owner/property/${property.id}/edit`}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-cyan-600 text-white text-sm font-bold rounded-2xl hover:bg-cyan-700 transition-all active:scale-95 shadow-lg shadow-cyan-600/20 shrink-0"
          >
            <Edit size={16} />
            Edit
          </Link>
        </div>
      </div>

      {/* ── Image Gallery ───────────────────────────────────────────── */}
      {property.images.length > 0 ? (
        <div className="grid grid-cols-3 gap-3 rounded-[2rem] overflow-hidden shadow-xl shadow-gray-200/40 border border-gray-100">
          <div className="col-span-2 relative aspect-[4/3]">
            <Image src={property.images[0].url} alt={property.title} fill className="object-cover" unoptimized />
          </div>
          <div className="flex flex-col gap-3">
            {property.images.slice(1, 3).map((img, i) => (
              <div key={img.id} className="relative flex-1 min-h-0">
                <Image src={img.url} alt={`${property.title} ${i + 2}`} fill className="object-cover" unoptimized />
                {i === 1 && property.images.length > 3 && (
                  <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
                    <span className="text-white text-lg font-black">+{property.images.length - 3}</span>
                  </div>
                )}
              </div>
            ))}
            {property.images.length < 3 && (
              <div className="flex-1 bg-gray-100 flex items-center justify-center">
                <Home size={24} className="text-gray-300" />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="h-64 bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40 flex items-center justify-center">
          <div className="text-center">
            <Home size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm font-bold">No images uploaded yet</p>
            <Link href={`/owner/property/${property.id}/edit`} className="mt-2 inline-block text-cyan-600 text-xs font-bold hover:underline">
              Add images →
            </Link>
          </div>
        </div>
      )}

      {/* ── Content Grid ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left */}
        <div className="lg:col-span-2 space-y-6">

          {/* Description */}
          <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100 p-7">
            <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-widest mb-4">Description</h2>
            <p className="text-gray-600 leading-relaxed font-medium text-sm">
              {property.description || "No description provided."}
            </p>
          </div>

          {/* Amenities */}
          {property.amenities.length > 0 && (
            <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100 p-7">
              <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-widest mb-5 flex items-center gap-2">
                <Sparkles size={15} className="text-cyan-600" />
                Amenities
              </h2>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map(({ amenity }) => (
                  <span
                    key={amenity.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold rounded-full"
                  >
                    <Tag size={10} className="text-cyan-600" />
                    {amenity.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Nearby Colleges */}
          {property.colleges.length > 0 && (
            <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100 p-7">
              <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-widest mb-5 flex items-center gap-2">
                <GraduationCap size={15} className="text-cyan-600" />
                Nearby Colleges
              </h2>
              <div className="space-y-3">
                {property.colleges.map(({ college, distanceKm }) => (
                  <div key={college.id} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                    <div>
                      <p className="text-sm font-bold text-gray-900">{college.name}</p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{college.city}, {college.state}</p>
                    </div>
                    {distanceKm != null && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-50 border border-cyan-100 text-cyan-700 text-xs font-black rounded-full shrink-0">
                        <Navigation size={10} />
                        {distanceKm} km
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right — Rent + Specs */}
        <div className="space-y-5">

          {/* Rent */}
          <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100 p-6">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Monthly Rent</p>
            <div className="flex items-end gap-1 text-cyan-600 mb-1">
              <IndianRupee size={20} className="mb-1 shrink-0" />
              <span className="text-4xl font-black text-gray-900">{property.rent.toLocaleString("en-IN")}</span>
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              per {property.rentType === "PER_BED" ? "bed" : "room"}
            </p>
          </div>

          {/* Specs */}
          <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100 p-6">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Specifications</p>
            <div className="space-y-1">
              {[
                { icon: Home, label: "Type", value: property.type },
                { icon: Users, label: "Gender", value: property.gender },
                { icon: BedDouble, label: "Occupancy", value: property.occupancy.replace("_", " ") },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
                  <span className="text-sm font-bold text-gray-500 flex items-center gap-2">
                    <Icon size={14} className="text-gray-400" /> {label}
                  </span>
                  <span className="text-sm font-bold text-gray-900 capitalize">{value.toLowerCase()}</span>
                </div>
              ))}
              <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
                <span className="text-sm font-bold text-gray-500">Furnished</span>
                {property.isFurnished ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                    <CheckCircle size={12} /> Yes
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                    <XCircle size={12} /> No
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-sm font-bold text-gray-500">Status</span>
                {property.isAvailable ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                    <CheckCircle size={12} /> Available
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100">
                    <XCircle size={12} /> Occupied
                  </span>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
