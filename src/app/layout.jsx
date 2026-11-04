import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ClinicProvider } from '../context/ClinicContext';

export const metadata = {
  title: 'مطب هوشمند جراحی بینی و زیبایی | دکتر معتقدی',
  description: 'سامانه هوشمند مشاوره تخصصی، شبیه‌سازی فرم بینی و نوبت‌دهی آنلاین جراحی بینی و زیبایی',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-slate-50 text-slate-800 font-sans antialiased min-h-screen selection:bg-emerald-500 selection:text-white bg-medical-dots">
        <ClinicProvider>
          <div className="min-h-screen flex flex-col bg-slate-50/70 bg-medical-dots text-slate-800 antialiased">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </ClinicProvider>
      </body>
    </html>
  );
}

