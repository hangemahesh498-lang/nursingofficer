import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../lib/api';
import {
  Sparkles,
  BookOpen,
  Brain,
  Calendar,
  HelpCircle,
  Send,
  Loader2,
  Copy,
  Check,
  AlertCircle,
  RefreshCw,
  Database,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';

interface AiStudyCoachViewProps {
  initialTopic?: string;
  initialDoubt?: string;
  initialContext?: string;
}

export const AiStudyCoachView: React.FC<AiStudyCoachViewProps> = ({
  initialTopic,
  initialDoubt,
  initialContext
}) => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'explain' | 'mnemonic' | 'revision_plan' | 'doubt'>('explain');

  // Input states
  const [conceptQuery, setConceptQuery] = useState(initialTopic || 'Glasgow Coma Scale (E4 V5 M6)');
  const [mnemonicTopic, setMnemonicTopic] = useState('APGAR Score assessment');
  const [doubtText, setDoubtText] = useState(initialDoubt || '');
  const [doubtContext, setDoubtContext] = useState(initialContext || '');

  // Output states
  const [resultText, setResultText] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [targetLang, setTargetLang] = useState<'en' | 'mr'>(language);
  const [isCachedResult, setIsCachedResult] = useState(false);

  // AI Cache & Quota Defense states
  const [cacheStats, setCacheStats] = useState<{
    cachedPrompts: number;
    totalRequestsServed: number;
    savedApiCalls: number;
    tokensSavedEstimate: number;
  } | null>(null);
  const [showDefenseDetails, setShowDefenseDetails] = useState(false);

  const loadCacheStats = async () => {
    try {
      const stats = await api.getAiCacheStats();
      if (stats) setCacheStats(stats);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadCacheStats();
  }, []);

  const clearOutputs = () => {
    setResultText('');
    setErrorMessage(null);
    setIsCachedResult(false);
  };

  const handleExplain = async () => {
    if (!conceptQuery.trim()) return;
    setLoading(true);
    clearOutputs();
    try {
      const res = await api.aiExplain(conceptQuery, targetLang);
      if (res.success && res.text) {
        setResultText(res.text);
        loadCacheStats();
      } else {
        setErrorMessage(res.error || 'Failed to generate explanation. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error communicating with AI Study Coach.');
    } finally {
      setLoading(false);
    }
  };

  const handleMnemonic = async () => {
    if (!mnemonicTopic.trim()) return;
    setLoading(true);
    clearOutputs();
    try {
      const res = await api.aiMnemonic(mnemonicTopic, targetLang);
      if (res.success && res.text) {
        setResultText(res.text);
        loadCacheStats();
      } else {
        setErrorMessage(res.error || 'Failed to generate mnemonic. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error generating mnemonic.');
    } finally {
      setLoading(false);
    }
  };

  const handleRevisionPlan = async () => {
    setLoading(true);
    clearOutputs();
    try {
      const res = await api.aiRevisionPlan(targetLang);
      if (res.success && res.text) {
        setResultText(res.text);
        loadCacheStats();
      } else {
        setErrorMessage(res.error || 'Failed to generate revision plan. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error generating revision plan.');
    } finally {
      setLoading(false);
    }
  };

  const handleDoubt = async () => {
    if (!doubtText.trim()) return;
    setLoading(true);
    clearOutputs();
    try {
      const res = await api.aiDoubt(doubtText, doubtContext, targetLang);
      if (res.success && res.text) {
        setResultText(res.text);
        loadCacheStats();
      } else {
        setErrorMessage(res.error || 'Failed to answer clinical doubt. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error asking AI Study Coach.');
    } finally {
      setLoading(false);
    }
  };

  const retryCurrentAction = () => {
    if (activeTab === 'explain') handleExplain();
    else if (activeTab === 'mnemonic') handleMnemonic();
    else if (activeTab === 'revision_plan') handleRevisionPlan();
    else if (activeTab === 'doubt') handleDoubt();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const quickHighYieldConcepts = [
    { label: 'Glasgow Coma Scale (GCS)', topic: 'Glasgow Coma Scale (E4 V5 M6 scoring)' },
    { label: 'Parkland Burns Formula', topic: 'Parkland Fluid Resuscitation Formula in Burns' },
    { label: 'Digoxin Toxicity & Nursing Care', topic: 'Digoxin therapeutic index, toxicity symptoms, and nursing priorities' },
    { label: 'Shock Triad & Types', topic: 'Hypovolemic, Cardiogenic, and Septic Shock priority interventions' },
    { label: 'APGAR Score', topic: 'APGAR Score assessment at 1 and 5 minutes' },
    { label: 'Cranial Nerves Mnemonic', topic: '12 Cranial Nerves names and sensory/motor functions' }
  ];

  const quickMnemonicPicks = [
    { label: 'APGAR Newborn Score', topic: 'APGAR Score assessment in newborns' },
    { label: 'MONA Protocol for MI', topic: 'MONA protocol for Acute Myocardial Infarction' },
    { label: '12 Cranial Nerves', topic: '12 Cranial Nerves names and sensory/motor types' },
    { label: 'Parkland Burns Fluid', topic: 'Parkland Formula for Fluid Resuscitation in Burns' },
    { label: 'Digoxin Toxicity Precautions', topic: 'Digoxin Toxicity signs, therapeutic level, and nursing antidote' },
    { label: 'Meningitis Signs (Kernig/Brudzinski)', topic: 'Kernig and Brudzinski signs in Meningitis' }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-teal-950 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>AI Clinical Mentor • High-Yield Exam Companion</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold mb-2">
          {language === 'mr' ? 'एआय अभ्यास मार्गदर्शक (AI Study Coach)' : 'AI Clinical Study Coach'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          {language === 'mr'
            ? 'अवघड क्लिनिकल संकल्पना सोप्या भाषेत समजून घ्या, स्मृतीसूत्र (Mnemonics) मिळवा आणि तुमच्या कमकुवत विषयांवर आधारित ७ दिवसांचे रिव्हिजन वेळापत्रक बनवा.'
            : 'Simplify complex nursing physiology, generate memory recall mnemonics, clear clinical doubts, and synthesize personalized 7-day revision plans.'}
        </p>

        {/* Language selector for AI outputs */}
        <div className="mt-4 flex items-center gap-3 text-xs">
          <span className="text-slate-400 font-medium">Output Language:</span>
          <div className="flex bg-slate-800 p-0.5 rounded-lg border border-slate-700">
            <button
              onClick={() => setTargetLang('en')}
              className={`px-3 py-1 rounded-md transition cursor-pointer ${
                targetLang === 'en' ? 'bg-teal-600 text-white font-bold' : 'text-slate-300'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setTargetLang('mr')}
              className={`px-3 py-1 rounded-md transition cursor-pointer ${
                targetLang === 'mr' ? 'bg-teal-600 text-white font-bold' : 'text-slate-300'
              }`}
            >
              मराठी (Marathi)
            </button>
          </div>
        </div>
      </div>

      {/* Cloud SQL AI Cache & Limit Defense Dashboard Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 text-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Cloud SQL AI Quota Defense</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active & Cached
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {language === 'mr'
                  ? 'AI मर्यादा संपल्या तरी Cloud SQL कॅशे आणि ऑफलाइन नॉलेज बेसमुळे अभ्यास कधीही थांबत नाही.'
                  : 'AI rate-limit protection active via PostgreSQL caching and instant clinical offline fallbacks.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center">
            <div className="grid grid-cols-3 gap-3 text-center pr-3 border-r border-slate-800">
              <div>
                <div className="text-xs font-bold text-teal-400">{cacheStats?.cachedPrompts || 0}</div>
                <div className="text-[10px] text-slate-400">Cached</div>
              </div>
              <div>
                <div className="text-xs font-bold text-emerald-400">{cacheStats?.savedApiCalls || 0}</div>
                <div className="text-[10px] text-slate-400">Saved Calls</div>
              </div>
              <div>
                <div className="text-xs font-bold text-sky-400">~{cacheStats?.tokensSavedEstimate ? (cacheStats.tokensSavedEstimate / 1000).toFixed(1) + 'k' : '0'}</div>
                <div className="text-[10px] text-slate-400">Tokens Saved</div>
              </div>
            </div>

            <button
              onClick={() => setShowDefenseDetails(!showDefenseDetails)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 transition cursor-pointer shrink-0"
            >
              <Info className="w-3.5 h-3.5 text-teal-400" />
              <span>{showDefenseDetails ? (language === 'mr' ? 'माहिती लपवा' : 'Hide Details') : (language === 'mr' ? 'मर्यादा संरक्षण' : 'AI Limit Defense')}</span>
            </button>
          </div>
        </div>

        {/* Expandable 3-tier architecture explanation */}
        {showDefenseDetails && (
          <div className="mt-4 pt-4 border-t border-slate-800 text-xs space-y-3">
            <div className="font-semibold text-teal-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>
                {language === 'mr'
                  ? 'AI Limit संपल्यास किंवा समस्या आल्यास काय होते? (३-स्तरीय सुरक्षा व्यवस्था)'
                  : 'What happens if AI quota or limits are reached? (3-Tier Contingency Architecture)'}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>१. Cloud SQL AI Cache</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {language === 'mr'
                    ? 'प्रत्येक विचारलेला प्रश्न किंवा स्मृतीसूत्र थेट PostgreSQL मधील ai_cache मध्ये साठवले जाते. त्यामुळे पुढील वेळेस तोच प्रश्न विचारल्यास शून्य API कॉल आणि शून्य टोकन वापरून १ सेकंदात उत्तर मिळते.'
                    : 'Responses are indexed by query hash in Cloud SQL. Duplicate queries take 0 API calls, consume 0 tokens, and load instantaneously.'}
                </p>
              </div>

              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
                  <span>२. Auto Model Failover</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {language === 'mr'
                    ? 'जर एका मॉडेलची लिमिट संपली किंवा ५०३ एरर आला, तर सिस्टीम आपोआप Gemini Flash Latest आणि Gemini Flash Lite या पर्यायी मॉडेल्सवर प्रयत्न करते.'
                    : 'Automatic sequential fallback across free-tier candidate models (Gemini 3.8 Flash -> Flash Latest -> Flash Lite) with exponential backoff.'}
                </p>
              </div>

              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                  <span>३. High-Yield Offline Knowledge</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {language === 'mr'
                    ? 'AI API पूर्णपणे बंद असले तरीही APGAR, GCS, Parkland Formula, Digoxin, MI MONA यांसारखे उच्च-गुण देणारे नर्सिंग टॉपिक्स थेट सर्व्हर डेटाबेसमधून त्वरित दिले जातात.'
                    : 'Pre-verified high-yield exam clinical topics (APGAR, GCS, Parkland, MONA, Digoxin) deliver instantly even if the Gemini API is 100% offline.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tool Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { id: 'explain', label: 'Concept Explainer', icon: BookOpen },
          { id: 'mnemonic', label: 'Clinical Mnemonics', icon: Brain },
          { id: 'revision_plan', label: '7-Day Revision Plan', icon: Calendar },
          { id: 'doubt', label: 'Ask Clinical Doubt', icon: HelpCircle }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                clearOutputs();
              }}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
                isActive
                  ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Interactive Tool Input Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        {/* Tool 1: Concept Explainer */}
        {activeTab === 'explain' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Enter Nursing / Medical Concept
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={conceptQuery}
                  onChange={e => setConceptQuery(e.target.value)}
                  placeholder="e.g. Decerebrate vs Decorticate Posturing, Cardiac Tamponade Beck's Triad..."
                  className="grow px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
                <button
                  disabled={loading}
                  onClick={handleExplain}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition cursor-pointer disabled:opacity-50 shrink-0"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>Explain Concept</span>
                </button>
              </div>
            </div>

            {/* Quick High Yield Prompts */}
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Frequently Tested High-Yield Topics:
              </div>
              <div className="flex flex-wrap gap-2">
                {quickHighYieldConcepts.map((pick, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setConceptQuery(pick.topic);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-teal-50 hover:text-teal-800 text-[11px] font-semibold text-slate-600 border border-slate-200 transition cursor-pointer"
                  >
                    {pick.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tool 2: Clinical Mnemonics */}
        {activeTab === 'mnemonic' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Topic for Memory Mnemonic
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={mnemonicTopic}
                  onChange={e => setMnemonicTopic(e.target.value)}
                  placeholder="e.g. Signs of Meningitis (Kernig / Brudzinski), APGAR score, MONA for MI..."
                  className="grow px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
                <button
                  disabled={loading}
                  onClick={handleMnemonic}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition cursor-pointer disabled:opacity-50 shrink-0"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
                  <span>Generate Mnemonic</span>
                </button>
              </div>
            </div>

            {/* Quick Mnemonic Prompts */}
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Popular High-Yield Mnemonics:
              </div>
              <div className="flex flex-wrap gap-2">
                {quickMnemonicPicks.map((pick, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setMnemonicTopic(pick.topic);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-teal-50 hover:text-teal-800 text-[11px] font-semibold text-slate-600 border border-slate-200 transition cursor-pointer"
                  >
                    {pick.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tool 3: 7-Day Revision Plan */}
        {activeTab === 'revision_plan' && (
          <div className="space-y-4">
            <div className="text-xs text-slate-600 leading-relaxed">
              The AI Study Coach synthesizes your unmastered mistakes from your Mistake Notebook and your lowest-scoring subject areas to build a tailored 7-day spaced schedule.
            </div>
            <button
              disabled={loading}
              onClick={handleRevisionPlan}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition cursor-pointer disabled:opacity-50 shadow-xs"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calendar className="w-4 h-4" />}
              <span>Generate My 7-Day Spaced Revision Schedule</span>
            </button>
          </div>
        )}

        {/* Tool 4: Doubt Assistant */}
        {activeTab === 'doubt' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Your Nursing Doubt</label>
              <textarea
                rows={3}
                value={doubtText}
                onChange={e => setDoubtText(e.target.value)}
                placeholder="Ask any question, e.g. Why is Morphine contraindicated in Head Injury? Why is Ringer Lactate preferred over Normal Saline in Burns?"
                className="w-full p-3 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
              ></textarea>
            </div>

            {doubtContext && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                <span className="font-bold text-slate-700 block mb-1">Question Context:</span>
                {doubtContext}
              </div>
            )}

            <button
              disabled={loading}
              onClick={handleDoubt}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition cursor-pointer disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Ask Doubt</span>
            </button>
          </div>
        )}
      </div>

      {/* Error Message Card with Retry */}
      {errorMessage && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900 shadow-xs">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-amber-900">Notice from AI Study Coach</h4>
              <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">{errorMessage}</p>
            </div>
          </div>
          <button
            onClick={retryCurrentAction}
            className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition cursor-pointer shrink-0 self-start sm:self-center"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {/* AI Output Card */}
      {resultText && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-xs font-bold text-teal-800">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>AI Study Coach Response</span>
            </div>

            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed font-sans">
            {resultText}
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-400">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>AI study assistance is designed for academic exam preparation and does not replace official clinical treatment protocols.</span>
          </div>
        </div>
      )}
    </div>
  );
};
