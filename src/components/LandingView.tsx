import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  CheckCircle2,
  ShieldCheck,
  Zap,
  BookOpen,
  Activity,
  Award,
  ArrowRight,
  Stethoscope,
  Sparkles,
  Layers,
  Clock
} from 'lucide-react';

interface LandingViewProps {
  onGetStarted: () => void;
  onExploreMock: () => void;
  onOpenRegister: () => void;
  onOpenLogin: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onGetStarted, onExploreMock, onOpenRegister, onOpenLogin }) => {
  const { language } = useLanguage();
  const { currentUser } = useAuth();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-16 sm:py-24">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-900/80 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'mr' ? 'अखिल भारतीय नर्सिंग अधिकारी भरती २०२५' : 'All-India Nursing Officer Recruitment 2025'}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-6">
              {language === 'mr'
                ? 'नर्सिंग ऑफिसर परीक्षेत यश मिळवण्यासाठी एकमेव परिपूर्ण तयारी मंच'
                : 'Master AIIMS NORCET, ESIC & State Nursing Officer Examinations'}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8">
              {language === 'mr'
                ? 'क्लिनिकल केस स्टडीज, खराखुरा परीक्षा टाइमर, १/३ निगेटिव्ह मार्किंग, अचूक मराठी व इंग्रजी वैद्यकीय स्पष्टीकरण, चूक वही आणि एआय अभ्यास मार्गदर्शक.'
                : 'Built according to official Indian Nursing Council standards. Real timed mock tests with negative marking, bilingual rationales (English & Marathi), automated mistake notebook, and clinical case simulations.'}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenRegister}
                className="flex items-center gap-1.5 px-5 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-black text-xs sm:text-sm shadow-md transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span>{language === 'mr' ? '✨ मोफत नोंदणी करा (Register)' : '✨ Register Free'}</span>
              </button>

              <button
                onClick={onOpenLogin}
                className="flex items-center gap-1.5 px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm border border-slate-700 transition cursor-pointer"
              >
                <span>{language === 'mr' ? '🔐 लॉगिन करा (Login)' : '🔐 Member Login'}</span>
              </button>

              <button
                id="hero-start-btn"
                onClick={onGetStarted}
                className="flex items-center gap-1.5 px-5 py-3.5 rounded-xl bg-teal-900/60 hover:bg-teal-900 text-teal-200 border border-teal-500/30 font-semibold text-xs sm:text-sm transition cursor-pointer"
              >
                <span>{language === 'mr' ? '📚 सराव सुरू करा (Start Practice)' : 'Start Practice'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-mock-btn"
                onClick={onExploreMock}
                className="flex items-center gap-1.5 px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-semibold text-xs sm:text-sm transition cursor-pointer"
              >
                <Clock className="w-4 h-4" />
                <span>{language === 'mr' ? '⏱️ मॉक सुरू करा (Start Mock)' : 'Start Mock Test'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Target Exams Banner */}
      <section className="bg-slate-50 border-y border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider mb-6">
            {language === 'mr' ? 'खालील सर्व मुख्य नर्सिंग भरती परीक्षांसाठी तयार केलेले' : 'Prepared for Top Nursing Officer Recruitment Exams'}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: 'AIIMS NORCET 2025', desc: 'Central Govt Institutes • 80:20 Ratio Syllabus' },
              { title: 'ESIC Nursing Officer', desc: 'UPSC Recruitment Pattern • Clinical MCQs' },
              { title: 'RRB Railway Staff Nurse', desc: 'Technical Nursing + GK & Aptitude' },
              { title: 'State DMER & DHS', desc: 'Maharashtra, UP NHM, DSSSB & State Tests' }
            ].map((exam, i) => (
              <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-center">
                <div className="text-sm font-bold text-slate-900 mb-1">{exam.title}</div>
                <div className="text-xs text-slate-500">{exam.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7-Step Learning Cycle */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
            {language === 'mr' ? 'पूर्ण शिक्षण चक्र (The 7-Step Learning Cycle)' : 'The Complete Scientific Exam Mastery Cycle'}
          </h2>
          <p className="text-sm text-slate-600">
            {language === 'mr'
              ? 'केवळ प्रश्न पाठ न करता विषयाचे सखोल आकलन आणि पुनरावलोकन'
              : 'Beyond rote learning. Built on active recall, spaced repetition, and targeted clinical remediation.'}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { step: '1. LEARN', title: 'Concept Study', desc: 'INC Guideline notes' },
            { step: '2. PRACTICE', title: 'Topic MCQs', desc: 'Immediate feedback' },
            { step: '3. TEST', title: 'Timed Mocks', desc: 'Negative marking' },
            { step: '4. ANALYZE', title: 'Performance', desc: 'Accuracy & timings' },
            { step: '5. IDENTIFY', title: 'Weak Subjects', desc: 'Mistake clustering' },
            { step: '6. REVISE', title: 'Spaced Memory', desc: '1, 3, 7, 15 days' },
            { step: '7. RETEST', title: 'Target Retest', desc: 'Validate mastery' }
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-center">
              <div className="text-[11px] font-bold text-teal-700 uppercase tracking-wider mb-1">{item.step}</div>
              <div className="text-xs font-semibold text-slate-900 mb-1">{item.title}</div>
              <div className="text-[11px] text-slate-500">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Platform Features Grid */}
      <section className="bg-slate-50 border-t border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              {language === 'mr' ? 'प्लॅटफॉर्मची वैशिष्ट्ये' : 'High-Yield Exam Engine Capabilities'}
            </h2>
            <p className="text-sm text-slate-600">
              Designed for serious healthcare professionals preparing for gazetted and non-gazetted nursing positions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-4">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                {language === 'mr' ? 'क्लिनिकल केस व्हिग्नेट्स' : 'Clinical Scenario & Case Studies'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Realistic patient stems with vital signs (BP, SpO2, HR, RR), ECG strips, and lab investigations. Solve multi-step priority nursing interventions.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                {language === 'mr' ? 'खराखुरा परीक्षा सिम्युलेटर' : 'True Exam Simulator with 1/3 Penalty'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Official NORCET style question palette, countdown timer, auto-submission at 00:00, and exact negative marking penalty calculations.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                {language === 'mr' ? 'एआय अभ्यास मार्गदर्शक (Gemini 3.8)' : 'AI Clinical Study Coach'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clear complex concepts in simple English or Marathi, generate clinical memory mnemonics, and formulate personalized 7-day revision plans.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / Tiers */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
            {language === 'mr' ? 'सुलभ व परवडणारे अभ्यास पॅकेजेस' : 'Transparent Preparation Plans'}
          </h2>
          <p className="text-sm text-slate-600">
            Start free with core question banks or unlock the full AIIMS NORCET Grand Test series.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Foundation Plan</div>
              <div className="text-3xl font-extrabold text-slate-900 mb-4">₹0 <span className="text-sm font-normal text-slate-500">/ Free forever</span></div>
              <p className="text-xs text-slate-600 mb-6">Ideal for daily quick practice and core fundamentals review.</p>
              <ul className="space-y-3 text-xs text-slate-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600" /> Standard Subject Question Banks</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600" /> Instant Feedback Mode</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600" /> Mistake Notebook Tracking</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600" /> Bilingual Support (EN & MR)</li>
              </ul>
            </div>
            <button
              onClick={onGetStarted}
              className="mt-8 w-full py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 text-sm font-semibold transition cursor-pointer"
            >
              Start Free Practice
            </button>
          </div>

          {/* Pro Tier */}
          <div className="bg-slate-900 text-white p-8 rounded-2xl border border-teal-500 shadow-md relative flex flex-col justify-between">
            <div className="absolute top-4 right-4 bg-teal-500 text-slate-950 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
              Most Popular
            </div>
            <div>
              <div className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-2">AIIMS NORCET Master Pro</div>
              <div className="text-3xl font-extrabold text-white mb-4">₹499 <span className="text-sm font-normal text-slate-400">/ 6 Months</span></div>
              <p className="text-xs text-slate-300 mb-6">Comprehensive preparation with full mock tests and AI coach access.</p>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400" /> Everything in Free Plan</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400" /> Full-length NORCET Mock Tests with AI rank percentile</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400" /> Clinical Case Studies with Vitals & Lab strips</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400" /> Unlimited AI Study Coach (Mnemonics & Doubts)</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400" /> Verified Previous Year Questions (2020 - 2024)</li>
              </ul>
            </div>
            <button
              onClick={onGetStarted}
              className="mt-8 w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-bold transition cursor-pointer shadow-sm"
            >
              Get Pro Access
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
