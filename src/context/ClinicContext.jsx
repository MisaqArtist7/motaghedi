'use client';

import React, { createContext, useContext } from 'react';
import { useClinicState } from '../hooks/useClinicState';

const ClinicContext = createContext(null);

export function ClinicProvider({ children }) {
  const clinicState = useClinicState();

  return (
    <ClinicContext.Provider value={clinicState}>
      {children}
      {/* Toast Notification Simulation */}
      {clinicState.notification && (
        <div className="fixed bottom-6 left-6 z-50 max-w-sm animate-bounce-subtle">
          <div className="flex items-center gap-3 bg-slate-900/95 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-emerald-500/30 backdrop-blur-md">
            <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-ping"></span>
            <p className="text-sm font-medium leading-relaxed">
              {clinicState.notification.message}
            </p>
          </div>
        </div>
      )}
    </ClinicContext.Provider>
  );
}

export function useClinic() {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error('useClinic must be used within a ClinicProvider');
  }
  return context;
}
