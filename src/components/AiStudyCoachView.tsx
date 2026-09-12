import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../lib/api';
import {
  Sparkles,
  BookOpen,
  Brain,
  Calendar,
  HelpCircle,
  ArrowRight,
  Send,
  Loader2,
  Copy,
  Check,
  Languages,
  AlertCircle
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
  const [conceptQuery, setConceptQuery] = useState(initialTopic || 'Glasgow Coma Scale');
  const [mnemonicTopic, setMnemonicTopic] = useState('APGAR Score assessment');
  const [doubtText, setDoubtText] = useState(initialDoubt || '');
  const [doubtContext, setDoubtContext] = useState(initialContext || '');

  // Output states
  const [resultText, setResultText] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [targetLang, setTargetLang] = useState<'en' | 'mr'>(language);

  const handleExplain = async () => {
    if (!conceptQuery.trim()) return;
    setLoading(true);
    setResultText('');
    try {
      const res = await api.aiExplain(conceptQuery, targetLang);
      if (res.success && res.text) {
        setResultText(res.text);
      } else {
        setResultText(res.error || 'Failed to generate explanation. Please check your Gemini API key.');
      }
    } catch (err: any) {
      setResultText(err.message || 'Error communicating with AI Study Coach.');
    } finally {
      setLoading(false);
    }
  };

  const handleMnemonic = async () => {
    if (!mnemonicTopic.trim()) return;
    setLoading(true);
    setResultText('');
    try {
      const res = await api.aiMnemonic(mnemonicTopic, targetLang);
      if (res.success && res.text) {
        setResultText(res.text);
      } else {
        setResultText(res.error || 'Failed to generate mnemonic.');
      }
    } catch (err: any) {
      setResultText(err.message || 'Error generating mnemonic.');
    } finally {
      setLoading(false);
    }
  };

  const handleRevisionPlan = async () => {
    setLoading(true);
    setResultText('');
    try {
      const res = await api.aiRevisionPlan(targetLang);
      if (res.success && res.text) {
        setResultText(res.text);
      } else {
        setResultText(res.error || 'Failed to generate revision plan.');
      }
    } catch (err: any) {
      setResultText(err.message || 'Error generating revision plan.');
    } finally {
      setLoading(false);
    }
  };

  const handleDoubt = async () => {
    if (!doubtText.trim()) return;
    setLoading(true);
    setResultText('');
    try {
      const res = await api.aiDoubt(doubtText, doubtContext, targetLang);
      if (res.success && res.text) {
        setResultText(res.text);
      } else {
        setResultText(res.error || 'Failed to answer doubt.');
      }
    } catch (err: any) {
      setResultText(err.message || 'Error answering doubt.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const quickHighYieldPicks = [
    { label: 'Glasgow Coma Scale (GCS)', topic: 'Glasgow Coma Scale (E4 V5 M6 scoring)' },
    { label: 'Parkland Burns Formula', topic: 'Parkland Fluid Resuscitation Formula in Burns' },
    { label: 'Digoxin Toxicity & Nursing Care', topic: 'Digoxin therapeutic index, toxicity symptoms, and nursing priorities' },
    { label: 'Shock Triad & Types', topic: 'Hypovolemic, Cardiogenic, and Septic Shock priority interventions' },
    { label: 'APGAR Score', topic: 'APGAR Score assessment at 1 and 5 minutes' },
    { label: 'Cranial Nerves Mnemonic', topic: '12 Cranial Nerves names and sensory/motor functions' }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-teal-950 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>AI Clinical Mentor • Powered by Gemini 3.8 Flash</span>
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
                setResultText('');
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
                Frequently Tested High-Yield Topics (Click to run):
              </div>
              <div className="flex flex-wrap gap-2">
                {quickHighYieldPicks.map((pick, i) => (
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
                  placeholder="e.g. Signs of Meningitis (Kernig / Brudzinski), Hypokalemia ECG signs, MONA for MI..."
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
