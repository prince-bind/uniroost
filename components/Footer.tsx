import Image from 'next/image';
import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-50 pt-20 pb-10 border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
                    
                    {/* Brand Column */}
                    <div className="flex flex-col space-y-4 lg:pr-8">
                        <Link href="/" className="inline-block py-1">
                            <Image src="/uniroost.png" alt="Uniroost Logo" width={160} height={48} className="cursor-pointer" />
                        </Link>
                        <p className="text-gray-600 text-[15px] leading-relaxed mt-4">
                            Your campus home, simplified. We connect students with premium, verified accommodations near top universities with zero brokerage fees.
                        </p>
                        <div className="flex space-x-4 pt-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-cyan-600 hover:border-cyan-200 hover:bg-cyan-50 transition-all shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-cyan-600 hover:border-cyan-200 hover:bg-cyan-50 transition-all shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-cyan-600 hover:border-cyan-200 hover:bg-cyan-50 transition-all shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-cyan-600 hover:border-cyan-200 hover:bg-cyan-50 transition-all shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="lg:pl-8">
                        <h4 className="font-bold text-gray-900 mb-6 text-lg tracking-tight">Quick Links</h4>
                        <ul className="space-y-4">
                            <li><Link href="/search" className="text-gray-600 hover:text-cyan-600 transition-colors text-[15px] font-medium flex items-center group"><span className="w-1.5 h-1.5 rounded-full bg-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity mr-2"></span>Find PGs/Flats</Link></li>
                            <li><Link href="/find-roompartner" className="text-gray-600 hover:text-cyan-600 transition-colors text-[15px] font-medium flex items-center group"><span className="w-1.5 h-1.5 rounded-full bg-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity mr-2"></span>Find Room Partner</Link></li>
                            <li><Link href="/about" className="text-gray-600 hover:text-cyan-600 transition-colors text-[15px] font-medium flex items-center group"><span className="w-1.5 h-1.5 rounded-full bg-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity mr-2"></span>About Us</Link></li>
                            <li><Link href="/contact-us" className="text-gray-600 hover:text-cyan-600 transition-colors text-[15px] font-medium flex items-center group"><span className="w-1.5 h-1.5 rounded-full bg-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity mr-2"></span>Contact Support</Link></li>
                        </ul>
                    </div>

                    {/* Support & Legal */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-6 text-lg tracking-tight">Support & Legal</h4>
                        <ul className="space-y-4">
                            <li><Link href="/help" className="text-gray-600 hover:text-cyan-600 transition-colors text-[15px] font-medium flex items-center group"><span className="w-1.5 h-1.5 rounded-full bg-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity mr-2"></span>Help Center</Link></li>
                            <li><Link href="/faq" className="text-gray-600 hover:text-cyan-600 transition-colors text-[15px] font-medium flex items-center group"><span className="w-1.5 h-1.5 rounded-full bg-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity mr-2"></span>FAQs</Link></li>
                            <li><Link href="/privacy" className="text-gray-600 hover:text-cyan-600 transition-colors text-[15px] font-medium flex items-center group"><span className="w-1.5 h-1.5 rounded-full bg-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity mr-2"></span>Privacy Policy</Link></li>
                            <li><Link href="/terms" className="text-gray-600 hover:text-cyan-600 transition-colors text-[15px] font-medium flex items-center group"><span className="w-1.5 h-1.5 rounded-full bg-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity mr-2"></span>Terms of Service</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-6 text-lg tracking-tight">Contact Us</h4>
                        <ul className="space-y-5">
                            <li className="flex items-start space-x-3 group">
                                <div className="p-2 rounded-full bg-cyan-50 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                                    <MapPin size={18} />
                                </div>
                                <span className="text-gray-600 text-[15px] leading-relaxed pt-1">Knowledge Park III, Greater Noida, UP 201306</span>
                            </li>
                            <li className="flex items-center space-x-3 group cursor-pointer">
                                <div className="p-2 rounded-full bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Phone size={18} />
                                </div>
                                <span className="text-gray-600 text-[15px] font-medium group-hover:text-blue-600 transition-colors">+91 98765 43210</span>
                            </li>
                            <li className="flex items-center space-x-3 group cursor-pointer">
                                <div className="p-2 rounded-full bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    <Mail size={18} />
                                </div>
                                <span className="text-gray-600 text-[15px] font-medium group-hover:text-indigo-600 transition-colors">hello@uniroost.com</span>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-gray-500 text-[15px] font-medium">
                        © {new Date().getFullYear()} Uniroost. All rights reserved.
                    </p>
                    <div className="flex items-center space-x-6">
                        <span className="text-[15px] font-bold text-gray-900 flex items-center px-4 py-2 rounded-full bg-gray-100 cursor-default">
                            Made with <span className="text-red-500 mx-1.5 text-lg">♥</span> for Students
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
