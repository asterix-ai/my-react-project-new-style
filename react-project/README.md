# السفاريت للاسماك الطازجة - React Project

هذا هو مشروع React كامل لمحل أسماك \"السفاريت للاسماك الطازجة\"، مع دعم إدارة المنتجات (إضافة، عرض، تعديل، حذف) وميزات احترافية مثل Firebase للـ Authentication و Firestore لإدارة البيانات.

## الميزات:
- **إدارة المنتجات:** إضافة، عرض، تعديل، وحذف منتجات الأسماك الطازجة.
- **المصادقة (Authentication):** تسجيل الدخول وتسجيل حسابات جديدة باستخدام Firebase Auth.
- **الوضع الداكن (Dark Mode):** دعم الوضع الداكن لتجربة مستخدم مريحة.
- **واجهة مستخدم عصرية:** تصميم جذاب باستخدام Tailwind CSS وألوان عصرية.
- **الرسوم المتحركة (Animations):** استخدام Framer Motion لإضافة حركات سلسة وجمالية.
- **الأيقونات:** أيقونات جميلة ومتجاوبة باستخدام Lucide React.
- **الإشعارات:** نظام إشعارات سهل الاستخدام عبر React Hot Toast.
- **تحميل مرئي:** مؤشرات تحميل جذابة باستخدام React Spinners.
- **التجاوب:** تصميم متجاوب يعمل بسلاسة على جميع أحجام الشاشات.
- **عزل البيانات:** استخدام معرّف المشروع (Tenant ID) لعزل بيانات Firestore و Storage لضمان أمان البيانات بين المشاريع المختلفة.

## البدء (Getting Started):

### 1. المتطلبات الأساسية:
- Node.js (v14 أو أحدث)
- npm أو Yarn

### 2. تثبيت المشروع:
أولاً، استنسخ المستودع (clone the repository):
bash
git clone <your-repository-url>
cd react-project


ثم، قم بتثبيت التبعيات (dependencies):
bash
npm install
# أو
yarn install


### 3. إعداد Firebase:
هذا المشروع يستخدم Firebase لإدارة المصادقة والبيانات. ستحتاج إلى إعداد مشروع Firebase الخاص بك:

1.  انتقل إلى [Firebase Console](https://console.firebase.google.com/) وأنشئ مشروعًا جديدًا.
2.  أضف تطبيق ويب لمشروعك وانسخ إعدادات التهيئة (config).
3.  أنشئ ملف `.env` في جذر المشروع (react-project/) وأضف متغيرات البيئة التالية (استبدل القيم بقيم مشروعك):
    env
    REACT_APP_FIREBASE_API_KEY=\"YOUR_API_KEY\"
    REACT_APP_FIREBASE_AUTH_DOMAIN=\"YOUR_AUTH_DOMAIN\"
    REACT_APP_FIREBASE_PROJECT_ID=\"YOUR_PROJECT_ID\"
    REACT_APP_FIREBASE_STORAGE_BUCKET=\"YOUR_STORAGE_BUCKET\"
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID=\"YOUR_MESSAGING_SENDER_ID\"
    REACT_APP_FIREBASE_APP_ID=\"YOUR_APP_ID\"
    REACT_APP_FIREBASE_MEASUREMENT_ID=\"YOUR_MEASUREMENT_ID\"
    

### 4. قواعد Firestore لعزل البيانات:
لضمان عزل البيانات بين المشاريع، يُنصح بتطبيق قواعد Firestore التالية:

firestore
rules
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write to project-specific data if the user is a member of that project
    match /projects/{projectId}/{document=**} {
      allow read, write: if request.auth != null && get(/databases/$(database)/documents/projects/$(projectId)/members/$(request.auth.uid)).data.roles.hasAny(['owner', 'admin', 'member']);
    }

    // Allow users to create their own member profile upon sign-up
    match /projects/{projectId}/members/{userId} {
        allow create: if request.auth.uid == userId;
        allow read, update, delete: if request.auth.uid == userId;
    }
  }
}


### 5. تشغيل المشروع:
bash
npm start
# أو
yarn start

سيتم فتح المشروع في متصفحك الافتراضي على `http://localhost:3000`.

## هيكل المشروع:


react-project/
├── public/             # ملفات عامة (مثل index.html و manifest.json)
├── src/                # كود التطبيق الأساسي
│   ├── assets/         # صور وأيقونات إضافية
│   ├── components/     # مكونات React قابلة لإعادة الاستخدام
│   ├── contexts/       # سياقات React (مثل FirebaseContext)
│   ├── hooks/          # خطاطيف React مخصصة
│   ├── pages/          # مكونات الصفحات الرئيسية
│   ├── services/       # واجهات برمجة تطبيقات (API) وخدمات (مثل Firebase CRUD)
│   ├── utils/          # دوال مساعدة ومرافق
│   ├── styles/         # ملفات CSS (مثل globals.css)
│   ├── config/         # ملفات إعدادات التطبيق
│   ├── App.js          # المكون الرئيسي للتطبيق
│   ├── index.js        # نقطة الدخول الرئيسية لـ React
│   └── reportWebVitals.js # لأداء الويب
├── tailwind.config.js  # إعدادات Tailwind CSS
├── .env                # متغيرات البيئة
├── .gitignore          # الملفات التي يتجاهلها Git
├── package.json        # معلومات المشروع والتبعيات
└── README.md           # هذا الملف


## المساهمة:
إذا كنت ترغب في المساهمة في هذا المشروع، يرجى قراءة ملف `CONTRIBUTING.md` (إذا كان موجودًا) أو فتح مشكلة/طلب سحب.

---