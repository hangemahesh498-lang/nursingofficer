# Nursing Officer Exam Preparation Platform (NursingPrep AI) ⚕️

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6-646cff.svg)](https://vitejs.dev/)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable%20Launcher-emerald.svg)](https://web.dev/progressive-web-apps/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> A modern, full-stack, bilingual (**English & मराठी**) Nursing Officer & Staff Nurse exam preparation platform designed strictly in alignment with **Indian Nursing Council (INC)** standards, **AIIMS NORCET**, ESIC, DSSSB, RRB, and State DMER examinations.

---

## 🌟 Key Highlights & Features

1. **📱 Native PWA App Launcher & Install**:
   - Installable on **Android, iOS, Windows, Mac, and Linux** with a single click.
   - Dedicated branded launcher icon (`/public/icon.svg`, `/public/pwa-512x512.png`).
   - Runs full-screen with offline-ready caching for seamless revision anywhere.

2. **🆓 5 Free MCQs Per Topic Policy**:
   - The first 5 certified high-yield MCQs for **every topic** across all **18 syllabus subjects** are 100% free for all aspirants without mandatory subscription.

3. **📚 Complete 18-Subject INC Syllabus Bank**:
   - Medical-Surgical Nursing, Pharmacology, Obstetrics & Gynaecological Nursing, Child Health (Pediatrics), Community Health Nursing, Mental Health (Psychiatry), Anatomy & Physiology, Nursing Foundation, Microbiology, Nutrition, Research & Stats, Management, and General Aptitude/English/GK.

4. **⚡ High-Yield Practice Engine**:
   - Instant feedback mode with comprehensive **Option-by-Option Clinical Rationales**.
   - Verified Previous Year Questions (AIIMS NORCET, ESIC, DSSSB, RRB, Maha DMER).
   - High-resolution clinical diagrams, ECG strips, anatomical charts, and surgical instruments.

5. **🏥 Multi-Step Clinical Case Studies**:
   - Scenario-based clinical decision-making simulations reflecting the new AIIMS NORCET Stage II Pattern.

6. **🎯 Realistic Timed Mock Test Engine**:
   - Strict NORCET marking (+1.00 correct, -0.33 negative marking).
   - Real-time subject-wise analysis, percentile ranking, and weak area diagnostics.

7. **📕 Smart Mistake Notebook**:
   - Automatically bookmarks incorrect answers with categorized error tagging (e.g. *Conceptual Confusion*, *Factual Recall*, *Calculation Error*).
   - One-click Retest Mode for rapid targeted mastery.

8. **🤖 Gemini AI Clinical Study Coach**:
   - 24/7 bilingual AI Nursing Tutor for in-depth concept breakdown, clinical mnemonics, NCLEX-style drug cards, and customized study schedules.

---

## 🚀 Quick Start & GitHub Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/nursing-officer-prep.git
cd nursing-officer-prep
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Generate Launcher Icons (Optional / Pre-generated)
```bash
node scripts/generate-icons.js
```

### 4. Configure Environment Variables
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```
Fill in your `GEMINI_API_KEY` (and optional Cloud SQL / Cloudinary credentials):
```env
GEMINI_API_KEY="your_google_gemini_api_key"
```

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Production Build & Deployment

### Build for Production
```bash
npm run build
```
This bundles the Vite client frontend to `dist/` and compiles the Node/Express server to `dist/server.cjs`.

### Start Production Server
```bash
npm start
```

---

## 📱 Mobile Launcher & PWA Installation Instructions

### On Android (Chrome / Edge / Brave):
1. Open the website in your browser.
2. Tap the **Install App** button in the top navigation header or tap **⋮ (Menu) -> Install App / Add to Home screen**.
3. The **NursingPrep** launcher icon will appear on your home screen and app drawer.

### On iOS (iPhone & iPad Safari):
1. Open the website in **Safari**.
2. Tap the **Share** button in the bottom navigation toolbar.
3. Scroll down and tap **Add to Home Screen** (**होम स्क्रीनवर जोडा**).
4. Tap **Add** in the top-right corner. The app will launch in standalone full-screen mode.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion, Lucide Icons, Canvas-Confetti
- **Backend API**: Node.js, Express, tsx, esbuild
- **Database**: PostgreSQL (Cloud SQL) with automatic resilient local JSON store fallback
- **AI Engine**: Google Gemini API (`@google/genai`)
- **PWA & Offline**: `vite-plugin-pwa`, Workbox, Web App Manifest, Service Workers

---

## 📂 Project Structure

```
├── data/
│   └── store.json          # Seed questions, subjects, topics, and mocks
├── public/
│   ├── icon.svg            # Master vector launcher icon
│   ├── pwa-192x192.png     # Android home screen icon (192px)
│   ├── pwa-512x512.png     # Splash screen icon (512px)
│   ├── pwa-maskable-512x512.png # Android adaptive maskable icon
│   ├── apple-touch-icon.png# iOS Safari home screen icon
│   ├── favicon.svg         # Tab favicon
│   └── manifest.json       # Web App Manifest
├── scripts/
│   └── generate-icons.js   # Icon generator utility
├── server/
│   └── db.ts               # Database layer & query engine
├── src/
│   ├── components/         # Modular UI views (Practice, Mocks, Cases, AI, PWAInstall)
│   ├── context/            # Language & Auth contexts
│   ├── hooks/              # Custom hooks (usePWAInstall)
│   ├── lib/                # API client & helpers
│   ├── App.tsx             # Root view coordinator
│   └── types.ts            # Shared TypeScript definitions
├── server.ts               # Express backend & Vite middleware
├── vite.config.ts          # Vite & PWA bundler configuration
└── package.json            # Scripts and dependencies
```

---

## 📜 License
MIT License. Built for Nursing Aspirants across India.

## Final Product / Payment Architecture Update
- Payment products are separated into MCQ, Test Series, YouTube, Combo, Single Test and Single Video access types.
- Razorpay production verification must use server-side order creation, signature verification, Razorpay payment capture/status lookup, order/item matching and amount validation before activation.
- Student deletion is permanently admin-controlled; there is no two-month auto-delete policy.
- Referral codes and referral leaderboard are supported.
- Firebase Cloud Messaging integration requires a Web Push VAPID key and Firebase Admin service-account secret in deployment.
