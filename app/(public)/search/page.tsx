"use client"
import React from 'react'
import { Search, MapPin, Home, Sparkles, Filter } from 'lucide-react'

const SearchPage = () => {
    return (
        <main className="min-h-screen pt-32 pb-20 bg-white relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-50/50 to-transparent rounded-full -z-10 blur-3xl opacity-60"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50/50 to-transparent rounded-full -z-10 blur-3xl opacity-60"></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-10">
                {/* Hero Header */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-50 border border-cyan-100 text-cyan-800 font-semibold text-xs uppercase tracking-widest mb-6">
                        <Sparkles size={14} />
                        <span>Curated Listings</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4 italic">
                        Find your next <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">Uniroost Home</span>
                    </h1>
                </div>

                {/* Search Capsule (Migrated from Header) */}
                <div className="flex justify-center mb-16">
                    <div className="flex flex-col md:flex-row items-center bg-white border border-gray-200 rounded-[2.5rem] md:rounded-full shadow-2xl shadow-gray-200/50 hover:shadow-cyan-900/10 hover:border-cyan-200 transition-all cursor-pointer w-full max-w-[900px] min-h-[70px] p-2 md:p-0 ring-1 ring-gray-900/5 group">
                        
                        {/* City */}
                        <div className="flex flex-col flex-1 pl-8 pr-4 py-3 md:py-2 hover:bg-gray-50 rounded-full group/item h-full justify-center min-w-0 w-full md:w-auto">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 group-focus-within/item:text-cyan-600">City</span>
                            <input
                                type="text"
                                placeholder="Where are you going?"
                                className="bg-transparent text-sm font-bold outline-none placeholder-gray-400 text-gray-900 w-full truncate border-none focus:ring-0 p-0"
                            />
                        </div>

                        <div className="hidden md:block h-10 w-[1px] bg-gray-100 shrink-0"></div>

                        {/* College */}
                        <div className="flex flex-col flex-1 px-8 py-3 md:py-2 hover:bg-gray-50 rounded-full group/item h-full justify-center min-w-0 w-full md:w-auto">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">College / Campus</span>
                            <span className="text-sm font-bold text-gray-400 truncate">Select your university</span>
                        </div>

                        <div className="hidden md:block h-10 w-[1px] bg-gray-100 shrink-0"></div>

                        {/* Type & Search */}
                        <div className="flex flex-1 items-center justify-between pl-8 pr-3 py-3 md:py-2 hover:bg-gray-50 rounded-full group/item h-full min-w-0 w-full md:w-auto">
                            <div className="flex flex-col min-w-0 pr-4">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Type</span>
                                <span className="text-sm font-bold text-gray-900 truncate">PG / Studio / Flat</span>
                            </div>

                            {/* Search Button */}
                            <button className="h-14 w-14 md:h-12 md:w-12 bg-gray-900 rounded-full text-white hover:bg-cyan-600 shadow-lg shadow-gray-900/20 active:scale-95 transition-all flex items-center justify-center shrink-0">
                                <Search size={20} strokeWidth={2.5} />
                            </button>
                        </div>

                    </div>
                </div>

                {/* Filters & Information Row */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-8 mb-12">
                    <div className="flex items-center space-x-6">
                        <button className="flex items-center space-x-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-black hover:bg-black transition-all shadow-xl shadow-gray-200/50 active:scale-95">
                            <Filter size={16} />
                            <span>Filters</span>
                        </button>
                        <div className="h-8 w-[1px] bg-gray-200"></div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Available Homes</span>
                            <span className="text-sm font-bold text-gray-900">124 Premium Listings found</span>
                        </div>
                    </div>
                </div>

                {/* Placeholder Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="group cursor-pointer">
                            <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-sm mb-4 ring-1 ring-gray-900/5 bg-gray-100 animate-pulse">
                                {/* Skeleton loading placeholder */}
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="h-4 w-1/3 bg-gray-100 rounded animate-pulse"></div>
                                    <div className="h-4 w-1/4 bg-gray-100 rounded animate-pulse"></div>
                                </div>
                                <div className="h-3 w-1/2 bg-gray-50 rounded animate-pulse"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    )
}

export default SearchPage