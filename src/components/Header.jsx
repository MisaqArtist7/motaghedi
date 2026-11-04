'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Sparkles, 
  Calendar, 
  Images, 
  Home, 
  UserCheck, 
  Menu, 
  X, 
  ArrowLeft,
  Stethoscope
} from 'lucide-react';
import { useClinic } from '../context/ClinicContext';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useClinic();
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/80 border-b border-white/30 shadow-xs transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Clinic Branding */}
          <Link 
            href="/" 
            className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none cursor-pointer"
          >
            <img 
              src="/logo.png" 
              alt="لوگوی دکتر معتقدی" 
              className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
            />
            <div className="flex flex-col">
              <span className="text-sm sm:text-base lg:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-tight">
                دکتر معتقدی
              </span>
              <span className="text-[10px] sm:text-xs text-emerald-700 font-medium tracking-tight">
                مطب هوشمند جراحی بینی و زیبایی
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-all duration-300 ease-in-out flex items-center gap-1.5 px-3.5 py-2 rounded-xl cursor-pointer ${
                isActive('/') 
                  ? 'text-emerald-700 font-semibold bg-emerald-50/80 shadow-2xs border border-emerald-200/50' 
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/50'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>صفحه اصلی</span>
            </Link>

            <Link
              href="/gallery"
              className={`text-sm font-medium transition-all duration-300 ease-in-out flex items-center gap-1.5 px-3.5 py-2 rounded-xl cursor-pointer ${
                isActive('/gallery') 
                  ? 'text-emerald-700 font-semibold bg-emerald-50/80 shadow-2xs border border-emerald-200/50' 
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/50'
              }`}
            >
              <Images className="w-4 h-4" />
              <span>گالری قبل و بعد</span>
            </Link>

            {user.isLoggedIn && (
              <Link
                href="/dashboard"
                className={`text-sm font-medium transition-all duration-300 ease-in-out flex items-center gap-1.5 px-3.5 py-2 rounded-xl cursor-pointer ${
                  isActive('/dashboard') 
                    ? 'text-emerald-700 font-semibold bg-emerald-50/80 shadow-2xs border border-emerald-200/50' 
                    : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/50'
                }`}
              >
                <Stethoscope className="w-4 h-4" />
                <span>پرونده و نوبت‌های من</span>
              </Link>
            )}
          </nav>

          {/* Call-to-Action Primary Green Button */}
          <div className="hidden sm:flex items-center gap-3">
            {user.isLoggedIn ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 bg-emerald-50/90 text-emerald-800 border border-emerald-300/80 hover:bg-emerald-100/90 px-4 py-2.5 rounded-2xl font-medium text-sm transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              >
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>پرونده: {user.name}</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="relative group overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 text-white px-5 py-2.5 rounded-2xl font-semibold text-sm shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 flex items-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4 transition-transform group-hover:rotate-12" />
                <span>ورود به مطب مجازی / نوبت‌دهی</span>
                <ArrowLeft className="w-4 h-4 mr-0.5 opacity-80 group-hover:-translate-x-1 transition-transform" />
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
              aria-label="منو"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/20 bg-white/90 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-3 shadow-2xl rounded-b-3xl transition-all duration-300">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-medium transition-all duration-200 cursor-pointer ${
              isActive('/') ? 'bg-emerald-50 text-emerald-800 font-bold shadow-xs' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Home className="w-5 h-5 text-emerald-600" />
            <span>صفحه اصلی</span>
          </Link>

          <Link
            href="/gallery"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-medium transition-all duration-200 cursor-pointer ${
              isActive('/gallery') ? 'bg-emerald-50 text-emerald-800 font-bold shadow-xs' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Images className="w-5 h-5 text-emerald-600" />
            <span>گالری قبل و بعد عمل</span>
          </Link>

          {user.isLoggedIn && (
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                isActive('/dashboard') ? 'bg-emerald-50 text-emerald-800 font-bold shadow-xs' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Stethoscope className="w-5 h-5 text-emerald-600" />
              <span>میزکار و پرونده دیجیتال</span>
            </Link>
          )}

          <div className="pt-2">
            <Link
              href={user.isLoggedIn ? "/dashboard" : "/login"}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-3.5 rounded-2xl font-semibold text-sm shadow-lg shadow-emerald-600/30 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>{user.isLoggedIn ? 'مشاهده پرونده و نوبت‌ها' : 'ورود به مطب مجازی / نوبت‌دهی'}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
