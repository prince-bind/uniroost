"use client"
import React, { useState } from 'react'
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Globe } from 'lucide-react'

const ContactUsPage = () => {
    const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus('sending');
        setTimeout(() => setFormStatus('success'), 1500);
    };

    return (
        <main className="pt-32 pb-24 bg-white relative overflow-hidden">
            {/* Background Decorative Blurs (Optimised) */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-50/50 to-transparent rounded-full -z-10 blur-3xl opacity-60"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50/50 to-transparent rounded-full -z-10 blur-3xl opacity-60"></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-10">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-50 border border-cyan-100 text-cyan-800 font-semibold text-sm mb-6">
                        <MessageSquare size={16} />
                        <span>Get in Touch</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
                        Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">Our Team</span>
                    </h1>
                    <p className="text-lg text-gray-600">
                        Have questions about a property or need help finding the perfect roommate? We're here to help you every step of the way.
                    </p>
                </div>

                <div className="grid lg:grid-cols-5 gap-12 items-start">
                    
                    {/* Left Column: Contact Information (2/5) */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-gray-900">Reach out to us</h2>
                            
                            <div className="flex items-start space-x-4 group p-1">
                                <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600 shadow-sm border border-cyan-100 group-hover:scale-110 transition-transform duration-300">
                                    <Mail size={22} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email</span>
                                    <a href="mailto:support@uniroost.com" className="text-lg font-bold text-gray-900 hover:text-cyan-600 transition-colors">support@uniroost.com</a>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4 group p-1">
                                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm border border-blue-100 group-hover:scale-110 transition-transform duration-300">
                                    <Phone size={22} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Call or WhatsApp</span>
                                    <a href="tel:+919876543210" className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors">+91 98765 43210</a>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4 group p-1">
                                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-600 shadow-sm border border-gray-100 group-hover:scale-110 transition-transform duration-300">
                                    <MapPin size={22} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Office Address</span>
                                    <p className="text-lg font-bold text-gray-900 leading-tight">123 University Hub, <br />South Campus, New Delhi 110021</p>
                                </div>
                            </div>
                        </div>

                        {/* Additional Meta Info Card */}
                        <div className="bg-gray-900 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            <div className="relative z-10 flex flex-col space-y-6">
                                <div className="flex items-center space-x-3">
                                    <Clock className="text-cyan-400" size={20} />
                                    <span className="font-bold text-sm tracking-wide">Customer Support Hours</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <span className="text-[11px] text-gray-400 uppercase font-black tracking-widest">Mon - Fri</span>
                                        <span className="text-sm font-bold">9:00 AM - 8:00 PM</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[11px] text-gray-400 uppercase font-black tracking-widest">Sat - Sun</span>
                                        <span className="text-sm font-bold">10:00 AM - 4:00 PM</span>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-white/10">
                                    <div className="flex items-center space-x-2 text-xs text-gray-400 font-medium">
                                        <Globe size={14} />
                                        <span>Average response time: 2 hours</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Contact Form (3/5) */}
                    <div className="lg:col-span-3">
                        <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-gray-200/50 p-8 md:p-12 border border-white/50 ring-1 ring-gray-900/5">
                            {formStatus === 'success' ? (
                                <div className="py-20 flex flex-col items-center text-center space-y-6 animate-in fade-in zoom-in duration-500">
                                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-600 shadow-inner">
                                        <Send size={40} className="animate-bounce" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black text-gray-900 italic">Message Sent!</h3>
                                        <p className="text-gray-600 font-medium max-w-xs mx-auto">
                                            Thanks for reaching out! Our team will get back to you personally within 2 hours.
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => setFormStatus('idle')}
                                        className="text-sm font-black text-cyan-600 hover:text-cyan-700 underline underline-offset-4"
                                    >
                                        Send another message
                                    </button>
                                </div>
                            ) : (
                                <form className="space-y-6" onSubmit={handleSubmit}>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-black text-gray-700 ml-1">Full Name</label>
                                            <input 
                                                required
                                                type="text" 
                                                placeholder="John Doe" 
                                                className="block w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-cyan-600/10 focus:border-cyan-600 transition-all font-medium"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-black text-gray-700 ml-1">Email Address</label>
                                            <input 
                                                required
                                                type="email" 
                                                placeholder="john@example.com" 
                                                className="block w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all font-medium"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-black text-gray-700 ml-1">Subject</label>
                                        <select className="block w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-cyan-600/10 focus:border-cyan-600 transition-all font-medium appearance-none">
                                            <option>General Inquiry</option>
                                            <option>Property Listing Support</option>
                                            <option>Roommate Matching Question</option>
                                            <option>Report an Issue</option>
                                            <option>Other</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-black text-gray-700 ml-1">Message</label>
                                        <textarea 
                                            required
                                            rows={5}
                                            placeholder="How can we help you today?" 
                                            className="block w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-cyan-600/10 focus:border-cyan-600 transition-all font-medium resize-none"
                                        ></textarea>
                                    </div>

                                    <button 
                                        type="submit"
                                        disabled={formStatus === 'sending'}
                                        className="group relative w-full flex items-center justify-center py-5 px-4 border border-transparent text-lg font-black rounded-2xl text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed shadow-xl transition-all hover:shadow-gray-900/20 active:scale-[0.98] cursor-pointer overflow-hidden overflow-hidden"
                                    >
                                        <span className="relative z-10 flex items-center gap-3">
                                            {formStatus === 'sending' ? 'Sending...' : 'Send Message'}
                                            <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
};

export default ContactUsPage;