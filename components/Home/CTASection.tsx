import Link from "next/link"
import { ArrowRight, Phone, ShieldCheck } from "lucide-react"

const CTASection = () => {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
                <div className="relative rounded-[2.5rem] bg-gray-900 overflow-hidden py-16 md:py-24 px-8 md:px-16 text-center shadow-[0_20px_50px_rgba(0,0,0,0.15)] ring-1 ring-gray-900/5">
                    
                    {/* Background Visuals */}
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-600/30 to-transparent rounded-full pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-600/20 to-transparent rounded-full pointer-events-none -translate-x-1/3 translate-y-1/3"></div>
                    
                    {/* Subtle grid pattern overlay fallback (if SVG doesn't exist it just sits empty invisibly) */}
                    <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none mix-blend-overlay"></div>

                    <div className="relative z-10 max-w-4xl mx-auto">
                        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white font-semibold text-sm mb-8 backdrop-blur-sm shadow-sm cursor-pointer hover:bg-white/20 transition-colors">
                            <ShieldCheck size={16} className="text-cyan-400" />
                            <span>100% Secure & Verified</span>
                        </div>
                        
                        <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-white mb-6 tracking-tight leading-[1.15]">
                            Ready to find your <br className="hidden sm:block"/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">perfect campus home?</span>
                        </h2>
                        
                        <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Join thousands of students who have already found their ideal PG, flat, or compatible roommate through Uniroost.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                            <Link href="/search" className="group w-full sm:w-auto px-8 py-4 rounded-full bg-cyan-500 text-gray-900 font-extrabold text-lg hover:bg-cyan-400 hover:shadow-xl hover:shadow-cyan-500/30 hover:-translate-y-1 transition-all flex items-center justify-center space-x-2">
                                <span>Start Searching Now</span>
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            
                            <Link href="/contact-us" className="group w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 text-white font-bold text-lg border border-white/10 hover:bg-white/15 hover:border-white/20 transition-all backdrop-blur-md flex items-center justify-center space-x-2">
                                <Phone size={20} className="text-gray-400 group-hover:text-white transition-colors" />
                                <span>Talk to Our Team</span>
                            </Link>
                        </div>
                        
                        <div className="mt-12 flex items-center justify-center space-x-6 text-sm text-gray-400 font-medium max-w-xs mx-auto justify-between sm:max-w-none sm:justify-center border-t border-white/10 pt-8 sm:border-none sm:pt-0">
                            <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-2 shadow-[0_0_8px_rgba(74,222,128,0.5)]"></span> No Brokerage</span>
                            <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2 shadow-[0_0_8px_rgba(96,165,250,0.5)]"></span> Instant Booking</span>
                        </div>
                    </div>
                    
                </div>
            </div>
        </section>
    )
}

export default CTASection