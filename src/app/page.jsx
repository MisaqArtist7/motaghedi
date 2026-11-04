import React from 'react';
import Link from 'next/link';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import { 
  DOCTOR_PROFILE, 
  SURGICAL_STYLES, 
  LOCATION_DATA,
  FEATURED_BEFORE_AFTER
} from '../data/mockData';
import { 
  Sparkles, 
  GraduationCap, 
  Building2, 
  MapPin, 
  Phone, 
  Clock, 
  ArrowLeft, 
  CheckCircle2, 
  Navigation, 
  ShieldCheck, 
  Calendar,
  Layers,
  Activity,
  HeartHandshake
} from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-24 py-6 md:py-12">

      {/* ۲. بخش معرفی جراح (Hero Section) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* عکس پزشک با قاب شیک و مینیمال شیشه‌ای */}
          <div className="lg:col-span-5 flex justify-center order-1 lg:order-2">
            <div className="relative max-w-sm w-full">
              {/* افکت گرادیان محو پس‌زمینه */}
              <div className="absolute -inset-3 bg-gradient-to-tr from-emerald-500/25 via-teal-400/20 to-emerald-600/20 rounded-3xl blur-xl -z-10 animate-pulse duration-1000" />

              <div className="overflow-hidden rounded-3xl border border-white/60 shadow-2xl bg-white/80 backdrop-blur-xl p-2.5 transition-all duration-500 hover:shadow-emerald-500/10">
                <div className="overflow-hidden rounded-2xl relative aspect-4/5 bg-slate-100">
                  <img
                    src={DOCTOR_PROFILE.image}
                    alt={DOCTOR_PROFILE.name}
                    className="w-full h-full object-cover object-top hover:scale-103 transition-transform duration-700 ease-out"
                  />
                  {/* تراشه کد نظام پزشکی با افکت شیشه‌ای */}
                  <div className="absolute bottom-3 right-3 bg-slate-900/85 backdrop-blur-md text-white text-xs px-3.5 py-1.5 rounded-xl border border-white/15 flex items-center gap-1.5 shadow-lg">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>نظام پزشکی: {DOCTOR_PROFILE.nezamCode}</span>
                  </div>
                </div>
              </div>

              {/* پلاک نشان سبک جراحی طبیعی با گلس‌مورفیسم */}
              <div className="absolute -bottom-5 -left-4 sm:left-4 bg-white/85 backdrop-blur-xl border border-white/40 shadow-xl rounded-2xl p-3.5 flex items-center gap-3 max-w-xs hover:-translate-y-1 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-700 flex items-center justify-center shrink-0 shadow-xs">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">سبک جراحی طبیعی</p>
                  <p className="text-[11px] text-slate-500">حفظ تنفس، تناسب و فرم پایدار</p>
                </div>
              </div>
            </div>
          </div>

          {/* محتوا و مشخصات علمی جراح */}
          <div className="lg:col-span-7 space-y-6 order-2 lg:order-1 text-right">
            
            <div className="space-y-2.5">
              <div className="inline-flex items-center gap-2 bg-emerald-50/90 text-emerald-800 border border-emerald-200/80 px-4 py-1.5 rounded-full text-xs font-semibold shadow-2xs backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                <span>معرفی جراح و خط‌مشی بالینی</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
                {DOCTOR_PROFILE.name}
              </h1>
              <p className="text-emerald-700 font-bold text-sm sm:text-base">
                {DOCTOR_PROFILE.specialty}
              </p>
              <p className="text-slate-500 text-xs sm:text-sm font-medium">
                {DOCTOR_PROFILE.fellowship}
              </p>
            </div>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-light">
              {DOCTOR_PROFILE.bio}
            </p>

            {/* سوابق علمی و افتخارات */}
            <div className="space-y-3 pt-2">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                <span>سوابق علمی و مدارک تخصصی</span>
              </h2>
              <ul className="grid grid-cols-1 gap-2.5 text-xs text-slate-700">
                {DOCTOR_PROFILE.scientificBackground.map((item, index) => (
                  <li key={index} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed font-light">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* لیست بیمارستان‌های همکار با طراحی شیشه‌ای مدرن */}
            <div className="space-y-3 pt-4 border-t border-slate-200/80">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>بیمارستان‌ها و مراکز جراحی همکار</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {DOCTOR_PROFILE.partnerHospitals.map((hosp) => (
                  <div
                    key={hosp.id}
                    className="p-3.5 bg-white/80 backdrop-blur-md border border-slate-200/80 hover:border-emerald-300 rounded-2xl shadow-xs hover:shadow-lg hover:-translate-y-1 active:scale-98 transition-all duration-300 cursor-pointer"
                  >
                    <p className="font-bold text-slate-800 text-xs">{hosp.name}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{hosp.type}</p>
                    <p className="text-[10px] text-emerald-700 font-semibold mt-1.5">{hosp.area}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* دکمه‌های اقدام شیک */}
            <div className="flex flex-wrap items-center gap-3.5 pt-3">
              <Link
                href="/login"
                className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold px-7 py-3.5 rounded-2xl text-xs sm:text-sm shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 flex items-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>رزرو وقت ویزیت حضوری یا آنلاین</span>
              </Link>
              <Link
                href="/gallery"
                className="bg-white/80 backdrop-blur-md hover:bg-slate-50 text-slate-700 border border-slate-200/90 hover:border-emerald-300/80 px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-300 cursor-pointer"
              >
                <span>مشاهده نتایج جراحی‌ها</span>
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* بخش نمونه‌کارهای قبل و بعد */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* هدر سکشن */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald-50/90 text-emerald-800 border border-emerald-200/90 px-4 py-1.5 rounded-full text-xs font-semibold shadow-2xs backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>تغییرات واقعی</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            نتایج جراحی و مقایسه قبل و بعد
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
            مشاهده تغییرات طبیعی و بدون روتوش بیماران مطب دکتر معتقدی با امکان مقایسه دقیق قبل و بعد از عمل.
          </p>
        </div>

        {/* گرید ۳ ستونه در دسکتاپ با طراحی گلس‌مورفیک */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURED_BEFORE_AFTER.map((item) => (
            <div
              key={item.id}
              className="bg-white/85 backdrop-blur-md rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 ease-in-out flex flex-col overflow-hidden group cursor-pointer"
            >
              {/* اسلایدر مقایسه */}
              <div className="p-3 bg-slate-50/70 border-b border-slate-100">
                <BeforeAfterSlider
                  beforeImage={item.beforeImage}
                  afterImage={item.afterImage}
                  alt={item.title}
                />
              </div>

              {/* مشخصات نمونه‌کار */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3.5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                      {item.category}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {item.subtitle}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-emerald-800 transition-colors">
                    {item.title}
                  </h3>
                </div>

                {/* مدت زمان گذشته از عمل */}
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-3 border-t border-slate-100/90">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>مدت زمان: <strong className="text-slate-700 font-medium">{item.timeElapsed}</strong></span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* دکمه مشاهده همه نمونه‌کارها در گالری با افکت فشردن و گرادیان جذاب */}
        <div className="text-center pt-8">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold px-8 py-4 rounded-2xl text-xs sm:text-sm shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 group cursor-pointer"
          >
            <span>مشاهده همه نمونه‌کارها در گالری</span>
            <ArrowLeft className="w-4 h-4 mr-0.5 opacity-80 group-hover:-translate-x-1.5 transition-transform" />
          </Link>
        </div>

      </section>

      {/* ۳. سبک جراحی و خدمات (طبیعی، استخوانی، گوشتی، ترمیمی) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* سرتیتر ساده و آرام */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald-50/90 text-emerald-800 border border-emerald-200 px-3.5 py-1 rounded-full text-xs font-semibold shadow-2xs backdrop-blur-sm">
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <span>رویکردها و تکنیک‌ها</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            سبک‌های جراحی بینی
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
            در این مطب از رویکرد تک‌نسخه‌ای اجتناب می‌شود؛ تکنیک جراحی متناسب با بافت پوست، ساختار استخوان و تقارن هندسی صورت شما تعیین می‌گردد.
          </p>
        </div>

        {/* کارت‌های ۴ سبک جراحی در ۴ ستون دسکتاپ با طراحی گلس‌مورفیک و هاور روان */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SURGICAL_STYLES.map((style) => (
            <div
              key={style.id}
              className="bg-white/85 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-slate-200/90 hover:border-emerald-300/80 shadow-xs hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-in-out cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                    جراحی {style.slug}
                  </span>
                  <Activity className="w-4 h-4 text-emerald-600 group-hover:scale-115 transition-transform duration-300" />
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                  {style.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed font-light">
                  {style.summary}
                </p>

                {/* ویژگی‌های کلیدی این سبک */}
                <ul className="space-y-2 pt-2 border-t border-slate-100">
                  {style.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-1.5 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-snug font-light">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link
                  href="/gallery"
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group/link active:scale-95 transition-all"
                >
                  <span>نمونه‌ها</span>
                  <ArrowLeft className="w-3.5 h-3.5 group-hover/link:-translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/login"
                  className="text-[11px] bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 px-3 py-1.5 rounded-xl transition-all duration-200 font-medium whitespace-nowrap active:scale-95 shadow-2xs hover:shadow"
                >
                  مشاوره
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ۴. لوکیشن و دسترسی مطب با کارت شیشه‌ای */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/85 backdrop-blur-md rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            
            {/* اطلاعات نشانی و شماره تماس */}
            <div className="lg:col-span-5 p-6 sm:p-10 space-y-6 flex flex-col justify-between">
              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 text-emerald-700 text-xs font-semibold">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>دسترسی و نشانی مطب</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    {LOCATION_DATA.title}
                  </h3>
                </div>

                <div className="space-y-4 text-xs text-slate-600">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed font-medium text-slate-800">
                      {LOCATION_DATA.address}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="text-slate-500">تلفن هماهنگی و مطب: </span>
                      <a 
                        href={`tel:${LOCATION_DATA.phone.replace(/[^0-9]/g, '')}`} 
                        dir="ltr" 
                        className="font-mono text-emerald-700 font-bold hover:underline"
                      >
                        {LOCATION_DATA.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{LOCATION_DATA.workingHours}</span>
                  </div>

                  <div className="p-3.5 bg-slate-50/80 rounded-2xl text-[11px] text-slate-500 leading-relaxed border border-slate-200/70">
                    {LOCATION_DATA.accessTips}
                  </div>
                </div>
              </div>

              {/* دکمه‌های مسیریابی سریع */}
              <div className="pt-4 border-t border-slate-100 space-y-2.5">
                <p className="text-[11px] font-semibold text-slate-700 flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                  <span>مسیریابی در اپلیکیشن‌ها:</span>
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {LOCATION_DATA.navigationApps.map((app, idx) => (
                    <a
                      key={idx}
                      href={app.link}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-50/90 text-emerald-800 hover:bg-emerald-100/90 border border-emerald-200/80 shadow-2xs hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer"
                    >
                      {app.name}
                    </a>
                  ))}
                </div>
              </div>

            </div>

            {/* نقشه مطب (Map View) */}
            <div className="lg:col-span-7 relative min-h-[320px] bg-slate-100 border-t lg:border-t-0 lg:border-r border-slate-200">
              <iframe
                title="موقعیت مطب دکتر معتقدی در تهران"
                src={LOCATION_DATA.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '340px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full object-cover"
              />
              
              {/* نشانگر هوشمند روی نقشه */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg border border-white/40 text-xs flex items-center gap-2 pointer-events-none">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-bold text-slate-800">برج پزشکی آراد — طبقه ۴</span>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
