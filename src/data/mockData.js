// Mock data for Smart Rhinoplasty Clinic

export const CLINIC_INFO = {
  name: 'مطب دکتر معتقدی',
  doctorName: 'دکتر معتقدی',
  specialty: 'متخصص گوش، گلو، بینی و جراح پلاستیک بینی و صورت',
  nezamCode: '۹۸۴۳۲',
  phone: '۰۲۱-۸۸۹۹۰۰۱۱',
  emergencyPhone: '۰۹۱۲-۰۰۰-۰۰۰۰',
  telegram: '@dr_motaghedi_clinic',
  instagram: '@dr.motaghedi.rhino',
  address: 'تهران، خیابان ولیعصر، بالاتر از ظفر، برج پزشکی آراد، طبقه ۴، واحد ۱۲',
  workHours: 'شنبه تا چهارشنبه: ۱۴:۰۰ الی ۲۰:۰۰',
};

export const DOCTOR_PROFILE = {
  name: 'دکتر معتقدی',
  specialty: 'متخصص گوش، گلو، بینی و سر و گردن',
  fellowship: 'فلوشیپ فوق‌تخصصی جراحی پلاستیک بینی و صورت (رینوپلاستی)',
  nezamCode: '۹۸۴۳۲',
  image: 'Professional Corporate Headshot.png',
  bio: 'دکتر معتقدی با بیش از ۱۵ سال تجربه جراحی و تمرکز ویژه بر متد پرزرویشن (Preservation Rhinoplasty)، سبک جراحی خود را بر پایه ایجاد زیبایی طبیعی در هارمونی کامل با سایر اجزای چهره و حفظ بی‌نقص عملکرد تنفسی بنا نهاده است.',
  scientificBackground: [
    'دارای بورد تخصصی ناسیونال گوش، حلق و بینی و جراحی سر و گردن',
    'عضو رسمی آکادمی جراحان پلاستیک و زیبایی صورت آمریکا (AAFPRS)',
    'عضو انجمن راینولوژی و جراحان گوش و حلق و بینی ایران',
    'گذراندن دوره‌های تکمیلی بازسازی غضروفی و رینوپلاستی پیشرفته در میلان و استانبول',
    'بیش از ۴,۰۰۰ عمل موفق رینوپلاستی اولیه و ترمیمی با بالاترین نرخ رضایتمندی',
  ],
  partnerHospitals: [
    {
      id: 'kasra',
      name: 'بیمارستان فوق‌تخصصی کسری',
      type: 'بخش جراحی زیبایی و اتاق عمل مجهز',
      area: 'میدان آرژانتین، تهران',
    },
    {
      id: 'gandhi',
      name: 'بیمارستان تخصصی گاندی',
      type: 'هتل‌بیمارستان بین‌المللی با امکانات VIP',
      area: 'خیابان گاندی، تهران',
    },
    {
      id: 'pasteur',
      name: 'مرکز جراحی محدود پاستور نو',
      type: 'کلینیک جراحی روزانه با استانداردهای مدرن',
      area: 'خیابان ولیعصر، تهران',
    },
  ],
};

