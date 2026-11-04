'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MOCK_GALLERY } from '../../data/mockData';
import BeforeAfterSlider from '../../components/BeforeAfterSlider';
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ArrowLeft
} from 'lucide-react';

const CATEGORIES = ['همه', 'بینی استخوانی', 'بینی گوشتی', 'ترمیمی'];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('همه');

  const filteredItems = MOCK_GALLERY.filter((item) => {
    if (activeCategory === 'همه') return true;
    return item.category === activeCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* هدر صفحه و تب‌های فیلتر دسته‌بندی */}
      <div className="text-center max-w-3xl mx-auto space-y-5">
        <div className="inline-flex items-center gap-2 bg-emerald-50/90 text-emerald-800 border border-emerald-200/90 px-4 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md shadow-2xs">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>آرشیو مستند و ثبت‌شده جراحی‌ها</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight">
          گالری نمونه‌کارهای جراحی بینی
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
          نتایج جراحی رینوپلاستی دکتر معتقدی با قابلیت مقایسه زنده قبل و بعد. نشانگر وسط هر تصویر را به چپ یا راست بکشید.
        </p>

        {/* تب‌های فیلتر با انیمیشن نرم و گلاسمورفیسم */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-4">
          {CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 ease-in-out cursor-pointer active:scale-95 ${
                  isSelected
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30 scale-102 ring-2 ring-emerald-500/20'
                    : 'bg-white/80 backdrop-blur-md text-slate-700 border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/60 shadow-2xs hover:shadow-md'
                }`}
              >
                {cat}
                {cat === 'همه' && (
                  <span className="mr-1.5 text-[10px] opacity-75 font-mono">
                    ({MOCK_GALLERY.length})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* گرید کارتهای نمونه‌کار با اسلایدر مقایسه‌ای اختصاصی و هاور کارت نرم */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white/85 backdrop-blur-md rounded-3xl border border-white/60 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-in-out flex flex-col group overflow-hidden ring-1 ring-slate-900/5 animate-fadeIn"
          >
            {/* اسلایدر مقایسه قبل و بعد لمسی/موس */}
            <div className="p-3 bg-gradient-to-b from-slate-50/80 to-slate-100/50 border-b border-slate-100/80">
              <BeforeAfterSlider
                beforeImage={item.beforeImage}
                afterImage={item.afterImage}
                alt={item.title}
              />
            </div>

            {/* بدنه و مشخصات پرونده بیمار */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200/60 shadow-2xs">
                    {item.category}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 font-semibold bg-slate-100/80 px-2.5 py-0.5 rounded-lg border border-slate-200/60">
                    پرونده: {item.patientCode}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-emerald-800 transition-colors duration-200">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed font-light">
                  {item.description}
                </p>
              </div>

              {/* یادداشت تخصصی پزشک و زمان سپری شده */}
              <div className="space-y-3 pt-3 border-t border-slate-100/80">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>دوره ثبت نتیجه: <strong className="text-slate-700 font-medium">{item.timeElapsed}</strong></span>
                </div>

                <div className="bg-emerald-50/70 backdrop-blur-xs p-3.5 rounded-2xl border border-emerald-100/80 shadow-2xs">
                  <div className="flex items-start gap-2 text-xs text-emerald-950">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="font-medium text-[11px] leading-relaxed">
                      {item.doctorNotes}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* بنر پایین صفحه برای هدایت به /login با گرادیانت لوکس و افکت شیشه‌ای */}
      <section className="bg-gradient-to-r from-slate-950 via-emerald-950 to-teal-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-emerald-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-right relative z-10">
          
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-emerald-700/50 backdrop-blur-md text-emerald-200 px-3.5 py-1 rounded-full text-xs font-semibold border border-emerald-400/30 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>مشاوره و آنالیز آنلاین فرم بینی</span>
            </div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold leading-snug">
              آیا بینی شما هم نیازمند بررسی است؟
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/90 font-light leading-relaxed">
              برای ارسال عکس‌های چهره و دریافت نوبت ویزیت حضوری یا مشاوره هوشمند وارد شوید.
            </p>
          </div>

          <Link
            href="/login"
            className="shrink-0 bg-gradient-to-r from-white via-emerald-50 to-white hover:from-white hover:to-emerald-100 text-emerald-950 font-bold px-8 py-4 rounded-2xl text-xs sm:text-sm shadow-xl shadow-black/25 hover:shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out flex items-center gap-2.5 group cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-emerald-700" />
            <span>ارسال عکس و دریافت نوبت</span>
            <ArrowLeft className="w-4 h-4 text-emerald-700 group-hover:-translate-x-1 transition-transform duration-300" />
          </Link>

        </div>
      </section>

    </div>
  );
}

