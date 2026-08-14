import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin, IndianRupee, BedDouble, Home, ArrowLeft,
  ShieldCheck, ShieldAlert, Phone, Mail, CheckCircle2,
  Wifi, Sofa, Car, Zap, Droplets, UtensilsCrossed,
  Building2, Users, CalendarCheck, Navigation
} from "lucide-react";

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      images: true,
      amenities: { include: { amenity: true } },
      colleges: { include: { college: true } },
      owner: {
        select: {
          name: true,
          email: true,
          phone: true,
          profileImage: true,
          isVerified: true,
        },
      },
    },
  });

  if (!property) notFound();

  const genderLabel = { BOYS: "Boys Only", GIRLS: "Girls Only", UNISEX: "Unisex" }[property.gender];
  const occupancyLabel = { SINGLE: "Single", DOUBLE: "Double Sharing", TRIPLE: "Triple Sharing" }[property.occupancy];

  return (
    <main className="min-h-screen pt-28 pb-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">

        {/* Back link */}
        <Link
          href="/search"
          className="inline-flex items-center gap-2 text-sm font-black text-gray-500 hover:text-cyan-600 transition-colors mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Search
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ── Left column: Images + Details ── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Image gallery */}
            {property.images.length > 0 ? (
              <div className="space-y-3">
                {/* Hero image */}
                <div className="relative aspect-[16/9] rounded-[2rem] overflow-hidden shadow-xl bg-gray-100">
                  <Image
                    src={property.images[0].url}
                    alt={property.title}
                    fill
                    className="object-cover"
                    unoptimized
                    priority
                  />
                </div>
                {/* Thumbnail row */}
                {property.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-3">
                    {property.images.slice(1, 5).map((img, i) => (
                      <div key={img.id} className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-sm">
                        <Image src={img.url} alt={`Photo ${i + 2}`} fill className="object-cover hover:scale-105 transition-transform duration-500" unoptimized />
                        {i === 3 && property.images.length > 5 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white font-black text-lg">+{property.images.length - 5}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-[16/9] rounded-[2rem] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-xl">
                <Home size={64} className="text-gray-300" />
              </div>
            )}

            {/* Title & Tags */}
            <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/30 border border-gray-100 p-8">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full bg-cyan-50 text-cyan-700 border border-cyan-100">{property.type}</span>
                <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full bg-cyan-50 text-cyan-700 border border-cyan-100">{genderLabel}</span>
                <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full bg-cyan-50 text-cyan-700 border border-cyan-100">{occupancyLabel}</span>
                <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${property.isFurnished ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-gray-50 text-gray-500 border-gray-100"}`}>
                  {property.isFurnished ? "Furnished" : "Unfurnished"}
                </span>
              </div>

              <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-3">{property.title}</h1>

              <div className="flex items-center gap-2 text-gray-500 font-semibold text-sm mb-6">
                <MapPin size={15} className="text-gray-300 shrink-0" />
                <span>{property.address}, {property.city}, {property.state} — {property.zipcode}</span>
              </div>

              {/* Rent */}
              <div className="flex items-baseline gap-1 mb-6">
                <IndianRupee size={28} className="text-cyan-600 shrink-0" />
                <span className="text-4xl font-black text-gray-900">{property.rent.toLocaleString("en-IN")}</span>
                <span className="text-base font-bold text-gray-400 ml-1">/{property.rentType === "PER_BED" ? "bed / month" : "room / month"}</span>
              </div>

              {property.description && (
                <div>
                  <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">About this property</h2>
                  <p className="text-gray-600 font-medium leading-relaxed text-sm whitespace-pre-line">{property.description}</p>
                </div>
              )}
            </div>

            {/* Amenities */}
            {property.amenities.length > 0 && (
              <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/30 border border-gray-100 p-8">
                <h2 className="text-lg font-black text-gray-900 mb-6">Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.map((pa) => (
                    <div key={pa.amenityId} className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="p-2 bg-cyan-50 text-cyan-600 rounded-xl">
                        <CheckCircle2 size={14} />
                      </div>
                      <span className="text-sm font-bold text-gray-700">{pa.amenity.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nearby Colleges */}
            {property.colleges.length > 0 && (
              <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/30 border border-gray-100 p-8">
                <h2 className="text-lg font-black text-gray-900 mb-6">Nearby Colleges</h2>
                <div className="space-y-3">
                  {property.colleges.map((pc) => (
                    <div key={pc.collegeId} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-cyan-50 text-cyan-600 rounded-xl">
                          <Building2 size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900">{pc.college.name}</p>
                          <p className="text-xs font-bold text-gray-400">{pc.college.city}, {pc.college.state}</p>
                        </div>
                      </div>
                      {pc.distanceKm != null && (
                        <div className="flex items-center gap-1.5 text-xs font-black text-cyan-600 bg-cyan-50 px-3 py-1.5 rounded-full border border-cyan-100">
                          <Navigation size={11} />
                          {pc.distanceKm} km
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Right column: Owner + Quick facts ── */}
          <div className="space-y-6 lg:sticky lg:top-28 self-start">

            {/* Quick facts */}
            <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/30 border border-gray-100 p-7 space-y-4">
              <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-5">Quick Facts</h2>

              {[
                { label: "Property Type", value: property.type, icon: <Home size={15} /> },
                { label: "Occupancy", value: occupancyLabel, icon: <Users size={15} /> },
                { label: "For", value: genderLabel, icon: <Users size={15} /> },
                { label: "Furnishing", value: property.isFurnished ? "Furnished" : "Unfurnished", icon: <Sofa size={15} /> },
                { label: "Availability", value: property.isAvailable ? "Available Now" : "Currently Occupied", icon: <CalendarCheck size={15} />, color: property.isAvailable ? "text-emerald-600" : "text-rose-500" },
              ].map(({ label, value, icon, color }) => (
                <div key={label} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-2 text-gray-400">
                    {icon}
                    <span className="text-xs font-black uppercase tracking-widest">{label}</span>
                  </div>
                  <span className={`text-sm font-black ${color ?? "text-gray-900"}`}>{value}</span>
                </div>
              ))}
            </div>

            {/* Owner card */}
            <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/30 border border-gray-100 p-7">
              <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-5">Listed By</h2>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-100 to-blue-200 flex items-center justify-center text-cyan-700 text-2xl font-black shrink-0 shadow-md">
                  {property.owner.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-black text-gray-900">{property.owner.name}</p>
                  {property.owner.isVerified ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full uppercase tracking-widest mt-1">
                      <ShieldCheck size={10} strokeWidth={3} /> Verified Owner
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full uppercase tracking-widest mt-1">
                      <ShieldAlert size={10} strokeWidth={3} /> Pending Verification
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <a
                  href={`tel:${property.owner.phone}`}
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-cyan-50 hover:border-cyan-200 transition-all group"
                >
                  <div className="p-2 bg-white rounded-xl text-gray-400 group-hover:text-cyan-600 transition-colors shadow-sm">
                    <Phone size={14} />
                  </div>
                  <span className="text-sm font-bold text-gray-700 group-hover:text-cyan-700 transition-colors">{property.owner.phone}</span>
                </a>
                <a
                  href={`mailto:${property.owner.email}`}
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-cyan-50 hover:border-cyan-200 transition-all group"
                >
                  <div className="p-2 bg-white rounded-xl text-gray-400 group-hover:text-cyan-600 transition-colors shadow-sm">
                    <Mail size={14} />
                  </div>
                  <span className="text-sm font-bold text-gray-700 group-hover:text-cyan-700 transition-colors truncate">{property.owner.email}</span>
                </a>
              </div>
            </div>

            {/* Location map placeholder */}
            {(property.latitude && property.longitude) ? (
              <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/30 border border-gray-100 p-7">
                <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Location</h2>
                <a
                  href={`https://maps.google.com/?q=${property.latitude},${property.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-cyan-50 border border-cyan-100 rounded-2xl hover:bg-cyan-100 transition-all group"
                >
                  <MapPin size={18} className="text-cyan-600 shrink-0" />
                  <span className="text-sm font-black text-cyan-700">View on Google Maps</span>
                </a>
              </div>
            ) : null}
          </div>

        </div>
      </div>
    </main>
  );
}
