'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useClinic } from '../../context/ClinicContext';
import PhotoUploadBox from '../../components/PhotoUploadBox';
import TelegramBotWidget from '../../components/TelegramBotWidget';
import { 
  Phone, 
  LogOut, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight,
  Sparkles, 
  Stethoscope, 
  Check, 
  Calendar, 
  Clock,
  ShieldCheck,
  CreditCard,
  MapPin,
  Lock,
  Printer,
  Info,
  Smartphone,
  Copy,
  Navigation,
  RotateCcw
} from 'lucide-react';
import { LOCATION_DATA } from '../../data/mockData';

// تولید روزهای دو هفته آینده به تقویم شمسی
function getNextTwoWeeksSchedule() {
  const days = [];
  const now = new Date();
  
  for (let i = 1; i <= 14; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    
    const weekday = new Intl.DateTimeFormat('fa-IR', { weekday: 'long' }).format(d);
    const dayMonth = new Intl.DateTimeFormat('fa-IR', { day: 'numeric', month: 'long' }).format(d);
    const fullDate = new Intl.DateTimeFormat('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' }).format(d);
    
    // فقط روزهای دوشنبه و چهارشنبه قابل انتخاب باشند
    const isSelectable = weekday.includes('دوشنبه') || weekday.includes('چهارشنبه');
    
    days.push({
      id: i,
      weekday,
      dayMonth,
      fullDate,
      isSelectable,
    });
  }
  return days;
}

// اسلات‌های زمانی ۱۶:۰۰ الی ۲۰:۰۰ با فاصله ۳۰ دقیقه‌ای و چند اسلات پر
const MOCK_TIME_SLOTS = [
  { time: '۱۶:۰۰', isBooked: false },
  { time: '۱۶:۳۰', isBooked: false },
  { time: '۱۷:۰۰', isBooked: true },  // پر
  { time: '۱۷:۳۰', isBooked: false },
  { time: '۱۸:۰۰', isBooked: true },  // پر
  { time: '۱۸:۳۰', isBooked: false },
  { time: '۱۹:۰۰', isBooked: false },
  { time: '۱۹:۳۰', isBooked: true },  // پر
];

const DEPOSIT_AMOUNT = '۵۰۰,۰۰۰ تومان';

