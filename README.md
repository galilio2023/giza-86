# 🧵 MODANIL | متجر مودانيل للأزياء والقطن المصري - E-Commerce & Admin CMS

[![Live Demo](https://img.shields.io/badge/Live_Demo-modanil.vercel.app-000000?style=for-the-badge&logo=vercel)](https://modanil.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16.3.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.45.2-C5F74F?style=for-the-badge&logo=drizzle)](https://orm.drizzle.team/)
[![PostgreSQL](https://img.shields.io/badge/Neon_PostgreSQL-Serverless-00E599?style=for-the-badge&logo=postgresql)](https://neon.tech/)
[![Upstash Redis](https://img.shields.io/badge/Upstash_Redis-Rate_Limiting-00E599?style=for-the-badge&logo=redis)](https://upstash.com/)
[![Better Auth](https://img.shields.io/badge/Better_Auth-1.7.3-black?style=for-the-badge)](https://www.better-auth.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media_CDN-3448C5?style=for-the-badge&logo=cloudinary)](https://cloudinary.com/)

**MODANIL** (Live: [https://modanil.vercel.app/](https://modanil.vercel.app/)) is a high-performance, enterprise-grade e-commerce storefront and Content Management System (CMS) tailored specifically for premium Egyptian cotton apparel (Oversized T-Shirts, Hoodies, Linen Shirts, and Winter Wear). Built with **Next.js 16 App Router (Turbopack)**, **React 19**, and a **Clean Layered Domain Architecture**.

---

## ✨ Key Platform Highlights

- ⚡ **Next.js 16 App Router & Turbopack:** Full streaming with Server Components (`loading.tsx`), static rendering (`SSG`), and resilient error boundaries (`global-error.tsx`, `error.tsx`).
- 🇪🇬 **Egyptian Market Native:** Pre-configured with all 27 Egyptian governorates, dynamic shipping tariffs, Egyptian mobile phone validation (11-digit regex), and instant WhatsApp direct ordering.
- 💳 **Local Payment Ecosystem:** Cash on Delivery (COD), InstaPay with 1-click handle copying, Vodafone Cash mobile wallet, and online card readiness.
- 🛡️ **Distributed Rate Limiting:** Powered by **Upstash Redis REST API** pipeline for serverless multi-instance protection against brute-force and DDoS, with in-memory sliding window fallback.
- 📸 **Cloudinary CDN Integration:** High-speed cloud image delivery and upload pipeline with local filesystem fallback.
- 🔐 **Better Auth & Drizzle ORM:** Secure credential-based session management, role-based route handlers, and type-safe database access with Neon Serverless PostgreSQL.
- 🎛️ **Full Admin CMS:** Dashboard metrics, product variant matrix (sizes, colors, custom pricing & stock), coupon rules engine, category hierarchy, and live store settings.

---

## 🏛️ System Architecture

The application strictly enforces **Clean Layered Architecture** with strict Separation of Concerns (SoC):

### 1. Architectural Layers

```mermaid
graph TD
    subgraph Presentation ["1. Presentation Layer (App Router & UI)"]
        SC["Server Components (app/page, app/products)"]
        CC["Leaf Client Components (components/store, components/admin)"]
        RH["Route Handlers (app/api/* with withAdminAuth)"]
    end

    subgraph Domain ["2. Domain & Application Services Layer"]
        PS["products.service.ts"]
        OS["orders.service.ts"]
        CS["categories.service.ts"]
        CPS["coupons.service.ts"]
        SS["settings.service.ts"]
        subgraph DomainRules ["Pure Domain Rules & Utilities"]
            PR["pricing.ts (Discount, Shipping, Totals)"]
            VR["variants.ts (Effective Price, Stock, Matching)"]
            WA["whatsapp.ts (Instant WhatsApp Ordering)"]
            RL["rate-limiter.ts (Upstash Redis + Memory Fallback)"]
            ERR["errors.ts (Domain Errors)"]
        end
    end

    subgraph Repository ["3. Repository Layer (Data Abstraction)"]
        IPR["IProductRepository"]
        IOR["IOrderRepository"]
        ICR["ICategoryRepository"]
        ICPR["ICouponRepository"]
        ISR["ISettingsRepository"]
    end

    subgraph Persistence ["4. Infrastructure & Persistence"]
        DRZ["Drizzle ORM + Neon Serverless Postgres"]
        REDIS["Upstash Redis (Atomic Distributed Rate Limiting)"]
        CLD["Cloudinary Media Storage"]
        MEM["Memory Store (Offline / Zero-Config Fallback)"]
    end

    SC --> PS
    SC --> CS
    SC --> SS
    CC --> RH
    RH --> PS
    RH --> OS
    RH --> RL
    PS --> IPR
    OS --> IOR
    CS --> ICR
    CPS --> ICPR
    SS --> ISR
    IPR --> DRZ
    IPR --> MEM
    IOR --> DRZ
    IOR --> MEM
    RL --> REDIS
    RL --> MEM
```

---

### 2. Order Lifecycle State Machine

```mermaid
stateDiagram-v2
    [*] --> new : Customer places order (Checkout)
    new --> confirmed : Admin confirms order
    new --> processing : Order enters preparation
    new --> cancelled : Cancelled (Inventory auto-restored)
    
    confirmed --> processing : Preparation in warehouse
    confirmed --> shipped : Dispatched to courier
    confirmed --> cancelled : Cancelled
    
    processing --> shipped : Dispatched for delivery
    processing --> delivered : Delivered directly
    processing --> cancelled : Cancelled
    
    shipped --> delivered : Delivered & COD collected
    shipped --> returned : Delivery failed / Returned (Inventory restored)
    
    delivered --> returned : Return / Exchange requested
    delivered --> [*]
    returned --> [*]
    cancelled --> [*]
```

---

## 📂 Project Structure

```
giza-86/
├── drizzle/                         # SQL migration outputs generated by Drizzle Kit
├── public/                          # Static assets and fallback uploads
├── scripts/
│   └── create-admin.ts              # CLI utility to create or promote CMS admin users
├── src/
│   ├── app/                         # Next.js 16 App Router
│   │   ├── (storefront)/            # Customer-facing storefront
│   │   │   ├── page.tsx             # Home landing page (Hero, Categories, Promo)
│   │   │   ├── products/            # Catalog filter & individual product details
│   │   │   ├── cart/                # Shopping cart drawer & full page
│   │   │   ├── checkout/            # Egyptian checkout flow (COD, InstaPay, VF-Cash)
│   │   │   ├── track/               # Order status tracking by phone & order ID
│   │   │   └── order-success/[id]/  # Order confirmation & receipt printing
│   │   ├── admin/                   # Full Backoffice Admin CMS
│   │   │   ├── page.tsx             # Analytics dashboard & KPI metrics
│   │   │   ├── products/            # Product & variant catalog manager
│   │   │   ├── orders/              # Order fulfillment, airway bills, status updates
│   │   │   ├── categories/          # Category taxonomy management
│   │   │   ├── coupons/             # Coupon & promo code rules engine
│   │   │   ├── settings/            # 27 Governorates shipping rates & payment settings
│   │   │   └── login/               # Secure admin login portal
│   │   └── api/                     # Type-safe API Route Handlers (Zod + Better-Auth)
│   ├── components/
│   │   ├── admin/                   # CMS backoffice tables, forms, and dialogs
│   │   ├── common/                  # Reusable order summary, item tables, badges
│   │   ├── store/                   # Storefront navigation, product cards, filters
│   │   └── ui/                      # Base UI primitives (Radix UI + Tailwind CSS)
│   ├── db/
│   │   ├── index.ts                 # Neon Serverless Postgres client initialization
│   │   ├── schema.ts                # Drizzle ORM schema with indexes & relations
│   │   ├── seed.ts                  # Database seeding script
│   │   └── seed-data.ts             # Initial categories, products, and variants
│   ├── hooks/                       # Custom React leaf hooks
│   ├── lib/
│   │   ├── domain/                  # Pure business rules (pricing, variants, WhatsApp)
│   │   ├── repositories/            # Data access abstractions (Drizzle & Memory)
│   │   ├── services/                # Business orchestration facade services
│   │   ├── validations/             # Zod validation schemas
│   │   ├── auth.ts                  # Better Auth server configuration
│   │   ├── auth-guard.ts            # Route protection middleware wrapper
│   │   ├── cloudinary.ts            # Cloudinary upload helpers
│   │   ├── egypt-constants.ts       # 27 governorates metadata & phone rules
│   │   ├── rate-limiter.ts          # Upstash Redis & in-memory sliding window limiter
│   │   └── utils.ts                 # EGP currency formatters, slugify, cn
│   └── types/                       # TypeScript models & domain types
├── .env.example                     # Environment template
├── drizzle.config.ts                # Drizzle Kit configuration
├── next.config.ts                   # Next.js compiler & image domain configuration
├── package.json
└── tsconfig.json
```

---

## 🇪🇬 Egyptian Market Native Features

| Feature | Description |
| :--- | :--- |
| **Currency Formatting** | Formatted in Egyptian Pounds (`ج.م` / `EGP`) with thousands separation. |
| **27 Egyptian Governorates** | Real-time shipping calculation and delivery estimates customized per governorate. |
| **Free Shipping Threshold** | Dynamic progress bar encouraging customers to reach the free delivery tier. |
| **Cash on Delivery (COD)** | Full COD support with automated order confirmation and tracking. |
| **InstaPay Integration** | Display of store InstaPay username with 1-click clipboard copy and payment receipt upload. |
| **Vodafone Cash** | Direct wallet transfer number support with payment instructions. |
| **Phone Number Validation** | Strict Egyptian mobile number format validation (11 digits, prefixes: `010`, `011`, `012`, `015`). |
| **1-Click WhatsApp Ordering** | Instant WhatsApp order generation with pre-populated Arabic message containing product, size, and pricing. |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v20.x or higher
- [pnpm](https://pnpm.io/) package manager (`npm install -g pnpm`)

### 1. Installation

```bash
# Clone the repository
git clone git@github.com:galilio2023/giza-86.git
cd giza-86

# Install dependencies
pnpm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory by copying the template:

```bash
cp .env.example .env.local
```

Configure your environment variables:

```env
# Database: Neon Serverless PostgreSQL
DATABASE_URL="postgresql://neondb_owner:password@ep-sample-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require"

# Better Auth Secret (Min 32 random characters)
BETTER_AUTH_SECRET="your-super-secure-token-min-32-chars-long"
BETTER_AUTH_URL="http://localhost:3000"

# Store Configuration
NEXT_PUBLIC_SITE_URL="https://modanil.vercel.app"
NEXT_PUBLIC_STORE_NAME="MODANIL"
NEXT_PUBLIC_WHATSAPP_NUMBER="201002081676"
NEXT_PUBLIC_INSTAPAY_HANDLE="modanil.eg@instapay"
NEXT_PUBLIC_VODAFONE_CASH="01002081676"

# Cloudinary Image Hosting (Optional - fallbacks to local storage if omitted)
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Upstash Redis Distributed Rate Limiting (Optional - fallbacks to in-memory window)
UPSTASH_REDIS_REST_URL="https://your-instance.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your_upstash_rest_token"
```

> [!NOTE]
> **Zero-Config Fallback:** If `DATABASE_URL` is not provided, the application automatically runs in **Demo Mode** using an in-memory repository store (`MemoryStore`).

---

### 3. Database Initialization & Seed

When using Neon PostgreSQL:

```bash
# Push the Drizzle schema to Neon database
pnpm db:push

# Seed initial categories, products, and default governorate rates
pnpm db:seed

# Create an initial Administrator account for the CMS
pnpm admin:create --email=admin@modanil.com --password="${ADMIN_PASSWORD:?Set a unique ADMIN_PASSWORD before running}"
```

---

### 4. Running Locally

```bash
# Start the Next.js development server with Turbopack
pnpm dev
```

Open your browser:
- **Storefront:** [http://localhost:3000](http://localhost:3000)
- **Admin CMS:** [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 🧪 Verification & Quality Control

To verify code quality and build stability before pushing:

```bash
# 1. Run unit test suite (pricing, variants, orders, coupons, whatsapp)
pnpm test

# 2. Run TypeScript strict type verification
pnpm tsc --noEmit

# 3. Compile Next.js production build
pnpm build
```

---

## 🛡️ Security & Performance

- **DDoS & Brute-Force Protection:** Route handlers and checkout submissions are protected by a sliding-window rate limiter via Upstash Redis REST API, preventing API abuse in distributed serverless environments.
- **Role-Based Access Control:** All `/api/admin/*` and CMS mutations are shielded by `withAdminAuth` verifying user session roles via Better Auth.
- **Sanitized Inputs:** Every API endpoint rigorously validates request payloads using **Zod** schemas.
- **Optimized Media:** Images are processed through Cloudinary and Next.js Image optimization (`sharp`), with responsive source sets and WebP/AVIF formatting.

---

## 📄 License

This project is licensed under the MIT License.
