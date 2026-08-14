import { CheckCircle2, Users, Wallet } from 'lucide-react'

const FeatureSection = () => {
    return (
        <section className="py-24 bg-gray-50 relative">
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Why students choose <span className="text-cyan-600">Uniroost</span></h2>
                    <p className="text-lg text-gray-600">We take the hassle out of student housing. Everything you need to secure your perfect campus home is right here.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-10 lg:gap-14">
                    {/* Feature 1 */}
                    <div className="flex flex-col items-center text-center group cursor-pointer bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-cyan-900/5 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
                        <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-100/50 to-transparent rounded-full -z-10"></div>
                        <div className="w-16 h-16 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-6 group-hover:bg-cyan-600 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-cyan-200 group-hover:-translate-y-1">
                            <CheckCircle2 size={32} strokeWidth={2} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 z-10">100% Verified Listings</h3>
                        <p className="text-gray-600 leading-relaxed z-10">Every property and owner on our platform is strictly verified. What you see is exactly what you get upon arrival.</p>
                    </div>

                    {/* Feature 2 */}
                    <div className="flex flex-col items-center text-center group cursor-pointer bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
                        <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100/50 to-transparent rounded-full -z-10"></div>
                        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-blue-200 group-hover:-translate-y-1">
                            <Wallet size={32} strokeWidth={2} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 z-10">Zero Brokerage Fees</h3>
                        <p className="text-gray-600 leading-relaxed z-10">Connect directly with property owners. Keep your hard-earned cash entirely for your rent and living expenses.</p>
                    </div>

                    {/* Feature 3 */}
                    <div className="flex flex-col items-center text-center group cursor-pointer bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-indigo-900/5 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
                        <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-100/50 to-transparent rounded-full -z-10"></div>
                        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-indigo-200 group-hover:-translate-y-1">
                            <Users size={32} strokeWidth={2} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 z-10">Find Perfect Roommates</h3>
                        <p className="text-gray-600 leading-relaxed z-10">Use our smart matching algorithm to find room partners who share your exact habits, discipline, and vibe.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default FeatureSection