'use client';

import React, { useRef, useState } from 'react';
import { Upload, X, RefreshCw, Check, Camera, Image as ImageIcon } from 'lucide-react';

export default function PhotoUploadBox({ 
  label, 
  hint, 
  photoUrl, 
  onPhotoChange, 
  onRemove 
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const processFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('لطفاً یک فایل تصویری معتبر (JPG یا PNG) انتخاب کنید.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // فشرده‌سازی و تغییر سایز مناسب برای کارایی سریع و ذخیره در کلاینت
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        onPhotoChange(compressedDataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <Camera className="w-3.5 h-3.5 text-emerald-600" />
          <span>{label}</span>
        </label>
        {photoUrl && (
          <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
            <Check className="w-3 h-3 text-emerald-600" />
            <span>بارگذاری شد</span>
          </span>
        )}
      </div>

      {photoUrl ? (
        /* پیش‌نمایش تصویر بارگذاری شده با دکمه‌های حذف و تعویض */
        <div className="relative aspect-4/5 w-full rounded-3xl overflow-hidden border-2 border-emerald-500/60 shadow-md group bg-slate-900">
          <img
            src={photoUrl}
            alt={label}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* اکشن بار روی پیش‌نمایش با بلور شیشه‌ای */}
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 p-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-white/95 hover:bg-white text-slate-800 text-xs font-semibold px-3.5 py-2 rounded-2xl shadow-md transition-all duration-300 active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
              <span>تعویض</span>
            </button>

            <button
              type="button"
              onClick={onRemove}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-3.5 py-2 rounded-2xl shadow-md transition-all duration-300 active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>حذف</span>
            </button>
          </div>

          <div className="absolute bottom-2.5 inset-x-2.5 bg-slate-900/80 backdrop-blur-md py-1 px-3 rounded-xl text-center text-[10px] text-slate-300 pointer-events-none border border-white/10">
            {label}
          </div>
        </div>
      ) : (
        /* کادر درگ اند دراپ و انتخاب فایل */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`aspect-4/5 w-full rounded-3xl border-2 border-dashed transition-all duration-300 cursor-pointer active:scale-98 flex flex-col items-center justify-center p-4 text-center group ${
            isDragOver
              ? 'border-emerald-500 bg-emerald-50/70 shadow-lg scale-102'
              : 'border-slate-300 hover:border-emerald-400 bg-slate-50/80 hover:bg-emerald-50/30 hover:shadow-md'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-white text-emerald-600 flex items-center justify-center shadow-sm border border-slate-200/90 group-hover:border-emerald-300 group-hover:scale-110 group-hover:shadow-emerald-500/10 transition-all duration-300 mb-3">
            <Upload className="w-5 h-5 text-emerald-600" />
          </div>

          <p className="text-xs font-bold text-slate-700 group-hover:text-emerald-800 transition-colors">
            انتخاب یا رها کردن عکس
          </p>

          <p className="text-[11px] text-slate-400 mt-1 max-w-[170px] leading-relaxed font-light">
            {hint}
          </p>

          <span className="mt-3 text-[10px] bg-slate-200/70 group-hover:bg-emerald-100/90 text-slate-600 group-hover:text-emerald-800 font-semibold px-3 py-1.5 rounded-xl transition-all duration-300 shadow-2xs">
            انتخاب فایل (JPG/PNG)
          </span>
        </div>
      )}

      {/* اینپوت مخفی فایل */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