export const SURGICAL_STYLES = [
  {
    id: 'natural',
    title: 'جراحی بینی طبیعی (Natural)',
    slug: 'طبیعی',
    summary: 'طراحی فرم متناسب با تناسبات اختصاصی چهره، بدون قوس افراطی یا سربالا شدن غیرطبیعی نوک بینی، با حفظ سلامت و مجرای تنفسی.',
    features: ['حفظ زاویه نرمال لب و بینی (۹۵ تا ۱۰۰ درجه)', 'پل صاف و عدم ایجاد شیب مصنوعی', 'مناسب برای متقاضیان ظاهر شیک و دست‌نخورده'],
  },
  {
    id: 'bony',
    title: 'جراحی بینی استخوانی (Bony)',
    slug: 'استخوانی',
    summary: 'اصلاح قوز اسکلتی و ناهمواری‌های تیغه با ابزارهای ظریف پیزوسرجری (اولتراسونیک) با حداقل خونریزی، کبودی و دوره نقاهت کوتاه.',
    features: ['تراش میکروسکوپیک استخوان با دقت میلی‌متری', 'باریک‌سازی قوس پشت بینی با حفظ استحکام', 'تقارن خطوط دورسال بینی در نمای تمام‌رخ'],
  },
  {
    id: 'fleshy',
    title: 'جراحی بینی گوشتی (Fleshy)',
    slug: 'گوشتی',
    summary: 'استحکام‌بخشی اسکلت غضروفی نوک بینی و کاهش ظریف بافت چربی زیرپوست، بدون خطر افتادگی یا بازگشت فرم نوک بینی در گذر زمان.',
    features: ['استفاده از گرافت‌های غضروفی مقاوم خودی', 'شکل‌دهی پره‌ها متناسب با زاویه لب و چانه', 'کنترل تورم پوست ضخیم با پروتکل تخصصی بعد از عمل'],
  },
  {
    id: 'revision',
    title: 'جراحی ترمیمی بینی (Revision)',
    slug: 'ترمیمی',
    summary: 'اصلاح نقایص ساختاری و انحرافات ناشی از جراحی‌های ناموفق قبلی، بازسازی حمایت غضروفی و گشایش مسیرهای مسدود تنفسی.',
    features: ['پیوند غضروف گوش یا دنده در صورت کمبود غضروف', 'برطرف کردن کجی و فرورفتگی‌های پره‌ها', 'بهبود تنفس همزمان با بازسازی تقارن صورت'],
  },
];

export const LOCATION_DATA = {
  title: 'موقعیت و دسترسی مطب',
  address: 'تهران، خیابان ولیعصر، بالاتر از ظفر، برج پزشکی آراد، طبقه ۴، واحد ۱۲',
  phone: '۰۲۱-۸۸۹۹۰۰۱۱',
  consultationPhone: '۰۹۱۲-۰۰۰-۰۰۰۰',
  workingHours: 'شنبه تا چهارشنبه: ۱۴:۰۰ الی ۲۰:۰۰ (پذیرش صرفاً با تعیین وقت قبلی)',
  accessTips: 'دسترسی سریع از طریق ایستگاه BRT ظفر / پارکینگ عمومی در فاصله ۵۰ متری برج',
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3237.939886369062!2d51.41438932454518!3d35.77685672471617!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f8e06f15e87a2d7%3A0xb35a39784e868a2f!2sValiasr%20St%2C%20Tehran!5e0!3m2!1sen!2sir!4v1714000000000!5m2!1sen!2sir',
  navigationApps: [
    { name: 'نشان', link: 'https://neshan.org' },
    { name: 'بلد', link: 'https://balad.ir' },
    { name: 'گوگل مپ', link: 'https://maps.google.com' },
  ],
};

export const FOOTER_DATA = {
  copyright: 'کلیه حقوق این وب‌سایت محفوظ و متعلق به «نووا لبز» است.',
  developerName: 'نووا لبز',
  links: [
    { title: 'صفحه اصلی', path: '/' },
    { title: 'گالری قبل و بعد', path: '/gallery' },
    { title: 'ورود به مطب مجازی', path: '/login' },
    { title: 'راهنمای مراجعین', path: '#' },
  ],
};

export const INITIAL_USER = {
  isLoggedIn: false,
  name: 'کاربر مهمان',
  phone: '',
  nationalId: '',
  fileNumber: '',
  appointments: [],
  consultationStep: 0,
};

