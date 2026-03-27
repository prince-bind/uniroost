"use client"
import React, { useState, useEffect } from 'react';
import { Search, Globe, Menu, UserCircle, MessageSquare, Users, Home } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed w-full top-0 z-50 bg-white font-sans text-gray-800 transition-all duration-300 ${isScrolled ? 'shadow-sm' : ''}`}>
      {/* Top Section: Logo, Main Nav, User Actions */}
      <div className="w-full px-4 md:px-10 h-20 flex items-center justify-between">

        {/* Logo */}
        <div className="flex-1 flex items-center">
          <Link href={'/'} className='cursor-pointer'>
            <Image src={'/uniroost.png'} alt={'uniroost_logo'} width={200} height={100} className='cursor-pointer' />
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
        <div className="flex-1 flex items-center justify-end space-x-4">
          <button className="hidden lg:block text-md font-semibold py-3 px-4 rounded-full hover:bg-gray-100 transition-colors">
            Become a host
          </button>
          <div
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center p-2 rounded-full transition-all cursor-pointer hover:bg-gray-100 bg-gray-50"
          >
            <Menu size={22} />

            {isMenuOpen && (
              <div className="absolute top-[74px] right-4 md:right-10 lg:right-20 w-60 bg-white border border-gray-100 rounded-xl shadow-[0_2px_16px_rgba(0,0,0,0.12)] py-2 z-50 overflow-hidden">
                <button className="w-full text-left px-4 py-3 text-sm font-semibold hover:bg-gray-100 transition">Log in or sign up</button>
                <div className="h-[1px] bg-gray-100 my-1"></div>
                <button className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 transition">Become a host</button>
                <button className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 transition">Help Centre</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Search Bar */}
      <div 
        className={`flex justify-center overflow-hidden transition-all duration-300 ease-in-out transform origin-top ${
          isScrolled ? 'max-h-0 opacity-0 scale-y-95' : 'max-h-[100px] opacity-100 scale-y-100 pb-4'
        }`}
      >
        <div className="flex items-center bg-white border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-shadow cursor-pointer w-full max-w-[800px] h-[66px]">

          {/* City */}
          <div className="flex flex-col flex-1 pl-8 pr-4 py-2 hover:bg-gray-100 rounded-full group h-full justify-center min-w-0">
            <span className="text-xs font-bold uppercase tracking-wide">City</span>
            <input
              type="text"
              placeholder="Search destinations"
              className="bg-transparent text-sm outline-none placeholder-gray-500 w-full truncate"
            />
          </div>

          <div className="h-8 w-[1px] bg-gray-200 shrink-0"></div>

          {/* College */}
          <div className="flex flex-col flex-1 px-6 py-2 hover:bg-gray-100 rounded-full group h-full justify-center min-w-0">
            <span className="text-xs font-bold uppercase tracking-wide">College</span>
            <span className="text-sm text-gray-500 truncate">Select campus</span>
          </div>

          <div className="h-8 w-[1px] bg-gray-200 shrink-0"></div>

          {/* Type & Search */}
          <div className="flex flex-1 items-center justify-between pl-6 pr-2 py-2 hover:bg-gray-100 rounded-full group h-full min-w-0">
            <div className="flex flex-col min-w-0 pr-2">
              <span className="text-xs font-bold uppercase tracking-wide">Type</span>
              <span className="text-sm text-gray-500 truncate">PG/Flat</span>
            </div>

            {/* Search Button */}
            <div className="bg-cyan-600 p-3.5 rounded-full text-white hover:bg-cyan-700 transition-colors shrink-0">
              <Search size={16} strokeWidth={3} />
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;