export default function DashboardPage() {
  const { 
    user, 
    logout, 
    updateTriageData, 
    setActiveStep, 
    addAppointment, 
    resetDemoFlow, 
    showNotification,
    isInitialized
  } = useClinic();
  const router = useRouter();

  // در صورت عدم ورود، بلافاصله به /login هدایت شود
  useEffect(() => {
    if (isInitialized && (!user || !user.isLoggedIn)) {
      router.replace('/login');
    }
  }, [isInitialized, user, router]);

  const triage = user?.triageData || {
    photos: { frontal: null, rightProfile: null, basal: null },
    noseType: 'بینی استخوانی',
    hasFracture: false,
    hasAllergy: false,
    allergyDescription: '',
  };

  const activeStep = user?.activeStep || 1;

  // بررسی وضعیت تکمیل تصاویر بخش اول
  const hasAllPhotos = Boolean(
    triage.photos?.frontal && 
    triage.photos?.rightProfile && 
    triage.photos?.basal
  );

  // وضعیت‌های بخش دوم: انتخاب روز و ساعت
  const scheduleDays = useMemo(() => getNextTwoWeeksSchedule(), []);
  
  // انتخاب پیش‌فرض اولین دوشنبه یا چهارشنبه در دسترس
  const firstAvailableDay = scheduleDays.find(d => d.isSelectable);
  const [selectedDay, setSelectedDay] = useState(firstAvailableDay || null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // وضعیت‌های مودال پرداخت شبیه‌سازی‌شده
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentPhase, setPaymentPhase] = useState('loading'); // 'loading' | 'success'
  const [trackingCode, setTrackingCode] = useState('');

  // کپی پیامک
  const [copiedSms, setCopiedSms] = useState(false);

  const handlePhotoUpdate = (key, dataUrl) => {
    updateTriageData({
      photos: {
        ...triage.photos,
        [key]: dataUrl,
      },
    });
  };

  const handlePhotoRemove = (key) => {
    updateTriageData({
      photos: {
        ...triage.photos,
        [key]: null,
      },
    });
  };

  const handleLoadDemoPhotos = () => {
    updateTriageData({
      photos: {
        frontal: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80',
        rightProfile: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
        basal: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
      },
    });
    showNotification('سه زاویه تصویر نمونه جهت بررسی دمو با موفقیت لود شد.');
  };

  const handleNextFromTriage = (e) => {
    e.preventDefault();
    if (!hasAllPhotos) {
      alert('لطفاً تصاویر هر سه زاویه (روبرو، نیمرخ راست و نمای زیرین) را انتخاب کنید.');
      return;
    }
    setActiveStep(2);
    showNotification('اطلاعات تریاژ ثبت شد. اکنون روز و ساعت ویزیت را انتخاب فرمایید.');
  };

  const handleOpenPayment = () => {
    if (!selectedDay || !selectedSlot) {
      alert('لطفاً روز و ساعت ویزیت را انتخاب کنید.');
      return;
    }

    setIsPaymentModalOpen(true);
    setPaymentPhase('loading');

    // شبیه‌سازی لودینگ درگاه پرداخت حدود ۲ ثانیه
    setTimeout(() => {
      const generatedCode = 'TRX-' + Math.floor(100000 + Math.random() * 900000);
      setTrackingCode(generatedCode);
      setPaymentPhase('success');

      // ثبت نوبت قطعی در context و سشن بیمار
      addAppointment({
        date: selectedDay.fullDate,
        time: selectedSlot.time,
        weekday: selectedDay.weekday,
        depositPaid: DEPOSIT_AMOUNT,
        trackingCode: generatedCode,
        noseType: triage.noseType,
      });

      // انتقال خودکار به بخش ۳ پس از تایید
      setTimeout(() => {
        setIsPaymentModalOpen(false);
        setActiveStep(3);
      }, 1600);
    }, 2000);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // اگر هنوز در کلاینت داده‌ها از localStorage لود نشده است
  if (!isInitialized) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-emerald-600 animate-spin" />
          <p className="text-xs text-slate-500">در حال فراخوانی پرونده دیجیتال...</p>
        </div>
      </div>
    );
  }

  // اگر کاربر وارد نشده باشد
  if (!user || !user.isLoggedIn) {
    return null;
  }

  // داده‌های نوبت تأییدشده (واقعی یا پیش‌فرض نمونه در صورت مشاهده مستقیم)
  const confirmedApt = user.confirmedAppointment || {
    id: 'APT-98241',
    date: selectedDay ? selectedDay.fullDate : 'دوشنبه ۱۱ آبان ۱۴۰۵',
    time: selectedSlot ? selectedSlot.time : '۱۶:۳۰',
    weekday: selectedDay ? selectedDay.weekday : 'دوشنبه',
    depositPaid: DEPOSIT_AMOUNT,
    trackingCode: trackingCode || 'TRX-841920',
    status: 'قطعی (تأیید سیستم)',
    noseType: triage.noseType || 'بینی استخوانی',
  };

  // متن پیامک تأیید نمونه
  const smsMessageText = `${user.name || 'سارا رضایی'} گرامی،
نوبت معاینه و مشاوره جراحی بینی شما در مطب دکتر معتقدی قطعی گردید.

🗓 تاریخ: ${confirmedApt.date}
⏰ ساعت: ${confirmedApt.time}
🔑 کد پیگیری: ${confirmedApt.trackingCode}
💳 بیعانه پرداختی: ${confirmedApt.depositPaid}
📍 نشانی: تهران، خ ولیعصر، بالاتر از ظفر، برج پزشکی آراد، ط ۴، واحد ۱۲

لطفاً ۱۵ دقیقه قبل از زمان مقرر با مدارک پزشکی در مطب حضور یابید.`;

  const handleCopySms = () => {
    navigator.clipboard.writeText(smsMessageText);
    setCopiedSms(true);
    showNotification('متن پیامک تأیید کپی شد.');
    setTimeout(() => setCopiedSms(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* بالای پنل: سلام، شماره موبایل کاربر و دکمه خروج با افکت شیشه‌ای */}
      <div className="bg-white/85 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-white/60 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 ring-1 ring-slate-900/5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-emerald-500/25 shrink-0 border border-emerald-400/30">
            {user.name ? user.name.charAt(0) : 'ب'}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                سلام، {user.name || 'بیمار گرامی'}
              </h1>
              <span className="text-[11px] font-semibold bg-emerald-100/80 text-emerald-800 px-3 py-0.5 rounded-full border border-emerald-200/60 shadow-2xs">
                پرونده: {user.fileNumber || 'NOSE-10492'}
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-2 font-light">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>شماره همراه ثبت‌شده:</span>
              <strong dir="ltr" className="font-mono text-slate-700 font-semibold">{user.phone}</strong>
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50/80 hover:bg-rose-100/90 px-4 py-2.5 rounded-2xl border border-rose-200/70 transition-all duration-300 shadow-2xs hover:shadow-rose-500/10 active:scale-95 self-end sm:self-center cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>خروج از حساب</span>
        </button>
      </div>

      {/* ساختار مرحله‌ای (Stepper سه مرحله‌ای مدرن با افکت شیشه‌ای) */}
      <div className="bg-white/85 backdrop-blur-xl rounded-3xl p-5 sm:p-6 border border-white/60 shadow-sm ring-1 ring-slate-900/5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* گام ۱ */}
          <div 
            onClick={() => setActiveStep(1)}
            className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer active:scale-98 flex items-center gap-3.5 ${
              activeStep === 1
                ? 'bg-emerald-50/90 border-emerald-500 shadow-md shadow-emerald-500/10 ring-2 ring-emerald-500/20 scale-101'
                : 'bg-slate-50/80 border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/30'
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs transition-all duration-300 ${
              hasAllPhotos && activeStep > 1
                ? 'bg-emerald-600 text-white'
                : activeStep === 1
                ? 'bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-emerald-600/30'
                : 'bg-slate-200 text-slate-600'
            }`}>
              {hasAllPhotos && activeStep > 1 ? <Check className="w-4 h-4" /> : '۱'}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">بخش اول</p>
              <p className={`text-[11px] ${activeStep === 1 ? 'text-emerald-800 font-semibold' : 'text-slate-500'}`}>
                ارزیابی اولیه و تریاژ
              </p>
            </div>
          </div>

          {/* گام ۲ */}
          <div 
            onClick={() => hasAllPhotos && setActiveStep(2)}
            className={`p-4 rounded-2xl border transition-all duration-300 flex items-center gap-3.5 ${
              activeStep === 2
                ? 'bg-emerald-50/90 border-emerald-500 shadow-md shadow-emerald-500/10 ring-2 ring-emerald-500/20 scale-101'
                : 'bg-slate-50/80 border-slate-200/80'
            } ${hasAllPhotos ? 'cursor-pointer hover:border-emerald-300 hover:bg-emerald-50/30 active:scale-98' : 'opacity-60 cursor-not-allowed'}`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs transition-all duration-300 ${
              activeStep === 2 
                ? 'bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-emerald-600/30' 
                : activeStep > 2 
                ? 'bg-emerald-600 text-white' 
                : 'bg-slate-200 text-slate-600'
            }`}>
              {activeStep > 2 ? <Check className="w-4 h-4" /> : '۲'}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">بخش دوم</p>
              <p className={`text-[11px] ${activeStep === 2 ? 'text-emerald-800 font-semibold' : 'text-slate-500'}`}>
                رزرو نوبت و تقویم مطب
              </p>
            </div>
          </div>

          {/* گام ۳ */}
          <div 
            onClick={() => setActiveStep(3)}
            className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer active:scale-98 flex items-center gap-3.5 ${
              activeStep === 3
                ? 'bg-emerald-50/90 border-emerald-500 shadow-md shadow-emerald-500/10 ring-2 ring-emerald-500/20 scale-101'
                : 'bg-slate-50/80 border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/30'
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs transition-all duration-300 ${
              activeStep === 3 ? 'bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-emerald-600/30' : 'bg-slate-200 text-slate-600'
            }`}>
              ۳
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">بخش سوم</p>
              <p className={`text-[11px] ${activeStep === 3 ? 'text-emerald-800 font-semibold' : 'text-slate-500'}`}>
                وضعیت نوبت و پیامک‌ها
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================
          بخش اول — «ارزیابی اولیه و تریاژ»
          ======================================================== */}
      {activeStep === 1 && (
        <div className="bg-white/85 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/60 shadow-sm space-y-8 animate-fadeIn ring-1 ring-slate-900/5">
          
          <div className="space-y-1 border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-1.5 text-emerald-700 text-xs font-bold">
              <Stethoscope className="w-4 h-4" />
              <span>گام اول از فرآیند پذیرش هوشمند</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              ارزیابی اولیه و تریاژ بالینی
            </h2>
            <p className="text-xs text-slate-500 font-light leading-relaxed">
              تصاویر شما بدون نیاز به ارسال به سرور، مستقیماً در مرورگر جهت آنالیز اولیه فرم و زاویه بینی قرار می‌گیرند.
            </p>
          </div>

          {/* ۱. سه باکس آپلود مرتب و هم‌اندازه */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span>بارگذاری تصاویر از سه زاویه استاندارد (الزامی)</span>
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleLoadDemoPhotos}
                  className="text-[11px] text-emerald-800 hover:text-emerald-900 bg-emerald-50/80 hover:bg-emerald-100/90 border border-emerald-200/90 px-3 py-1.5 rounded-2xl transition-all duration-300 active:scale-95 flex items-center gap-1 font-semibold cursor-pointer shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>بارگذاری عکس نمونه (تست)</span>
                </button>
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-xl shadow-2xs ${
                  hasAllPhotos 
                    ? 'bg-emerald-100/80 text-emerald-800 border border-emerald-200/60' 
                    : 'bg-amber-100/80 text-amber-800 border border-amber-200/60'
                }`}>
                  {hasAllPhotos ? 'هر ۳ عکس آماده است' : 'نیاز به ۳ زاویه کامل'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <PhotoUploadBox
                label="عکس از روبرو"
                hint="نگاه مستقیم به لنز دوربین با نور کافی و بدون عینک"
                photoUrl={triage.photos?.frontal}
                onPhotoChange={(url) => handlePhotoUpdate('frontal', url)}
                onRemove={() => handlePhotoRemove('frontal')}
              />

              <PhotoUploadBox
                label="نیمرخ راست"
                hint="چرخش ۹۰ درجه سر به راست برای بررسی قوز و زاویه بینی"
                photoUrl={triage.photos?.rightProfile}
                onPhotoChange={(url) => handlePhotoUpdate('rightProfile', url)}
                onRemove={() => handlePhotoRemove('rightProfile')}
              />

              <PhotoUploadBox
                label="نمای زیرین"
                hint="کمی متمایل کردن سر به عقب برای مشاهده تقارن سوراخ‌ها"
                photoUrl={triage.photos?.basal}
                onPhotoChange={(url) => handlePhotoUpdate('basal', url)}
                onRemove={() => handlePhotoRemove('basal')}
              />
            </div>
          </div>

          {/* ۲. فرم ثبت سابقه کوتاه */}
          <div className="space-y-5 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>پرسشنامه سوابق بالینی بینی</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  نوع ساختار بینی خود را انتخاب کنید:
                </label>
                <select
                  value={triage.noseType}
                  onChange={(e) => updateTriageData({ noseType: e.target.value })}
                  className="w-full p-3.5 bg-slate-50/80 backdrop-blur-xs border border-slate-200/90 rounded-2xl text-xs font-medium focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all shadow-2xs"
                >
                  <option value="بینی استخوانی">بینی استخوانی (قوز استخوانی، پوست نازک یا متوسط)</option>
                  <option value="بینی گوشتی">بینی گوشتی (پوست ضخیم، نوک پهن و غضروف نرم)</option>
                  <option value="ترکیبی و انحراف‌دار">ترکیبی (انحراف سپتوم، مشکل تنفسی و قوز استخوانی)</option>
                  <option value="نیاز به ترمیم جراحی قبلی">ترمیمی / Revision (سابقه عمل ناموفق پیشین)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  آیا سابقه شکستگی یا ضربه شدید به بینی داشته‌اید؟
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => updateTriageData({ hasFracture: false })}
                    className={`py-3 px-4 rounded-2xl text-xs font-bold border transition-all duration-300 active:scale-95 cursor-pointer ${
                      !triage.hasFracture
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                        : 'bg-slate-50/80 text-slate-700 border-slate-200/90 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    خیر
                  </button>

                  <button
                    type="button"
                    onClick={() => updateTriageData({ hasFracture: true })}
                    className={`py-3 px-4 rounded-2xl text-xs font-bold border transition-all duration-300 active:scale-95 cursor-pointer ${
                      triage.hasFracture
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                        : 'bg-slate-50/80 text-slate-700 border-slate-200/90 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    بله، سابقه شکستگی دارم
                  </button>
                </div>
              </div>

              <div className="md:col-span-2 space-y-3">
                <label className="block text-xs font-semibold text-slate-700">
                  آیا سابقه حساسیت دارویی، بیهوشی یا آلرژی فصلی شدید دارید؟
                </label>
                
                <div className="flex items-center gap-4">
                  <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="allergy"
                      checked={!triage.hasAllergy}
                      onChange={() => updateTriageData({ hasAllergy: false, allergyDescription: '' })}
                      className="accent-emerald-600 w-4 h-4 cursor-pointer"
                    />
                    <span>خیر، هیچ‌گونه حساسیت خاصی ندارم</span>
                  </label>

                  <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="allergy"
                      checked={triage.hasAllergy}
                      onChange={() => updateTriageData({ hasAllergy: true })}
                      className="accent-emerald-600 w-4 h-4 cursor-pointer"
                    />
                    <span>بله، دارای حساسیت هستم</span>
                  </label>
                </div>

                {triage.hasAllergy && (
                  <div className="pt-2 animate-fadeIn">
                    <input
                      type="text"
                      value={triage.allergyDescription}
                      onChange={(e) => updateTriageData({ allergyDescription: e.target.value })}
                      placeholder="توضیح کوتاه نوع حساسیت (مثلاً: حساسیت به پنی‌سیلین، رینیت آلرژیک فصلی...)"
                      className="w-full p-3.5 bg-slate-50/80 backdrop-blur-xs border border-slate-200/90 rounded-2xl text-xs focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all shadow-2xs"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* دکمه «ثبت و ادامه به مرحله بعد» */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500 flex items-center gap-2 font-light">
              <Info className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {hasAllPhotos 
                  ? 'تمامی تصاویر آماده است. اکنون می‌توانید به مرحله رزرو نوبت بروید.'
                  : 'دکمه ادامه تنها پس از بارگذاری کامل هر ۳ زاویه عکس فعال خواهد شد.'}
              </span>
            </div>

            <button
              type="button"
              onClick={handleNextFromTriage}
              disabled={!hasAllPhotos}
              className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-300 ease-in-out ${
                hasAllPhotos
                  ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 text-white shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/40 active:scale-95 cursor-pointer hover:scale-102'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              <span>ثبت و ادامه به انتخاب نوبت</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* ========================================================
          بخش دوم — «رزرو نوبت و تقویم مطب»
          ======================================================== */}
      {activeStep === 2 && (
        <div className="bg-white/85 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/60 shadow-sm space-y-8 animate-fadeIn ring-1 ring-slate-900/5">
          
          {/* هدر بخش ۲ و دکمه بازگشت به تریاژ */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-emerald-700 text-xs font-bold">
                <Calendar className="w-4 h-4" />
                <span>گام دوم — تقویم و ساعات حضور پزشک</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                رزرو نوبت معاینه و مشاوره مطب
              </h2>
              <p className="text-xs text-slate-500 font-light">
                برنامه ویزیت دکتر معتقدی صرفاً در روزهای <strong>دوشنبه و چهارشنبه</strong> (ساعت ۱۶:۰۰ تا ۲۰:۰۰) برقرار است.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActiveStep(1)}
              className="text-xs font-semibold text-slate-600 hover:text-emerald-700 bg-slate-50/80 hover:bg-emerald-50 px-4 py-2.5 rounded-2xl border border-slate-200 transition-all duration-300 active:scale-95 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-2xs"
            >
              <ArrowRight className="w-4 h-4" />
              <span>ویرایش عکس‌ها و تریاژ</span>
            </button>
          </div>

          {/* ۱. انتخاب روز: لیست روزهای دو هفته آینده (فقط دوشنبه و چهارشنبه فعال) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span>۱. انتخاب روز ویزیت (دو هفته آینده):</span>
              </label>
              <span className="text-[11px] text-slate-500 font-light">
                روزهای پذیرش: <strong className="text-emerald-700 font-medium">دوشنبه‌ها و چهارشنبه‌ها</strong>
              </span>
            </div>

            {/* لیست اسکرول افقی روزها با کارت‌های مدرن */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 pt-1">
              {scheduleDays.map((day) => {
                const isSelected = selectedDay?.id === day.id;
                return (
                  <button
                    key={day.id}
                    type="button"
                    disabled={!day.isSelectable}
                    onClick={() => {
                      setSelectedDay(day);
                      setSelectedSlot(null); // بازنشانی ساعت با تغییر روز
                    }}
                    className={`p-3.5 rounded-2xl border text-center transition-all duration-300 flex flex-col justify-between items-center min-h-[102px] active:scale-95 ${
                      isSelected
                        ? 'bg-gradient-to-b from-emerald-600 to-teal-700 text-white border-emerald-600 shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-500/20 scale-102'
                        : day.isSelectable
                        ? 'bg-white/90 hover:bg-emerald-50/80 border-emerald-200/90 text-slate-800 cursor-pointer shadow-2xs hover:shadow-md hover:-translate-y-0.5'
                        : 'bg-slate-50/60 border-slate-200/60 text-slate-400 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <span className="text-[11px] font-medium">
                      {day.weekday}
                    </span>
                    
                    <span className="text-xs font-extrabold my-1">
                      {day.dayMonth}
                    </span>

                    {day.isSelectable ? (
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        نوبت آزاد
                      </span>
                    ) : (
                      <span className="text-[9px] text-slate-400">
                        عدم پذیرش
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ۲. لیست تایم‌اسلات‌های خالی */}
          {selectedDay && (
            <div className="space-y-3 pt-3 border-t border-slate-100 animate-fadeIn">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span>۲. انتخاب ساعت مشاوره برای روز {selectedDay.weekday} ({selectedDay.dayMonth}):</span>
                </label>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 font-light">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>آزاد</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-slate-300" />
                    <span>رزرو شده (تکمیل)</span>
                  </span>
                </div>
              </div>

              {/* گرید تایم‌اسلات‌ها با دکمه‌های شکیل */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                {MOCK_TIME_SLOTS.map((slot, index) => {
                  const isSelected = selectedSlot?.time === slot.time;
                  return (
                    <button
                      key={index}
                      type="button"
                      disabled={slot.isBooked}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-3.5 rounded-2xl border text-center transition-all duration-300 flex items-center justify-between active:scale-95 ${
                        isSelected
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-600 shadow-md shadow-emerald-600/25 ring-2 ring-emerald-500/20 scale-102'
                          : slot.isBooked
                          ? 'bg-slate-100/70 border-slate-200/80 text-slate-400 cursor-not-allowed opacity-60'
                          : 'bg-white/90 hover:bg-emerald-50/70 border-slate-200/90 hover:border-emerald-300 text-slate-800 cursor-pointer shadow-2xs hover:shadow-sm hover:-translate-y-0.5'
                      }`}
                    >
                      <span className="flex items-center gap-1.5 text-xs font-mono font-bold">
                        <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-emerald-600'}`} />
                        <span>{slot.time}</span>
                      </span>

                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : slot.isBooked
                          ? 'bg-slate-200 text-slate-500'
                          : 'bg-emerald-100/70 text-emerald-800'
                      }`}>
                        {slot.isBooked ? 'تکمیل' : 'قابل رزرو'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ۳. خلاصه نوبت و دکمه پرداخت بیعانه */}
          {selectedDay && selectedSlot && (
            <div className="pt-4 border-t border-slate-100 animate-fadeIn space-y-5">
              <div className="bg-gradient-to-br from-emerald-50/80 via-teal-50/40 to-emerald-50/60 backdrop-blur-md border border-emerald-200/80 rounded-3xl p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-emerald-200/60 pb-3">
                  <h3 className="text-xs font-bold text-emerald-950 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>خلاصه نوبت معاینه و مشاوره انتخابی</span>
                  </h3>
                  <span className="text-[11px] font-semibold bg-emerald-200/80 text-emerald-900 px-3 py-0.5 rounded-full shadow-2xs">
                    مطب حضوری
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-700">
                  <div className="space-y-1">
                    <span className="text-slate-500 text-[11px]">روز و تاریخ ویزیت:</span>
                    <p className="font-bold text-slate-900">
                      {selectedDay.weekday}، {selectedDay.fullDate}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-500 text-[11px]">ساعت دقیق معاینه:</span>
                    <p className="font-bold text-slate-900 font-mono text-sm text-emerald-800">
                      ساعت {selectedSlot.time}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-500 text-[11px]">مبلغ بیعانه رزرو نوبت:</span>
                    <p className="font-bold text-emerald-700 font-mono text-base">
                      {DEPOSIT_AMOUNT}
                    </p>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed pt-1 font-light">
                  مبلغ بیعانه جهت تثبیت وقت حضور شما در مطب منظور شده و در روز ویزیت از هزینه نهایی مشاوره کسر خواهد شد.
                </p>
              </div>

              {/* دکمه پرداخت بیعانه و ثبت قطعی نوبت با گرادیانت لوکس */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-500 font-light">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>پرداخت امن شبیه‌سازی‌شده از طریق شبکه شاپرک</span>
                </div>

                <button
                  type="button"
                  onClick={handleOpenPayment}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-xl shadow-emerald-600/30 hover:shadow-emerald-600/40 hover:scale-102 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>پرداخت بیعانه و ثبت قطعی نوبت ({DEPOSIT_AMOUNT})</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================
          بخش سوم — «وضعیت نوبت و پیامک‌ها»
          ======================================================== */}
      {activeStep === 3 && (
        <div className="bg-white/85 backdrop-blur-xl rounded-3xl p-6 sm:p-9 border border-white/60 shadow-sm space-y-9 animate-fadeIn ring-1 ring-slate-900/5">
          
          {/* هدر بخش ۳ */}
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-700 mx-auto flex items-center justify-center shadow-inner border border-emerald-200/60">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              وضعیت نوبت رزروشده و پیامک تایید
            </h2>
            <p className="text-xs text-slate-500 font-light">
              نوبت حضور شما در سیستم اتوماسیون مطب با موفقیت ثبت قطعی گردید.
            </p>
          </div>

          {/* ۱. کارت تأیید نوبت رزروشده — کارت الکترونیک لوکس با افکت شیشه‌ای تیره */}
          <div className="max-w-3xl mx-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl p-7 sm:p-9 shadow-2xl border border-slate-800/80 relative overflow-hidden backdrop-blur-xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* نوار سربرگ کارت */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5 mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25 border border-emerald-400/30">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-white">مطب دکتر معتقدی</h3>
                  <p className="text-[11px] text-emerald-400 font-light">کارت الکترونیک پذیرش و ویزیت جراحی بینی</p>
                </div>
              </div>

              {/* نشان سبز وضعیت قطعی */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-xs backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>وضعیت: قطعی</span>
                </span>
              </div>
            </div>

            {/* گرید اطلاعات کلیدی نوبت */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs relative z-10">
              <div className="space-y-1">
                <span className="text-slate-400 text-[11px]">نام بیمار:</span>
                <p className="font-bold text-white text-sm">{user.name || 'سارا رضایی'}</p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 text-[11px]">تاریخ شمسی ویزیت:</span>
                <p className="font-bold text-white text-sm">{confirmedApt.date}</p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 text-[11px]">ساعت دقیق حضور:</span>
                <p className="font-bold text-emerald-400 font-mono text-base">
                  ساعت {confirmedApt.time}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 text-[11px]">کد پیگیری نوبت:</span>
                <p className="font-bold text-emerald-300 font-mono text-sm tracking-wider">
                  {confirmedApt.trackingCode}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 text-[11px]">مبلغ بیعانه پرداخت‌شده:</span>
                <p className="font-bold text-emerald-400 font-mono text-sm">
                  {confirmedApt.depositPaid}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 text-[11px]">نوع ساختار تریاژ:</span>
                <p className="font-bold text-white text-xs">{confirmedApt.noseType}</p>
              </div>
            </div>

            {/* نشانی در انتهای کارت */}
            <div className="mt-6 pt-4 border-t border-white/10 flex items-start gap-2.5 text-xs text-slate-300 relative z-10 font-light">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{LOCATION_DATA.address}</span>
            </div>
          </div>

          {/* ۲. باکس به شکل حباب پیامک گوشی با متن پیامک تأیید نمونه */}
          <div className="max-w-2xl mx-auto space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>شبیه‌ساز پیامک تایید ارسال‌شده به تلفن همراه بیمار:</span>
              </h3>
              <button
                type="button"
                onClick={handleCopySms}
                className="text-[11px] text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-2xl border border-emerald-200/80 transition-all duration-300 active:scale-95 flex items-center gap-1 font-semibold cursor-pointer shadow-2xs"
              >
                {copiedSms ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSms ? 'کپی شد' : 'کپی پیامک'}</span>
              </button>
            </div>

            {/* حباب پیامک تلفن همراه (Smartphone Bubble) با افکت شیشه‌ای */}
            <div className="bg-slate-100/80 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-inner">
              <div className="max-w-lg bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-3xl rounded-tr-xs p-5 sm:p-6 shadow-xl space-y-3 mr-auto text-xs leading-relaxed relative">
                
                {/* هدر حباب پیامک */}
                <div className="flex items-center justify-between border-b border-emerald-500/60 pb-2.5 text-[11px] text-emerald-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
                    <span className="font-bold text-white">پیامک از: مطب دکتر معتقدی</span>
                  </div>
                  <span className="font-mono text-[10px] opacity-80">هم‌اکنون</span>
                </div>

                {/* متن پیامک تایید */}
                <div className="space-y-2 whitespace-pre-line text-emerald-50 font-light">
                  <p className="font-semibold text-white">
                    {user.name || 'سارا رضایی'} گرامی،
                  </p>
                  <p>
                    نوبت مشاوره و معاینه شما در مطب دکتر معتقدی با موفقیت ثبت قطعی شد.
                  </p>
                  
                  <div className="bg-emerald-800/50 backdrop-blur-xs rounded-2xl p-3.5 space-y-1 font-mono text-[11px] border border-emerald-400/20">
                    <p>🗓 تاریخ: {confirmedApt.date}</p>
                    <p>⏰ ساعت حضور: {confirmedApt.time}</p>
                    <p>🔑 کد پیگیری: {confirmedApt.trackingCode}</p>
                    <p>💳 بیعانه: {confirmedApt.depositPaid}</p>
                    <p className="font-sans pt-1">📍 نشانی: {LOCATION_DATA.address}</p>
                  </div>

                  <p className="text-[11px] opacity-90">
                    لطفاً ۱۵ دقیقه قبل از زمان مقرر با مدارک پزشکی در مطب حضور یابید.
                  </p>
                </div>

                {/* دم حباب پیامک */}
                <div className="text-left text-[10px] text-emerald-200 flex items-center justify-end gap-1 pt-1">
                  <span>تحویل داده شد</span>
                  <Check className="w-3 h-3 text-emerald-200" />
                </div>
              </div>
            </div>
          </div>

          {/* ۳. نقشه کوچک / لوکیشن مطب و دکمه «مسیریابی» با استایل شیشه‌ای */}
          <div className="max-w-2xl mx-auto bg-white/85 backdrop-blur-md rounded-3xl border border-white/60 p-5 sm:p-6 shadow-sm space-y-4 ring-1 ring-slate-900/5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>موقعیت مکانی و راهنمای دسترسی مطب</span>
              </h3>
              <span className="text-[11px] text-slate-500 font-light">برج پزشکی آراد، طبقه ۴</span>
            </div>

            {/* مینی مپ با قاب شکیل */}
            <div className="rounded-2xl overflow-hidden border border-slate-200/90 aspect-16/7 relative shadow-inner">
              <iframe
                title="موقعیت مطب دکتر معتقدی"
                src={LOCATION_DATA.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-slate-200 text-xs flex items-center gap-2 pointer-events-none">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-bold text-slate-800 text-[11px]">مطب دکتر معتقدی (آراد)</span>
              </div>
            </div>

            {/* اطلاعات متنی و دکمه‌های مسیریابی */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
              <div className="text-xs text-slate-600 space-y-1">
                <p className="font-medium text-slate-800">{LOCATION_DATA.address}</p>
                <p className="text-[11px] text-slate-400 font-light">{LOCATION_DATA.accessTips}</p>
              </div>

              {/* دکمه‌های مسیریابی با افکت هاور و اکتیو */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {LOCATION_DATA.navigationApps.map((app, idx) => (
                  <a
                    key={idx}
                    href={app.link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 sm:flex-none text-center px-4 py-2.5 rounded-2xl text-xs font-bold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/90 transition-all duration-300 active:scale-95 flex items-center justify-center gap-1.5 shadow-2xs hover:shadow-md cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{app.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ۴. دکمه «ثبت نوبت جدید» برای ریست کردن جریان دمو */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={resetDemoFlow}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-emerald-400 group-hover:-rotate-90 transition-transform duration-300" />
              <span>ثبت نوبت جدید (شروع مجدد جریان دمو)</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-slate-200/90 hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-2xs hover:shadow-sm"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>چاپ کارت نوبت</span>
            </button>
          </div>

        </div>
      )}

      {/* ========================================================
          ۴. مودال شبیه‌سازی درگاه پرداخت بانکی شاپرک با افکت شیشه‌ای
          ======================================================== */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
          <div className="bg-white/95 backdrop-blur-2xl rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-white/50 space-y-6 text-center ring-1 ring-slate-900/10">
            
            {/* سربرگ شاپرک */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-emerald-600/30">
                  شاپرک
                </div>
                <span className="text-xs font-bold text-slate-800">سامانه جامع پرداخت الکترونیک</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">SSL 256-bit</span>
            </div>

            {/* حالت ۱: لودینگ پردازش و اعتبارسنجی (حدود ۲ ثانیه) */}
            {paymentPhase === 'loading' && (
              <div className="space-y-5 py-4">
                <div className="relative w-16 h-16 mx-auto">
                  <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-emerald-600 animate-spin" />
                  <CreditCard className="w-6 h-6 text-emerald-600 absolute inset-0 m-auto" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">
                    در حال اتصال امن به درگاه و ثبت بیعانه...
                  </h3>
                  <p className="text-xs text-slate-500 font-light">
                    لطفاً شکیبا باشید، اطلاعات رزرو در حال تأیید بانکی است.
                  </p>
                </div>

                <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-600">مبلغ ودیعه نوبت:</span>
                  <span className="font-bold text-emerald-700 font-mono text-sm">{DEPOSIT_AMOUNT}</span>
                </div>
              </div>
            )}

            {/* حالت ۲: پرداخت موفق و نمایش کد پیگیری */}
            {paymentPhase === 'success' && (
              <div className="space-y-4 py-2 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center scale-110 transition-transform shadow-md shadow-emerald-500/20">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-extrabold text-emerald-800">
                    پرداخت بیعانه با موفقیت انجام شد
                  </h3>
                  <p className="text-xs text-slate-500 font-light">
                    نوبت معاینه شما در سیستم مطب قطعی گردید.
                  </p>
                </div>

                <div className="bg-emerald-50/80 border border-emerald-200/80 p-3.5 rounded-2xl text-xs space-y-1 shadow-2xs">
                  <span className="text-slate-500">کد پیگیری تراکنش بانکی:</span>
                  <p className="font-mono font-bold text-slate-800 text-sm tracking-wider">
                    {trackingCode}
                  </p>
                </div>

                <p className="text-[11px] text-emerald-700 font-medium animate-pulse">
                  در حال انتقال به صفحه صدور کارت نوبت...
                </p>
              </div>
            )}

            <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1.5 pt-2 font-light">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>محیط شبیه‌سازی‌شده امن مطب مجازی</span>
            </div>

          </div>
        </div>
      )}

      {/* ویجت شناور ربات تلگرام به منشی */}
      <TelegramBotWidget />

    </div>
  );
}

