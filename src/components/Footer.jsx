import React from 'react';
import Link from 'next/link';
import { Sparkles, Phone, MapPin, Clock, ShieldCheck, HeartHandshake, Send } from 'lucide-react';
import { CLINIC_INFO, FOOTER_DATA } from '../data/mockData';

export default function Footer() {
  return (
    <footer className="bg-slate-950/95 text-slate-200 mt-24 border-t border-slate-800 backdrop-blur-md">
      
      {/* Upper subtle bar: Doctor Nezam & Accreditation */}
      <div className="bg-slate-950/80 border-b border-slate-800/80 py-4 px-4 sm:px-6 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-300">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-white font-medium">{CLINIC_INFO.name}</span>
            <span className="text-slate-500">—</span>
            <span>کد نظام پزشکی: <strong className="font-mono text-emerald-400 font-bold">{CLINIC_INFO.nezamCode}</strong></span>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>{CLINIC_INFO.workHours}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Summary */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="inline-block group cursor-pointer">
              <img 
                src="/logo-white.png" 
                alt="لوگوی دکتر معتقدی" 
                className="h-12 sm:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
              />
            </Link>
            <div className="space-y-1">
              <h4 className="font-extrabold text-white text-lg sm:text-xl">
                {CLINIC_INFO.doctorName}
              </h4>
              <p className="text-xs sm:text-sm text-emerald-400 font-medium">
                {CLINIC_INFO.title}
              </p>
            </div>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
              جراحی بینی به سبک طبیعی (Natural Rhinoplasty) با اولویت حفظ تنفس، رفع انحراف تیغه و ایجاد قرینگی دقیق چهره بدون تغییرات نامتعارف.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-4">
            <h5 className="text-sm sm:text-base font-extrabold text-white uppercase tracking-wider text-emerald-400">
              دسترسی سریع
            </h5>
            <ul className="space-y-3 text-sm sm:text-base">
              {FOOTER_DATA.links.map((link, idx) => (
                <li key={idx}>
                  <Link 
                    href={link.path}
                    className="text-slate-300 hover:text-emerald-400 transition-colors duration-200 cursor-pointer flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-emerald-400 transition-colors" />
                    <span>{link.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Col */}
          <div className="md:col-span-4 space-y-4 text-sm sm:text-base text-slate-300">
            <h5 className="font-extrabold text-white uppercase tracking-wider text-emerald-400">
              ارتباط مستقیم با مطب
            </h5>
            <div className="space-y-3">
              <p className="flex items-start gap-2.5 leading-relaxed">
                <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{CLINIC_INFO.address}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="w-5 h-5 text-emerald-400 shrink-0" />
                <span dir="ltr" className="font-mono text-slate-200 font-bold text-base">{CLINIC_INFO.phone}</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Copyright explicitly mentioning Nova Labs */}
        <div className="mt-14 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-300">
          <p className="font-medium text-slate-200">
            {FOOTER_DATA.copyright}
          </p>
          <div className="flex items-center gap-2 text-slate-400 text-xs sm:text-sm">
            <span>طراحی و پیاده‌سازی شده توسط</span>
            <span className="font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-3 py-1 rounded-lg shadow-2xs">
              {FOOTER_DATA.developerName}
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
