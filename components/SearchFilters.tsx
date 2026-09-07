"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type FilterName = "college" | "type" | "gender" | "maxRent";

type SearchFiltersProps = {
  colleges: Array<{ id: string; name: string; city: string }>;
  filters: Partial<Record<FilterName, string>>;
};

export default function SearchFilters({ colleges, filters }: SearchFiltersProps) {
  const router = useRouter();
  const priceTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(priceTimer.current), []);

  function updateFilter(name: FilterName, value: string) {
    const query = new URLSearchParams(window.location.search);

    if (!value || value === "ALL") query.delete(name);
    else query.set(name, value);
    query.delete("page");

    const search = query.toString();
    router.replace(search ? `/search?${search}` : "/search", { scroll: false });
  }

  function schedulePriceFilter(value: string) {
    clearTimeout(priceTimer.current);
    priceTimer.current = setTimeout(() => updateFilter("maxRent", value), 400);
  }

  return (
    <div className="flex justify-center mb-16">
      <div className="flex flex-col md:flex-row items-center bg-white border border-gray-200 rounded-[2.5rem] md:rounded-full shadow-2xl shadow-gray-200/50 hover:shadow-cyan-900/10 hover:border-cyan-200 transition-all w-full max-w-[1000px] min-h-[70px] p-2 md:p-0 ring-1 ring-gray-900/5">
        <div className="flex flex-col flex-1 pl-8 pr-4 py-3 md:py-2 rounded-full h-full justify-center min-w-0 w-full md:w-auto">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">College</span>
          <select
            value={filters.college ?? "ALL"}
            onChange={(event) => updateFilter("college", event.target.value)}
            className="bg-transparent text-sm font-bold outline-none text-gray-900 border-none focus:ring-0 p-0 cursor-pointer w-full truncate"
          >
            <option value="ALL">All Colleges</option>
            {colleges.map((college) => (
              <option key={college.id} value={college.id}>
                {college.name} — {college.city}
              </option>
            ))}
          </select>
        </div>

        <div className="hidden md:block h-10 w-[1px] bg-gray-100 shrink-0" />

        <div className="flex flex-col flex-1 px-8 py-3 md:py-2 rounded-full h-full justify-center min-w-0 w-full md:w-auto">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Type</span>
          <select
            value={filters.type ?? "ALL"}
            onChange={(event) => updateFilter("type", event.target.value)}
            className="bg-transparent text-sm font-bold outline-none text-gray-900 border-none focus:ring-0 p-0 cursor-pointer"
          >
            <option value="ALL">All Types</option>
            <option value="PG">PG</option>
            <option value="FLAT">Flat / Apartment</option>
          </select>
        </div>

        <div className="hidden md:block h-10 w-[1px] bg-gray-100 shrink-0" />

        <div className="flex flex-col flex-1 px-8 py-3 md:py-2 rounded-full h-full justify-center min-w-0 w-full md:w-auto">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Gender</span>
          <select
            value={filters.gender ?? "ALL"}
            onChange={(event) => updateFilter("gender", event.target.value)}
            className="bg-transparent text-sm font-bold outline-none text-gray-900 border-none focus:ring-0 p-0 cursor-pointer"
          >
            <option value="ALL">Any</option>
            <option value="BOYS">Boys</option>
            <option value="GIRLS">Girls</option>
            <option value="UNISEX">Unisex</option>
          </select>
        </div>

        <div className="hidden md:block h-10 w-[1px] bg-gray-100 shrink-0" />

        <div className="flex flex-col flex-1 pl-8 pr-6 py-3 md:py-2 rounded-full h-full justify-center min-w-0 w-full md:w-auto">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Max Price (₹)</span>
          <input
            type="number"
            min="1"
            defaultValue={filters.maxRent ?? ""}
            onChange={(event) => schedulePriceFilter(event.target.value)}
            placeholder="e.g. 10000"
            className="bg-transparent text-sm font-bold outline-none placeholder-gray-400 text-gray-900 w-full border-none focus:ring-0 p-0"
          />
        </div>
      </div>
    </div>
  );
}
