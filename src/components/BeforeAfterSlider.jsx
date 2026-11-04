'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  alt = 'مقایسه قبل و بعد جراحی بینی',
  initialPosition = 36, // قرارگیری پیش‌فرض خط در سمت چپ (نمایش ۷۲٪ عکس بعد از عمل)
}) {
  const [sliderPosition, setSliderPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = useCallback(
    (e) => {
      if (!isDragging) return;
      if (e.touches && e.touches[0]) {
        handleMove(e.touches[0].clientX);
      }
    },
    [isDragging, handleMove]
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  const handleStart = (clientX) => {
    setIsDragging(true);
    handleMove(clientX);
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={(e) => handleStart(e.clientX)}
      onTouchStart={(e) => e.touches && e.touches[0] && handleStart(e.touches[0].clientX)}
      className="relative w-full aspect-[4/5] overflow-hidden select-none cursor-ew-resize rounded-2xl bg-slate-950 group shadow-xl"
      dir="ltr"
    >
      {/* تصویر بعد از عمل (پس‌زمینه کامل و واضح) */}
      <img
        src={afterImage}
        alt={`${alt} - بعد از عمل`}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
        loading="lazy"
      />

      {/* تصویر قبل از عمل (برش‌خورده در سمت چپ) */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none"
        style={{
          clipPath: `polygon(0% 0%, ${sliderPosition}% 0%, ${sliderPosition}% 100%, 0% 100%)`,
        }}
      >
        <img
          src={beforeImage}
          alt={`${alt} - قبل از عمل`}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* برچسب‌های قبل و بعد */}
      <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-lg border border-white/10 pointer-events-none z-20 shadow-md">
        قبل از عمل
      </div>
      <div className="absolute top-3 right-3 bg-emerald-950/90 backdrop-blur-md text-emerald-300 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-emerald-500/30 pointer-events-none z-20 shadow-md">
        نتیجه (بعد)
      </div>

      {/* خط جداکننده و نشانگر درگ */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white/90 shadow-[0_0_12px_rgba(20,184,166,0.9),0_0_4px_rgba(255,255,255,1)] z-30 pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      >
        {/* دکمه مرکزی درگ */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white text-slate-800 shadow-2xl border-2 border-emerald-600 flex items-center justify-center pointer-events-none transition-transform duration-150 ${
            isDragging
              ? 'scale-110 ring-4 ring-emerald-500/40 shadow-emerald-500/30'
              : 'group-hover:scale-105'
          }`}
        >
          <svg
            className="w-4 h-4 text-emerald-700"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
      </div>

      {/* راهنمای شناور پایین تصویر */}
      <div className="absolute bottom-3 inset-x-0 flex justify-center pointer-events-none z-20 opacity-85 group-hover:opacity-100 transition-opacity">
        <span className="text-[11px] bg-slate-950/85 text-emerald-300 font-medium px-3 py-1 rounded-full backdrop-blur-md border border-emerald-500/30 shadow-sm flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>برای مقایسه قبل و بعد اسلایدر را بکشید</span>
        </span>
      </div>
    </div>
  );
}