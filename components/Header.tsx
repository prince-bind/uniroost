"use client"
import React, { useState, useEffect } from 'react';
import { Search, MessageSquare, Users, Home } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed w-full top-0 z-50 bg-white font-sans text-gray-800 transition-all duration-300 ${isScrolled ? 'shadow-sm' : ''}`}>
      {/* Top Section: Logo, Main Nav, User Actions */}
      <div className="w-full px-4 md:px-10 h-20 flex items-center justify-between">

        {/* Logo */}
        <div className="flex-1 flex items-center">
          <Link href={'/'} className='cursor-pointer'>
            <Image src={'/uniroost.png'} alt={'uniroost_logo'} width={150} height={100} className='cursor-pointer w-auto h-auto' priority />
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-10">
          {[
            { href: '/search', label: 'Find PGs/Flats', icon: Home },
            { href: '/find-roompartner', label: 'Find Room Partner', icon: Users },
            { href: '/contact-us', label: 'Contact Us', icon: MessageSquare },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                href={item.href}
                key={item.href}
                className={`flex flex-col items-center group transition-all ${isActive ? 'text-gray-900' : 'text-gray-500 hover:text-black'}`}
              >
                <div className={`mb-1 ${isActive ? '' : 'group-hover:scale-110 transition-transform relative'}`}>
                  <Icon size={24} strokeWidth={1.5} />
                </div>
                <span className={`text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
                <div className={`h-0.5 w-full bg-black mt-2 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></div>
              </Link>
            );
          })}
        </nav>

        {/* Right Side Actions */}
        <div className="flex-1 flex items-center justify-end space-x-3">
          <Link 
            href="/login" 
            className="hidden sm:block text-sm font-bold text-gray-700 hover:text-cyan-600 px-4 py-2 rounded-full hover:bg-gray-50 transition-all"
          >
            Log in
          </Link>
          <Link 
            href="/signup" 
            className="text-sm font-black text-white bg-gray-900 px-6 py-2.5 rounded-full hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-900/10 transition-all active:scale-95"
          >
            Sign up
          </Link>
        </div>
      </div>

    </header>
  );
};

export default Header;