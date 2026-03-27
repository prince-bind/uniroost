import { MapPin, ArrowRight, Star, Heart, Home as HomeIcon } from 'lucide-react';
import Link from 'next/link';
import HeroSection from '@/components/Home/HeroSection';
import FeatureSection from '@/components/Home/FeatureSection';
import CTASection from '@/components/Home/CTASection';
import HowItWorks from '@/components/Home/HowItWorks';

export default function Home() {
  return (
    <main className="min-h-[90vh] bg-white">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeatureSection />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Featured Properties Section */}
      <section className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Trending near top campuses</h2>
              <p className="text-lg text-gray-600">Explore highest-rated accommodations that students are booking right now.</p>
            </div>
            <Link href="/search" className="mt-6 md:mt-0 text-cyan-600 font-bold hover:text-cyan-800 flex items-center gap-2 transition-colors">
              View all spaces <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 cursor-pointer flex flex-col">
                <div className="relative h-56 w-full overflow-hidden bg-gray-200">
                  <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm flex items-center gap-1.5">
                    <Star size={12} className="text-amber-400" fill="currentColor" /> 4.8
                  </div>
                  <div className="absolute top-4 right-4 z-10 rounded-full p-2 bg-white/50 hover:bg-white backdrop-blur text-gray-600 hover:text-red-500 transition-colors cursor-pointer">
                    <Heart size={18} />
                  </div>
                  {/* Decorative placeholder gradient for image */}
                  <div className={`w-full h-full bg-gradient-to-br transition-transform duration-700 group-hover:scale-110 ${item === 1 ? 'from-slate-300 to-slate-200' : item === 2 ? 'from-gray-300 to-gray-200' : 'from-zinc-300 to-zinc-200'}`}></div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-600 uppercase tracking-wider mb-2">
                    <HomeIcon size={14} /> {item === 2 ? 'Premium Flat' : 'Boys PG'}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-cyan-600 transition-colors">Sunshine Student Residency</h3>
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-6">
                    <MapPin size={16} /> Near North Campus, 1.2km away
                  </div>

                  <div className="mt-auto border-t border-gray-100 pt-4 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-500 font-medium">Starts from</span>
                      <div className="text-lg font-extrabold text-gray-900">₹8,500<span className="text-sm font-medium text-gray-500">/mo</span></div>
                    </div>
                    <button className="bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-bold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <CTASection />
    </main>
  );
}