export const MOCK_GALLERY = [
  {
    id: 1,
    patientCode: 'BN-510',
    category: 'بینی استخوانی',
    title: 'رفع قوز استخوانی شدید و تنظیم زاویه نازولابیال',
    description: 'تراش میلی‌متری قوز بینی با پیزوسرجری و حفظ کامل قوام استخوان‌ها بدون شیب غیرطبیعی.',
    beforeImage: '/gallery/3.jpeg',
    afterImage: '/gallery/4.jpeg',
    timeElapsed: '۶ ماه پس از عمل',
    doctorNotes: 'رفع کامل انحراف تیغه و بهبود تنفس در خواب',
  },
  {
    id: 2,
    patientCode: 'BN-492',
    category: 'بینی استخوانی',
    title: 'باریک‌سازی تیغه استخوانی پهن و رفع کجی محور بینی',
    description: 'تراز خطوط تقارن دورسال بینی در نمای تمام‌رخ همراه با اصلاح نوک بینی با زاویه طبیعی مردانه.',
    beforeImage: '/gallery/1.jpeg',
    afterImage: '/gallery/before.jpeg',
    timeElapsed: '۹ ماه پس از عمل',
    doctorNotes: 'حفظ استقامت ستون بینی با گرافت اسپیریدر',
  },
  {
    id: 3,
    patientCode: 'FN-389',
    category: 'بینی گوشتی',
    title: 'استحکام‌بخشی نوک بینی گوشتی و جمع کردن پره‌ها',
    description: 'تقویت غضروفی با گرافت‌های کلوملار استرات خودی و کاهش بافت ضخیم زیرپوستی بدون آسیب به عروق.',
    beforeImage: '/gallery/5.jpeg',
    afterImage: '/gallery/6.jpeg',
    timeElapsed: '۱ سال پس از عمل',
    doctorNotes: 'پایداری کامل نوک بینی بدون افتادگی پس از یک سال',
  },
  {
    id: 4,
    patientCode: 'FN-404',
    category: 'بینی گوشتی',
    title: 'فرم‌دهی طبیعی به بینی پوست ضخیم و منافذ باز',
    description: 'جمع‌آوری بالچه‌های بینی (آلارپلاستی ظریف) با حفظ تقارن سوراخ‌های بینی و تنفس بدون انسداد.',
    beforeImage: '/gallery/8.jpeg',
    afterImage: '/gallery/7.jpeg',
    timeElapsed: '۸ ماه پس از عمل',
    doctorNotes: 'رعایت پروتکل تزریق کورتون موضعی جهت مهار ورم',
  },
  {
    id: 5,
    patientCode: 'RV-415',
    category: 'ترمیمی',
    title: 'ترمیم افتادگی نوک بینی و عدم تقارن عمل قبلی',
    description: 'بازسازی ساپورت از دست رفته نوک بینی با پیوند غضروف گوش و اصلاح عدم قرینگی پره‌های بینی.',
    beforeImage: '/gallery/10.jpeg',
    afterImage: '/gallery/9.jpeg',
    timeElapsed: '۱۰ ماه پس از عمل ترمیمی',
    doctorNotes: 'اصلاح کامل زاویه نازولابیال به ۹۵ درجه پایدار',
  },
  {
    id: 6,
    patientCode: 'RV-428',
    category: 'ترمیمی',
    title: 'بازسازی فرورفتگی شدید پل بینی و انسداد تنفسی',
    description: 'پیوند گرافت غضروفی دنده جهت بازسازی پل خوابیده بینی و گشاد کردن دریچه‌های مسدود تنفسی.',
    beforeImage: '/gallery/12.jpeg',
    afterImage: '/gallery/11.jpeg',
    timeElapsed: '۱ سال پس از جراحی ترمیمی',
    doctorNotes: 'بهبود ۹۰ درصدی حجم تنفس و رفع کامل فرورفتگی کلوملا',
  },
];

export const FEATURED_BEFORE_AFTER = [
  {
    id: 1,
    category: 'بینی استخوانی',
    title: 'جراحی بینی استخوانی',
    subtitle: 'سبک طبیعی',
    timeElapsed: '۶ ماه بعد از عمل',
    beforeImage: '/gallery/3.jpeg',
    afterImage: '/gallery/4.jpeg',
  },
  {
    id: 2,
    category: 'بینی گوشتی',
    title: 'جراحی بینی گوشتی با پوست ضخیم',
    subtitle: 'سبک نیمه‌فانتزی',
    timeElapsed: '۱ سال بعد از عمل',
    beforeImage: '/gallery/5.jpeg',
    afterImage: '/gallery/6.jpeg',
  },
  {
    id: 3,
    category: 'ترمیمی',
    title: 'جراحی ترمیمی بینی',
    subtitle: 'اصلاح فرم و تنفس',
    timeElapsed: '۸ ماه بعد از عمل',
    beforeImage: '/gallery/10.jpeg',
    afterImage: '/gallery/9.jpeg',
  },
];


