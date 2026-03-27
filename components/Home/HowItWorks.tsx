import { Search, MapPin, CheckCircle2 } from 'lucide-react';

const HowItWorks = () => {
    const steps = [
        {
            icon: Search,
            title: "1. Search Properties",
            description: "Browse verified options using smart filters for location, budget, and roommate preferences.",
            color: "text-cyan-600",
            bg: "bg-cyan-50",
            border: "ring-cyan-100"
        },
        {
            icon: MapPin,
            title: "2. Schedule Visit",
            description: "Book a free site visit instantly or request a virtual video tour if you're currently out of town.",
            color: "text-blue-600",
            bg: "bg-blue-50",
            border: "ring-blue-100"
        },
        {
            icon: CheckCircle2,
            title: "3. Move In",
            description: "Finalize paperworks securely online. Pay rent directly to the owner with zero brokerage.",
            color: "text-indigo-600",
            bg: "bg-indigo-50",
            border: "ring-indigo-100"
        }
    ];

    return (
        <section className="py-24 bg-white relative">
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                        How it works
                    </h2>
                    <p className="text-lg text-gray-600">
                        Three simple steps to secure your perfect student accommodation safely and affordably.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-10 lg:gap-14 relative mt-12">
                    {/* Connecting line for desktop between steps */}
                    <div className="hidden md:block absolute top-[45px] left-[15%] right-[15%] h-[2px] bg-gray-100 -z-0"></div>

                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <div key={index} className="flex flex-col items-center text-center group relative z-10 cursor-pointer">
                                {/* Icon container */}
                                <div className={`w-24 h-24 rounded-full ${step.bg} ${step.color} flex items-center justify-center mb-8 ring-8 ring-white shadow-sm group-hover:-translate-y-2 transition-transform duration-300 relative`}>
                                    <Icon size={36} strokeWidth={2} />
                                    {/* Number Badge */}
                                    <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-bold border-2 border-white shadow-sm">
                                        {index + 1}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-cyan-600 transition-colors">{step.title}</h3>
                                <p className="text-gray-600 leading-relaxed min-w-[250px]">{step.description}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    );
}

export default HowItWorks;
