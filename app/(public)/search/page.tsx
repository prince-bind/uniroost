import { prisma } from "@/lib/prisma";
import { GenderType, Prisma, PropertyType } from "@/generated/prisma/client";
import { MapPin, IndianRupee, BedDouble, Home, Sparkles, ShieldCheck, Navigation } from "lucide-react";
import SearchFilters from "@/components/SearchFilters";
import Image from "next/image";
import Link from "next/link";

interface SearchParams {
  college?: string;
  type?: string;
  gender?: string;
  maxRent?: string;
  page?: string;
}

const PAGE_SIZE = 12;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const where: Prisma.PropertyWhereInput = { isAvailable: true };
  if (params.college && params.college !== "ALL") {
    where.colleges = { some: { collegeId: params.college } };
  }
  if (params.type === "PG" || params.type === "FLAT") {
    where.type = params.type as PropertyType;
  }
  if (params.gender === "BOYS" || params.gender === "GIRLS" || params.gender === "UNISEX") {
    where.gender = params.gender as GenderType;
  }
  const maxRent = Number.parseInt(params.maxRent ?? "", 10);
  if (Number.isFinite(maxRent) && maxRent > 0) where.rent = { lte: maxRent };

  // Clamp to a sane range so ?page=-5 or ?page=99999999 can't be used to
  // force a huge OFFSET scan or a negative skip that Prisma would reject.
  const requestedPage = parseInt(params.page ?? "1", 10);
  const currentPage = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  // These are independent read queries. Do not wrap them in Prisma's batch
  // transaction: it pins all of the listing's relation queries to one pg
  // client, which triggers pg's "client.query() already executing" warning.
  const [properties, totalCount, colleges] = await Promise.all([
    prisma.property.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        images: { take: 1 },
        amenities: { include: { amenity: true }, take: 4 },
        colleges: { include: { college: true }, take: 1 },
        owner: { select: { name: true, isVerified: true } },
      },
    }),
    prisma.property.count({ where }),
    prisma.college.findMany({
      where: { properties: { some: { property: { isAvailable: true } } } },
      select: { id: true, name: true, city: true },
      orderBy: [{ name: "asc" }, { city: "asc" }],
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <main className="min-h-screen pt-32 pb-20 bg-white relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-50/50 to-transparent rounded-full -z-10 blur-3xl opacity-60" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50/50 to-transparent rounded-full -z-10 blur-3xl opacity-60" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-50 border border-cyan-100 text-cyan-800 font-semibold text-xs uppercase tracking-widest mb-6">
            <Sparkles size={14} />
            <span>Curated Listings</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4 italic">
            Find your next{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">
              Uniroost Home
            </span>
          </h1>
          <p className="text-gray-500 font-medium">
            Browse verified PGs and flats near top colleges across India.
          </p>
        </div>

        <SearchFilters colleges={colleges} filters={params} />

        {/* Results Info Row */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-8 mb-12">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Available Homes</span>
              <span className="text-sm font-bold text-gray-900">
                {properties.length} {properties.length === 1 ? "listing" : "listings"} found
                {params.college && params.college !== "ALL" && " near your selected college"}
              </span>
            </div>
          </div>
          {(params.college || params.type || params.gender || params.maxRent) && (
            <Link
              href="/search"
              className="text-xs font-black text-gray-400 hover:text-rose-500 uppercase tracking-widest transition-colors"
            >
              Clear filters ×
            </Link>
          )}
        </div>

        {/* Property Grid */}
        {properties.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-24 h-24 bg-gray-50 rounded-[2rem] border border-gray-100 flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Home size={40} className="text-gray-300" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">No listings found</h2>
            <p className="text-gray-500 font-medium">Try adjusting your filters or searching a different city.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {properties.map((property) => {
              const coverUrl = property.images[0]?.url ?? null;
              const nearestCollege = property.colleges[0];
              return (
                <div key={property.id} className="group cursor-pointer relative">
                  {/* Stretched invisible link — covers the whole card */}
                  <Link
                    href={`/search/${property.id}`}
                    className="absolute inset-0 z-10 rounded-[2rem]"
                    aria-label={property.title}
                  />

                  {/* Image */}
                  <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-sm mb-5 ring-1 ring-gray-900/5 bg-gray-100">
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

                    {/* Badges overlay */}
                    <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                      <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full bg-white/90 backdrop-blur-sm text-gray-700 shadow-sm">
                        {property.type}
                      </span>
                      <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full bg-white/90 backdrop-blur-sm text-gray-700 shadow-sm">
                        {property.gender}
                      </span>
                    </div>

                    {/* Rent badge */}
                    <div className="absolute bottom-4 right-4 bg-gray-900/90 backdrop-blur-md px-4 py-2 rounded-2xl text-sm font-black text-white shadow-xl flex items-center gap-1">
                      <IndianRupee size={13} className="text-cyan-400" />
                      {property.rent.toLocaleString("en-IN")}
                      <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest ml-0.5">
                        /{property.rentType === "PER_BED" ? "bed" : "room"}
                      </span>
                    </div>

                    {property.owner.isVerified && (
                      <div className="absolute top-4 right-4 bg-emerald-500 text-white p-1.5 rounded-full shadow-md" title="Verified Owner">
                        <ShieldCheck size={12} strokeWidth={3} />
                      </div>
                    )}
                  </div>

                  {/* Card Info */}
                  <div className="space-y-2 px-1">
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="text-base font-extrabold text-gray-900 group-hover:text-cyan-600 transition-colors leading-snug line-clamp-2">
                        {property.title}
                      </h2>
                    </div>

                    <div className="flex items-center gap-1.5 text-gray-500 font-semibold text-sm">
                      <MapPin size={13} className="text-gray-300 shrink-0" />
                      <span className="truncate flex-1">{property.address}, {property.city}</span>
                      {property.latitude && property.longitude && (
                        <a
                          href={`https://maps.google.com/?q=${property.latitude},${property.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="View on Google Maps"
                          className="relative z-20 shrink-0 flex items-center gap-1 px-2.5 py-1 bg-cyan-50 border border-cyan-100 text-cyan-600 text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-cyan-100 hover:border-cyan-300 transition-all"
                        >
                          <Navigation size={10} />
                          Map
                        </a>
                      )}
                    </div>

                    {nearestCollege && (
                      <div className="flex items-center gap-1.5 text-cyan-600 font-bold text-xs">
                        <BedDouble size={12} />
                        <span>{nearestCollege.college.name}</span>
                        {nearestCollege.distanceKm && (
                          <span className="text-gray-400 font-semibold">· {nearestCollege.distanceKm} km</span>
                        )}
                      </div>
                    )}

                    {property.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {property.amenities.slice(0, 3).map((pa) => (
                          <span
                            key={pa.amenityId}
                            className="px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-full bg-cyan-50 text-cyan-700 border border-cyan-100"
                          >
                            {pa.amenity.name}
                          </span>
                        ))}
                        {property.amenities.length > 3 && (
                          <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-full bg-gray-50 text-gray-500 border border-gray-100">
                            +{property.amenities.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (() => {
          const baseParams = Object.fromEntries(
            Object.entries(params).filter(([, v]) => v !== undefined)
          ) as Record<string, string>;
          return (
          <div className="flex items-center justify-center gap-3 mt-16">
            {currentPage > 1 && (
              <Link
                href={`/search?${new URLSearchParams({ ...baseParams, page: String(currentPage - 1) }).toString()}`}
                className="px-5 py-2.5 rounded-full border border-gray-200 text-sm font-bold text-gray-700 hover:border-cyan-300 hover:text-cyan-700 transition-colors"
              >
                Previous
              </Link>
            )}
            <span className="text-sm font-bold text-gray-500">
              Page {currentPage} of {totalPages}
            </span>
            {currentPage < totalPages && (
              <Link
                href={`/search?${new URLSearchParams({ ...baseParams, page: String(currentPage + 1) }).toString()}`}
                className="px-5 py-2.5 rounded-full border border-gray-200 text-sm font-bold text-gray-700 hover:border-cyan-300 hover:text-cyan-700 transition-colors"
              >
                Next
              </Link>
            )}
          </div>
          );
        })()}
      </div>
    </main>
  );
}
