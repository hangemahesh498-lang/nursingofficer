import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CLINICAL_NOTES_DATABASE, findMatchingClinicalNote } from '../data/clinicalNotesData';
import {
  BookOpen,
  Brain,
  Calendar,
  HelpCircle,
  Copy,
  Check,
  ShieldCheck,
  Zap,
  CheckCircle2,
  FileText,
  Search
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
  const [conceptQuery, setConceptQuery] = useState(initialTopic || 'Glasgow Coma Scale (GCS)');
  const [mnemonicTopic, setMnemonicTopic] = useState('APGAR Score assessment');
  const [doubtText, setDoubtText] = useState(initialDoubt || '');
  const [doubtContext] = useState(initialContext || '');

  // Output states
  const [activeNote, setActiveNote] = useState<any>(null);
  const [customResponseText, setCustomResponseText] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [targetLang, setTargetLang] = useState<'en' | 'mr'>(language);

  // Initialize with GCS note by default
  React.useEffect(() => {
    const initialNote = findMatchingClinicalNote(initialTopic || 'gcs');
    if (initialNote) {
      setActiveNote(initialNote);
    }
  }, [initialTopic]);

  const copyToClipboard = () => {
    const textToCopy = activeNote
      ? (targetLang === 'mr' ? activeNote.content_mr : activeNote.content_en)
      : customResponseText;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExplain = (topicToQuery?: string) => {
    const q = topicToQuery || conceptQuery;
    if (!q.trim()) return;
    const note = findMatchingClinicalNote(q);
    if (note) {
      setActiveNote(note);
      setCustomResponseText('');
    } else {
      setActiveNote(null);
      setCustomResponseText(
        targetLang === 'mr'
          ? `### ${q} - क्लिनिकल अभ्यास टीप\n\n- **महत्त्वाची व्याख्या**: या विषयाशी संबंधित वैद्यकीय नियम व नर्सिंग प्राथमिकता तपासण्यासाठी खालीलपैकी उच्च-प्राधान्य टॉपिक्स निवडा.\n- **फॉर्म्युला आणि गणना**: GCS स्कोर, पार्कसंड बर्न्स फॉर्म्युला, ॲपगार स्कोर व डायजॉक्सिन टॉक्सिसिटी यांसारख्या वारंवार विचारल्या जाणाऱ्या प्रश्नांचा समावेश खालील लिस्टमध्ये केला आहे.`
          : `### ${q} - High-Yield Clinical Reference\n\n- **Key Definition**: Select one of the high-yield topics below for instant access to verified nursing formulas, mnemonics, and calculations.`
      );
    }
  };

  const handleMnemonic = (topicToQuery?: string) => {
    const q = topicToQuery || mnemonicTopic;
    if (!q.trim()) return;
    const note = findMatchingClinicalNote(q);
    if (note) {
      setActiveNote(note);
      setCustomResponseText('');
    } else {
      setActiveNote(null);
      setCustomResponseText(
        targetLang === 'mr'
          ? `### ${q} स्मरण सूत्र (Mnemonic)\n\n- **स्मरण सूत्र**: ११ क्रेनिअल नर्व्ह्ज, APGAR स्कोर आणि ABG ROME फॉर्म्युला त्वरित पाहण्यासाठी खालील हाय-यिल्ड बटणांवर क्लिक करा.`
          : `### ${q} Clinical Mnemonic\n\n- **Recall Strategy**: Select from the quick high-yield mnemonics list below to view instant recall formulas.`
      );
    }
  };

  const handleRevisionPlan = () => {
    setActiveNote(null);
    setCustomResponseText(
      targetLang === 'mr'
        ? `### 📅 ७ दिवसांचे उच्च-प्राधान्य उजळणी वेळापत्रक (7-Day Revision Plan)

- **दिवस १ (Day 1)**: एनाटॉमी व फिजियोलॉजी (Cranial Nerves, ABG, Cardiac System)
- **दिवस २ (Day 2)**: मेडिकल सर्जिकल नर्सिंग (Burns Parkland Formula, Shock Triad, GCS Score)
- **दिवस ३ (Day 3)**: फार्माकोलॉजी व डोस गणना (Digoxin Toxicity, Insulin Types, Drug Dosage Formulas)
- **दिवस ४ (Day 4)**: बालरोग नर्सिंग (APGAR Score, Pediatric Milestones, Reflexes)
- **दिवस ५ (Day 5)**: स्त्रीरोग व प्रसूती नर्सिंग (Naegele's Rule, GTPAL System, FHR Monitoring)
- **दिवस ६ (Day 6)**: समुदाय आरोग्य व नर्सिंग व्यवस्थापन (Epidemiology, Cold Chain, Bio-medical Waste)
- **दिवस ७ (Day 7)**: मागील वर्षांचे प्रश्न (PYQs) व अंतिम सराव मॉक टेस्ट.`
        : `### 📅 7-Day High-Yield Spaced Revision Plan

- **Day 1**: Anatomy & Physiology (Cranial Nerves, ABG Analysis, Cardiac System)
- **Day 2**: Medical-Surgical Nursing (Parkland Burns Formula, Shock Triad, GCS Score)
- **Day 3**: Pharmacology & Dosage Calculations (Digoxin Toxicity, Insulin Types, Drug Calculations)
- **Day 4**: Pediatric Nursing (APGAR Score, Pediatric Milestones, Primitive Reflexes)
- **Day 5**: Obstetrics & Gynecological Nursing (Naegele's Rule, GTPAL System, FHR Monitoring)
- **Day 6**: Community Health & Nursing Management (Epidemiology, Cold Chain, Biomedical Waste)
- **Day 7**: Full Length Mock Test & Weak Area Retesting.`
    );
  };

  const handleDoubt = () => {
    if (!doubtText.trim()) return;
    const note = findMatchingClinicalNote(doubtText);
    if (note) {
      setActiveNote(note);
      setCustomResponseText('');
    } else {
      setActiveNote(null);
      setCustomResponseText(
        targetLang === 'mr'
          ? `### 🩺 क्लिनिकल शंका निरसन गाइड (Clinical Guide)\n\n**प्रश्न**: ${doubtText}\n\n**वैद्यकीय उत्तर व नर्सिंग प्राधान्य**:\n- नर्सिंग परीक्षांमध्ये क्लिनिकल परिस्थिती हाताळताना नेहमी **ABC (Airway, Breathing, Circulation)** तत्त्वाचा प्रथम विचार करा.\n- औषधशास्त्रातील प्रश्नांसाठी सुरक्षा मर्यादा व Antidotes ची यादी तपासा.\n- विशेष मार्गदर्शनासाठी खाली दिलेले Glasgow Coma Scale, Parkland Formula किंवा Digoxin Toxicity तपासा.`
          : `### 🩺 Clinical Doubt Reference Guide\n\n**Doubt Query**: ${doubtText}\n\n**Clinical Priority**:\n- Always prioritize **ABC (Airway, Breathing, Circulation)** in clinical case questions.\n- Verify drug therapeutic indices and antidote guidelines before selecting interventions.`
      );
    }
  };

  const quickHighYieldConcepts = [
    { label: 'Glasgow Coma Scale (GCS)', query: 'gcs' },
    { label: 'Parkland Burns Formula', query: 'parkland_burns' },
    { label: 'Digoxin Toxicity & Nursing Care', query: 'digoxin_toxicity' },
    { label: 'Shock Triad & Types', query: 'gcs' },
    { label: 'APGAR Score', query: 'apgar_score' },
    { label: 'Cranial Nerves Mnemonic', query: 'cranial_nerves' }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner - Clinical Notes & Formula Guide */}
      <div className="bg-gradient-to-r from-slate-900 to-teal-950 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-2">
          <BookOpen className="w-4 h-4" />
          <span>Clinical Exam Reference & Formula Guide</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold mb-2">
          {language === 'mr' ? 'अभ्यास मार्गदर्शक व क्लिनिकल नोट्स (Clinical Study Guide)' : 'Clinical Study Guide & Formulas'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          {language === 'mr'
            ? 'अवघड क्लिनिकल संकल्पना, डोस फॉर्म्युले, स्मृतीसूत्र (Mnemonics) आणि ७ दिवसांचे उजळणी नियोजन त्वरित मिळवा.'
            : 'Access high-yield nursing formulas, GCS scores, Parkland burn calculations, APGAR charts, and cranial nerve mnemonics offline.'}
        </p>

        {/* Output Language Toggle */}
        <div className="mt-4 flex items-center gap-3 text-xs">
          <span className="text-slate-400 font-medium">भाषा (Language):</span>
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

      {/* Verified Knowledge Base Badge */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
            <ShieldCheck className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">INC & AIIMS NORCET Verified Offline Knowledge Base</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Offline Ready
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {language === 'mr'
                ? 'नर्सिंग परीक्षांचे महत्त्वाचे फॉर्म्युले, तक्ते आणि स्मृतीसूत्रे इंटरनेटशिवाय उपलब्ध.'
                : 'Instant clinical concepts, Parkland formulas, GCS scale & mnemonics aligned with NORCET syllabus.'}
            </p>
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
                if (tab.id === 'revision_plan') handleRevisionPlan();
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

      {/* Interactive Input Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
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
                  onKeyDown={e => e.key === 'Enter' && handleExplain()}
                  placeholder="e.g. Glasgow Coma Scale, Parkland Burns Formula, Digoxin Toxicity..."
                  className="grow px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
                <button
                  onClick={() => handleExplain()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition cursor-pointer shrink-0"
                >
                  <Search className="w-4 h-4" />
                  <span>Explain Concept</span>
                </button>
              </div>
            </div>

            {/* Quick High-Yield Topic Buttons (as in screenshot) */}
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                FREQUENTLY TESTED HIGH-YIELD TOPICS:
              </div>
              <div className="flex flex-wrap gap-2">
                {quickHighYieldConcepts.map((pick, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setConceptQuery(pick.label);
                      handleExplain(pick.query);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-teal-50 hover:text-teal-800 text-xs font-semibold text-slate-700 border border-slate-200 transition cursor-pointer shadow-2xs"
                  >
                    {pick.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

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
                  onKeyDown={e => e.key === 'Enter' && handleMnemonic()}
                  placeholder="e.g. APGAR score, Cranial Nerves, ABG ROME..."
                  className="grow px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
                <button
                  onClick={() => handleMnemonic()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition cursor-pointer shrink-0"
                >
                  <Brain className="w-4 h-4" />
                  <span>Show Mnemonic</span>
                </button>
              </div>
            </div>

            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                POPULAR HIGH-YIELD MNEMONICS:
              </div>
              <div className="flex flex-wrap gap-2">
                {quickHighYieldConcepts.map((pick, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setMnemonicTopic(pick.label);
                      handleMnemonic(pick.query);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-teal-50 hover:text-teal-800 text-xs font-semibold text-slate-700 border border-slate-200 transition cursor-pointer shadow-2xs"
                  >
                    {pick.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'revision_plan' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'mr'
                ? 'नर्सिंग परीक्षांसाठी ७ दिवसांचे विनामूल्य उजळणी वेळापत्रक पहा.'
                : 'Structured 7-day high-yield nursing study and revision roadmap.'}
            </p>
            <button
              onClick={handleRevisionPlan}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>{language === 'mr' ? 'उजळणी नियोजन पहा' : 'View 7-Day Plan'}</span>
            </button>
          </div>
        )}

        {activeTab === 'doubt' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Enter Clinical Doubt / Topic
              </label>
              <textarea
                rows={2}
                value={doubtText}
                onChange={e => setDoubtText(e.target.value)}
                placeholder="Ask any nursing topic e.g. Why is Morphine contraindicated in Head Injury?"
                className="w-full p-3 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
              ></textarea>
            </div>
            {doubtContext && (
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                <span className="font-bold">Context: </span>{doubtContext}
              </div>
            )}
            <button
              onClick={handleDoubt}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" />
              <span>View Guidance</span>
            </button>
          </div>
        )}
      </div>

      {/* Structured Content Output Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs font-bold text-teal-800">
            <FileText className="w-4 h-4 text-teal-600" />
            <span>
              {activeNote
                ? (targetLang === 'mr' ? activeNote.title_mr : activeNote.title_en)
                : (language === 'mr' ? 'नर्सिंग मार्गदर्शक नोट्स' : 'Clinical Reference Note')}
            </span>
          </div>

          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Display Active Note */}
        {activeNote ? (
          <div className="space-y-4">
            <div className="text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed font-sans">
              {targetLang === 'mr' ? activeNote.content_mr : activeNote.content_en}
            </div>

            {activeNote.key_nursing_points_mr && activeNote.key_nursing_points_mr.length > 0 && (
              <div className="p-4 bg-teal-50/70 border border-teal-200/80 rounded-xl space-y-2 mt-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-teal-900">
                  <Zap className="w-4 h-4 text-teal-700" />
                  <span>परीक्षेसाठी महत्त्वाचे नर्सिंग पॉईंट्स (Key Nursing Alerts):</span>
                </div>
                <ul className="list-disc pl-5 text-xs text-teal-950 space-y-1 font-medium">
                  {activeNote.key_nursing_points_mr.map((pt: string, idx: number) => (
                    <li key={idx}>{pt}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed font-sans">
            {customResponseText}
          </div>
        )}
      </div>
    </div>
  );
};
