# 🧵 متجر خيوط نيلية | GIZA 86 - E-Commerce & CMS Architecture

[![Next.js](https://img.shields.io/badge/Next.js-16.3.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.45.2-C5F74F?style=for-the-badge&logo=drizzle)](https://orm.drizzle.team/)
[![PostgreSQL](https://img.shields.io/badge/Neon_PostgreSQL-Serverless-00E599?style=for-the-badge&logo=postgresql)](https://neon.tech/)
[![Better Auth](https://img.shields.io/badge/Better_Auth-1.7-black?style=for-the-badge)](https://www.better-auth.com/)

متجر إلكتروني متكامل للأزياء والملابس المصنوعة من القطن المصري الفاخر (تيشيرتات أوفر سايز، هوديز، قمصان كتان)، مجهز بنظام إدارة محتوى كامل (**Admin CMS**) ومصمم خصيصاً لتلبية متطلبات السوق المصري والتجارة الإلكترونية الحديثة بنظام **Next.js 16 App Router** وهندسة برمجية نظيفة (**Clean Layered Architecture**).

---

## 🏛️ النظام المعماري للبرمجية (System Architecture)

يعتمد التطبيق على مبادئ **Clean Architecture** مع فصل صارم للمسؤوليات (SoC)، مما يضمن قابلية إعادة الاستخدام (**Reusability**)، وسهولة التوسع والتحجيم السحابي (**Serverless Scalability**):

### 1. مخطط الطبقات المعمارية (Layered Architecture)

```mermaid
graph TD
    subgraph UI ["1. Presentation Layer (App Router & UI)"]
        SC["Server Components (app/page, app/products)"]
        CC["Leaf Client Components (components/store, components/admin)"]
        RH["Route Handlers (app/api/* with withAdminAuth)"]
    end

    subgraph Service ["2. Domain & Application Services Layer"]
        PS["products.service.ts"]
        OS["orders.service.ts"]
        CS["categories.service.ts"]
        CPS["coupons.service.ts"]
        SS["settings.service.ts"]
        subgraph DomainLogic ["Pure Domain Rules"]
            PR["pricing.ts (Discount, Shipping, Totals)"]
            VR["variants.ts (Effective Price, Stock, Matching)"]
            WA["whatsapp.ts (Instant WhatsApp Ordering)"]
            ERR["errors.ts (Domain Errors)"]
        end
    end

    subgraph Repo ["3. Repository Layer (Data Abstraction)"]
        IPR["IProductRepository"]
        IOR["IOrderRepository"]
        ICR["ICategoryRepository"]
        ICPR["ICouponRepository"]
        ISR["ISettingsRepository"]
    end

    subgraph Data ["4. Infrastructure & Persistence"]
        DRZ["Drizzle ORM + Neon Serverless Postgres"]
        MEM["Memory Store (Offline / Demo Fallback)"]
    end

    SC --> PS
    SC --> CS
    SC --> SS
    CC --> RH
    RH --> PS
    RH --> OS
    PS --> IPR
    OS --> IOR
    CS --> ICR
    CPS --> ICPR
    SS --> ISR
    IPR --> DRZ
    IPR --> MEM
    IOR --> DRZ
    IOR --> MEM
```

---

### 2. دورة حياة وإدارة حالة الطلب (Order State Machine)

```mermaid
stateDiagram-v2
    [*] --> new : العميل يُنشئ الطلب (Checkout)
    new --> confirmed : تأكيد الطلب
    new --> processing : قيد التجهيز
    new --> cancelled : إلغاء الطلب (استرجاع المخزون تلقائياً)
    
    confirmed --> processing : بدء تجهيز الشحنة
    confirmed --> shipped : تسليم للمندوب
    confirmed --> cancelled : إلغاء الطلب
    
    processing --> shipped : خرج للتوصيل (بوليصة الشحن)
    processing --> delivered : تم التسليم
    processing --> cancelled : إلغاء
    
    shipped --> delivered : تم التحصيل والتسليم للعميل
    shipped --> returned : مرتجع / تعذر التسليم (استرجاع المخزون)
    
    delivered --> returned : طلب استرجاع واستبدال
    delivered --> [*]
    returned --> [*]
    cancelled --> [*]
```

---

## 📂 هيكل المشروع والمجلدات (Directory Structure)

```
clothes-store/
├── src/
│   ├── app/                         # Next.js 16 App Router Routes
│   │   ├── (storefront)/            # واجهة المتجر العامة للعملاء
│   │   │   ├── page.tsx             # الصفحة الرئيسية (Server Component + JSON-LD)
│   │   │   ├── products/            # كتالوج الملابس وتفاصيل الموديل
│   │   │   ├── cart/                # سلة المشتريات
│   │   │   ├── checkout/            # إنهاء الطلب وبيانات الشحن المصرية
│   │   │   ├── track/               # تتبع حالة الشحنة بالهاتف ورقم الطلب
│   │   │   └── order-success/[id]/  # صفحة تأكيد نجاح الطلب وإيصال الدفع
│   │   ├── admin/                   # لوحة الإدارة والتحكم CMS
│   │   │   ├── page.tsx             # إحصائيات المبيعات ومؤشرات الأداء
│   │   │   ├── products/            # إدارة الموديلات والمخزون والمقاسات
│   │   │   ├── orders/              # إدارة وتحديث الشحنات وطباعة البوليصة
│   │   │   ├── categories/          # إدارة وتصنيف أقسام المتجر
│   │   │   ├── coupons/             # إدارة أكواد الخصم والعروض
│   │   │   └── settings/            # أسعار شحن الـ 27 محافظة وبيانات الدفع
│   │   └── api/                     # مسارات Route Handlers مؤمنة بـ Zod و Better-Auth
│   ├── components/
│   │   ├── store/                   # مكونات واجهة المتجر (Cards, Drawer, Checkout)
│   │   ├── admin/                   # مكونات لوحة التحكم (Tables, Modals, Stats)
│   │   └── ui/                      # مكونات التصميم الأساسية (Radix UI + Tailwind)
│   ├── db/                          # طبقة قاعدة البيانات
│   │   ├── index.ts                 # تهيئة اتصال Neon Postgres
│   │   ├── schema.ts                # تعريف جداول Drizzle مع فهارس الأداء B-Tree
│   │   └── seed-data.ts             # البيانات الأولية والتجريبية الجاهزة
│   ├── lib/
│   │   ├── domain/                  # قواعد العمل المجردة (Pricing, Variants, WhatsApp)
│   │   ├── repositories/            # طبقة المستودعات المعزولة (Drizzle vs Memory)
│   │   ├── services/                # خدمات العمليات (Facade Services)
│   │   ├── auth.ts                  # إعداد Better Auth للتحقق من المدير
│   │   ├── egypt-constants.ts       # ثوابت محافظات مصر الـ 27 وتنسيق الهاتف
│   │   └── utils.ts                 # أدوات التنسيق (formatEGP, slugify, cn)
│   └── types/                       # تعريفات وتوافق أنواع TypeScript الصارمة
```

---

## 🇪🇬 مميزات خاصة بالسوق المصري (Egyptian E-Commerce Features)

| الميزة | التفاصيل |
| :--- | :--- |
| **العملة الرسمية** | تسعير دقيق وواضح بصيغة الجنيه المصري (`ج.م` / `EGP`). |
| **تغطية الـ 27 محافظة** | حساب ديناميكي لتكلفة الشحن وزمن التوصيل حسب المحافظة المختارة. |
| **الشحن المجاني التلقائي** | تفعيل فوري عند بلوغ سلة العميل حد الشحن المجاني (قابل للتعديل من CMS). |
| **طرق الدفع المحلية** | الدفع نقدياً عند الاستلام (**COD**)، تحويلات **إنستاباي (InstaPay)** مع زر نسخ المعرف، ومحافظ **فودافون كاش**. |
| **التحقق من الهاتف المصري** | خوارزمية ذكية تفحص وتصحح أرقام الموبايل (11 رقماً تبدأ بـ `010`, `011`, `012`, `015`). |
| **الطلب السريع عبر واتساب** | رسالة مسبقة التجهيز بضغطة زر تنقل تفاصيل الموديل والمقاس ومجموع السعر للمحادثة مباشرة. |

---

## 🚀 البدء والتشغيل (Quickstart & Installation)

### 1. المتطلبات الأساسية
- تثبيت [Node.js](https://nodejs.org/) الإصدار 20 فأعلى.
- مدير الحزم [pnpm](https://pnpm.io/) (`npm i -g pnpm`).

### 2. التثبيت والتشغيل المحلي
```bash
# 1. تثبيت الاعتمادات
pnpm install

# 2. تشغيل بيئة التطوير (Turbopack)
pnpm dev
```

افتح المتصفح على:
- المتجر: [http://localhost:3000](http://localhost:3000)
- لوحة الإدارة CMS: [http://localhost:3000/admin](http://localhost:3000/admin)

> [!NOTE]
> المتجر مهيأ ليعمل تلقائياً في **وضع العرض التجريبي (Demo Mode)** بدون الحاجة لقاعدة بيانات خارجية فور استنساخ المستودع، بالاعتماد على `MemoryStore`.

---

## 🗄️ ربط قاعدة البيانات السحابية (Neon Serverless PostgreSQL)

1. أنشئ مشروعاً مجانياً على منصة [Neon.tech](https://neon.tech).
2. أنشئ ملف `.env.local` في المجلد الرئيسي وضع به الرابط:

```env
DATABASE_URL="postgresql://neondb_owner:password@ep-sample-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require"

# لوحة التحكم وإعدادات المدير
ADMIN_EMAIL="admin@giza86.com"
NEXT_PUBLIC_ADMIN_EMAIL="admin@giza86.com"
NEXT_PUBLIC_STORE_NAME="متجر خيوط نيلية | GIZA 86"
```

3. ادفع الجداول والفهارس لقاعدة البيانات مباشرة:
```bash
pnpm db:push
```

4. قم بتغذية المتجر بالموديلات والأقسام الافتراضية:
```bash
pnpm db:seed
```

5. أنشئ حساب مدير لوحة التحكم لأول مرة:
```bash
pnpm admin:create --email=admin@giza86.com --password=YourStrongPassword2026!
```

---

## 🧪 التحقق والاختبارات (Verification & Quality Gates)

لضمان سلامة الكود، يحتوي المشروع على اختبارات تلقائية وفحوصات صارمة:

```bash
# تشغيل اختبارات النطاق وقواعد التسعير وحالات الطلب (Unit Tests)
pnpm test

# فحص توافق الأنواع الكامل (TypeScript Verification)
pnpm tsc --noEmit

# بناء النسخة الإنتاجية وفحص الصفحات الثابتة والديناميكية
pnpm build
```

---

## 🆘 المساعدة وحل المشكلات الشائعة (Troubleshooting & FAQ)

<details>
<summary><b>1. فشل الدخول إلى لوحة التحكم (/admin)</b></summary>

- تأكد من تفعيل دور المدير (`role: "admin"`) لحسابك عبر تشغيل سكربت:
  ```bash
  pnpm admin:create --email=admin@giza86.com --password=YourPassword!
  ```
- إذا كنت تستخدم بريداً مخصصاً، تأكد من تحديث قيمة `ADMIN_EMAIL` و `NEXT_PUBLIC_ADMIN_EMAIL` في ملف `.env.local`.
</details>

<details>
<summary><b>2. خطأ في اتصال قاعدة بيانات Neon (Connection Timeout)</b></summary>

- تأكد من إضافة معامل `?sslmode=require` في نهاية رابط `DATABASE_URL`.
- يفضل استخدام رابط **Pooled Connection** (المتضمن لكلمة `-pooler`) المخصص لبيئات Serverless.
</details>

<details>
<summary><b>3. كيفية تعديل أسعار الشحن لمحافظة معينة؟</b></summary>

- ادخل إلى لوحة التحكم: `/admin/settings` -> تبويب **الشحن والتوصيل**.
- يمكنك تعديل السعر المخصص لكل محافظة من المحافظات الـ 27 وحفظ التغييرات فورياً دون الحاجة لتعديل الكود.
</details>

---

## 📄 الترخيص (License)

هذا المشروع متاح للاستخدام التجاري والتطوير بموجب رخصة [MIT License](LICENSE).
