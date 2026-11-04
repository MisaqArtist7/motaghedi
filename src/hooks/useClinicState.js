'use client';

import { useState, useEffect } from 'react';
import { INITIAL_USER } from '../data/mockData';

const STORAGE_KEY = 'rhino_clinic_user_session';

const INITIAL_TRIAGE = {
  photos: {
    frontal: null,      // عکس از روبرو
    rightProfile: null, // نیمرخ راست
    basal: null,        // نمای زیرین
  },
  noseType: 'بینی استخوانی',
  hasFracture: false,
  hasAllergy: false,
  allergyDescription: '',
};

export function useClinicState() {
  const [user, setUser] = useState({
    ...INITIAL_USER,
    triageData: INITIAL_TRIAGE,
    activeStep: 1,
  });

  const [notification, setNotification] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // بارگذاری داده‌ها از localStorage در کلاینت
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setUser({
            ...parsed,
            triageData: parsed.triageData || INITIAL_TRIAGE,
            activeStep: parsed.activeStep || 1,
          });
        }
      }
    } catch (e) {
      console.warn('localStorage read error:', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // ذخیره‌سازی تغییرات در localStorage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      }
    } catch (e) {
      console.warn('localStorage quota or error:', e);
    }
  }, [user, isInitialized]);

  const login = (phone, name = 'بیمار گرامی') => {
    const fileNumber = 'NOSE-' + Math.floor(10000 + Math.random() * 90000);
    const updated = {
      isLoggedIn: true,
      name,
      phone,
      fileNumber,
      registeredAt: new Date().toLocaleDateString('fa-IR'),
      appointments: user.appointments || [],
      triageData: user.triageData || INITIAL_TRIAGE,
      activeStep: user.activeStep || 1,
    };
    setUser(updated);
    showNotification(`خوش آمدید، پرونده دیجیتال شما فعال شد (${fileNumber})`);
    return updated;
  };

  const logout = () => {
    setUser({
      ...INITIAL_USER,
      triageData: INITIAL_TRIAGE,
      activeStep: 1,
    });
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    showNotification('شما از مطب مجازی خارج شدید.');
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type, id: Date.now() });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  const updateTriageData = (newData) => {
    setUser((prev) => ({
      ...prev,
      triageData: {
        ...(prev.triageData || INITIAL_TRIAGE),
        ...newData,
      },
    }));
  };

  const setActiveStep = (stepNumber) => {
    setUser((prev) => ({
      ...prev,
      activeStep: stepNumber,
    }));
  };

  const addAppointment = (appointmentData) => {
    const newAppointment = {
      id: 'APT-' + Date.now().toString().slice(-5),
      createdAt: new Date().toLocaleDateString('fa-IR'),
      status: 'رزرو قطعی (بیعانه پرداخت شد)',
      ...appointmentData,
    };
    setUser((prev) => ({
      ...prev,
      confirmedAppointment: newAppointment,
      appointments: [newAppointment, ...(prev.appointments || [])],
    }));
    showNotification('نوبت ویزیت شما با موفقیت رزرو و بیعانه ثبت گردید.');
    return newAppointment;
  };

  const resetDemoFlow = () => {
    setUser((prev) => ({
      ...prev,
      triageData: INITIAL_TRIAGE,
      activeStep: 1,
      confirmedAppointment: null,
    }));
    showNotification('جریان رزرو و دمو جهت بررسی مجدد از مرحله اول ریست شد.');
  };

  return {
    user,
    login,
    logout,
    updateTriageData,
    setActiveStep,
    addAppointment,
    resetDemoFlow,
    notification,
    showNotification,
    isInitialized,
  };
}
