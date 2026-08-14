import Image from 'next/image';
import { Star, Quote } from 'lucide-react';

const testimonials = [
    {
        id: 1,
        name: "Aarav Sharma",
        role: "DU Student",
        image: "https://i.pravatar.cc/150?img=11",
        content: "Uniroost made finding a PG near North Campus so incredibly easy. I found a place within my budget in just two days with absolutely zero brokerage. Highly recommended!",
        rating: 5,
    },
    {
        id: 2,
        name: "Priya Desai",
        role: "Engineering Undergrad",
        image: "https://i.pravatar.cc/150?img=5",
        content: "I was extremely anxious about moving to a new city, but Uniroost's room partner matching feature connected me with a roommate who has the exact same study habits. A lifesaver!",
        rating: 5,
    },
    {
        id: 3,
        name: "Rohan Gupta",
        role: "Medical Student",
        image: "https://i.pravatar.cc/150?img=60",
        content: "The verified listings gave me total peace of mind. What I saw in the photos is exactly what I got when I moved in. No surprises, just a transparent and smooth process.",
        rating: 5,
    }
];

const TestimonialSection = () => {
    return (
        <section className="py-24 bg-cyan-50 relative overflow-hidden">
            {/* Background Details */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-200 to-transparent"></div>
            <div className="absolute -left-40 top-40 w-96 h-96 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-200/40 to-transparent rounded-full pointer-events-none"></div>
            <div className="absolute -right-40 bottom-40 w-96 h-96 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-200/40 to-transparent rounded-full pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                        Loved by thousands
                    </h2>
                    <p className="text-lg text-gray-600">
                        Don't just take our word for it. Read what students across the country have to say about finding their home on Uniroost.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial) => (
                        <div key={testimonial.id} className="bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:shadow-cyan-900/5 transition-all duration-300 ring-1 ring-gray-900/5 group relative flex flex-col">
                            <Quote className="absolute top-8 right-8 text-gray-100 w-12 h-12 transform -scale-x-100 group-hover:text-cyan-50 transition-colors pointer-events-none" />
                            
                            <div className="flex items-center mb-6">
                                <div className="flex gap-1 text-amber-400">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} size={18} className="fill-amber-400" />
                                    ))}
                                </div>
                            </div>
                            
                            <p className="text-gray-700 text-lg leading-relaxed mb-8 relative z-10">
                                "{testimonial.content}"
                            </p>
                            
                            <div className="flex items-center space-x-4 mt-auto">
                                <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-gray-100">
                                    <Image
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        fill
                                        sizes="48px"
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <h4 className="text-base font-bold text-gray-900">{testimonial.name}</h4>
                                    <p className="text-sm font-medium text-cyan-600">{testimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialSection;
