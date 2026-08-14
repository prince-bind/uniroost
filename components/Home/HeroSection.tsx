import { ArrowRight, MapPin, ShieldCheck, Star, Zap } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const HeroSection = () => {
    return (
        <section className="pt-44 pb-12 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-50/60 via-white to-white overflow-hidden relative flex items-center">
            {/* Decorative background shapes (Hardware Accelerated) */}
            <div className="absolute top-32 left-[-100px] w-96 h-96 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-100/60 to-transparent rounded-full opacity-60 pointer-events-none transform-gpu will-change-transform"></div>
            <div className="absolute top-10 right-[-50px] w-96 h-96 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-100/60 to-transparent rounded-full opacity-60 pointer-events-none transform-gpu will-change-transform"></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-8">

                    {/* Left Content Column */}
                    <div className="lg:flex-[0.9] flex flex-col items-start space-y-6 z-10 w-full">
                        {/* Badge */}
                        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-50 border border-cyan-100 text-cyan-800 font-semibold text-[13px] shadow-sm transform-gpu transition hover:scale-105 cursor-pointer">
                            <span className="flex h-2 w-2 rounded-full bg-cyan-500 animate-pulse"></span>
                            <span>#1 Trusted Student Housing Platform</span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
                            Your Campus Home, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 inline-block mt-1">
                                Simplified.
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="text-base md:text-lg text-gray-600 max-w-lg leading-relaxed">
                            Discover verified PGs, premium flats, and compatible room partners seamlessly. Say goodbye to broker fees and endless searching.
                        </p>

                        {/* Feature Icons Row */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pt-1">
                            <div className="flex items-center space-x-3 text-gray-700 group hover:text-cyan-600 transition-colors cursor-pointer">
                                <div className="p-3 rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 group-hover:ring-cyan-200 group-hover:bg-cyan-50 group-hover:-translate-y-1 transition-all duration-300">
                                    <ShieldCheck size={22} className="text-cyan-600" />
                                </div>
                                <span className="font-bold text-base">100% Verified</span>
                            </div>

                            <div className="flex items-center space-x-3 text-gray-700 group hover:text-blue-600 transition-colors cursor-pointer">
                                <div className="p-3 rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 group-hover:ring-blue-200 group-hover:bg-blue-50 group-hover:-translate-y-1 transition-all duration-300">
                                    <Zap size={22} className="text-blue-600" />
                                </div>
                                <span className="font-bold text-base">Zero Brokerage</span>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto">
                            <Link href="/search" className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-gray-900 text-white font-bold text-base hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-900/20 hover:-translate-y-0.5 transition-all flex items-center justify-center space-x-2 border border-transparent">
                                <span>Explore Properties</span>
                                <ArrowRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link href="/find-roompartner" className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white text-gray-900 font-bold text-base border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center">
                                Find Roommates
                            </Link>
                        </div>

                        {/* Trust Stats */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-100 w-full max-w-sm mt-4">
                            <div className="flex -space-x-3">
                                <Image src="https://i.pravatar.cc/100?img=1" alt="User" width={40} height={40} className="w-10 h-10 rounded-full border-4 border-white shadow-sm" />
                                <Image src="https://i.pravatar.cc/100?img=2" alt="User" width={40} height={40} className="w-10 h-10 rounded-full border-4 border-white shadow-sm" />
                                <Image src="https://i.pravatar.cc/100?img=3" alt="User" width={40} height={40} className="w-10 h-10 rounded-full border-4 border-white shadow-sm" />
                                <div className="w-10 h-10 rounded-full border-4 border-white bg-gray-50 flex items-center justify-center text-[10px] font-black text-gray-700 shadow-sm z-10">
                                    +5k
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center text-amber-400 gap-0.5 mb-1">
                                    <Star size={14} fill="currentColor" stroke="transparent" />
                                    <Star size={14} fill="currentColor" stroke="transparent" />
                                    <Star size={14} fill="currentColor" stroke="transparent" />
                                    <Star size={14} fill="currentColor" stroke="transparent" />
                                    <Star size={14} fill="currentColor" stroke="transparent" />
                                </div>
                                <span className="text-xs font-semibold text-gray-500">Loved by students nationwide</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Image Column */}
                    <div className="lg:flex-[1.1] w-full relative group mt-8 lg:mt-0">
                        {/* Glow backdrop behind image */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/20 to-blue-500/20 rounded-[2rem] group-hover:opacity-100 transition-opacity duration-700 -z-10 transform-gpu will-change-transform scale-105"></div>

                        {/* Main Image Container */}
                        <div className="relative h-[300px] lg:h-[460px] w-full rounded-[2rem] overflow-hidden shadow-xl ring-1 ring-gray-900/5 transition-transform duration-700 group-hover:-translate-y-2 transform-gpu will-change-transform">
                            <Image
                                src="/hero-image.png"
                                alt="Students enjoying their premium Uniroost accommodation"
                                fill
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
                                priority
                            />

                            {/* Floating element 1: Location Tag */}
                            <div className="absolute top-6 right-[-15px] sm:right-[-5px] md:right-6 bg-white/95 backdrop-blur-md pl-3 pr-5 py-3 rounded-xl shadow-lg shadow-cyan-900/10 border border-white/60 flex items-center space-x-2.5 animate-bounce transform-gpu will-change-transform" style={{ animationDuration: '4s' }}>
                                <div className="p-2 bg-green-100 text-green-600 rounded-full shadow-inner">
                                    <MapPin size={18} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[14px] font-black text-gray-900 tracking-tight">Near Campus</span>
                                    <span className="text-[12px] text-gray-500 font-medium">Just 2 mins walk</span>
                                </div>
                            </div>

                            {/* Floating element 2: Trust Tag */}
                            <div className="absolute bottom-6 left-[-15px] sm:left-[-25px] bg-white/95 backdrop-blur-md pl-3 pr-5 py-2.5 rounded-xl shadow-lg shadow-blue-900/10 border border-white/60 flex items-center space-x-3 transition-transform duration-700 group-hover:-translate-y-3 transform-gpu will-change-transform">
                                <div className="w-12 h-12 relative bg-cyan-50 rounded-full flex items-center justify-center border border-cyan-100">
                                    <ShieldCheck size={24} className="text-cyan-600" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[14px] font-black text-gray-900 tracking-tight">Premium Verified</span>
                                    <span className="text-[12px] text-cyan-600 font-bold tracking-wide">Top Rated Property</span>
                                </div>
                            </div>
                        </div>

                        {/* Subtle bottom shadow anchor */}
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-4/5 h-8 bg-black/10 blur-xl rounded-full transform-gpu pointer-events-none"></div>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default HeroSection