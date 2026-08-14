import Image from 'next/image';
import { Home, Users, ShieldCheck } from 'lucide-react';

const AboutSection = () => {
    return (
        <section className="py-24 bg-gray-50 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white to-transparent mix-blend-overlay"></div>
            
            <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
                <div className="flex flex-col items-center justify-center gap-16 max-w-4xl mx-auto text-center">
                    
                    {/* Content Column */}
                    <div className="w-full flex flex-col items-center space-y-8">
                        <div className="inline-flex items-center space-x-2 px-5 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-semibold text-sm">
                            <ShieldCheck size={18} />
                            <span>About Uniroost</span>
                        </div>
                        
                        <h2 className="text-4xl md:text-5xl lg:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
                            Redefining the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">Student Living</span> Experience
                        </h2>
                        
                        <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
                            We believe that finding your perfect campus home should be as exciting as moving in. Uniroost was built by former students, for students, to eliminate the stress of house hunting.
                        </p>
                        
                        <div className="grid sm:grid-cols-2 gap-10 pt-8 w-full">
                            <div className="flex flex-col items-center space-y-4 border border-gray-100 bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition">
                                <div className="w-16 h-16 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600 mb-2">
                                    <Home size={32} />
                                </div>
                                <h4 className="text-xl font-bold text-gray-900">Curated Spaces</h4>
                                <p className="text-gray-600 text-[15px] leading-relaxed max-w-xs">Handpicked properties that meet our strict quality and safety standards.</p>
                            </div>
                            
                            <div className="flex flex-col items-center space-y-4 border border-gray-100 bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition">
                                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-2">
                                    <Users size={32} />
                                </div>
                                <h4 className="text-xl font-bold text-gray-900">Community First</h4>
                                <p className="text-gray-600 text-[15px] leading-relaxed max-w-xs">Match with compatible roommates and build lasting campus friendships.</p>
                            </div>
                        </div>
                        
                    </div>
                    
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
