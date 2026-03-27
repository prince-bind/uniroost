import Image from 'next/image';
import { Home, Users, ShieldCheck } from 'lucide-react';

const AboutSection = () => {
    return (
        <section className="py-24 bg-gray-50 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white to-transparent mix-blend-overlay"></div>
            
            <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    
                    {/* Image Column */}
                    <div className="lg:w-1/2 relative group w-full">
                        {/* Glow backdrop */}
                        <div className="absolute -inset-4 bg-gradient-to-tr from-cyan-400/20 to-blue-500/20 rounded-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 transform scale-105 -z-10"></div>
                        
                        <div className="relative h-[400px] sm:h-[500px] w-full rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5 transform transition-transform duration-700 group-hover:scale-[1.02]">
                            <Image 
                                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80" 
                                alt="Students hanging out in their Uniroost apartment" 
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover"
                            />
                            
                            {/* Overlay Stats Card */}
                            <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/60 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-3xl font-black text-cyan-600">10k+</span>
                                        <span className="text-sm font-semibold text-gray-600">Happy Students</span>
                                    </div>
                                    <div className="h-10 w-px bg-gray-200"></div>
                                    <div className="flex flex-col">
                                        <span className="text-3xl font-black text-blue-600">50+</span>
                                        <span className="text-sm font-semibold text-gray-600">Campuses</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Column */}
                    <div className="lg:w-1/2 flex flex-col items-start space-y-6">
                        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-semibold text-sm">
                            <ShieldCheck size={16} />
                            <span>About Uniroost</span>
                        </div>
                        
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
                            Redefining the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">Student Living</span> Experience
                        </h2>
                        
                        <p className="text-lg text-gray-600 leading-relaxed">
                            We believe that finding your perfect campus home should be as exciting as moving in. Uniroost was built by former students, for students, to eliminate the stress of house hunting.
                        </p>
                        
                        <div className="grid sm:grid-cols-2 gap-6 pt-6 w-full">
                            <div className="flex flex-col space-y-3">
                                <div className="w-12 h-12 rounded-xl bg-white shadow-sm ring-1 ring-gray-100 flex items-center justify-center text-cyan-600 group-hover:bg-cyan-50 transition-colors">
                                    <Home size={24} />
                                </div>
                                <h4 className="text-xl font-bold text-gray-900">Curated Spaces</h4>
                                <p className="text-gray-600 text-sm leading-relaxed">Handpicked properties that meet our strict quality and safety standards.</p>
                            </div>
                            
                            <div className="flex flex-col space-y-3">
                                <div className="w-12 h-12 rounded-xl bg-white shadow-sm ring-1 ring-gray-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-50 transition-colors">
                                    <Users size={24} />
                                </div>
                                <h4 className="text-xl font-bold text-gray-900">Community First</h4>
                                <p className="text-gray-600 text-sm leading-relaxed">Match with compatible roommates and build lasting campus friendships.</p>
                            </div>
                        </div>
                        
                    </div>
                    
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
