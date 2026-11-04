'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useClinic } from '../../context/ClinicContext';
import { 
  Sparkles, 
  Smartphone, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2, 
  RotateCcw,
  UserCheck
} from 'lucide-react';

// تبدیل اعداد فارسی به انگلیسی
const toEnglishDigits = (str) => {
  if (!str) return '';
  return str
    .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
    .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
};

export default function LoginPage() {
  const { user, login } = useClinic();
  const router = useRouter();

  // مرحله ۱ (شماره موبایل) یا مرحله ۲ (کد تایید)
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('09123456789');
  const [phoneError, setPhoneError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ۴ کادر جداگانه برای کد اعتبارسنجی
  const [otp, setOtp] = useState(['', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [isAutoFilled, setIsAutoFilled] = useState(false);
  const input0 = useRef(null);
  const input1 = useRef(null);
  const input2 = useRef(null);
  const input3 = useRef(null);
  const inputRefs = [input0, input1, input2, input3];

  // اگر کاربر قبلاً لاگین کرده باشد، امکان انتقال مستقیم به میزکار وجود دارد
  if (user?.isLoggedIn) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white/85 backdrop-blur-xl rounded-3xl p-8 border border-white/60 shadow-2xl text-center space-y-6 ring-1 ring-slate-900/5 animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-700 mx-auto flex items-center justify-center shadow-inner border border-emerald-200/60">
            <UserCheck className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900">پرونده شما در مطب فعال است</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              خوش آمدید، <span className="font-semibold text-emerald-800">{user.name}</span>
              <br />
              شماره پرونده: <strong className="font-mono text-slate-800">{user.fileNumber}</strong>
            </p>
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-emerald-600/30 active:scale-95 transition-all duration-300 ease-in-out flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>ورود به پرونده من</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // اعتبارسنجی فرمت موبایل ۰۹xxxxxxxxx
  const validatePhone = (phoneNumber) => {
    const cleaned = toEnglishDigits(phoneNumber.trim());
    const iranPhoneRegex = /^09\d{9}$/;
    return iranPhoneRegex.test(cleaned);
  };

  // ارسال کد تایید و ورود به مرحله ۲
  const handleSendCode = (e) => {
    e.preventDefault();
    setPhoneError('');

    const englishPhone = toEnglishDigits(phone.trim());
    if (!validatePhone(englishPhone)) {
      setPhoneError('لطفاً شماره موبایل ۱۱ رقمی معتبر با فرمت ۰۹xxxxxxxxx وارد کنید.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(2);

      // شبیه‌سازی دریافت پیامک و پر شدن خودکار بعد از ۱ ثانیه
      setTimeout(() => {
        setOtp(['1', '2', '3', '4']);
        setIsAutoFilled(true);
      }, 1000);
    }, 400);
  };

  // تغییر مقادیر کادرهای ۴ رقمی و انتقال خودکار فوکوس
  const handleOtpChange = (index, value) => {
    const rawVal = toEnglishDigits(value);
    const lastChar = rawVal.slice(-1);

    if (rawVal && !/^\d+$/.test(rawVal)) return;

    if (otpError) setOtpError('');

    const newOtp = [...otp];
    newOtp[index] = lastChar;
    setOtp(newOtp);

    // انتقال خودکار فوکوس به کادر بعدی
    if (lastChar && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // بازگشت فوکوس به کادر قبلی در صورت فشردن Backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    if (otpError) setOtpError('');
    const pasteData = toEnglishDigits(e.clipboardData.getData('text')).replace(/\D/g, '').slice(0, 4);
    if (pasteData) {
      const newOtp = [...otp];
      for (let i = 0; i < pasteData.length; i++) {
        newOtp[i] = pasteData[i];
      }
      setOtp(newOtp);
      const nextIndex = Math.min(pasteData.length, 3);
      inputRefs[nextIndex].current?.focus();
    }
  };

  // تایید کد و ورود نهایی به /dashboard
  const handleFinalLogin = (e) => {
    e.preventDefault();
    setOtpError('');
    const enteredCode = otp.join('');

    if (enteredCode.length < 4) {
      setOtpError('لطفاً کد تایید ۴ رقمی را به طور کامل وارد کنید.');
      return;
    }

    if (enteredCode !== '1234') {
      setOtpError('کد وارد شده نادرست است. لطفاً کد تایید تست (۱۲۳۴) را وارد کنید.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const cleanPhone = toEnglishDigits(phone.trim());
      login(cleanPhone, 'بیمار گرامی');
      setIsSubmitting(false);
      router.push('/dashboard');
    }, 400);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 relative">
      
      {/* باکس لاگین در وسط صفحه با افکت بلور شیشه‌ای و حاشیه شفاف */}
      <div className="max-w-md w-full bg-white/85 backdrop-blur-xl rounded-3xl p-8 sm:p-10 border border-white/60 shadow-2xl space-y-7 relative ring-1 ring-slate-900/5">
        
        {/* هدر باکس لاگین */}
        <div className="text-center space-y-2">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/25 border border-emerald-400/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            ورود به مطب مجازی
          </h1>
          <p className="text-xs text-slate-500 font-light">
            مشاهده پرونده پزشکی، ثبت نوبت و ارسال تصاویر
          </p>
        </div>

        {/* مرحله ۱: فیلد شماره موبایل */}
        {step === 1 && (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                شماره تلفن همراه
              </label>
              <div className="relative">
                <input
                  type="tel"
                  dir="ltr"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (phoneError) setPhoneError('');
                  }}
                  placeholder="09xxxxxxxxx"
                  className={`w-full pl-3 pr-10 py-3.5 bg-slate-50/80 backdrop-blur-xs border rounded-2xl text-sm font-mono text-right transition-all duration-200 focus:outline-none focus:bg-white shadow-2xs ${
                    phoneError 
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10' 
                      : 'border-slate-200/90 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10'
                  }`}
                  autoFocus
                />
                <Smartphone className="w-4 h-4 text-slate-400 absolute right-3.5 top-4" />
              </div>

              {phoneError ? (
                <p className="text-[11px] text-rose-500 mt-1.5 font-medium leading-relaxed">
                  {phoneError}
                </p>
              ) : (
                <p className="text-[11px] text-slate-400 mt-1.5 font-light">
                  کد ورود به صورت پیامک برای این شماره ارسال خواهد شد.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 active:scale-95 transition-all duration-300 ease-in-out flex items-center justify-center gap-2 text-sm mt-3 cursor-pointer"
            >
              {isSubmitting ? (
                <span className="text-xs">در حال ارسال کد...</span>
              ) : (
                <>
                  <span>ارسال کد تایید</span>
                  <ArrowLeft className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* مرحله ۲: فیلد ۴ رقمی با انتقال خودکار فوکوس */}
        {step === 2 && (
          <form onSubmit={handleFinalLogin} className="space-y-5">
            
            {/* راهنمای کوچک کد تست */}
            <div className="bg-emerald-50/80 backdrop-blur-xs border border-emerald-200/90 p-3.5 rounded-2xl flex items-center justify-between text-xs shadow-2xs">
              <div className="space-y-0.5">
                <span className="text-slate-600 font-medium">کد تایید پیامکی:</span>
                <p className="font-bold text-emerald-800 text-xs">
                  کد تست: <strong className="font-mono text-sm tracking-wider">۱۲۳۴</strong>
                </p>
              </div>
              <span className="text-[10px] bg-emerald-200/70 text-emerald-900 font-semibold px-2 py-1 rounded-lg border border-emerald-300/40">
                {isAutoFilled ? 'تکمیل خودکار شد' : 'ارسال شد'}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-3 text-center">
                کد ۴ رقمی ارسال‌شده به شماره <span className="font-mono text-emerald-700 font-bold">{phone}</span> را وارد کنید:
              </label>

              {/* چهار کادر مجزا با سایز و استایل مدرن */}
              <div className="flex items-center justify-center gap-3" dir="ltr" onPaste={handlePaste}>
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={inputRefs[idx]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className={`w-14 h-16 text-center text-2xl font-bold font-mono bg-slate-50/90 backdrop-blur-xs border rounded-2xl focus:outline-none focus:bg-white focus:ring-4 transition-all duration-200 shadow-2xs ${
                      otpError
                        ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/15'
                        : 'border-slate-300/90 focus:border-emerald-600 focus:ring-emerald-500/15'
                    }`}
                  />
                ))}
              </div>

              {otpError && (
                <p className="text-[11px] text-rose-500 text-center mt-2.5 font-semibold leading-relaxed animate-fadeIn">
                  {otpError}
                </p>
              )}
            </div>

            {/* مرحله ۳: دکمه سبز «ورود به پرونده من» */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/40 active:scale-95 transition-all duration-300 ease-in-out flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              {isSubmitting ? (
                <span className="text-xs">در حال ورود به پرونده دیجیتال...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>ورود به پرونده من</span>
                </>
              )}
            </button>

            {/* تغییر شماره تلفن */}
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setOtp(['', '', '', '']);
                  setIsAutoFilled(false);
                }}
                className="text-xs text-slate-500 hover:text-emerald-700 font-medium transition-all duration-200 inline-flex items-center gap-1 cursor-pointer active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>ویرایش یا تغییر شماره موبایل</span>
              </button>
            </div>
          </form>
        )}

        {/* تضمین حریم خصوصی و امنیت */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-400 text-xs font-light">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>حفظ محرمانگی سوابق و پرونده سلامت در سرور امن</span>
        </div>

      </div>

    </div>
  );
}

