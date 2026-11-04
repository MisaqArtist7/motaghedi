'use client';

import React, { useState, useEffect } from 'react';
import { useClinic } from '../context/ClinicContext';
import { 
  Send, 
  X, 
  Bot, 
  CheckCheck, 
  Sparkles
} from 'lucide-react';

export default function TelegramBotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useClinic();
  const [currentTime, setCurrentTime] = useState('۱۴:۳۰');

  useEffect(() => {
    setCurrentTime(
      new Intl.DateTimeFormat('fa-IR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }).format(new Date())
    );
  }, []);

  const triage = user?.triageData || {};
  const photos = triage.photos || {};
  const appointment = user?.confirmedAppointment;

  return (
    <>
      {/* دکمه شناور در گوشه پایین چپ */}
      <div className="fixed bottom-6 left-6 z-40">
        <div className="relative group">
          
          {/* تولتیپ هاور */}
          <div className="absolute bottom-full left-0 mb-3 hidden group-hover:flex items-center gap-1.5 bg-slate-900/95 text-white text-[11px] font-medium px-3 py-1.5 rounded-xl shadow-xl whitespace-nowrap pointer-events-none backdrop-blur-sm border border-slate-700 animate-fadeIn">
            <span>ارسال خودکار به تلگرام منشی مطب</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#2AABEE]" />
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#229ED9] to-[#2AABEE] hover:from-[#1b8bc2] hover:to-[#229ED9] text-white shadow-2xl shadow-[#2AABEE]/40 hover:shadow-[#2AABEE]/60 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 border-2 border-white/90 backdrop-blur-md cursor-pointer"
            aria-label="اعلان تلگرام منشی"
          >
            {isOpen ? (
              <X className="w-6 h-6 stroke-[2.5]" />
            ) : (
              <Send className="w-6 h-6 -translate-x-0.5 translate-y-0.5 fill-current" />
            )}

            {/* نشانگر اعلان جدید (Badge) */}
            <span className="absolute -top-1 -right-1 flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-rose-500 text-white text-[10px] font-bold items-center justify-center border-2 border-white">
                ۱
              </span>
            </span>
          </button>
        </div>
      </div>

      {/* پاپ‌آپ شبیه چت تلگرام با افکت شیشه‌ای */}
      {isOpen && (
        <div className="fixed bottom-24 left-4 sm:left-6 z-50 w-[92vw] sm:w-[390px] max-w-[420px] bg-slate-100/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden ring-1 ring-slate-900/10 animate-slideUp font-sans">
          
          {/* هدر تلگرام */}
          <div className="bg-[#242F3D]/95 backdrop-blur-md text-white p-3.5 flex items-center justify-between border-b border-slate-700/80">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#2AABEE] to-teal-400 flex items-center justify-center text-white shadow-sm">
                <Bot className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold">ربات پذیرش مطب دکتر معتقدی</h4>
                  <span className="bg-[#2AABEE] text-[9px] font-mono px-1 rounded text-white">BOT</span>
                </div>
                <p className="text-[10px] text-slate-300">اتوماسیون پیام به تلگرام منشی</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/60 transition-all active:scale-95 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* بدنه چت تلگرام */}
          <div className="p-3.5 space-y-3 bg-[#0E1621]/5 max-h-[480px] overflow-y-auto">
            
            {/* برچسب تاریخ تلگرام */}
            <div className="flex justify-center">
              <span className="bg-slate-200/90 backdrop-blur-xs text-slate-600 text-[10px] font-semibold px-3 py-0.5 rounded-full shadow-2xs">
                امروز
              </span>
            </div>

            {/* حباب پیام تلگرام منشی */}
            <div className="bg-white/95 backdrop-blur-md rounded-2xl rounded-tr-xs p-4 shadow-sm border border-slate-200/80 space-y-3 text-xs text-slate-800 leading-relaxed text-right">
              
              {/* سربرگ پیام تلگرام */}
              <div className="border-b border-slate-100 pb-2">
                <p className="font-extrabold text-[#229ED9] text-[13px] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#2AABEE]" />
                  <span>#گزارش_تریاژ_و_نوبت_جدید</span>
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  ارسال‌شده توسط بات وب‌سایت به کانال اختصاصی پذیرش مطب
                </p>
              </div>

              {/* مشخصات بیمار و سوابق */}
              <div className="space-y-1.5 text-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">👤 نام بیمار:</span>
                  <strong className="text-slate-900">{user.name || 'سارا رضایی'}</strong>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">📱 شماره همراه:</span>
                  <span dir="ltr" className="font-mono font-bold text-slate-800">
                    {user.phone || '۰۹۱۲۳۴۵۶۷۸۹'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">📋 شماره پرونده:</span>
                  <span className="font-mono text-emerald-700 font-semibold text-[11px]">
                    {user.fileNumber || 'NOSE-10492'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">🩺 نوع ساختار بینی:</span>
                  <span className="font-semibold text-slate-800">
                    {triage.noseType || <span className="text-amber-600">هنوز ثبت نشده</span>}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">⚠️ سابقه شکستگی:</span>
                  <span className="font-medium">
                    {triage.hasFracture ? 'بله، سابقه شکستگی دارد' : 'خیر'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">💊 سابقه حساسیت:</span>
                  <span className="font-medium">
                    {triage.hasAllergy 
                      ? (triage.allergyDescription || 'دارای حساسیت (توضیح ثبت نشده)') 
                      : 'خیر'}
                  </span>
                </div>
              </div>

              {/* اطلاعات نوبت و بیعانه */}
              <div className="p-2.5 bg-emerald-50/70 border border-emerald-100 rounded-xl space-y-1 text-slate-800">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">🗓 تاریخ و ساعت نوبت:</span>
                  {appointment ? (
                    <strong className="text-emerald-900">
                      {appointment.date} — {appointment.time}
                    </strong>
                  ) : (
                    <span className="text-amber-600 font-medium">هنوز نوبت ثبت نشده</span>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">💳 وضعیت بیعانه:</span>
                  {appointment ? (
                    <strong className="text-emerald-700 font-mono">
                      {appointment.depositPaid || '۵۰۰,۰۰۰ تومان'} (تایید شاپرک)
                    </strong>
                  ) : (
                    <span className="text-amber-600 font-medium">هنوز پرداخت نشده</span>
                  )}
                </div>

                {appointment?.trackingCode && (
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                    <span>کد رهگیری:</span>
                    <span className="font-mono text-slate-700">{appointment.trackingCode}</span>
                  </div>
                )}
              </div>

              {/* پیش‌نمایش سه عکس آپلودشده */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-slate-600 block">
                  📸 تصاویر تریاژ ارسالی بیمار (۳ زاویه):
                </span>

                <div className="grid grid-cols-3 gap-2">
                  {/* عکس روبرو */}
                  <div className="aspect-4/5 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex flex-col items-center justify-center relative">
                    {photos.frontal ? (
                      <img src={photos.frontal} alt="روبرو" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[9px] text-slate-400 text-center px-1">روبرو: هنوز ثبت نشده</span>
                    )}
                    <span className="absolute bottom-0 inset-x-0 bg-slate-900/70 text-white text-[8px] text-center py-0.5">
                      روبرو
                    </span>
                  </div>

                  {/* عکس نیمرخ */}
                  <div className="aspect-4/5 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex flex-col items-center justify-center relative">
                    {photos.rightProfile ? (
                      <img src={photos.rightProfile} alt="نیمرخ" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[9px] text-slate-400 text-center px-1">نیمرخ: هنوز ثبت نشده</span>
                    )}
                    <span className="absolute bottom-0 inset-x-0 bg-slate-900/70 text-white text-[8px] text-center py-0.5">
                      نیمرخ
                    </span>
                  </div>

                  {/* عکس زیرین */}
                  <div className="aspect-4/5 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex flex-col items-center justify-center relative">
                    {photos.basal ? (
                      <img src={photos.basal} alt="زیرین" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[9px] text-slate-400 text-center px-1">زیرین: هنوز ثبت نشده</span>
                    )}
                    <span className="absolute bottom-0 inset-x-0 bg-slate-900/70 text-white text-[8px] text-center py-0.5">
                      زیرین
                    </span>
                  </div>
                </div>
              </div>

              {/* فوتر حباب پیام تلگرام با ساعت و تیک دوگانه */}
              <div className="flex items-center justify-end gap-1 pt-1 text-[10px] text-slate-400 border-t border-slate-100">
                <span className="font-mono">{currentTime}</span>
                <CheckCheck className="w-3.5 h-3.5 text-[#2AABEE]" />
              </div>

            </div>

          </div>

          {/* نوار پایین پاپ‌آپ تلگرام */}
          <div className="bg-[#242F3D] text-slate-300 p-2.5 text-center text-[10px] flex items-center justify-between border-t border-slate-700">
            <span className="flex items-center gap-1 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>وضعیت وب‌هوک ربات: متصل</span>
            </span>
            <span className="text-[#2AABEE] font-mono">@DrMotaghedi_Bot</span>
          </div>

        </div>
      )}
    </>
  );
}
